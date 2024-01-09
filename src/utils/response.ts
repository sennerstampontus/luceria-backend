import { Response } from 'express';

// Response structure
interface ApiResponse {
  message?: string;
  data?: any;
}

// Utility function to send responses
function response(
  res: Response,
  statusCode: number = 200,
  message?: string,
  data?: any
) {
  const response: ApiResponse = {
    message,
    data,
  };
  res.status(statusCode).send(JSON.stringify(response));
}

// Middleware for different response scenarios
export const responseHandler = {
  ok: (res: Response, data?: any, message: string = 'Success') => {
    response(res, 200, message, data);
  },
  error: (
    res: Response,
    message: string = 'Bad Request',
    statusCode: number = 400
  ) => {
    response(res, statusCode, message);
  },
  notFound: (res: Response, message: string = 'Not Found') => {
    response(res, 404, message);
  },
  NotOk500: (res: Response, message: string = 'Internal Server Error') => {
    response(res, 500, message);
  },
  // You can add more handlers for different scenarios (e.g., unauthorized, forbidden, etc.)
};
