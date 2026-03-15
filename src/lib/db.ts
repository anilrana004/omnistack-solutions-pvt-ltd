import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

const cached: Cached = globalThis.mongoose ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") globalThis.mongoose = cached;

export async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URL or MONGODB_URI is not set");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI?.length);
}

/** Use MongoDB for feedback only when explicitly enabled (default: file storage). */
export function isMongoFeedbackEnabled(): boolean {
  return Boolean(MONGODB_URI?.length && process.env.USE_MONGODB_FEEDBACK === 'true');
}
