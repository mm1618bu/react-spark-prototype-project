
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

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
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-6xl mx-auto">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask questions about the anomaly data..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          className="bg-sage-500 hover:bg-sage-600"
          disabled={!input.trim()}
        >
          <SendIcon size={18} />
        </Button>
      </form>
    </div>
  );
};
