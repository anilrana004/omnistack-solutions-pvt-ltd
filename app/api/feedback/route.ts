import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from '@/src/lib/logger';
import { dbConnect, useMongoForFeedback } from '@/src/lib/db';
import { Feedback } from '@/src/lib/models/Feedback';

interface FileFeedback {
  id: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  rating: number;
  message: string;
  approved?: boolean;
  createdAt: string;
}

const DATA_FILE = join(process.cwd(), 'data', 'feedback.json');

function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

function readFeedbackFromFile(): FileFeedback[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) return [];
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.apiError('/api/feedback (read)', error instanceof Error ? error : new Error(String(error)), {
      errorType: 'FILE_READ_ERROR',
    });
    return [];
  }
}

function writeFeedbackToFile(feedback: FileFeedback[]): void {
  ensureDataDir();
  try {
    writeFileSync(DATA_FILE, JSON.stringify(feedback, null, 2), 'utf-8');
  } catch (error) {
    logger.apiError('/api/feedback (write)', error instanceof Error ? error : new Error(String(error)), {
      errorType: 'FILE_WRITE_ERROR',
    });
    throw error;
  }
}

type FeedbackLike = {
  _id?: unknown;
  id?: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  rating: number;
  message: string;
  createdAt: Date | string;
};

function toPublicFeedback(item: FeedbackLike | FileFeedback) {
  const id =
    '_id' in item && typeof item._id === 'object' && item._id && 'toString' in item._id
      ? (item._id as { toString(): string }).toString()
      : (item as FileFeedback).id ?? '';
  return {
    id,
    name: item.name,
    email: item.email ?? '',
    role: item.role ?? '',
    company: item.company ?? '',
    rating: item.rating,
    message: item.message,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : (item.createdAt as Date).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 6), 100) : 6;

    if (useMongoForFeedback()) {
      try {
        await dbConnect();
        const list = await Feedback.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        const testimonials = list.map((doc) => toPublicFeedback(doc as unknown as FeedbackLike));
        return NextResponse.json({ testimonials });
      } catch {
        // Fall back to file if MongoDB fails
      }
    }

    const allFeedback = readFeedbackFromFile();
    const approved = (allFeedback as FileFeedback[])
      .filter((f) => f.approved !== false)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    const testimonials = approved.map((f) => toPublicFeedback(f));
    return NextResponse.json({ testimonials });
  } catch (error) {
    logger.apiError('/api/feedback (GET)', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, company, rating, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (useMongoForFeedback()) {
      const emailVal = typeof email === 'string' ? email.trim() : '';
      if (!emailVal) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      await dbConnect();
      const doc = await Feedback.create({
        name: name.trim(),
        email: emailVal.toLowerCase(),
        rating: Number(rating),
        message: message.trim(),
        role: typeof role === 'string' ? role.trim() : undefined,
        company: typeof company === 'string' ? company.trim() : undefined,
      });
      const feedback = toPublicFeedback({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
        company: doc.company,
        rating: doc.rating,
        message: doc.message,
        createdAt: doc.createdAt,
      });
      return NextResponse.json(
        { message: 'Thank you for your feedback!', success: true, feedback },
        { status: 201 }
      );
    }

    const newFeedback: FileFeedback = {
      id: Date.now().toString(),
      name: name.trim(),
      email: typeof email === 'string' ? email.trim() : undefined,
      role: typeof role === 'string' ? role.trim() : undefined,
      company: typeof company === 'string' ? company.trim() : undefined,
      rating: Number(rating),
      message: message.trim(),
      approved: true,
      createdAt: new Date().toISOString(),
    };
    const allFeedback = readFeedbackFromFile();
    allFeedback.push(newFeedback);
    writeFeedbackToFile(allFeedback);
    return NextResponse.json(
      {
        message: 'Thank you for your feedback!',
        success: true,
        feedback: toPublicFeedback(newFeedback),
      },
      { status: 201 }
    );
  } catch (error) {
    logger.apiError('/api/feedback (POST)', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
