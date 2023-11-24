import { ZodError } from "zod";

export enum Responses {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}

const responseModel = <T>(code: Responses, message: string, data?: T) => {
  return {
    code,
    message,
    data,
  };
};

export const success = <T>(message: string, data?: T) => {
  return responseModel<T>(Responses.SUCCESS, message, data);
};

export const created = <T>(message: string, data?: T) => {
  return responseModel<T>(Responses.CREATED, message, data);
};

export const badRequest = (message: string) => {
  return responseModel(Responses.BAD_REQUEST, message);
};

export const unauthorized = (message: string) => {
  return responseModel(Responses.UNAUTHORIZED, message);
};

export const notFound = (message: string) => {
  return responseModel(Responses.NOT_FOUND, message);
};

export const forbidden = (message: string) => {
  return responseModel(Responses.FORBIDDEN, message);
};

export const conflict = (message: string) => {
  return responseModel(Responses.CONFLICT, message);
};

export const validationError = (message: string) => {
  return responseModel(Responses.VALIDATION_ERROR, message);
};

export const internalServerError = () => {
  return responseModel(
    Responses.INTERNAL_SERVER_ERROR,
    "Internal Server Error"
  );
};

export const parseZodError = <T = any>(error: ZodError<T>) => {
  const errors: string[] = [];
  error.issues.forEach((issue) => {
    errors.push(issue.message);
  });
  return errors.join(", ");
};
