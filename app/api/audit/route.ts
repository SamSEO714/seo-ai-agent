import { NextRequest, NextResponse } from 'next/server';
import { performDeepAudit } from '@/lib/seo-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface AuditRequestBody {
  domain?: unknown;
  targetKeyword?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    let body: AuditRequestBody;

    try {
      body = (await request.json()) as AuditRequestBody;
    } catch {
      return NextResponse.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const domain = typeof body.domain === 'string' ? body.domain.trim() : '';
    const targetKeyword = typeof body.targetKeyword === 'string'
      ? body.targetKeyword.trim()
      : '';

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const result = await performDeepAudit(
      domain,
      targetKeyword || 'digital marketing'
    );

    return NextResponse.json(
      { success: true, data: result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Audit error:', error);

    const message = error instanceof Error ? error.message : 'Failed to perform audit';
    const isValidationError = message.startsWith('Invalid website URL');

    return NextResponse.json(
      {
        error: isValidationError ? message : 'Failed to perform audit',
        ...(process.env.NODE_ENV === 'development' ? { details: message } : {}),
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
