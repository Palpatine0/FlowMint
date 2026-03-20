import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

function formatMessage(content: string) {
  const lines = content.split('\n');

  return lines.map((line, i) => {
    const isBullet = line.trim().match(/^[-*]\s+(.*)/);
    const textToParse = isBullet ? isBullet[1] : line;

    const boldParts = textToParse.split(/(\*\*.*?\*\*)/g);
    const formattedText = boldParts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={j}
            className="font-semibold text-slate-900 dark:text-white leading-relaxed tracking-wide"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{part}</span>;
    });

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2.5 items-start mt-2 mb-2 ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0 opacity-80" />
          <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide">
            {formattedText}
          </div>
        </div>
      );
    }

    return (
      <div
        key={i}
        className={
          line.trim() === ''
            ? 'h-1'
            : 'mb-2 text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide'
        }
      >
        {formattedText}
      </div>
    );
  });
}
import { generateAIResponse } from '../../services/aiService';
import type { ChatMessage, Transaction, SavingsGoal, UserProfile } from '../../types';

interface Props {
  profile: UserProfile;
  transactions: Transaction[];
  goals: SavingsGoal[];
}

export function ChatWidget({ profile, transactions, goals }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi there! I'm your FlowMint AI assistant. Ask me anything about your spending, budgets, or goals!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!profile.geminiApiKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            '❌ **API Key Missing!**\n\nPlease paste your Google API key in the Settings tab to use the AI chat manager!',
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const replyText = await generateAIResponse(
        userMessage.content,
        profile.geminiApiKey,
        transactions,
        goals,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `**Error:** ${error.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] max-h-[80vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center p-4 bg-primary-500 text-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">FlowMint Assistant</h3>
                <p className="text-xs text-primary-100">Powered by local Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-none whitespace-pre-wrap' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'}`}
                >
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
