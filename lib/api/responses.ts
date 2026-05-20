import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data, error: null }, init);
}

export function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "internal_error";

  return NextResponse.json({ data: null, error: { message, code } }, { status });
}
