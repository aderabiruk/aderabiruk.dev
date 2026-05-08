'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactCategory, ContactFormData } from '@/lib/types';
import clsx from 'clsx';

const categories: { id: ContactCategory; label: string; description: string }[] = [
  {
    id: 'hiring',
    label: 'Hiring/Contract',
    description: "I'm looking to hire or contract you",
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    description: "Let's work on a project together",
  },
  {
    id: 'speaking',
    label: 'Speaking/Interview',
    description: 'Inviting you to speak or interview',
  },
  {
    id: 'general',
    label: 'General',
    description: 'General inquiry or question',
  },
  {
    id: 'feedback',
    label: 'Website Feedback',
    description: 'Feedback about this website',
  },
];

interface ContactFormProps {
  calendarUrl?: string;
}

export default function ContactForm({ calendarUrl }: ContactFormProps) {
  const [category, setCategory] = useState<ContactCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const showBookingOption = category === 'hiring' || category === 'collaboration';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      console.log('Bot detected');
      return;
    }

    if (!category) {
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, category }),
      });

      const result = await response.json();

      setSubmitResult({
        success: response.ok,
        message: result.message || (response.ok ? 'Message sent!' : 'Failed to send'),
      });

      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          message: '',
          honeypot: '',
        });
        setCategory(null);
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryFields = () => {
    if (!category) return null;

    switch (category) {
      case 'hiring':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="Position title"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Budget/Rate Range
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., $150-200/hr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  name="projectTimeline"
                  value={formData.projectTimeline || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., ASAP, Q2 2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Tech Stack (if relevant)
              </label>
              <input
                type="text"
                name="stack"
                value={formData.stack || ''}
                onChange={handleChange}
                className="input"
                placeholder="e.g., TypeScript, React, Node.js"
              />
            </div>
          </>
        );

      case 'collaboration':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Project Type
                </label>
                <input
                  type="text"
                  name="projectType"
                  value={formData.projectType || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Open source, Startup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  name="projectTimeline"
                  value={formData.projectTimeline || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="Expected duration"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                What do you need?
              </label>
              <input
                type="text"
                name="whatYouNeed"
                value={formData.whatYouNeed || ''}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Technical co-founder, Backend expertise"
              />
            </div>
          </>
        );

      case 'speaking':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Event/Publication
                </label>
                <input
                  type="text"
                  name="event"
                  value={formData.event || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="Conference name or publication"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Date
                </label>
                <input
                  type="text"
                  name="eventDate"
                  value={formData.eventDate || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., March 2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic || ''}
                onChange={handleChange}
                className="input"
                placeholder="What would you like me to speak about?"
              />
            </div>
          </>
        );

      case 'general':
        return (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic || ''}
              onChange={handleChange}
              className="input"
              placeholder="What is this about?"
            />
          </div>
        );

      case 'feedback':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Page
              </label>
              <input
                type="text"
                name="page"
                value={formData.page || ''}
                onChange={handleChange}
                className="input"
                placeholder="Which page/section?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Issue/Suggestion
              </label>
              <input
                type="text"
                name="issue"
                value={formData.issue || ''}
                onChange={handleChange}
                className="input"
                placeholder="Brief description"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card p-6 md:p-8">
      {/* Category selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-secondary mb-3">
          What are you contacting me for?
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id);
                setSubmitResult(null);
              }}
              className={clsx(
                'p-4 rounded-lg border-2 text-left transition-all',
                category === cat.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 terminal:border-terminal-fg terminal:bg-terminal-dim/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 terminal:border-terminal-dim terminal:hover:border-terminal-fg'
              )}
            >
              <span className="block font-medium text-primary">{cat.label}</span>
              <span className="block text-sm text-secondary mt-1">
                {cat.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {category && (
          <motion.form
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Honeypot field */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Common fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Category-specific fields */}
            {renderCategoryFields()}

            {/* Message field */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="input resize-none"
                placeholder="Tell me more..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <span className="terminal:hidden">Send Message</span>
                    <span className="hidden terminal:inline">$ send --message</span>
                  </>
                )}
              </button>

              {showBookingOption && calendarUrl && (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 text-center"
                >
                  <span className="terminal:hidden">Book a Call</span>
                  <span className="hidden terminal:inline">$ book --call</span>
                </a>
              )}
            </div>

            {/* Submit result */}
            <AnimatePresence>
              {submitResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={clsx(
                    'p-4 rounded-lg text-sm',
                    submitResult.success
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 terminal:bg-transparent terminal:border terminal:border-terminal-fg terminal:text-terminal-fg'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 terminal:bg-transparent terminal:border terminal:border-terminal-error terminal:text-terminal-error'
                  )}
                >
                  {submitResult.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {!category && (
        <p className="text-center text-secondary py-8">
          Select a category above to continue
        </p>
      )}
    </div>
  );
}
