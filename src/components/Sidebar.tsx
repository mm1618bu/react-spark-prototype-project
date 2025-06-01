

import React from 'react';
import { FileText, Settings, Info, BookmarkIcon, Heart, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-sage-500 w-[80px] flex flex-col items-center py-4 text-white">
      <div className="mb-8 text-xl font-bold flex items-center">
        <span className="text-white">(</span>
        <span className="text-sage-200">*</span>
        <span className="text-white">)</span>
      </div>
      <div className="flex flex-col space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-sage-600">
                <FileText size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Documents</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-sage-600 relative"
                onClick={() => navigate('/machine-health')}
              >
                <Heart size={20} />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"></div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Machine Health</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-sage-600"
                onClick={() => navigate('/scheduler')}
              >
                <Calendar size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Maintenance Scheduler</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-sage-600">
                <BookmarkIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Saved Queries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-sage-600"
                onClick={() => navigate('/settings')}
              >
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-sage-600">
                <Info size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

