"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface IterationChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export default function IterationChat({ messages, onSendMessage, isProcessing }: IterationChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl animate-fade-in animate-delay-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_theme(colors.green.500)]"></div>
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">AI Assistant</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10 text-sm italic">
            Start chatting to refine your document...
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                                max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm border
                                ${msg.role === 'user'
                  ? 'bg-indigo-600/80 border-indigo-500/50 text-white rounded-br-sm'
                  : 'bg-white/10 border-white/10 text-slate-200 rounded-bl-sm'
                }
                            `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type instructions..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            aria-label="Send message"
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl w-12 flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/20"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
