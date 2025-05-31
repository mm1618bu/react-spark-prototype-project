
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export const InspectionHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-1" 
          onClick={() => navigate('/machine-health')}
        >
          <ArrowLeft size={18} />
        </Button>
        <Logo />
      </div>
    </header>
  );
};
