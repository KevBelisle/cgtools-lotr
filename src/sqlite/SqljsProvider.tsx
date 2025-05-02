import {
  use,
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";

import type { Database, QueryExecResult } from "sql.js";
import initSqlJs from "sql.js";
import sqliteUrl from "@/sqlite/sql-wasm.wasm?url";

interface SqljsContextType {
  sqljsDb: Database | null;
}

// Helper function to load the database
const loadDatabase = async (dbFileUrl: string): Promise<Uint8Array> => {
  const opfsRoot = await navigator.storage.getDirectory();

  try {
    // If the file exists in OPFS, read it
    const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
      create: false,
    });
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    console.log("File loaded from OPFS");
    return new Uint8Array(buffer);
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      // If the file doesn't exist, fetch it from the server
      const response = await fetch(dbFileUrl);
      const buffer = new Uint8Array(await response.arrayBuffer());
      console.log("File loaded from server");

      // And save it to OPFS
      const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(buffer);
      await writable.close();
      console.log("File saved to OPFS");
      return buffer;
    } else {
      throw error;
    }
  }
};

// Step 1: Create a Context
const SqljsContext = createContext<SqljsContextType>({ sqljsDb: null });

// Step 2: Create a Provider Component
const SqljsProvider = ({
  children,
  dbBuffer,
  dbBufferPromise,
}: PropsWithChildren<{
  dbBuffer?: Uint8Array;
  dbBufferPromise: Promise<Uint8Array>;
}>) => {
  const [sqljsContext, setSqljsContext] = useState<SqljsContextType>({
    sqljsDb: null,
  });

  dbBuffer = (dbBuffer as Uint8Array) ?? use(dbBufferPromise);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        const SQL = await initSqlJs({ locateFile: () => sqliteUrl });
        const db = new SQL.Database(dbBuffer);
        setSqljsContext({ sqljsDb: db });
      } catch (error) {
        if (error instanceof Error) {
          alert(`An error occurred: ${error.message}`);
        } else if (typeof error === "string") {
          alert(error);
        } else {
          alert("An unknown error occurred " + error);
        }
      }
    }

    initializeDatabase();

    return () => {
      if (sqljsContext.sqljsDb) {
        sqljsContext.sqljsDb.close();
      }
    };
  }, [dbBuffer]);

  return (
    <SqljsContext.Provider value={sqljsContext}>
      {children}
    </SqljsContext.Provider>
  );
};

// Step 3: Create a hook to query the db
const useSqljsQuery = (query: string) => {
  const sqljsContext = useContext(SqljsContext);

  if (!sqljsContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult[]>([]);

  useMemo(() => {
    if (sqljsContext.sqljsDb === null) {
      return;
    }

    try {
      setResults(sqljsContext.sqljsDb!.exec(query));
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

export { loadDatabase, SqljsContext, SqljsProvider, useSqljsQuery };
export type { SqljsContextType };
