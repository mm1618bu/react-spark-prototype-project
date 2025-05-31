
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [connectionUrl, setConnectionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDatabase || !connectionUrl) {
      toast({
        title: "Validation Error",
        description: "Please select a database type and enter a connection URL.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/addConnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseType: selectedDatabase,
          connectionUrl: connectionUrl
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Database connection added successfully.",
        });
        setSelectedDatabase('');
        setConnectionUrl('');
      } else {
        throw new Error('Failed to add connection');
      }
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: "Error",
        description: "Failed to add database connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Database Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Database Type</Label>
                <RadioGroup value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SQL" id="sql" />
                    <Label htmlFor="sql">SQL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MONGO" id="mongo" />
                    <Label htmlFor="mongo">MONGO</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IMPORT_FILE" id="import-file" />
                    <Label htmlFor="import-file">IMPORT FILE</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="connection-url" className="text-base font-medium">
                  Connection URL
                </Label>
                <Input
                  id="connection-url"
                  type="url"
                  value={connectionUrl}
                  onChange={(e) => setConnectionUrl(e.target.value)}
                  placeholder="Enter your database connection URL"
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Connection...' : 'Add Connection'}
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
