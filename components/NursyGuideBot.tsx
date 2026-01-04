
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, MessageSquare, Minimize2, Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../context/AppContext';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const NursyGuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useApp();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && user) {
      setMessages([{ 
        role: 'bot', 
        text: `Hi ${user.name.split(' ')[0]}. How can I help you today?` 
      }]);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: userMsg,
        config: {
          systemInstruction: `You are a helpful support agent for Nursy, a nursing education platform. Keep answers concise, professional, and helpful.`
        }
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm having trouble connecting. Please try again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] h-12 px-4 bg-[#F38020] text-white rounded-full flex items-center gap-2 shadow-lg hover:bg-[#c7620e] transition-all"
        >
          <MessageSquare size={18} />
          <span className="text-sm font-semibold">Support</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[100] w-[350px] h-[500px] flex flex-col bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333] rounded-[8px] shadow-2xl overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-[#E5E5E5] dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525] flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-bold text-sm text-main">Nursy Assistant</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-muted hover:text-main"><X size={16}/></button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1E1E1E]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-[6px] text-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-[#F38020] text-white' 
                    : 'bg-gray-100 dark:bg-[#2C2C2C] text-main'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-gray-100 dark:bg-[#2C2C2C] px-3 py-2 rounded-[6px] flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#1E1E1E] flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm bg-transparent outline-none text-main placeholder:text-gray-400"
              />
              <button type="submit" disabled={isLoading || !inputValue.trim()} className="text-[#F38020] disabled:opacity-50">
                <Send size={18} />
              </button>
          </form>
        </div>
      )}
    </>
  );
};
