import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { ContactFormData, ContactCategory } from '@/lib/types';

const validCategories: ContactCategory[] = [
  'hiring',
  'collaboration',
  'speaking',
  'general',
  'feedback',
];

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getRateLimitIdentifier(request);
  const rateLimitResult = checkRateLimit(identifier);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many requests. Please try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetIn / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      // Silently accept but don't process
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message!',
      });
    }

    // Validate required fields
    const { category, name, email, message } = body;

    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Sanitize data
    const formData: ContactFormData = {
      category,
      name: name.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
      message: message.trim().substring(0, 5000),
      company: body.company?.trim().substring(0, 100),
      role: body.role?.trim().substring(0, 100),
      budget: body.budget?.trim().substring(0, 100),
      projectTimeline: body.projectTimeline?.trim().substring(0, 100),
      stack: body.stack?.trim().substring(0, 200),
      projectType: body.projectType?.trim().substring(0, 100),
      whatYouNeed: body.whatYouNeed?.trim().substring(0, 500),
      event: body.event?.trim().substring(0, 100),
      eventDate: body.eventDate?.trim().substring(0, 50),
      topic: body.topic?.trim().substring(0, 200),
      page: body.page?.trim().substring(0, 100),
      issue: body.issue?.trim().substring(0, 500),
    };

    // Send email
    const result = await sendContactEmail(formData);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
