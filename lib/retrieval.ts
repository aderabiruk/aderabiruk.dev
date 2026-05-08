import { ContentChunk, Profile, TimelineData, Experience, FaqEntry, Testimonial, SkillCategory, Credentials } from './types';
import { getAllContent } from './content';

interface RetrievalResult {
  chunks: ContentChunk[];
  totalScore: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function calculateScore(query: string, content: string): number {
  const queryTokens = tokenize(query);
  const contentTokens = new Set(tokenize(content));

  let score = 0;
  for (const token of queryTokens) {
    if (contentTokens.has(token)) {
      score += 1;
    }
    // Partial matches
    for (const contentToken of contentTokens) {
      if (contentToken.includes(token) || token.includes(contentToken)) {
        score += 0.5;
      }
    }
  }

  return score;
}

function chunkProfile(profile: Profile): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  chunks.push({
    id: 'profile-basic',
    source: 'profile',
    content: `Name: ${profile.name}. Title: ${profile.title}. ${profile.tagline}. Location: ${profile.location}. Email: ${profile.email}.`,
    metadata: { section: 'basic' },
  });

  chunks.push({
    id: 'profile-bio',
    source: 'profile',
    content: `Bio: ${profile.bio}`,
    metadata: { section: 'bio' },
  });

  chunks.push({
    id: 'profile-expertise',
    source: 'profile',
    content: `Areas of expertise: ${profile.expertise.join(', ')}.`,
    metadata: { section: 'expertise' },
  });

  chunks.push({
    id: 'profile-tech',
    source: 'profile',
    content: `Primary technologies and tools: ${profile.primaryTech.join(', ')}.`,
    metadata: { section: 'tech' },
  });

  chunks.push({
    id: 'profile-availability',
    source: 'profile',
    content: `Available for: ${profile.availableFor.join(', ')}. Working hours: ${profile.workingHours}. Response time: ${profile.responseTime}.`,
    metadata: { section: 'availability' },
  });

  return chunks;
}

function chunkTimeline(timeline: TimelineData): ContentChunk[] {
  return timeline.milestones.map((milestone) => ({
    id: `timeline-${milestone.id}`,
    source: 'timeline',
    content: `${milestone.date}: ${milestone.title}. ${milestone.summary} ${milestone.bullets.join('. ')}. Tags: ${milestone.tags.join(', ')}. Type: ${Array.isArray(milestone.type) ? milestone.type.join(', ') : milestone.type}.`,
    metadata: {
      milestoneId: milestone.id,
      type: milestone.type,
      date: milestone.date,
    },
  }));
}

function chunkFaq(faq: FaqEntry[]): ContentChunk[] {
  return faq.map((entry, index) => ({
    id: `faq-${index}`,
    source: 'faq',
    content: `Q: ${entry.question} A: ${entry.answer}`,
    metadata: { question: entry.question, category: entry.category },
  }));
}

function chunkExperiences(experiences: Experience[]): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  for (const exp of experiences) {
    chunks.push({
      id: `experience-${exp.id}`,
      source: 'experience',
      content: `${exp.title} at ${exp.company}. ${exp.summary}. ${exp.bullets.join('. ')}. Skills: ${exp.skills.join(', ')}.`,
      metadata: {
        experienceId: exp.id,
        company: exp.company,
        featured: exp.featured,
      },
    });

    if (exp.overview) {
      chunks.push({
        id: `experience-${exp.id}-overview`,
        source: 'experience',
        content: `${exp.company}: ${exp.overview}`,
        metadata: { experienceId: exp.id },
      });
    }

    if (exp.impact && exp.impact.length > 0) {
      chunks.push({
        id: `experience-${exp.id}-impact`,
        source: 'experience',
        content: `${exp.company} impact: ${exp.impact.join('. ')}`,
        metadata: { experienceId: exp.id },
      });
    }
  }

  return chunks;
}

function chunkTestimonials(testimonials: Testimonial[]): ContentChunk[] {
  return testimonials.map((t) => ({
    id: `testimonial-${t.id}`,
    source: 'testimonial',
    content: `Client review from ${t.author} for "${t.jobTitle}": "${t.quote}" Rating: ${t.rating}/5.`,
    metadata: { author: t.author, rating: t.rating },
  }));
}

function chunkSkills(skills: SkillCategory[]): ContentChunk[] {
  return skills.map((cat) => ({
    id: `skills-${cat.category.toLowerCase().replace(/\s+/g, '-')}`,
    source: 'skills',
    content: `${cat.category} skills: ${cat.skills.join(', ')}.`,
    metadata: { category: cat.category },
  }));
}

