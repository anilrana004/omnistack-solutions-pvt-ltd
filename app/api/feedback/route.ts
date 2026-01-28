import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from '@/src/lib/logger';

interface Feedback {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
}

const DATA_FILE = join(process.cwd(), 'data', 'feedback.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

// Read feedback from file
function readFeedback(): Feedback[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) {
    // Return default testimonials if file doesn't exist
    return [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Founder & CEO",
        company: "TechStart Inc.",
        rating: 5,
        message: "OmniStack Solutions transformed our business with their exceptional full-stack development. Their team delivered a scalable platform that exceeded our expectations.",
        approved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "CTO",
        company: "Digital Innovations",
        rating: 5,
        message: "The AI automation solutions they built have streamlined our operations significantly. Professional, responsive, and always ahead of schedule.",
        approved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "Marketing Director",
        company: "GrowthCo",
        rating: 5,
        message: "Their PR and personal branding services helped establish our thought leadership. The strategic content and media placements were exactly what we needed.",
        approved: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
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

// Write feedback to file
function writeFeedback(feedback: Feedback[]): void {
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

// GET - Fetch approved testimonials
export async function GET() {
  try {
    const allFeedback = readFeedback();
    const approvedFeedback = allFeedback
      .filter((f) => f.approved === true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6); // Limit to latest 6 for better display

    return NextResponse.json({ testimonials: approvedFeedback });
  } catch (error) {
    logger.apiError('/api/feedback (GET)', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, rating, message } = body;

    // Validation
    if (!name || !role || !company || !rating || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create new feedback - auto-approve for instant display
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      rating: parseInt(rating),
      message: message.trim(),
      approved: true, // Auto-approve for instant display
      createdAt: new Date().toISOString(),
    };

    // Save to file
    const allFeedback = readFeedback();
    allFeedback.push(newFeedback);
    writeFeedback(allFeedback);

    // Return the saved feedback object for instant UI update
    return NextResponse.json(
      { 
        message: 'Thank you for your feedback!', 
        success: true,
        feedback: newFeedback 
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
