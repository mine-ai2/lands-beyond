'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
  storySlug: string;
  characterName: string;
  characterGreeting: string;
  characterVoice: string;
  onEnd: (transcript: Message[]) => void;
}

export default function ChatInterface({
  storySlug,
  characterName,
  characterGreeting,
  characterVoice,
  onEnd,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: characterGreeting },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storySlug,
          messages: messages,
          newMessage: userMessage,
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEnd = () => {
    onEnd(messages);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role === 'assistant' ? 'character' : 'user'}
            content={message.content}
            characterName={characterName}
            voice={characterVoice}
          />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-zinc-500">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-100">●</span>
            <span className="animate-pulse delay-200">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say something..."
            disabled={isLoading}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-600"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-medium rounded transition-colors"
          >
            Send
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleEnd}
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            End conversation →
          </button>
        </div>
      </div>
    </div>
  );
}
