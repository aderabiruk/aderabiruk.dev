'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '@/lib/types';

interface ProjectCardProps {
  project: Experience;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const timelineDisplay = project.isCurrent
    ? `${project.startDate.slice(0, 4)} - Present`
    : `${project.startDate.slice(0, 4)} - ${project.endDate?.slice(0, 4) || ''}`;

  return (
    <motion.div
      id={`project-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {project.featured && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full mb-2 terminal:bg-transparent terminal:border terminal:border-terminal-accent terminal:text-terminal-accent">
                Featured
              </span>
            )}
            <h3 className="text-xl font-semibold text-primary">
              {project.company}
            </h3>
          </div>
          <span className="text-sm text-secondary whitespace-nowrap">
            {timelineDisplay}
          </span>
        </div>

        <p className="text-secondary mb-4">{project.summary}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">{project.title}</span>
          <div className="flex items-center gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 terminal:text-terminal-dim terminal:hover:text-terminal-fg"
                aria-label="Live site"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 terminal:text-terminal-accent terminal:hover:text-terminal-fg"
            >
              {isExpanded ? 'Show less' : 'Details'}
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 terminal:border-terminal-dim">
                {project.overview && (
                  <p className="text-secondary leading-relaxed mb-4">
                    {project.overview}
                  </p>
                )}
                {project.impact && project.impact.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">Impact</h4>
                    <ul className="space-y-1">
                      {project.impact.map((item, i) => (
                        <li key={i} className="text-sm text-secondary flex items-start gap-2">
                          <span className="text-green-500 mt-0.5 terminal:text-terminal-fg">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!project.overview && (
                  <ul className="space-y-1">
                    {project.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-secondary flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 terminal:text-terminal-fg">-</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
