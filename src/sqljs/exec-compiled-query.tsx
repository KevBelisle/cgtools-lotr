import { CompiledQuery } from "kysely";
import { Database, SqlValue } from "sql.js";

function execCompiledQuery<T>(
  compiledQuery: CompiledQuery<T>,
  db: Database,
): T[] {
  const res = db.exec(
    compiledQuery.sql,
    compiledQuery.parameters as SqlValue[],
  );

  if (res.length === 0) {
    return [] as T[];
  }

  const cols = res[0].columns;
  const ret = res[0].values.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < row.length; i++) {
      obj[cols[i]] = row[i];
    }
    return obj;
  });

  return ret as T[];
}

export default execCompiledQuery;
