//import { toaster } from "@/components/ui/toaster";
import { useContext, useState, useMemo } from "react";
import { QueryExecResult } from "sql.js";
import { SqljsDbContext } from "@/sqljs/sqljs-provder";
import type { CompiledQuery } from "kysely";

function useKyselyQuery(query: CompiledQuery) {
  const sqljsDbContext = useContext(SqljsDbContext);

  if (!SqljsDbContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult[]>([]);

  useMemo(() => {
    if (!sqljsDbContext.sqljsDb) {
      return;
    }

    try {
      // const startTime = performance.now();
      const results = sqljsDbContext.sqljsDb.exec(query.sql, query.parameters);

      console.log("Query results:", results);

      setResults(results);
      setError("");
    } catch (error) {
      console.log("Error executing query:", error);
      console.log(error);
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
      setResults([]);
    }
  }, [sqljsDbContext.sqljsDb, query]);

  return { error, results };
}

export default useKyselyQuery;
