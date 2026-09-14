/**
 * Kysely dialect for Better Auth over Neon's **HTTP** query function
 * (`@neondatabase/serverless`'s `neon()`), not `Pool`.
 *
 * Cloudflare Workers forbids resolving I/O (sockets, and the promises tied to
 * them) outside the request that started it. `Pool` — even with
 * `poolQueryViaFetch` — keeps a client checked out across the `connect` /
 * `query` / `release` sequence, so a connection opened on one request can get
 * torn down or resolved on the next warm-isolate request, surfacing as
 * intermittent 500s on whichever route touches the DB next (session reads,
 * sign-out, the OAuth callback — whichever request happens to land on the
 * poisoned pool). `neon()` has no persistent connection: every `.query()` is
 * a single stateless fetch, so there is nothing to leak across requests.
 */
import { neon } from "@neondatabase/serverless";
import {
  CompiledQuery,
  type DatabaseConnection,
  type DatabaseIntrospector,
  type Dialect,
  type Driver,
  type Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type QueryCompiler,
  type QueryResult,
  type TransactionSettings,
} from "kysely";

/** Factory used by `auth/server.ts`: `neonHttpDialect(databaseUrl)`. */
export function neonHttpDialect(connectionString: string): Dialect {
  return {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new NeonHttpDriver(connectionString),
    createQueryCompiler: (): QueryCompiler => new PostgresQueryCompiler(),
    createIntrospector: (db: Kysely<unknown>): DatabaseIntrospector =>
      new PostgresIntrospector(db),
  };
}

class NeonHttpDriver implements Driver {
  private readonly sql: ReturnType<typeof neon>;

  constructor(connectionString: string) {
    this.sql = neon(connectionString);
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    // No real connection to acquire — each query is its own fetch. A fresh
    // wrapper per acquire keeps `beginTransaction` state (see below) isolated
    // per Kysely transaction instead of shared across concurrent callers.
    return new NeonHttpConnection(this.sql);
  }

  async releaseConnection(): Promise<void> {}

  async beginTransaction(
    conn: DatabaseConnection,
    settings: TransactionSettings,
  ): Promise<void> {
    const c = conn as NeonHttpConnection;
    if (settings.isolationLevel) {
      await c.executeQuery(
        CompiledQuery.raw(
          `start transaction isolation level ${settings.isolationLevel}`,
        ),
      );
    } else {
      await c.executeQuery(CompiledQuery.raw("begin"));
    }
  }

  async commitTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as NeonHttpConnection).executeQuery(CompiledQuery.raw("commit"));
  }

  async rollbackTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as NeonHttpConnection).executeQuery(
      CompiledQuery.raw("rollback"),
    );
  }

  async destroy(): Promise<void> {}
}

class NeonHttpConnection implements DatabaseConnection {
  constructor(private readonly sql: ReturnType<typeof neon>) {}

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const rows = (await this.sql.query(
      compiledQuery.sql,
      [...compiledQuery.parameters],
    )) as O[];
    return { rows };
  }

  async *streamQuery<O>(
    compiledQuery: CompiledQuery,
    chunkSize: number,
  ): AsyncIterableIterator<QueryResult<O>> {
    if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
      throw new Error("chunkSize must be a positive integer");
    }
    const rows = (await this.sql.query(
      compiledQuery.sql,
      [...compiledQuery.parameters],
    )) as O[];
    for (let i = 0; i < rows.length; i += chunkSize) {
      yield { rows: rows.slice(i, i + chunkSize) };
    }
  }
}
