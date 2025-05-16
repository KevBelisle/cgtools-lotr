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
import { saveToOpfs } from "@/sqljs/saveToOpfs";
import loadFile from "@/sqljs/fileLoader";

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
    return <div>Sql.js error: {sqljsContext.error}</div>;
  }

  return (
    <SqljsContext.Provider value={sqljsContext}>
      {children}
    </SqljsContext.Provider>
  );
};

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
      const generator = loadFile(dbUrl, true);

      do {
        const { value, done } = await generator.next();
        if (done) {
          resolve(value);
          return;
        } else {
          setProgress(value);
        }
      } while (true);
    });

    loadingPromise.then(async ({ buffer, source }) => {
      if (source == "fetch") {
        console.log("Database loaded from fetch");
        await saveToOpfs("lotr_lcg.db", buffer).then(
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

export { SqljsContext, SqljsProvider, SqljsDbContext, SqljsDbProvider };
export type { SqljsContextType, SqljsDbContextType };
