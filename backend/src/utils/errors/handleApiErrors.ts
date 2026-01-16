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
    logger.error("Clerk API error", {
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
    logger.error("PrismaClientInitializationError", {
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error("PrismaClientValidationError", {
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error("PrismaClientKnownRequestError", {
      message: error.message,
      error,
    });
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof ZodError) {
    logger.error("ZodError", {
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
    logger.error("EmailError", {
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
    logger.error("UnauthorizedError", {
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.message || "Unauthorized",
      status: error.status,
    });
  }
  if (error instanceof Error) {
    logger.error("Error", {
      message: error.message,
      error,
    });
    return ErrorResponse({
      message: error.message,
      error,
    });
  }

  logger.error("InternalServerError", {
    message: "Internal Server Error",
    error,
  });

  return ErrorResponse({ message: "Internal Server Error", error });
};
