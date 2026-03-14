import { NextResponse } from 'next/server';
import { logger } from '@/src/lib/logger';
import { getAdminFeedback } from '@/src/lib/feedback-admin';

export async function GET() {
  try {
    const feedback = await getAdminFeedback();
    return NextResponse.json({ feedback });
  } catch (error) {
    logger.apiError('/api/admin/feedback (GET)', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
