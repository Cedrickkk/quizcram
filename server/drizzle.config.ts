import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
