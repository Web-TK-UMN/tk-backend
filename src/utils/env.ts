import dotenv from "dotenv";
dotenv.config();

const ENV = {
  APP_VERSION: process.env.APP_VERSION ?? "1.0.0",
  APP_PORT: Number(process.env.APP_PORT) ?? 3000,
  APP_API_URL: process.env.APP_API_URL ?? "http://localhost:3000",
  APP_JWT_SECRET: process.env.APP_JWT_SECRET ?? "secret123!",
};

export default ENV;
