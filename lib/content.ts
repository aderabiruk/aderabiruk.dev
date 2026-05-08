import fs from 'fs';
import path from 'path';
import { Profile, TimelineData, Experience, Testimonial, SkillCategory, Credentials, FaqEntry } from './types';

const contentDir = path.join(process.cwd(), 'content');

export function getProfile(): Profile {
  const filePath = path.join(contentDir, 'profile.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getTimeline(): TimelineData {
  const filePath = path.join(contentDir, 'timeline.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getFaq(): FaqEntry[] {
  const filePath = path.join(contentDir, 'faq.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getExperiences(): Experience[] {
  const filePath = path.join(contentDir, 'experience.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getTestimonials(): Testimonial[] {
  const filePath = path.join(contentDir, 'testimonials.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getSkills(): SkillCategory[] {
  const filePath = path.join(contentDir, 'skills.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getCredentials(): Credentials {
  const filePath = path.join(contentDir, 'credentials.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getAllContent(): {
  profile: Profile;
  timeline: TimelineData;
  faq: FaqEntry[];
  experiences: Experience[];
  testimonials: Testimonial[];
  skills: SkillCategory[];
  credentials: Credentials;
} {
  return {
    profile: getProfile(),
    timeline: getTimeline(),
    faq: getFaq(),
    experiences: getExperiences(),
    testimonials: getTestimonials(),
    skills: getSkills(),
    credentials: getCredentials(),
  };
}
