import dotenv from "dotenv";

export type CheckConfigReturn = {
  configComplete: boolean;
  error: string | null;
};

export const envNames = {
  nodeEnv: "NODE_ENV",
  db: {
    name: "DB_NAME",
    address: "DB_ADDRESS",
    user: "DB_USERNAME",
    password: "DB_PASSWORD",
  },
  origins: {
    prod: {
      ui: "TRUSTED_PROD_ORIGIN",
      api: "TRUSTED_PROD_AUTH_API_ORIGIN",
    },
    dev: {
      ui: "TRUSTED_DEV_ORIGIN",
      api: "TRUSTED_DEV_AUTH_API_ORIGIN",
    },
  },
  port: "PORT",
};

/**
 * Checks if all config properties are available before starting the server
 */
export default (): CheckConfigReturn => {
  dotenv.config();

  // Determines if an error occurred.
  let errorName: string | null = null;

  // Checks database configuration
  if (!process.env[envNames.db.address]) errorName = envNames.db.address;
  else if (!process.env[envNames.db.name]) errorName = envNames.db.name;
  else if (!process.env[envNames.db.password]) errorName = envNames.db.password;
  else if (!process.env[envNames.db.user]) errorName = envNames.db.user;

  return {
    configComplete: errorName ? false : true,
    error: errorName
      ? `Can't start the Express server. The "${errorName}" environment variable is not defined.`
      : null,
  };
};
