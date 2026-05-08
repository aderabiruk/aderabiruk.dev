import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import {
  buildContextForLLM,
  generateFallbackResponse,
} from '@/lib/retrieval';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Biruk Adera's AI representative on his personal portfolio website. You speak in first person as if you ARE Biruk. When visitors ask questions, you answer as Biruk would — "I built...", "I specialize in...", "My experience includes...".

CRITICAL RULES:
1. ALWAYS speak in first person (I, my, me) — you are representing Biruk directly
2. ONLY answer based on information explicitly provided in the context below
3. If the information is not in the context, say "I don't have that detail on the site yet, but feel free to reach out to me directly."
4. NEVER make up or infer information not directly stated in the context
5. NEVER fabricate employers, dates, degrees, job titles, or metrics
6. Keep answers concise, professional, and friendly
7. When relevant, suggest related sections using anchors like #about, #projects, #timeline, #contact, or #timeline-<id>, #project-<id>

Tone: Professional but approachable. You're a senior engineer talking to a potential client or employer.

Response format:
- Start with a direct answer in first person
- Include relevant details from the context
- End with "Related: [links]" when applicable

Remember: Accuracy is more important than being helpful. If you don't know, say so.`;

async function callOpenAI(
  message: string,
  context: string
): Promise<{ answer: string; relatedLinks: { label: string; href: string }[] }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Context from the website:\n\n${context}\n\n---\n\nUser question: ${message}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const answer = data.choices[0]?.message?.content || '';

  // Extract related links from the response
  const links: { label: string; href: string }[] = [];
  const linkRegex = /#([\w-]+)/g;
  let match;

  while ((match = linkRegex.exec(answer)) !== null) {
    const anchor = match[1];
    let label = anchor;

    if (anchor === 'about') label = 'About';
    else if (anchor === 'projects') label = 'Projects';
    else if (anchor === 'timeline') label = 'Timeline';
    else if (anchor === 'contact') label = 'Contact';
    else if (anchor === 'chat') label = 'Chat';
    else if (anchor.startsWith('timeline-')) label = 'Timeline Event';
    else if (anchor.startsWith('project-')) label = 'Project';

    if (!links.some((l) => l.href === `#${anchor}`)) {
      links.push({ label, href: `#${anchor}` });
    }
  }

  // Clean up the answer - remove explicit "Related:" section as we handle it separately
  const cleanAnswer = answer
    .replace(/Related:.*$/is, '')
    .replace(/\n+$/, '')
    .trim();

  return {
    answer: cleanAnswer,
    relatedLinks: links.slice(0, 4),
  };
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getRateLimitIdentifier(request);
  const rateLimitResult = checkRateLimit(`chat-${identifier}`);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        answer: `Too many requests. Please wait ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds before asking another question.`,
        relatedLinks: [],
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
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json(
        {
          answer: 'Please provide a valid question.',
          relatedLinks: [],
        },
        { status: 400 }
      );
    }

    const userMessage = message.trim().substring(0, 500);

    // Build context from site content
    const context = buildContextForLLM(userMessage);

    // If OpenAI API key is available, use it
    if (OPENAI_API_KEY) {
      try {
        const result = await callOpenAI(userMessage, context);
        return NextResponse.json(result, {
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          },
        });
      } catch (error) {
        console.error('[Chat API] OpenAI error:', error);
        // Fall back to deterministic response
      }
    }

    // Fallback: Use deterministic keyword-based response
    const fallbackResult = generateFallbackResponse(userMessage);

    return NextResponse.json(fallbackResult, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      {
        answer:
          'Sorry, there was an error processing your request. Please try again.',
        relatedLinks: [{ label: 'Contact', href: '#contact' }],
      },
      { status: 500 }
    );
  }
}
