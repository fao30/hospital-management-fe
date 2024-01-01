import { TRPCError } from "@trpc/server";
import { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import SuperJSON from "superjson";

export const transformer = SuperJSON;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc";
}

export const ERROR_MESSAGES: Record<TRPC_ERROR_CODE_KEY, string> = {
  PARSE_ERROR: "Error parsing the request. Please check the syntax of your request.",
  BAD_REQUEST: "Invalid request. Please provide valid request parameters.",
  INTERNAL_SERVER_ERROR: "Internal server error. Please try again later.",
  NOT_IMPLEMENTED: "Feature not implemented. This functionality is currently unavailable.",
  UNAUTHORIZED: "Unauthorized access. Please authenticate to access this resource.",
  FORBIDDEN: "Access forbidden. You do not have permission to access this resource.",
  NOT_FOUND: "Resource not found. The requested resource does not exist.",
  METHOD_NOT_SUPPORTED: "HTTP method not supported. Please use a supported HTTP method.",
  TIMEOUT: "Request timeout. The server did not receive a timely response.",
  CONFLICT: "Conflict in resource state. There is a conflict with the current state of the resource.",
  PRECONDITION_FAILED: "Precondition failed for the request. Please meet the required conditions.",
  PAYLOAD_TOO_LARGE: "Request payload too large. The size of the request payload exceeds the limit.",
  UNPROCESSABLE_CONTENT: "Unprocessable request content. The request content is not valid or cannot be processed.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  CLIENT_CLOSED_REQUEST: "Client closed the request. The client terminated the request unexpectedly.",
};

export const THROW_TRPC_ERROR = (code: TRPC_ERROR_CODE_KEY, message?: string) => {
  throw new TRPCError({ code, message: message ? message : ERROR_MESSAGES[code] });
};
