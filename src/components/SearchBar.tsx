
import React, { useState } from 'react';
import { Input } from './ui/input';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <Input 
        className="pr-10 bg-sage-50 border-none focus-visible:ring-sage-200 text-gray-600 placeholder:text-gray-400"
        placeholder="Ask away!" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit"
        size="icon" 
        variant="ghost" 
        className="absolute right-1 text-sage-500 hover:text-sage-700 hover:bg-transparent"
      >
        <ArrowRight size={18} />
      </Button>
    </form>
  );
};
