
import React from 'react';
import { Input } from './ui/input';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const SearchBar = () => {
  return (
    <div className="relative flex items-center w-full">
      <Input 
        className="pr-10 bg-sage-50 border-none focus-visible:ring-sage-200 text-gray-600 placeholder:text-gray-400"
        placeholder="Ask away!" 
      />
      <Button 
        size="icon" 
        variant="ghost" 
        className="absolute right-1 text-sage-500 hover:text-sage-700 hover:bg-transparent"
      >
        <ArrowRight size={18} />
      </Button>
    </div>
  );
};
