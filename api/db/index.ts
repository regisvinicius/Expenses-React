import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create the connection
const connection = postgres(process.env.DATABASE_URL!, { max: 1 });

// Create the database instance
const db = drizzle(connection, { schema });

export default db;
export { connection };