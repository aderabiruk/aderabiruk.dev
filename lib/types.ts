export interface UpworkStats {
  totalEarningsDisplay: string;
  totalJobs: number;
  completedJobs: number;
  totalHours: number;
  jobSuccessRate: number;
  rating: number;
  badge: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  careerStartYear: number;
  bio: string;
  expertise: string[];
  primaryTech: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    upwork?: string;
  };
  availableFor: string[];
  workingHours: string;
  responseTime: string;
  upworkStats?: UpworkStats;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string | null;
  employmentType: string;
  location: string;
  remote: boolean;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  summary: string;
  bullets: string[];
  skills: string[];
  source: string;
  featured?: boolean;
  live?: string;
  overview?: string;
  impact?: string[];
  relatedUpworkJobIds?: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  jobTitle: string;
  rating: number;
  upworkJobId: string;
  featured: boolean;
  order: number;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Credentials {
  education: {
    school: string;
    campus?: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
    gpa?: number;
    location: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    issuedDate: string;
    credentialId: string;
    credentialUrl: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  linkedAccounts: {
    platform: string;
    username: string;
    url?: string | null;
  }[];
}

export function getYearsOfExperience(startYear: number): number {
  return new Date().getFullYear() - startYear;
}

export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  summary: string;
  bullets: string[];
  tags: string[];
  type: string | string[];
  links?: { label: string; url: string }[];
}

export interface TimelineTypes {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface TimelineData {
  milestones: TimelineMilestone[];
  types: TimelineTypes;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedLinks?: { label: string; href: string }[];
  timestamp: Date;
}

export type ContactCategory =
  | 'hiring'
  | 'collaboration'
  | 'speaking'
  | 'general'
  | 'feedback';

export interface ContactFormData {
  category: ContactCategory;
  name: string;
  email: string;
  company?: string;
  role?: string;
  budget?: string;
  projectTimeline?: string;
  stack?: string;
  projectType?: string;
  whatYouNeed?: string;
  event?: string;
  eventDate?: string;
  topic?: string;
  page?: string;
  issue?: string;
  message: string;
  honeypot?: string;
}

export interface FaqEntry {
  category: string;
  question: string;
  answer: string;
}

export interface ContentChunk {
  id: string;
  source: string;
  content: string;
  metadata: Record<string, unknown>;
}
