import { errorMessages } from "../../services/errorMessages";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { StatusCodes } from "http-status-codes";

// The different error methods that are available to be called
type RequestErrorMethods = {
  // The error to send with the request */
  badRequest: () => void;

  // The error to send with the request */
  server: () => void;
};

// An error object within a network request
type RequestError = {
  status: number;
  errorMessage: string;
};

// Express request with an error property
export interface ExpressRequestError extends ExpressRequest {
  failed?: RequestError;
}

/**
 * Handles all errors from a request. This is the last middleware
 * the Express server will go through.
 * @param req The network request
 * @param res The network response
 */
export const requestFailedWithError = (
  req: ExpressRequestError,
  res: ExpressResponse
) => {
  // If there's a request error - send the error with the request's response
  if (req.failed) {
    res.status(req.failed.status).send(req.failed.errorMessage);
  } else {
    /**
     * If there's no request error - an error occured with the server since
     * no response was returned. Therefore, an internal server error is returned
     */
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(errorMessages.serverError);
  }
};

/**
 * Creates a network request error
 * @param req A network request
 * @param error The error that occured with the request
 * @returns The methods available to be called to specify the request error
 */
export const RequestError = (
  req: ExpressRequestError,
  error: Error
): RequestErrorMethods => {
  /**
   * Sets the network error as a bad request
   */
  const badRequest = (): void => {
    // The default error message
    const defaultMessage = errorMessages.badRequest;
    // The error message
    const errorMessage = error.message;
    // Adds the error to the request
    req.failed = {
      errorMessage: errorMessage ? errorMessage : defaultMessage,
      status: StatusCodes.BAD_REQUEST,
    };
  };

  /**
   * Sets the network error as an internal server error
   */
  const server = (): void => {
    // The default error message
    const defaultMessage = errorMessages.serverError;
    // The error message
    const errorMessage = error.message;
    // Adds the error to the request
    req.failed = {
      errorMessage: errorMessage ? errorMessage : defaultMessage,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  };

  // Returns the methods available to call
  return { badRequest, server };
};
