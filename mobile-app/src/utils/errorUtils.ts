export type ErrorType = "network" | "server" | "notFound" | "general";

export function getErrorType(errorMessage?: string | null): ErrorType {
  if (!errorMessage) return "general";
  
  const lowerError = errorMessage.toLowerCase();
  
  const networkKeywords = [
    "network",
    "connection",
    "offline",
    "timeout",
    "fetch failed",
    "no internet",
    "unreachable",
    "enotfound",
    "econnrefused",
  ];
  
  if (networkKeywords.some(keyword => lowerError.includes(keyword))) {
    return "network";
  }
  
  const serverKeywords = [
    "server",
    "500",
    "502",
    "503",
    "504",
    "internal server error",
    "bad gateway",
    "service unavailable",
    "gateway timeout",
  ];
  
  if (serverKeywords.some(keyword => lowerError.includes(keyword))) {
    return "server";
  }
  
  const notFoundKeywords = [
    "not found",
    "404",
    "does not exist",
    "cannot find",
  ];
  
  if (notFoundKeywords.some(keyword => lowerError.includes(keyword))) {
    return "notFound";
  }
  
  return "general";
}

export function getUserFriendlyErrorMessage(
  error: Error | string | null | undefined
): string {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorType = getErrorType(errorMessage);
  
  switch (errorType) {
    case "network":
      return "Please check your internet connection and try again.";
    case "server":
      return "Our servers are having issues. Please try again later.";
    case "notFound":
      return "The requested content could not be found.";
    default:
      return errorMessage || "Something went wrong. Please try again.";
  }
}