import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Wrench } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { fetchMaintenanceTasks, MaintenanceTask } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

const MaintenanceSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMaintenanceTasks = async () => {
      try {
        console.log('Loading maintenance tasks...');
        const tasks = await fetchMaintenanceTasks();
        setMaintenanceTasks(tasks);
        console.log('Maintenance tasks loaded successfully:', tasks);
      } catch (error) {
        console.error('Failed to load maintenance tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMaintenanceTasks();
  }, [toast]);

  const getTasksForDate = (date: Date) => {
    return maintenanceTasks.filter(task => isSameDay(new Date(task.scheduled_date), date));
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

  // Get dates that have maintenance tasks for the main calendar
  const getDatesWithTasks = () => {
    return maintenanceTasks.map(task => new Date(task.scheduled_date));
  };

  const datesWithTasks = getDatesWithTasks();
  const selectedDateTasks = getTasksForDate(selectedDate);

  if (loading) {
    return (
      <div className="min-h-screen flex w-full">
        <Sidebar 
          maintenanceTasks={[]}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
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
            </div>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-gray-500">Loading maintenance tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar 
        maintenanceTasks={maintenanceTasks.map(task => ({
          ...task,
          scheduledDate: new Date(task.scheduled_date),
          machineId: task.machine_id,
          machineName: task.machine_name,
          taskType: task.task_type,
          assignedTechnician: task.assigned_technician
        }))}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Calendar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                      }
                    }}
                    className="rounded-md border"
                    modifiers={{
                      hasTask: datesWithTasks,
                    }}
                    modifiersStyles={{
                      hasTask: {
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Selected Date Tasks */}
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
                    <div className="space-y-4">
                      {selectedDateTasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{task.machine_name}</h4>
                              <p className="text-sm text-gray-600">{task.task_type}</p>
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
                          
                          {task.assigned_technician && (
                            <p className="text-sm text-gray-500 mt-2">
                              Assigned: {task.assigned_technician}
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
                  {maintenanceTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No maintenance tasks found</p>
                  ) : (
                    <div className="space-y-3">
                      {maintenanceTasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900">{task.machine_name}</h4>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Task:</span>
                                  <p className="font-medium">{task.task_type}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <p className="font-medium">{format(new Date(task.scheduled_date), 'MMM dd, yyyy')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <p className="font-medium">{task.duration} hours</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Technician:</span>
                                  <p className="font-medium">{task.assigned_technician || 'Unassigned'}</p>
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
                  )}
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
