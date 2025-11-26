import { ZodError } from "zod";
import { logger } from "../logger";
import { UnauthorizedError } from "./unAuthError";
import { EmailError } from "./EmailError";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";
import { ErrorResponse } from "../next-response";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export const handleApiErrors = (error: unknown) => {
  // Handle Clerk API errors
  if (isClerkAPIResponseError(error)) {
    logger.error({
      type: "ClerkAPIError",
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.errors[0].message || "Clerk API error occurred",
      error: error.errors,
      status: error.status || 400,
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error({
      type: "PrismaClientInitializationError",
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error({
      type: "PrismaClientValidationError",
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({
      type: "PrismaClientKnownRequestError",
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof ZodError) {
    logger.error({
      type: "ZodError",
      message: error.issues[0].message,
      error: error,
    });
    return ErrorResponse({
      message: error.issues[0].message,
      error: error.issues,
      status: 400,
    });
  }

  if (error instanceof EmailError) {
    logger.error({
      type: "EmailError",
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.message || "Failed to send email",
      error,
      status: error.status,
    });
  }

  if (error instanceof UnauthorizedError) {
    logger.error({
      type: "UnauthorizedError",
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.message || "Unauthorized",
      status: error.status,
    });
  }
  if (error instanceof Error) {
    logger.error({
      type: "Error",
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.message,
      error,
    });
  }

  logger.error({
    type: "UnknownError",
    message: "Internal Server Error",
    error,
  });

  return ErrorResponse({ message: "Internal Server Error", error });
};
