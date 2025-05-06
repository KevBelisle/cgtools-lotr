import {
  use,
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";

import type {
  Sqlite3Static,
  InitOptions,
  Database,
  SqlValue,
} from "./sqlean.d.ts";
import sqlite3InitModule from "@/sqlean/sqlean";

// Helper function to load the database
const loadDatabase = async (dbFileUrl: string): Promise<Uint8Array> => {
  const opfsRoot = await navigator.storage.getDirectory();

  try {
    let er = new Error();
    er.name = "NotFoundError";
    throw er;
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
      try {
        // And save it to OPFS
        const fileHandle = await opfsRoot.getFileHandle(dbFileUrl, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(buffer);
        await writable.close();
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
interface SqleanContextType {
  sqleanDb: Database | null;
}

const SqleanContext = createContext<SqleanContextType>({ sqleanDb: null });

// required by the SQLite WASM API.
const CONFIG = {
  print: console.log,
  printErr: console.error,
} as InitOptions;

const SQL = (await sqlite3InitModule(CONFIG)) as Sqlite3Static;
const version = SQL.capi.sqlite3_libversion();
console.log(`Loaded SQLite ${version}`);

//window.SQL = SQL;

// Step 2: Create a Provider Component
const SqleanProvider = ({
  children,
  dbBuffer,
  dbBufferPromise,
}: PropsWithChildren<{
  dbBuffer?: Uint8Array;
  dbBufferPromise: Promise<Uint8Array>;
}>) => {
  const [sqleanContext, setSqleanContext] = useState<SqleanContextType>({
    sqleanDb: null,
  });

  dbBuffer = (dbBuffer as Uint8Array) ?? use(dbBufferPromise);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        // Load the database from the buffer
        const p = SQL.wasm.allocFromTypedArray(dbBuffer!);
        const db = new SQL.oo1.DB({ filename: ":memory:", flags: "ct" });

        console.log({ dbBufferLength: dbBuffer!.length });

        SQL.capi.sqlite3_deserialize(
          db.pointer!,
          "main",
          p,
          dbBuffer!.length,
          dbBuffer!.length,
          SQL.capi.SQLITE_DESERIALIZE_FREEONCLOSE
        );
        //window.sqleandb = db;
        setSqleanContext({ sqleanDb: db });
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
      if (sqleanContext.sqleanDb) {
        sqleanContext.sqleanDb.close();
      }
    };
  }, [dbBuffer]);

  return (
    <SqleanContext.Provider value={sqleanContext}>
      {children}
    </SqleanContext.Provider>
  );
};

// Step 3: Create a hook to query the db
const useSqleanQuery = (query: string) => {
  const sqleanContext = useContext(SqleanContext);

  if (!sqleanContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<
    {
      [columnName: string]: SqlValue;
    }[]
  >([]);

  useMemo(() => {
    if (sqleanContext.sqleanDb === null) {
      return;
    }

    if (query.length === 0) {
      setResults([]);
      setError("");
      return;
    }

    try {
      let rows = sqleanContext.sqleanDb.exec({
        sql: query,
        returnValue: "resultRows",
        rowMode: "object",
      });
      console.log({ rows });
      setResults(rows);
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
  }, [sqleanContext.sqleanDb, query]);

  return { error, results };
};

export { loadDatabase, SqleanContext, SqleanProvider, useSqleanQuery };
export type { SqleanContextType };
