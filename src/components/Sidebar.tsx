import React from 'react';
import { FileText, Settings, Info, BookmarkIcon, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMachineHealthClick = () => {
    console.log('Heart icon clicked - navigating to /machine-health');
    navigate('/machine-health');
  };

  return (
    <div className="h-screen bg-sage-500 w-[80px] flex flex-col items-center py-4 text-white">
      <button 
        onClick={handleLogoClick}
        className="mb-8 text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="text-white">(</span>
        <span className="text-sage-200">*</span>
        <span className="text-white">)</span>
      </button>
      
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-sage-600"
                onClick={handleMachineHealthClick}
              >
                <Heart size={20} />
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
                onClick={handleSettingsClick}
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
