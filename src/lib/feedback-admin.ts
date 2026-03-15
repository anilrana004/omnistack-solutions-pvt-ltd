import { readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { dbConnect, isMongoFeedbackEnabled } from "@/src/lib/db";
import { Feedback } from "@/src/lib/models/Feedback";

const DATA_FILE = join(process.cwd(), "data", "feedback.json");

export interface AdminFeedbackItem {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

function ensureDataDir() {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
}

function readAllFromFile(): AdminFeedbackItem[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) return [];
  try {
    const all = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    return all
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map(
        (f: {
          id: string;
          name: string;
          email?: string;
          rating: number;
          message: string;
          createdAt: string;
        }) => ({
          id: f.id,
          name: f.name,
          email: f.email ?? "",
          rating: f.rating,
          message: f.message,
          createdAt: f.createdAt,
        })
      );
  } catch {
    return [];
  }
}

export async function getAdminFeedback(): Promise<AdminFeedbackItem[]> {
  if (isMongoFeedbackEnabled()) {
    try {
      await dbConnect();
      const list = await Feedback.find().sort({ createdAt: -1 }).lean();
      return list.map((doc: Record<string, unknown>) => ({
        id: (doc._id as { toString(): string })?.toString() ?? "",
        name: String(doc.name ?? ""),
        email: String(doc.email ?? ""),
        rating: Number(doc.rating ?? 0),
        message: String(doc.message ?? ""),
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt ?? ""),
      }));
    } catch {
      return readAllFromFile();
    }
  }
  return readAllFromFile();
}
