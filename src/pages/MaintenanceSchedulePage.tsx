import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Wrench, AlertTriangle } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  taskType: string;
  description: string;
  scheduledDate: Date;
  duration: number; // in hours
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  assignedTechnician?: string;
}

const MaintenanceSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Sample maintenance data
  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: '1',
      machineId: 'CNC-001',
      machineName: 'CNC Machine 001',
      taskType: 'Oil Change',
      description: 'Regular hydraulic oil change and filter replacement',
      scheduledDate: new Date(2025, 5, 8), // June 8, 2025
      duration: 2,
      priority: 'medium',
      status: 'scheduled',
      assignedTechnician: 'John Smith'
    },
    {
      id: '2',
      machineId: 'PUMP-005',
      machineName: 'Hydraulic Pump 005',
      taskType: 'Bearing Replacement',
      description: 'Replace main bearing assembly and lubrication',
      scheduledDate: new Date(2025, 5, 10), // June 10, 2025
      duration: 4,
      priority: 'high',
      status: 'scheduled',
      assignedTechnician: 'Mike Johnson'
    },
    {
      id: '3',
      machineId: 'CONV-012',
      machineName: 'Conveyor Belt 012',
      taskType: 'Belt Inspection',
      description: 'Inspect belt tension and alignment, replace if necessary',
      scheduledDate: new Date(2025, 5, 12), // June 12, 2025
      duration: 1.5,
      priority: 'low',
      status: 'scheduled',
      assignedTechnician: 'Sarah Wilson'
    },
    {
      id: '4',
      machineId: 'COMP-003',
      machineName: 'Air Compressor 003',
      taskType: 'Filter Replacement',
      description: 'Replace air filters and check pressure settings',
      scheduledDate: new Date(2025, 5, 15), // June 15, 2025
      duration: 1,
      priority: 'medium',
      status: 'scheduled',
      assignedTechnician: 'David Brown'
    }
  ];

  const getTasksForDate = (date: Date) => {
    return maintenanceTasks.filter(task => isSameDay(task.scheduledDate, date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarDays className="h-8 w-8 text-sage-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance Scheduler</h1>
                <p className="text-gray-600">Schedule and track machine maintenance tasks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className="bg-sage-500 hover:bg-sage-600"
              >
                Calendar View
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="bg-sage-500 hover:bg-sage-600"
              >
                List View
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              {/* Full-width Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Calendar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border scale-150"
                    modifiers={{
                      hasTasks: (date) => getTasksForDate(date).length > 0
                    }}
                    modifiersStyles={{
                      hasTasks: { 
                        backgroundColor: '#10b981', 
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Selected Date Tasks Below Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Tasks for {format(selectedDate, 'MMM dd, yyyy')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No maintenance tasks scheduled for this date</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedDateTasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{task.machineName}</h4>
                              <p className="text-sm text-gray-600">{task.taskType}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{task.duration}h</span>
                            </div>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          
                          {task.assignedTechnician && (
                            <p className="text-sm text-gray-500 mt-2">
                              Assigned: {task.assignedTechnician}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Scheduled Maintenance Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {maintenanceTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">{task.machineName}</h4>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Task:</span>
                                <p className="font-medium">{task.taskType}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium">{format(task.scheduledDate, 'MMM dd, yyyy')}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <p className="font-medium">{task.duration} hours</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Technician:</span>
                                <p className="font-medium">{task.assignedTechnician || 'Unassigned'}</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                          </div>
                          
                          <div className="ml-4">
                            <Button variant="outline" size="sm">
                              <Wrench className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSchedulePage;
