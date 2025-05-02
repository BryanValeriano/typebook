import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Temporary user ID injection
  res.headers.set("x-user-id", "3");

  return res;
}
