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
    service: {
      ui: {
        dev: "TRUSTED_SERVICE_UI_DEV_ORIGIN",
        prod: "TRUSTED_SERVICE_UI_PROD_ORIGIN",
      },
      api: {
        dev: "TRUSTED_SERVICE_API_DEV_ORIGIN",
        prod: "TRUSTED_SERVICE_API_PROD_ORIGIN",
      },
    },
    auth: {
      api: {
        dev: "TRUSTED_AUTH_API_DEV_ORIGIN",
        prod: "TRUSTED_AUTH_API_PROD_ORIGIN",
      },
    },
  },
  cookie: {
    key: "COOKIE_KEY",
    ssoId: "COOKIE_SSO_ID",
  },
  authVerification: {
    path: "AUTH_VERIFICATION_PATH",
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

  /**
   * Checks database configuration
   */
  // Node variables
  if (!process.env[envNames.nodeEnv]) errorName = envNames.nodeEnv;
  // Database variables
  else if (!process.env[envNames.db.address]) errorName = envNames.db.address;
  else if (!process.env[envNames.db.name]) errorName = envNames.db.name;
  else if (!process.env[envNames.db.password]) errorName = envNames.db.password;
  else if (!process.env[envNames.db.user]) errorName = envNames.db.user;
  // Origin variables
  else if (!process.env[envNames.origins.auth.api.dev])
    errorName = envNames.origins.auth.api.dev;
  else if (!process.env[envNames.origins.auth.api.prod])
    errorName = envNames.origins.auth.api.prod;
  else if (!process.env[envNames.origins.service.api.dev])
    errorName = envNames.origins.service.api.dev;
  else if (!process.env[envNames.origins.service.api.prod])
    errorName = envNames.origins.service.api.prod;
  else if (!process.env[envNames.origins.service.ui.dev])
    errorName = envNames.origins.service.ui.dev;
  else if (!process.env[envNames.origins.service.ui.prod])
    errorName = envNames.origins.service.ui.prod;
  else if (!process.env[envNames.cookie.key]) errorName = envNames.cookie.key;
  else if (!process.env[envNames.cookie.ssoId])
    errorName = envNames.cookie.ssoId;
  else if (!process.env[envNames.authVerification.path])
    errorName = envNames.authVerification.path;
  else if (!process.env[envNames.port]) errorName = envNames.port;

  return {
    configComplete: errorName ? false : true,
    error: errorName
      ? `Can't start the Express server. The "${errorName}" environment variable is not defined.`
      : null,
  };
};
