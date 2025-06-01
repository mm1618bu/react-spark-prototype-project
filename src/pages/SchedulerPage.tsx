
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/Sidebar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface MaintenanceSchedule {
  id: string;
  machineId: string;
  machineName: string;
  type: 'preventive' | 'corrective' | 'overhaul';
  date: Date;
  duration: string;
  priority: 'low' | 'medium' | 'high';
}

const mockScheduleData: MaintenanceSchedule[] = [
  {
    id: '1',
    machineId: 'M001',
    machineName: 'CNC Machine A',
    type: 'preventive',
    date: new Date(2025, 5, 5), // June 5, 2025
    duration: '4 hours',
    priority: 'medium'
  },
  {
    id: '2',
    machineId: 'M002',
    machineName: 'Hydraulic Press B',
    type: 'corrective',
    date: new Date(2025, 5, 8), // June 8, 2025
    duration: '2 hours',
    priority: 'high'
  },
  {
    id: '3',
    machineId: 'M003',
    machineName: 'Assembly Line C',
    type: 'overhaul',
    date: new Date(2025, 5, 15), // June 15, 2025
    duration: '8 hours',
    priority: 'low'
  },
  {
    id: '4',
    machineId: 'M004',
    machineName: 'Conveyor System D',
    type: 'preventive',
    date: new Date(2025, 5, 20), // June 20, 2025
    duration: '3 hours',
    priority: 'medium'
  }
];

const SchedulerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getScheduleForDate = (date: Date) => {
    return mockScheduleData.filter(schedule => isSameDay(schedule.date, date));
  };

  const getScheduledDates = () => {
    return mockScheduleData.map(schedule => schedule.date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'corrective':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overhaul':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedSchedules = selectedDate ? getScheduleForDate(selectedDate) : [];

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Maintenance Scheduler</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    scheduled: getScheduledDates()
                  }}
                  modifiersStyles={{
                    scheduled: {
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Schedule Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Schedule for ${format(selectedDate, 'MMMM d, yyyy')}`
                    : 'Select a date to view schedule'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {selectedSchedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{schedule.machineName}</h3>
                          <Badge className={getPriorityColor(schedule.priority)}>
                            {schedule.priority}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Machine ID:</span>
                            <span className="text-sm font-medium">{schedule.machineId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Type:</span>
                            <Badge className={getTypeColor(schedule.type)}>
                              {schedule.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Duration:</span>
                            <span className="text-sm font-medium">{schedule.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {selectedDate 
                      ? 'No maintenance scheduled for this date'
                      : 'Select a date to view scheduled maintenance'
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockScheduleData.filter(s => s.type === 'preventive').length}
                  </div>
                  <div className="text-sm text-blue-800">Preventive Maintenance</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {mockScheduleData.filter(s => s.type === 'corrective').length}
                  </div>
                  <div className="text-sm text-orange-800">Corrective Maintenance</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockScheduleData.filter(s => s.type === 'overhaul').length}
                  </div>
                  <div className="text-sm text-purple-800">Overhauls</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
