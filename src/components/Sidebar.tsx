
import React, { useState } from 'react';
import { FileText, Settings, Info, BookmarkIcon, Heart, CalendarDays } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Calendar } from './ui/calendar';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleMaintenanceScheduleClick = () => {
    console.log('Calendar icon clicked - navigating to /maintenance-schedule');
    navigate('/maintenance-schedule');
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="h-screen bg-sage-500 flex text-white relative">
      {/* Main sidebar */}
      <div className="w-[80px] flex flex-col items-center py-4">
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
                  className={`text-white hover:bg-sage-600 ${showCalendar ? 'bg-sage-600' : ''}`}
                  onClick={handleMaintenanceScheduleClick}
                >
                  <CalendarDays size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Maintenance Schedule</p>
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

      {/* Calendar panel */}
      {showCalendar && (
        <div className="w-[300px] bg-white text-black p-4 shadow-lg border-l border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">Maintenance Calendar</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border w-full"
          />
        </div>
      )}
    </div>
  );
};
