import {
  use,
  useState,
  useEffect,
  useContext,
  useMemo,
  createContext,
  PropsWithChildren,
  ReactNode,
  Suspense,
} from "react";

import type { Database, SqlJsStatic } from "sql.js";
import initSqlJs from "sql.js";
import sqliteUrl from "@/sqljs/sql-wasm.wasm?url";
import { doWorkerTask, saveToOpfs } from "@/sqljs/opfsWriteWorker";

interface SqljsContextType {
  state: "loading" | "ready" | "error";
  error: string | null;
  sqljsPromise: Promise<SqlJsStatic>;
}
interface SqljsDbContextType {
  state: "loading" | "ready" | "error";
  error: string | null;
  sqljsDb: Database | null;
}

const SqljsContext = createContext<SqljsContextType>({
  state: "loading",
  error: null,
  sqljsPromise: new Promise(() => {}) as Promise<SqlJsStatic>,
});

const SqljsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [sqljsContext, setSqljsContext] = useState<SqljsContextType>({
    state: "loading",
    error: null,
    sqljsPromise: new Promise(() => {}) as Promise<SqlJsStatic>,
  });

  useEffect(() => {
    const startInitSqlJs = performance.now();
    const sqljsPromise = initSqlJs({ locateFile: () => sqliteUrl });

    setSqljsContext({
      state: "loading",
      error: null,
      sqljsPromise: sqljsPromise,
    });

    sqljsPromise
      .then(() => {
        console.log(
          `SqlJS initiated in ${(performance.now() - startInitSqlJs).toFixed(
            2
          )} ms`
        );
        setSqljsContext({
          state: "ready",
          error: null,
          sqljsPromise: sqljsPromise,
        });
      })
      .catch((error) => {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        } else {
          errorMessage = JSON.stringify(error);
        }
        setSqljsContext({
          ...sqljsContext,
          state: "error",
          error: errorMessage,
        });
        console.error(`Error initializing sql.js: ${errorMessage}`);
        console.error(error);
      });

    return;
  }, []);

  if (sqljsContext.state === "error") {
    return <div>ERROR: {sqljsContext.error}</div>;
  }

  return (
    <SqljsContext.Provider value={sqljsContext}>
      {children}
    </SqljsContext.Provider>
  );
};

// function onLoadedFromOpfs(ms: number) {
//   toaster.create({
//     title: `File loaded from OPFS in ${ms.toFixed(2)} ms`,
//     type: "info",
//     duration: 10000,
//   });
// }
// function onLoadedFromServer(ms: number) {
//   toaster.create({
//     title: `File loaded from server in ${ms.toFixed(2)} ms`,
//     type: "info",
//     duration: 10000,
//   });
// }

// Helper function to load the database
async function* loadDatabase(
  dbFileUrl: string
): AsyncGenerator<
  number,
  { buffer: Uint8Array; source: "opfs" | "fetch" },
  void
> {
  const opfsRoot = await navigator.storage.getDirectory();

  try {
    // throw (() => {
    //   let e = new Error();
    //   e.name = "NotFoundError";
    //   return e;
    // })();
    // If the file exists in OPFS, read it
    const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
      create: false,
    });
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    return { buffer: new Uint8Array(buffer), source: "opfs" };
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      // If the file doesn't exist, fetch it from the server
      const response = await fetch(dbFileUrl);

      const reader = response.body!.getReader();
      const contentLength = parseInt(response.headers!.get("Content-Length")!);

      let receivedLength = 0;
      let buffer = new Uint8Array(contentLength);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer.set(value, receivedLength);
        receivedLength += value.length;

        yield (receivedLength / contentLength) * 100;
      }

      return {
        buffer: buffer,
        source: "fetch",
      };
    } else {
      throw error;
    }
  }
}

const SqljsDbContext = createContext<SqljsDbContextType>({
  state: "loading",
  error: null,
  sqljsDb: null,
});

const SqljsDbProvider = ({
  children,
  dbUrl,
  loading,
}: PropsWithChildren<{
  dbUrl: string;
  loading: (progress: number) => ReactNode;
}>) => {
  const [progress, setProgress] = useState(0);

  const dbBufferPromise = useMemo(() => {
    const loadingPromise = new Promise<{
      buffer: Uint8Array<ArrayBufferLike>;
      source: "opfs" | "fetch";
    }>(async (resolve, _) => {
      const generator = loadDatabase(dbUrl);

      do {
        const { value, done } = await generator.next();
        if (done) {
          console.log("loadDatabase complete", value.source);
          resolve(value);
          return;
        } else {
          console.log("loadDatabase progress", value);
          setProgress(value);
        }
      } while (true);
    });

    loadingPromise.then(async ({ buffer, source }) => {
      if (source == "fetch") {
        console.log("Database loaded from fetch");
        await doWorkerTask(saveToOpfs, {
          filename: "lotr_lcg.db",
          array: buffer,
        }).then(
          () => {
            console.log("Database saved to OPFS");
          },
          (error) => {
            console.error("Error saving to OPFS", error);
          }
        );
      } else {
        console.log("Database loaded from OPFS");
      }
    });

    return loadingPromise.then(({ buffer }) => {
      return buffer;
    });
  }, [dbUrl]);

  return (
    <Suspense fallback={loading(progress)}>
      <InnerSqljsDbProvider dbBufferPromise={dbBufferPromise}>
        {children}
      </InnerSqljsDbProvider>
    </Suspense>
  );
};

const InnerSqljsDbProvider = ({
  children,
  dbBuffer,
  dbBufferPromise,
}: PropsWithChildren<{
  dbBuffer?: Uint8Array;
  dbBufferPromise: Promise<Uint8Array>;
}>) => {
  const sqljsContext = useContext(SqljsContext);

  if (!sqljsContext) {
    throw new Error("SqljsDbProvider must be used within a SqljsProvider");
  }

  const [sqljsDbContext, setSqljsDbContext] = useState<SqljsDbContextType>({
    state: "loading",
    error: null,
    sqljsDb: null,
  });

  const sqljs = use(sqljsContext.sqljsPromise as Promise<SqlJsStatic>);
  dbBuffer = (dbBuffer as Uint8Array) ?? use(dbBufferPromise);

  useMemo(() => {
    try {
      const db = new sqljs.Database(dbBuffer);
      setSqljsDbContext({ state: "ready", error: null, sqljsDb: db });
    } catch (error) {
      let errorMessage = "An unknown error occurred loading the database";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }
      setSqljsDbContext({
        state: "error",
        error: errorMessage,
        sqljsDb: null,
      });
      console.error(`Error initializing sql.js: ${errorMessage}`);
      console.error(error);
    }

    return () => {
      if (sqljsDbContext.sqljsDb) {
        sqljsDbContext.sqljsDb.close();
      }
    };
  }, [dbBuffer]);

  if (sqljsContext.state === "error") {
    return <div>ERROR: {sqljsContext.error}</div>;
  }

  return (
    <SqljsDbContext.Provider value={sqljsDbContext}>
      {children}
    </SqljsDbContext.Provider>
  );
};

export {
  loadDatabase,
  SqljsContext,
  SqljsProvider,
  SqljsDbContext,
  SqljsDbProvider,
};
export type { SqljsContextType, SqljsDbContextType };
