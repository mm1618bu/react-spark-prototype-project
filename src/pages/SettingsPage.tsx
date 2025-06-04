
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddConnection = async () => {
    if (!selectedDatabase || !databaseUrl) {
      toast({
        title: "Error",
        description: "Please select a database type and enter a URL",
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
          databaseType: selectedDatabase,
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
      setSelectedDatabase('');
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>
              Configure your database connection by selecting a type and providing the connection URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Database Type</Label>
              <RadioGroup value={selectedDatabase} onValueChange={setSelectedDatabase}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SQL" id="sql" />
                  <Label htmlFor="sql">SQL Database</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MONGO" id="mongo" />
                  <Label htmlFor="mongo">MongoDB</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="IMPORT_FILE" id="import" />
                  <Label htmlFor="import">Import File</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-base font-medium">
                Database URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="Enter your database connection URL"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleAddConnection}
              disabled={isLoading || !selectedDatabase || !databaseUrl}
              className="w-full"
            >
              {isLoading ? 'Adding Connection...' : 'Add Connection'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
