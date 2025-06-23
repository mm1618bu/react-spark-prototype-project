import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendQuery, QueryResponse } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'system';
  content: string;
  format?: 'markdown' | 'text';
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (initialQuery) {
      setMessages([{ role: 'user', content: initialQuery }]);
      
      // Send the initial query to the backend
      handleQueryBackend(initialQuery);
    }
  }, [initialQuery]);

  const handleQueryBackend = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await sendQuery(query, 'chat-page');
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: response.response || "I'm sorry, I couldn't process that request.",
          format: response.format || 'markdown'
        }
      ]);
    } catch (error) {
      console.error('Error querying the backend:', error);
      
      toast({
        title: "Backend Error",
        description: "Failed to get a response from the backend. Using simulated response instead.",
        variant: "destructive"
      });
      
      // Fallback to simulated response if backend call fails
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `Here's some information about "${query}". This is a simulated response as this is a prototype or the backend is unavailable.`,
          format: 'markdown'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userQuery = input.trim();
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    
    // Process with backend
    await handleQueryBackend(userQuery);
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
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-sage-100 ml-12' 
                    : 'bg-white border shadow-sm mr-12'
                }`}
              >
                {message.role === 'system' && message.format === 'markdown' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border shadow-sm p-4 rounded-lg mr-12">
                <p className="text-gray-500">Thinking...</p>
              </div>
            )}
          </div>
        </main>
        
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-sage-500 hover:bg-sage-600"
              disabled={isLoading}
            >
              <SendIcon size={18} />
            </Button>
          </form>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default ChatPage;
