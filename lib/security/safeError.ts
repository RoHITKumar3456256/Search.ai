import { NextResponse } from "next/server";

export function safeErrorResponse(message: string, status: number = 400) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return NextResponse.json(
    {
      error: {
        message,
        requestId,
      },
    },
    { status }
  );
}
