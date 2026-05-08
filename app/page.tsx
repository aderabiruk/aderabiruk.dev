'use client';

import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Freelance from '@/components/sections/Freelance';
import Timeline from '@/components/sections/Timeline';
import Chat from '@/components/sections/Chat';
import Contact from '@/components/sections/Contact';
import { Profile, TimelineData, Experience, Testimonial } from '@/lib/types';

// Import content statically for client component
import profileData from '@/content/profile.json';
import timelineData from '@/content/timeline.json';
import testimonialsData from '@/content/testimonials.json';
import experienceData from '@/content/experience.json';

export default function Home() {
  const profile = profileData as Profile;
  const timeline = timelineData as TimelineData;
  const testimonials = testimonialsData as Testimonial[];
  const featuredProjects = (experienceData as Experience[]).filter((e) => e.featured);
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_BOOKING_URL;

  const handleOpenChat = () => {
    const chatSection = document.getElementById('chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = chatSection.querySelector('input');
        if (input) input.focus();
      }, 500);
    }
  };

  return (
    <>
      <Hero profile={profile} onOpenChat={handleOpenChat} />
      <About profile={profile} />
      <Projects projects={featuredProjects} />
      {profile.upworkStats && (
        <Freelance upworkStats={profile.upworkStats} testimonials={testimonials} />
      )}
      <Timeline timeline={timeline} />
      <Chat />
      <Contact profile={profile} calendarUrl={calendarUrl} />
    </>
  );
}
