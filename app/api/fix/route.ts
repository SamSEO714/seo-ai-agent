import { NextRequest, NextResponse } from 'next/server';
import { autoFixIssue, bulkFixAll } from '@/lib/fix-engine';
import { Issue } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface FixRequestBody {
  issue?: unknown;
  issues?: unknown;
  mode?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    let body: FixRequestBody;

    try {
      body = (await request.json()) as FixRequestBody;
    } catch {
      return NextResponse.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const { issue, issues, mode } = body;

    if (mode === 'bulk' && Array.isArray(issues)) {
      const results = await bulkFixAll(issues as Issue[]);
      return NextResponse.json({
        success: true,
        mode: 'bulk',
        results,
        totalFixed: results.length,
        totalPages: results.reduce((total, result) => total + result.pagesFixed, 0),
      });
    }

    if (issue && typeof issue === 'object') {
      const result = await autoFixIssue(issue as Issue);
      return NextResponse.json({
        success: true,
        mode: 'single',
        result,
      });
    }

    return NextResponse.json(
      { error: 'Invalid request: provide issue, or an issues array with mode set to bulk' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Fix error:', error);
    return NextResponse.json(
      {
        error: 'Failed to apply fix',
        ...(process.env.NODE_ENV === 'development'
          ? { details: error instanceof Error ? error.message : String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
