'use client';

import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-blue-600 text-white terminal:bg-terminal-fg terminal:text-terminal-bg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:text-terminal-fg'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {message.relatedLinks && message.relatedLinks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 terminal:border-terminal-dim">
            <p className="text-xs font-medium mb-2 opacity-75">Related:</p>
            <div className="flex flex-wrap gap-2">
              {message.relatedLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'text-xs px-2 py-1 rounded-full transition-colors',
                    isUser
                      ? 'bg-blue-500 hover:bg-blue-400 terminal:bg-terminal-bg terminal:text-terminal-fg terminal:hover:bg-terminal-dim'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 terminal:bg-transparent terminal:border terminal:border-terminal-dim terminal:hover:border-terminal-fg'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
