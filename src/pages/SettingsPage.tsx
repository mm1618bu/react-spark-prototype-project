
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDatabaseConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDatabase || !databaseUrl) {
      toast({
        title: "Error",
        description: "Please select a database type and enter a URL.",
        variant: "destructive"
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
          type: selectedDatabase,
          url: databaseUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Database connection response:', data);
      
      toast({
        title: "Success",
        description: "Database connection added successfully!",
      });
      
      // Reset form
      setSelectedDatabase('');
      setDatabaseUrl('');
    } catch (error) {
      console.error('Error adding database connection:', error);
      toast({
        title: "Error",
        description: "Failed to add database connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} />
            </Button>
            <Logo />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2">Database Connection</h1>
              <p className="text-gray-600">Connect to your database</p>
            </div>

            <form onSubmit={handleDatabaseConnection} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="database-type" className="text-sm font-medium">Database Type</Label>
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SQL">SQL</SelectItem>
                    <SelectItem value="MONGO">MongoDB</SelectItem>
                    <SelectItem value="IMPORT_FILE">Import File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database-url" className="text-sm font-medium">Database URL</Label>
                <Input
                  id="database-url"
                  type="url"
                  placeholder="Enter your database connection URL"
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={isLoading || !selectedDatabase || !databaseUrl}
              >
                {isLoading ? 'Connecting...' : 'Add Connection'}
              </Button>
            </form>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;
