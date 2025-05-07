import {
  use,
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";

import type { Database, QueryExecResult, SqlJsStatic } from "sql.js";
import initSqlJs from "sql.js";
import sqliteUrl from "@/sqljs/sql-wasm.wasm?url";

import { toaster } from "@/components/ui/toaster";

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

// Helper function to load the database
const loadDatabase = async (dbFileUrl: string): Promise<Uint8Array> => {
  const startLoadDatabase = performance.now();

  const opfsRoot = await navigator.storage.getDirectory();

  try {
    // If the file exists in OPFS, read it
    const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
      create: false,
    });
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    console.log("File loaded from OPFS");
    toaster.create({
      title: `File loaded from OPFS in ${(
        performance.now() - startLoadDatabase
      ).toFixed(2)} ms`,
      type: "info",
      duration: 10000,
    });
    return new Uint8Array(buffer);
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      // If the file doesn't exist, fetch it from the server
      const response = await fetch(dbFileUrl);
      const buffer = new Uint8Array(await response.arrayBuffer());
      toaster.create({
        title: `File loaded from server in ${(
          performance.now() - startLoadDatabase
        ).toFixed(2)} ms`,
        type: "info",
        duration: 10000,
      });
      try {
        // And save it to OPFS
        const startSaveFile = performance.now();
        const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(buffer);
        await writable.close();
        toaster.create({
          title: `File saved to OPFS in ${(
            performance.now() - startSaveFile
          ).toFixed(2)} ms`,
          type: "info",
          duration: 10000,
        });
        console.log("File saved to OPFS");
      } catch (error) {
        await opfsRoot.removeEntry(dbFileUrl);
        console.error("Error saving file to OPFS", error);
      }
      return buffer;
    } else {
      throw error;
    }
  }
};

// Step 1: Create a Context
const SqljsContext = createContext<SqljsContextType>({
  state: "loading",
  error: null,
  sqljsPromise: new Promise(() => {}) as Promise<SqlJsStatic>,
});
const SqljsDbContext = createContext<SqljsDbContextType>({
  state: "loading",
  error: null,
  sqljsDb: null,
});

// Step 2: Create a Provider Component
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

const SqljsDbProvider = ({
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

  useEffect(() => {
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

// Step 3: Create a hook to query the db
const useSqljsQuery = (query: string) => {
  const sqljsContext = useContext(SqljsDbContext);

  if (!SqljsDbContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult[]>([]);

  useMemo(() => {
    if (!sqljsContext.sqljsDb) {
      return;
    }

    try {
      const startTime = performance.now();
      setResults(sqljsContext.sqljsDb.exec(query));
      toaster.create({
        title: `Query executed in ${(performance.now() - startTime).toFixed(
          2
        )} ms`,
        type: "info",
        duration: 1000,
      });
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
      setResults([]);
    }
  }, [sqljsContext.sqljsDb, query]);

  return { error, results };
};

export {
  loadDatabase,
  SqljsContext,
  SqljsProvider,
  SqljsDbContext,
  SqljsDbProvider,
  useSqljsQuery,
};
export type { SqljsContextType, SqljsDbContextType };
