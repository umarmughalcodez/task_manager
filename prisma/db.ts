import postgres from "postgres";

const connectionString: any = process.env.DATABASE_URL;
const sql = postgres(connectionString);

export default sql;
