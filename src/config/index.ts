import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVariables = [
  "APP_NAME",
  "VERSION",
  "PORT",
  "CONNECTION_STR",
  "JWT_SECRET",
] as const;

type Config = Record<(typeof envVariables)[number], string>;

let config: Config = {} as Config;

envVariables.forEach((env) => {
  if (typeof process.env[env] !== "string") {
    throw new Error(`Please add ${env} on environment variables`);
  }
  config[env] = process.env[env];
});

export default config;
