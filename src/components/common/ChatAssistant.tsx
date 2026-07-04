import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateChatResponse } from '../../data/generators';
import { uid } from '../../utils/helpers';
import type { ChatMessage } from '../../types';

const SUGGESTED_QUESTIONS = [
  'How should I price my product?',
  'What\'s the best marketing channel for a SaaS startup?',
  'How do I approach fundraising?',
  'What should my MVP include?',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your AI startup assistant. Ask me anything about marketing, finance, product development, hiring, growth, or investment.",
  timestamp: Date.now(),
};

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: generateChatResponse(text),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, response]);
      setTyping(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-xl shadow-primary-500/30 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open AI chat assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">AI Assistant</p>
                  <p className="text-xs text-success-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> Online
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="h-2 w-2 rounded-full bg-slate-400"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200/60 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about marketing, finance, growth..."
                  className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
