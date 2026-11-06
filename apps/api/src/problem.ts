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
