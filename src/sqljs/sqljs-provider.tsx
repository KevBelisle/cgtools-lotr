import {
  createContext,
  PropsWithChildren,
  ReactNode,
  Suspense,
  use,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import fetchFile from "@/sqljs/fetch-file";
import sqliteUrl from "@/sqljs/sql-wasm.wasm?url";
import type { Database, SqlJsStatic } from "sql.js";
import initSqlJs from "sql.js";

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
    const sqljsPromise = initSqlJs({ locateFile: () => sqliteUrl });

    setSqljsContext({
      state: "loading",
      error: null,
      sqljsPromise: sqljsPromise,
    });

    sqljsPromise
      .then(() => {
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
    const loadingPromise = new Promise<Uint8Array<ArrayBufferLike>>(
      async (resolve, _) => {
        const generator = fetchFile(dbUrl);

        do {
          const { value, done } = await generator.next();
          if (done) {
            resolve(value);
            return;
          } else {
            setProgress(value);
          }
        } while (true);
      },
    );
    return loadingPromise.then((buffer) => {
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
  dbBufferPromise,
}: PropsWithChildren<{
  dbBufferPromise: Promise<Uint8Array<ArrayBufferLike>>;
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
  const dbBuffer = use(dbBufferPromise);

  useMemo(() => {
    try {
      const db = new sqljs.Database(dbBuffer);
      setSqljsDbContext({
        state: "ready",
        error: null,
        sqljsDb: db,
      });
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

  if (sqljsDbContext.state === "error") {
    return <div>ERROR: {sqljsContext.error}</div>;
  }

  if (sqljsDbContext.state === "loading") {
    return <div>LOADING</div>;
  }

  return (
    <SqljsDbContext.Provider value={sqljsDbContext}>
      {children}
    </SqljsDbContext.Provider>
  );
};

export { SqljsContext, SqljsDbContext, SqljsDbProvider, SqljsProvider };
export type { SqljsContextType, SqljsDbContextType };
