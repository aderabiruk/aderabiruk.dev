'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessage from './ChatMessage';
import clsx from 'clsx';

const suggestedPrompts = [
  'Summarize my experience',
  'What tech do I use most?',
  'Show projects relevant to backend roles',
  'How can I contact you?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I'm sorry, I couldn't process that request.",
        relatedLinks: data.relatedLinks,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors',
          'bg-blue-600 hover:bg-blue-700 text-white',
          'terminal:bg-terminal-bg terminal:border-2 terminal:border-terminal-fg terminal:text-terminal-fg terminal:hover:bg-terminal-dim/20',
          isOpen && 'hidden'
        )}
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </motion.button>

      {/* Chat drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-50 md:hidden"
            />

            {/* Chat panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className={clsx(
                'fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50',
                'w-full md:w-[400px] h-[70vh] md:h-[600px] md:max-h-[80vh]',
                'bg-white dark:bg-gray-900 md:rounded-2xl shadow-2xl overflow-hidden',
                'flex flex-col',
                'terminal:bg-terminal-bg terminal:border terminal:border-terminal-fg'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 terminal:border-terminal-dim">
                <div>
                  <h3 className="font-semibold text-primary">
                    <span className="terminal:hidden">Ask me anything</span>
                    <span className="hidden terminal:inline">$ chat --ai</span>
                  </h3>
                  <p className="text-xs text-secondary">
                    <span className="terminal:hidden">
                      AI-powered assistant based on site content
                    </span>
                    <span className="hidden terminal:inline">
                      # Powered by RAG
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors terminal:hover:bg-terminal-dim/20"
                  aria-label="Close chat"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400 terminal:text-terminal-dim"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-secondary mb-4">
                      <span className="terminal:hidden">
                        Hi! Ask me about Biruk&apos;s experience, skills, or projects.
                      </span>
                      <span className="hidden terminal:inline">
                        # Query: experience | skills | projects
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:border-terminal-fg terminal:hover:text-terminal-fg"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 terminal:bg-transparent terminal:border terminal:border-terminal-dim">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce terminal:bg-terminal-fg" />
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce terminal:bg-terminal-fg"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce terminal:bg-terminal-fg"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested prompts (when conversation started) */}
              {messages.length > 0 && messages.length < 4 && (
                <div className="px-4 pb-2">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                    {suggestedPrompts
                      .filter(
                        (p) => !messages.some((m) => m.content === p)
                      )
                      .slice(0, 2)
                      .map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          disabled={isLoading}
                          className="px-3 py-1 text-xs whitespace-nowrap bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full transition-colors disabled:opacity-50 terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:border-terminal-fg"
                        >
                          {prompt}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-gray-200 dark:border-gray-700 terminal:border-terminal-dim"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="input flex-1 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="btn-primary px-4"
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
