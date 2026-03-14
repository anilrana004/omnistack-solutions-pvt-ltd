import { NextResponse } from "next/server";
import { dbConnect, isMongoConfigured } from "@/src/lib/db";

const CHECK_TIMEOUT_MS = 12000;

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { connected: false, message: "MONGODB_URI is not set" },
      { status: 503 }
    );
  }
  try {
    const connectPromise = dbConnect();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Connection timed out (12s)")), CHECK_TIMEOUT_MS)
    );
    await Promise.race([connectPromise, timeoutPromise]);
    return NextResponse.json({
      connected: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed";
    return NextResponse.json(
      { connected: false, message },
      { status: 503 }
    );
  }
}
