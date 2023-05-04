import { Express, json, static as expressStatic, urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import { requestFailedWithError } from "@middleware/requestError";
import { requestPassedWithSuccess } from "@middleware/requestSuccess";
import { envNames } from "@startup/config";

/**
 * Adds all the starting middleware to the Express server
 * @param server The Express server to add all the middleware to
 */
export const addStartMiddleware = (server: Express): void => {
  // Allows cross-origin requests
  server.use(
    cors({
      origin: (origin, callback) => {
        if (
          origin === process.env[envNames.origins.prod.ui] ||
          origin === process.env[envNames.origins.prod.api] ||
          origin === process.env[envNames.origins.dev.ui] ||
          origin === process.env[envNames.origins.dev.api]
        ) {
          return callback(null, true);
        }
        // If the request's origin is not acceptable
        else {
          const error = new Error(
            "Access denied. You are unauthorized to access this service."
          );
          delete error.stack;

          return callback(error, false);
        }
      },
    })
  );

  // Parses JSON data from the request
  server.use(json());

  // Secures the Express server more by setting various HTTP headers
  server.use(helmet());

  // Parses URL encoded data from the request
  server.use(urlencoded({ extended: true }));

  // Serves static files from the public folder
  server.use(expressStatic("public"));
};

/**
 * Adds all ending middleware to the Express server.
 *   ** WARNING **  Make sure to add the failed request middleware as the
 *                  last one since it terminates all requests whether failed
 *                  or not.
 *
 * @param server The Express server to add all the middleware to
 */
export const addEndMiddleware = (server: Express): void => {
  // Parses the request for any successful data and sends it as the response
  server.use(requestPassedWithSuccess);

  // Parses the request for any errors and sends the error as the response
  server.use(requestFailedWithError);
};
