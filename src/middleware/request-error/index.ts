import { errorMessages } from "@services/errorMessages";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { StatusCodes } from "http-status-codes";

// The different error methods that are available to be called
type RequestErrorMethods = {
  badRequest: () => void;
  server: () => void;
  validation: () => void;
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
   * Creates a request error
   * @param defaultMessage The default error message
   * @param status The request's error status
   * @param errorMessage A custom error message
   */
  const createError = (
    defaultMessage: string,
    status: StatusCodes,
    errorMessage?: string
  ) => {
    return {
      errorMessage: errorMessage || defaultMessage,
      status,
    };
  };

  /**
   * Sets the network error as a bad request
   */
  const badRequest = (): void => {
    // The default error message
    const defaultMessage = errorMessages.badRequest;
    // The error message
    const errorMessage = error.message;
    // Adds the error to the request
    req.failed = createError(
      defaultMessage,
      StatusCodes.BAD_REQUEST,
      errorMessage
    );
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
    req.failed = createError(
      defaultMessage,
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage
    );
  };

  /**
   * Sets the network error as a bad request due to validation errors
   */
  const validation = (): void => {
    // The default error message
    const defaultMessage = errorMessages.validationFail;
    // The error message
    const errorMessage = error.message
      ? `${errorMessages.validationFail} Property ${error.message}`
      : undefined;

    // Adds the error to the request
    req.failed = createError(
      defaultMessage,
      StatusCodes.BAD_REQUEST,
      errorMessage
    );
  };

  // Returns the methods available to call
  return { badRequest, server, validation };
};
