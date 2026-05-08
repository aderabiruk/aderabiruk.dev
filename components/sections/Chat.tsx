'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessage from '@/components/ui/ChatMessage';

const suggestedPrompts = [
  'Summarize my experience',
  'What tech do I use most?',
  'Show projects relevant to backend roles',
  'How can I contact you?',
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
    <section id="chat" className="section bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-primary">
            <span className="terminal:hidden">Ask the AI About Me</span>
            <span className="hidden terminal:inline">./chatbot --interactive</span>
          </h2>
          <p className="section-subtitle">
            <span className="terminal:hidden">
              Get answers about my experience, skills, and projects
            </span>
            <span className="hidden terminal:inline">
              # Query site content using natural language
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card overflow-hidden"
        >
          {/* Chat messages area */}
          <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center terminal:bg-transparent terminal:border-2 terminal:border-terminal-dim">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400 terminal:text-terminal-fg"
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
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  <span className="terminal:hidden">Start a conversation</span>
                  <span className="hidden terminal:inline">$ init conversation</span>
                </h3>
                <p className="text-secondary mb-6">
                  <span className="terminal:hidden">
                    Ask me about my experience, skills, projects, or anything else!
                  </span>
                  <span className="hidden terminal:inline">
                    # Type your query or select a prompt below
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-dim terminal:hover:border-terminal-fg terminal:hover:text-terminal-fg"
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
          </div>

          {/* Quick prompts when conversation started */}
          {messages.length > 0 && messages.length < 6 && (
            <div className="px-6 pb-2 border-t border-gray-100 dark:border-gray-800 terminal:border-terminal-dim">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
                {suggestedPrompts
                  .filter((p) => !messages.some((m) => m.content === p))
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

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200 dark:border-gray-700 terminal:border-terminal-dim bg-gray-50 dark:bg-gray-800/50 terminal:bg-terminal-bg"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary px-6"
              >
                <span className="hidden sm:inline terminal:hidden">Send</span>
                <span className="hidden sm:hidden terminal:inline">$</span>
                <svg
                  className="w-5 h-5 sm:hidden"
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-secondary mt-4"
        >
          <span className="terminal:hidden">
            Answers are generated based on the content of this website.
            The AI will only respond with information available on this site.
          </span>
          <span className="hidden terminal:inline">
            # Note: Responses are grounded in site content only
          </span>
        </motion.p>
      </div>
    </section>
  );
}