function chunkCredentials(credentials: Credentials): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  for (const edu of credentials.education) {
    chunks.push({
      id: `education-${edu.school.toLowerCase().replace(/\s+/g, '-')}`,
      source: 'credentials',
      content: `Education: ${edu.degree} in ${edu.field} from ${edu.school}${edu.campus ? ` (${edu.campus})` : ''}, ${edu.startYear}-${edu.endYear}${edu.gpa ? `, GPA: ${edu.gpa}` : ''}. Location: ${edu.location}.`,
      metadata: { type: 'education' },
    });
  }

  for (const cert of credentials.certifications) {
    chunks.push({
      id: `cert-${cert.credentialId}`,
      source: 'credentials',
      content: `Certification: ${cert.name} from ${cert.issuer}, issued ${cert.issuedDate}. Credential ID: ${cert.credentialId}.`,
      metadata: { type: 'certification' },
    });
  }

  if (credentials.languages.length > 0) {
    chunks.push({
      id: 'languages',
      source: 'credentials',
      content: `Languages: ${credentials.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}.`,
      metadata: { type: 'languages' },
    });
  }

  return chunks;
}

export function getAllChunks(): ContentChunk[] {
  const content = getAllContent();
  const chunks: ContentChunk[] = [];

  chunks.push(...chunkProfile(content.profile));
  chunks.push(...chunkTimeline(content.timeline));
  chunks.push(...chunkFaq(content.faq));
  chunks.push(...chunkExperiences(content.experiences));
  chunks.push(...chunkTestimonials(content.testimonials));
  chunks.push(...chunkSkills(content.skills));
  chunks.push(...chunkCredentials(content.credentials));

  return chunks;
}

export function retrieveRelevantChunks(
  query: string,
  topK: number = 5
): RetrievalResult {
  const allChunks = getAllChunks();

  const scoredChunks = allChunks.map((chunk) => ({
    chunk,
    score: calculateScore(query, chunk.content),
  }));

  scoredChunks.sort((a, b) => b.score - a.score);

  const topChunks = scoredChunks.slice(0, topK).filter((sc) => sc.score > 0);

  return {
    chunks: topChunks.map((sc) => sc.chunk),
    totalScore: topChunks.reduce((sum, sc) => sum + sc.score, 0),
  };
}

export function generateFallbackResponse(query: string): {
  answer: string;
  relatedLinks: { label: string; href: string }[];
} {
  const result = retrieveRelevantChunks(query, 3);

  if (result.chunks.length === 0 || result.totalScore < 1) {
    return {
      answer:
        "I don't have enough information to answer that question based on the content available on this site. Feel free to reach out directly through the contact form for more specific inquiries.",
      relatedLinks: [{ label: 'Contact', href: '#contact' }],
    };
  }

  const links: { label: string; href: string }[] = [];
  const uniqueSources = new Set<string>();

  for (const chunk of result.chunks) {
    if (chunk.source === 'timeline' && chunk.metadata.milestoneId) {
      const href = `#timeline-${chunk.metadata.milestoneId}`;
      if (!uniqueSources.has(href)) {
        links.push({ label: 'Timeline', href });
        uniqueSources.add(href);
      }
    } else if (chunk.source === 'experience' && chunk.metadata.experienceId) {
      const href = `#project-${chunk.metadata.experienceId}`;
      if (!uniqueSources.has(href)) {
        links.push({ label: 'Projects', href });
        uniqueSources.add(href);
      }
    } else if (chunk.source === 'profile') {
      if (!uniqueSources.has('#about')) {
        links.push({ label: 'About', href: '#about' });
        uniqueSources.add('#about');
      }
    } else if (chunk.source === 'faq') {
      if (!uniqueSources.has('#contact')) {
        links.push({ label: 'Contact/FAQ', href: '#contact' });
        uniqueSources.add('#contact');
      }
    } else if (chunk.source === 'testimonial') {
      if (!uniqueSources.has('#freelance')) {
        links.push({ label: 'Testimonials', href: '#freelance' });
        uniqueSources.add('#freelance');
      }
    } else if (chunk.source === 'skills') {
      if (!uniqueSources.has('#about')) {
        links.push({ label: 'About', href: '#about' });
        uniqueSources.add('#about');
      }
    }
  }

  const relevantInfo = result.chunks
    .map((chunk) => chunk.content)
    .join('\n\n');

  const summary = relevantInfo.length > 500
    ? relevantInfo.substring(0, 500) + '...'
    : relevantInfo;

  return {
    answer: `Based on the information available:\n\n${summary}`,
    relatedLinks: links.slice(0, 4),
  };
}

export function buildContextForLLM(query: string): string {
  const result = retrieveRelevantChunks(query, 15);

  if (result.chunks.length === 0) {
    return 'No relevant information found in the available content.';
  }

  const context = result.chunks
    .map(
      (chunk) =>
        `[Source: ${chunk.source}${chunk.metadata.milestoneId ? ` - ${chunk.metadata.milestoneId}` : ''}${chunk.metadata.experienceId ? ` - ${chunk.metadata.experienceId}` : ''}]\n${chunk.content}`
    )
    .join('\n\n---\n\n');

  return context;
}
