'use client';

import { motion } from 'framer-motion';
import { Profile, getYearsOfExperience } from '@/lib/types';

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  const yearsOfExperience = getYearsOfExperience(profile.careerStartYear);

  return (
    <section id="about" className="section bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-primary">
            <span className="terminal:hidden">About Me</span>
            <span className="hidden terminal:inline">cat about.md</span>
          </h2>
          <p className="section-subtitle">
            <span className="terminal:hidden">Get to know me better</span>
            <span className="hidden terminal:inline"># Biography and expertise</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                <span className="terminal:hidden">Background</span>
                <span className="hidden terminal:inline">## Background</span>
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-accent terminal:text-terminal-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                <span className="terminal:hidden">Tech Stack</span>
                <span className="hidden terminal:inline">## Tech Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.primaryTech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-mono terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                <span className="terminal:hidden">Available For</span>
                <span className="hidden terminal:inline">## Available For</span>
              </h3>
              <ul className="space-y-2">
                {profile.availableFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-secondary"
                  >
                    <svg
                      className="w-5 h-5 text-green-500 terminal:text-terminal-fg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="terminal:hidden">{item}</span>
                    <span className="hidden terminal:inline">- {item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                <span className="terminal:hidden">Quick Info</span>
                <span className="hidden terminal:inline">## Quick Info</span>
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-secondary">Experience</dt>
                  <dd className="text-primary font-medium">{yearsOfExperience}+ years</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Location</dt>
                  <dd className="text-primary font-medium">{profile.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Working Hours</dt>
                  <dd className="text-primary font-medium">{profile.workingHours}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Response Time</dt>
                  <dd className="text-primary font-medium">{profile.responseTime}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
