
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Array<{role: 'user' | 'system', content: string}>>([]);

  useEffect(() => {
    if (initialQuery) {
      setMessages([
        { role: 'user', content: initialQuery },
        { role: 'system', content: 'I can help you find information about that. What specifically would you like to know?' }
      ]);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `Here's some information about "${input}". This is a simulated response as this is a prototype.` 
        }
      ]);
    }, 1000);
    
    setInput('');
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
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        </main>
        
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button type="submit" className="bg-sage-500 hover:bg-sage-600">
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
