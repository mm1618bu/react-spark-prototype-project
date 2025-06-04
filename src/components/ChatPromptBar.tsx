
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ChatPromptBarProps {
  onMessageSent: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export const ChatPromptBar = ({ onMessageSent, onTyping }: ChatPromptBarProps) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onTyping(value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onMessageSent(input.trim());
    setInput('');
    onTyping(false);
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask away!"
          className="pr-12 bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-600 placeholder:text-gray-400 focus-visible:ring-sage-200"
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-2 text-sage-500 hover:text-sage-700 hover:bg-transparent"
          disabled={!input.trim()}
        >
          <ArrowRight size={20} />
        </Button>
      </form>
    </div>
  );
};
