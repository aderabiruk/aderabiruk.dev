'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineMilestone, TimelineTypes } from '@/lib/types';
import clsx from 'clsx';

interface TimelineCardProps {
  milestone: TimelineMilestone;
  types: TimelineTypes;
  isLeft?: boolean;
}

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  backend: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
  },
  fullstack: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-500',
    text: 'text-purple-700 dark:text-purple-300',
  },
  leadership: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    text: 'text-green-700 dark:text-green-300',
  },
  founder: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
  },
  education: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-500',
    text: 'text-gray-700 dark:text-gray-300',
  },
};

export default function TimelineCard({
  milestone,
  types,
  isLeft = false,
}: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeList = Array.isArray(milestone.type) ? milestone.type : [milestone.type];
  const primaryType = typeList[0];
  const colors = typeColors[primaryType] || typeColors.fullstack;

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    if (month) {
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    return year;
  };

  return (
    <div
      id={`timeline-${milestone.id}`}
      className={clsx('relative', isLeft ? 'md:pr-12' : 'md:pl-12')}
    >
      {/* Timeline dot */}
      <div
        className={clsx(
          'hidden md:block absolute top-6 w-4 h-4 rounded-full border-4 bg-white dark:bg-gray-950 terminal:bg-terminal-bg',
          colors.border,
          isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2',
          'terminal:border-terminal-fg'
        )}
      />

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={clsx(
          'card p-6 cursor-pointer transition-all hover:shadow-md',
          colors.bg,
          'terminal:bg-terminal-bg terminal:hover:bg-terminal-dim/10'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {typeList.map((t) => {
                const tc = typeColors[t] || typeColors.fullstack;
                return (
                  <span
                    key={t}
                    className={clsx(
                      'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                      tc.text,
                      tc.bg,
                      'terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim'
                    )}
                  >
                    {types[t]?.label || t}
                  </span>
                );
              })}
            </div>
            <h3 className="text-lg font-semibold text-primary">
              {milestone.title}
            </h3>
          </div>
          <span className="text-sm text-secondary whitespace-nowrap">
            {formatDate(milestone.date)}
          </span>
        </div>

        <p className="text-secondary mb-3">{milestone.summary}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {milestone.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 terminal:text-terminal-accent">
          <span>{isExpanded ? 'Show less' : 'Show more'}</span>
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
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 terminal:border-terminal-dim">
                <ul className="space-y-2 mb-4">
                  {milestone.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-secondary"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 terminal:text-terminal-fg shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {milestone.links && milestone.links.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {milestone.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 terminal:text-terminal-accent terminal:hover:text-terminal-fg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label}
                        <svg
                          className="w-4 h-4"
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
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
