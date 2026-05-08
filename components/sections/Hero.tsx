'use client';

import { motion } from 'framer-motion';
import { Profile, getYearsOfExperience } from '@/lib/types';

interface HeroProps {
  profile: Profile;
  onOpenChat: () => void;
}

export default function Hero({ profile, onOpenChat }: HeroProps) {
  const yearsOfExperience = getYearsOfExperience(profile.careerStartYear);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 terminal:text-terminal-accent">
            <span className="terminal:hidden">Hello, I&apos;m</span>
            <span className="hidden terminal:inline">$ whoami</span>
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 terminal:text-terminal-fg"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 terminal:text-terminal-dim"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto terminal:text-terminal-dim"
        >
          {yearsOfExperience}+ years {profile.tagline.toLowerCase()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onOpenChat}
            className="btn-primary px-6 py-3 text-lg group"
          >
            <span className="terminal:hidden">Ask the AI about me</span>
            <span className="hidden terminal:inline">$ ./chat --ai</span>
            <svg
              className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <a
            href="#contact"
            className="btn-secondary px-6 py-3 text-lg"
          >
            <span className="terminal:hidden">Get in touch</span>
            <span className="hidden terminal:inline">$ ./contact</span>
          </a>
        </motion.div>

        {profile.upworkStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-accent terminal:text-terminal-accent">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Top Rated Plus
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-fg terminal:text-terminal-fg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              100% Job Success
            </span>
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim">
              60+ Projects Delivered
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          {profile.primaryTech.slice(0, 8).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16"
        >
          <a
            href="#about"
            className="inline-flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors terminal:text-terminal-dim terminal:hover:text-terminal-fg"
          >
            <span className="text-sm mb-2">
              <span className="terminal:hidden">Scroll to explore</span>
              <span className="hidden terminal:inline">$ scroll --down</span>
            </span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
