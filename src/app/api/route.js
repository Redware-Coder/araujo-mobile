import { NextResponse } from "next/server";

export function GET(request) {
  let ip =
    request.headers.get("x-forwarded-for") ||
    request.ip ||
    "IP não identificado";

  if (ip.includes(",")) {
    ip = ip.split(",")[0];
  }

  // remove ::ffff:
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return NextResponse.json({ ip });
}
