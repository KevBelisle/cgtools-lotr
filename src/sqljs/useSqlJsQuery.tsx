//import { toaster } from "@/components/ui/toaster";
import { useContext, useState, useMemo } from "react";
import { QueryExecResult } from "sql.js";
import { SqljsDbContext } from "@/sqljs/SqljsProvider";

const useSqljsQuery = (query: string) => {
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
      setResults(sqljsDbContext.sqljsDb.exec(query));
      // toaster.create({
      //   title: `Query executed in ${(performance.now() - startTime).toFixed(
      //     2
      //   )} ms`,
      //   type: "info",
      //   duration: 1000,
      // });
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
  }, [sqljsDbContext.sqljsDb, query]);

  return { error, results };
};

export default useSqljsQuery;
