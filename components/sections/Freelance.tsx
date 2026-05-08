'use client';

import { motion } from 'framer-motion';
import { Testimonial } from '@/lib/types';

interface UpworkStats {
  totalEarningsDisplay: string;
  totalJobs: number;
  completedJobs: number;
  totalHours: number;
  jobSuccessRate: number;
  rating: number;
  badge: string;
}

interface FreelanceProps {
  upworkStats: UpworkStats;
  testimonials: Testimonial[];
}

const stats = [
  { key: 'completedJobs', label: 'Jobs Completed', icon: '✅', suffix: '+' },
  { key: 'totalHours', label: 'Hours Worked', icon: '⏱️', format: true },
  { key: 'rating', label: 'Avg Rating', icon: '⭐', suffix: '/5.0' },
  { key: 'jobSuccessRate', label: 'Job Success', icon: '🎯', suffix: '%' },
] as const;

export default function Freelance({ upworkStats, testimonials }: FreelanceProps) {
  const featured = testimonials
    .filter((t) => t.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <section id="freelance" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-primary">
            <span className="terminal:hidden">Freelance Track Record</span>
            <span className="hidden terminal:inline">cat upwork-stats.json</span>
          </h2>
          <p className="section-subtitle">
            <span className="terminal:hidden">
              Proven delivery across 60+ completed contracts on Upwork
            </span>
            <span className="hidden terminal:inline">
              # Verified freelance metrics and client feedback
            </span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat) => {
            const raw = upworkStats[stat.key as keyof UpworkStats];
            let display: string;
            if ('format' in stat && stat.format) {
              display = Number(raw).toLocaleString() + '+';
            } else {
              display = String(raw) + ('suffix' in stat ? stat.suffix : '');
            }

            return (
              <div
                key={stat.key}
                className="card p-4 text-center"
              >
                <div className="text-2xl mb-1 terminal:hidden">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {display}
                </div>
                <div className="text-sm text-secondary mt-1">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Badge Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full terminal:bg-transparent terminal:border terminal:border-terminal-accent terminal:text-terminal-accent">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {upworkStats.badge}
          </span>
          <a
            href={`https://www.upwork.com/freelancers/aderabiruk`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:text-terminal-fg"
          >
            View on Upwork
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="card p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg
                  className="w-8 h-8 text-blue-200 dark:text-gray-600 flex-shrink-0 terminal:text-terminal-dim"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="flex-1">
                  <p className="text-primary leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 terminal:border-terminal-dim">
                <div>
                  <p className="text-sm font-medium text-primary">{testimonial.author}</p>
                  <p className="text-xs text-secondary">{testimonial.jobTitle}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-amber-400 terminal:text-terminal-accent'
                          : 'text-gray-200 dark:text-gray-600 terminal:text-terminal-dim'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
