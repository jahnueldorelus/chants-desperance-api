import { ValidReqHeaders, VerifyReqHeaders } from "@app-types/middleware";
import { reqHeadersSchema } from "@app-types/middleware/schema";
import { envNames } from "@startup/config";
import axios from "axios";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Deterimines if the request is valid.
 * @param reqHeaders The request's headers
 */
const validateRequest = (reqHeaders: VerifyReqHeaders): ValidReqHeaders => {
  const { error, value } = reqHeadersSchema.validate(reqHeaders, {
    allowUnknown: true,
  });

  if (error) {
    return {
      errorMessage: error.message,
      isValid: false,
      validatedValue: undefined,
    };
  } else {
    return { errorMessage: null, isValid: true, validatedValue: value };
  }
};

/**
 * Verifies if a request is authenticated.
 * @param req The Express request
 * @param res The Express response
 * @param next The Express next function to go to the next middleware
 */
export const verifyRequestAuthentication = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const requestHeaders = <VerifyReqHeaders>req.headers;
  const { isValid, validatedValue } = validateRequest(requestHeaders);

  // If the request's is valid
  if (isValid) {
    try {
      const encryptedSSOId = <string>process.env[envNames.cookie.ssoId];
      const encryptedSSOToken = req.signedCookies[encryptedSSOId];

      const authDomain =
        process.env[envNames.nodeEnv] === "production"
          ? process.env[envNames.origins.auth.api.prod]
          : process.env[envNames.origins.auth.api.dev];
      const authVerificationPath = <string>(
        process.env[envNames.authVerification.path]
      );

      const authVerificationUrl = authDomain + authVerificationPath;

      const results = await axios(authVerificationUrl, {
        method: "POST",
        data: { token: validatedValue["sso-token"] },
        headers: {
          "sso-token": encryptedSSOToken,
        },
      });
      req.body.userId = results.data;

      next();
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).send("This request is not authorized.");
    }
  }
  // If the request is invalid
  else {
    res.status(StatusCodes.FORBIDDEN).send("This request is not authorized.");
  }
};
