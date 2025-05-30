//import { toaster } from "@/components/ui/toaster";
import { SqljsDbContext } from "@/sqljs/sqljs-provider";
import type { CompiledQuery } from "kysely";
import { useContext, useMemo, useState } from "react";
import { BindParams, QueryExecResult, SqlValue } from "sql.js";

function useKyselyQuery(compiledQuery: CompiledQuery) {
  const sqljsDbContext = useContext(SqljsDbContext);

  if (!SqljsDbContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult[]>([]);

  const sqlQuery = compiledQuery.sql;
  const sqlParameters: BindParams = compiledQuery.parameters as SqlValue[];

  useMemo(() => {
    if (!sqljsDbContext.sqljsDb) {
      return;
    }

    try {
      const results = sqljsDbContext.sqljsDb.exec(sqlQuery, sqlParameters);
      setResults(results);
      setError("");
    } catch (error) {
      console.error("Error executing query:", error);
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
      setResults([]);
    }
  }, [sqljsDbContext.sqljsDb, compiledQuery]);

  return { error, results };
}

export default useKyselyQuery;
