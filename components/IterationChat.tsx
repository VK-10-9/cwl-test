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
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">AI Assistant</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-10 text-sm italic">
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
                                max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed border
                                ${msg.role === 'user'
                  ? 'bg-primary text-primary-foreground border-primary/50 rounded-br-sm'
                  : 'bg-secondary text-foreground border-border rounded-bl-sm'
                }
                            `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-secondary border border-border rounded-xl px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type instructions..."
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            aria-label="Send message"
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg w-12 flex items-center justify-center transition-colors"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
