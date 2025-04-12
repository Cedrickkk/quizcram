import app from "@/app";
import { db } from "@/db";
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

const main = async () => {
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "./db/migrations"),
  });

  app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
  });
};

main().catch((err) => console.log(err));
