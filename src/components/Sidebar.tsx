
import React from 'react';
import { FileText, Settings, Info, BookmarkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-primary w-[80px] flex flex-col items-center py-4 text-white">
      <div className="mb-8 text-xl font-bold">
        <span className="text-white">(</span>
        <span className="text-gray-300">*</span>
        <span className="text-white">)</span>
      </div>
      <div className="flex flex-col space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
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
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
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
                className="text-white hover:bg-gray-700"
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
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
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
