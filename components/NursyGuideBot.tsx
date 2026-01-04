
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, MessageSquare, Minimize2, Sparkles, ChevronDown
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
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-[100] h-12 px-4 bg-[#F38020] text-white rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/30 hover:bg-[#c7620e] hover:scale-105 transition-all animate-bounce-subtle"
        >
          <MessageSquare size={20} />
          <span className="text-sm font-bold hidden sm:inline">AI Help</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 lg:inset-auto lg:bottom-6 lg:right-6 z-[2000] lg:z-[100] w-full lg:w-[380px] h-full lg:h-[550px] flex flex-col bg-white dark:bg-[#1E1E1E] border-0 lg:border border-[#E5E5E5] dark:border-[#333] rounded-none lg:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-[#E5E5E5] dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525] flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                   <Sparkles size={16} fill="currentColor" />
                </div>
                <div>
                   <span className="font-bold text-sm text-main block leading-tight">Nursy Assistant</span>
                   <span className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                   </span>
                </div>
             </div>
             <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-gray-100 dark:bg-[#333] rounded-full text-muted hover:text-main transition-colors"
             >
                <ChevronDown size={20} />
             </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1E1E1E] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#333]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-[#F38020] text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-[#2C2C2C] text-main rounded-bl-none border border-gray-100 dark:border-[#333]'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-gray-100 dark:bg-[#2C2C2C] px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center border border-gray-100 dark:border-[#333]">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#1E1E1E] flex gap-2 items-end">
              <div className="flex-1 bg-gray-100 dark:bg-[#2C2C2C] rounded-2xl px-4 py-2 border border-transparent focus-within:border-[#F38020] focus-within:ring-1 focus-within:ring-[#F38020]/20 transition-all">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="Type a message..."
                   className="w-full bg-transparent outline-none text-main placeholder:text-gray-400 text-sm py-1"
                 />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()} 
                className="w-10 h-10 bg-[#F38020] text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all"
              >
                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
              </button>
          </form>
        </div>
      )}
    </>
  );
};
