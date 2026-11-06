// Sends an error in the standard "problem details" format (RFC 9457).

import type { Response } from "express";

export function sendProblem(
  res: Response,
  status: number,
  title: string,
  extra: Record<string, unknown> = {},
): void {
  res
    .status(status)
    .type("application/problem+json")
    .json({
      type: "about:blank",
      title,
      status,
      ...extra,
    });
}

interface ValidationIssue {
  path: readonly PropertyKey[];
  message: string;
}

// Sends a 400 error that lists every wrong field.
export function sendValidationProblem(res: Response, issues: readonly ValidationIssue[]): void {
  sendProblem(res, 400, "Invalid query parameters", {
    errors: issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}
