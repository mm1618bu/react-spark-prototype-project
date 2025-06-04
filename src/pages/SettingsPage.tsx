
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from '@/components/Sidebar';
import { Database, Cloud, FileText, Link, Clipboard } from 'lucide-react';

const SettingsPage = () => {
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDataSourceSelect = (source: string) => {
    setSelectedDataSource(source);
    if (source !== 'SQL') {
      setDatabaseUrl('');
    }
  };

  const handleAddConnection = async () => {
    if (!selectedDataSource) {
      toast({
        title: "Error",
        description: "Please select a data source",
        variant: "destructive",
      });
      return;
    }

    if (selectedDataSource === 'SQL' && !databaseUrl) {
      toast({
        title: "Error",
        description: "Please enter a database URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/addConnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseType: selectedDataSource,
          url: databaseUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Database connection added successfully",
      });

      // Reset form
      setSelectedDataSource('');
      setDatabaseUrl('');
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: "Error",
        description: "Failed to add database connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dataSourceOptions = [
    {
      category: "Database Connections",
      options: [
        { id: "SQL", name: "PostgreSQL", icon: Database },
        { id: "MYSQL", name: "MySQL", icon: Database },
        { id: "MONGO", name: "MongoDB", icon: Database },
      ]
    },
    {
      category: "Cloud Services",
      options: [
        { id: "REDSHIFT", name: "Amazon Redshift", icon: Cloud },
        { id: "BIGQUERY", name: "Google BigQuery", icon: Cloud },
        { id: "SNOWFLAKE", name: "Snowflake", icon: Cloud },
      ]
    },
    {
      category: "Import Options",
      options: [
        { id: "IMPORT_FILE", name: "Import from File", icon: FileText },
        { id: "IMPORT_URL", name: "Import from URL", icon: Link },
        { id: "IMPORT_CLIPBOARD", name: "Import from Clipboard", icon: Clipboard },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Source Selection */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Data Source Options</CardTitle>
                <CardDescription>
                  Choose a data source to connect to your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {dataSourceOptions.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {category.category}
                    </Label>
                    <div className="space-y-2">
                      {category.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleDataSourceSelect(option.id)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                            selectedDataSource === option.id
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <option.icon size={20} />
                          <span className="text-sm font-medium">{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Connection Configuration */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Connection Configuration</CardTitle>
                <CardDescription>
                  {selectedDataSource 
                    ? `Configure your ${selectedDataSource} connection` 
                    : 'Select a data source to configure the connection'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedDataSource ? (
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Selected: <span className="font-medium">{selectedDataSource}</span>
                      </p>
                    </div>

                    {selectedDataSource === 'SQL' && (
                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-base font-medium">
                          Database URL
                        </Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="postgresql://username:password@host:port/database"
                          value={databaseUrl}
                          onChange={(e) => setDatabaseUrl(e.target.value)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Enter your PostgreSQL connection string
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={handleAddConnection}
                      disabled={isLoading || (selectedDataSource === 'SQL' && !databaseUrl)}
                      className="w-full"
                    >
                      {isLoading ? 'Adding Connection...' : 'Add Connection'}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a data source to begin configuration</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
