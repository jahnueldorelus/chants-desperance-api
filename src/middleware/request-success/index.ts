import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { StatusCodes } from "http-status-codes";

// Successful data return type
type RequestSuccessData = string | number | object | boolean | undefined;

// Successful file return type
type RequestSuccessFile = string;

// Express response headers
type ExtraHeaders = Array<{ headerName: string; headerValue: string }>;

// Express success response
type SuccessResponse = {
  headers?: ExtraHeaders;
  data: RequestSuccessData;
  file?: RequestSuccessFile;
};

// Express request with a success property
interface ExpressRequestSuccess extends ExpressRequest {
  success?: SuccessResponse;
}

/**
 * Handles all successful requests.
 * @param req The network request
 * @param res The network response
 * @param next The function that passes data to the next middleware
 */
export const requestPassedWithSuccess = (
  req: ExpressRequestSuccess,
  res: ExpressResponse,
  next: NextFunction
) => {
  // If there's a request error - send the error with the request's response
  if (req.success) {
    // Sets the response's headers if available
    if (req.success.headers) {
      req.success.headers.forEach((header) => {
        res.setHeader(header.headerName, header.headerValue);
      });
    }

    res.status(StatusCodes.OK);

    // Sends the response back with its appropriate data
    req.success.file
      ? res.sendFile(req.success.file)
      : res.send(req.success.data);
  } else {
    // Goes to the next middleware
    next();
  }
};

/**
 * Creates a successful network request
 * @param req The network request
 * @param data The data to send in the response
 * @param headers Headers to set in the response
 * @param file The file to send in the response
 */
export const RequestSuccess = (
  req: ExpressRequestSuccess,
  data: RequestSuccessData,
  headers?: ExtraHeaders,
  file?: RequestSuccessFile
): void => {
  // Adds the object data to the request
  req.success = { data, headers, file };
};
