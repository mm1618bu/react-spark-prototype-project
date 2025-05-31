
import React from 'react';
import { FileText, Settings, Info, BookmarkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export const Sidebar = () => {
  return (
    <div className="h-screen bg-sage-500 w-[80px] flex flex-col items-center py-4 text-white">
      <div className="mb-8 text-xl font-bold">
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
              <Button variant="ghost" size="icon" className="text-white hover:bg-sage-600">
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
