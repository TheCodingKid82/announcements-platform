import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./index";

async function main() {
  if (!db || !client) {
    throw new Error("DATABASE_URL is required to run migrations");
  }

  await migrate(db, { migrationsFolder: "./drizzle" });
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
