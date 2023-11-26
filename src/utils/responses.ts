import { ZodError } from "zod";
import { Response } from "express";

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

export const success = <T>(res: Response, message: string, data?: T) => {
  return res
    .status(Responses.SUCCESS)
    .json(responseModel<T>(Responses.SUCCESS, message, data));
};

export const created = <T>(res: Response, message: string, data?: T) => {
  return res
    .status(Responses.CREATED)
    .json(responseModel<T>(Responses.CREATED, message, data));
};

export const badRequest = (res: Response, message: string) => {
  return res
    .status(Responses.BAD_REQUEST)
    .json(responseModel(Responses.BAD_REQUEST, message));
};

export const unauthorized = (res: Response, message: string) => {
  return res
    .status(Responses.UNAUTHORIZED)
    .json(responseModel(Responses.UNAUTHORIZED, message));
};

export const notFound = (res: Response, message: string) => {
  return res
    .status(Responses.NOT_FOUND)
    .json(responseModel(Responses.NOT_FOUND, message));
};

export const forbidden = (res: Response, message: string) => {
  return res
    .status(Responses.FORBIDDEN)
    .json(responseModel(Responses.FORBIDDEN, message));
};

export const conflict = (res: Response, message: string) => {
  return res
    .status(Responses.CONFLICT)
    .json(responseModel(Responses.CONFLICT, message));
};

export const validationError = (res: Response, message: string) => {
  return res
    .status(Responses.VALIDATION_ERROR)
    .json(responseModel(Responses.VALIDATION_ERROR, message));
};

export const internalServerError = (res: Response) => {
  return res
    .status(Responses.INTERNAL_SERVER_ERROR)
    .json(
      responseModel(Responses.INTERNAL_SERVER_ERROR, "Internal Server Error")
    );
};

export const parseZodError = <T = any>(error: ZodError<T>) => {
  const flattened = error.flatten();

  const fieldErrors = Object.keys(flattened.fieldErrors)
    .map((key) => `${key} ${flattened.fieldErrors[key as keyof true]}`)
    .join(", ");

  return fieldErrors;
};
