import dotenv from "dotenv";

export type CheckConfigReturn = {
  configComplete: boolean;
  error: string | null;
};

/**
 * Checks if all config properties are available before starting the server
 */
export default (): CheckConfigReturn => {
  dotenv.config();

  // Determines if an error occurred.
  let errorName: string | null = null;

  // Checks database configuration
  if (!process.env.DB_ADDRESS) errorName = "DB_ADDRESS";
  else if (!process.env.DB_NAME) errorName = "DB_NAME";
  else if (!process.env.DB_USERNAME) errorName = "DB_USERNAME";
  else if (!process.env.DB_PASSWORD) errorName = "DB_PASSWORD";

  return {
    configComplete: errorName ? false : true,
    error: errorName
      ? `Can't start the Express server. The "${errorName}" environment variable is not defined.`
      : null,
  };
};
