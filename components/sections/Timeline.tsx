'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimelineData } from '@/lib/types';
import TimelineCard from '@/components/ui/TimelineCard';
import clsx from 'clsx';

interface TimelineProps {
  timeline: TimelineData;
}

export default function Timeline({ timeline }: TimelineProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    timeline.milestones.forEach((m) => m.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [timeline]);

  const filteredMilestones = useMemo(() => {
    let filtered = [...timeline.milestones];

    if (selectedType) {
      filtered = filtered.filter((m) => {
        const types = Array.isArray(m.type) ? m.type : [m.type];
        return types.includes(selectedType);
      });
    }

    if (selectedTag) {
      filtered = filtered.filter((m) => m.tags.includes(selectedTag));
    }

    // Sort by date descending
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date.length === 4 ? `${a.date}-01` : a.date);
      const dateB = new Date(b.date.length === 4 ? `${b.date}-01` : b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [timeline, selectedType, selectedTag]);

  return (
    <section id="timeline" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-primary">
            <span className="terminal:hidden">Career Journey</span>
            <span className="hidden terminal:inline">cat career.log</span>
          </h2>
          <p className="section-subtitle">
            <span className="terminal:hidden">
              My professional timeline and key milestones
            </span>
            <span className="hidden terminal:inline">
              # Chronological career events
            </span>
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
        >
          {/* Type filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-full transition-colors',
                selectedType === null
                  ? 'bg-blue-600 text-white terminal:bg-terminal-fg terminal:text-terminal-bg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:border-terminal-fg'
              )}
            >
              All
            </button>
            {Object.entries(timeline.types).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key === selectedType ? null : key)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full transition-colors',
                  selectedType === key
                    ? 'bg-blue-600 text-white terminal:bg-terminal-fg terminal:text-terminal-bg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:border-terminal-fg'
                )}
              >
                {value.label}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          <select
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="input max-w-[200px] text-sm"
          >
            <option value="">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Timeline - Desktop (horizontal-inspired vertical) */}
        <div className="hidden md:block relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 terminal:bg-terminal-dim" />

          <div className="space-y-12">
            {filteredMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={clsx(
                  'grid grid-cols-2 gap-8',
                  index % 2 === 0 ? '' : 'direction-rtl'
                )}
              >
                {index % 2 === 0 ? (
                  <>
                    <TimelineCard
                      milestone={milestone}
                      types={timeline.types}
                      isLeft
                    />
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <TimelineCard
                      milestone={milestone}
                      types={timeline.types}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline - Mobile (vertical) */}
        <div className="md:hidden space-y-6">
          {filteredMilestones.map((milestone) => (
            <TimelineCard
              key={milestone.id}
              milestone={milestone}
              types={timeline.types}
            />
          ))}
        </div>

        {filteredMilestones.length === 0 && (
          <p className="text-center text-secondary py-12">
            No milestones match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
