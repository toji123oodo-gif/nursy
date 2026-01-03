
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useLocation, useNavigate } = ReactRouterDOM as any;
import { 
  X, ChevronLeft, Sparkles, Send, 
  Bot, Zap, Play, Loader2, MousePointer2,
  Mic, Volume2, Maximize2, Minimize2, Terminal,
  Compass, BookOpen, Wallet, User as UserIcon, MessageSquare
} from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { useApp } from '../context/AppContext';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isFunctionCall?: boolean;
}

export const NursyGuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Define Tools for Gemini
  const navigationTool: FunctionDeclaration = {
    name: 'navigate_to_page',
    description: 'تحويل المستخدم إلى صفحة معينة داخل المنصة بناءً على طلبه.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        page: {
          type: Type.STRING,
          description: 'اسم الصفحة المطلوبة: "home", "dashboard", "community", "wallet", "profile", "ai-vision"',
          enum: ["home", "dashboard", "community", "wallet", "profile", "ai-vision"]
        },
        reason: {
          type: Type.STRING,
          description: 'السبب الذي سيذكره البوت للمستخدم قبل التحويل'
        }
      },
      required: ['page']
    }
  };

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0 && user) {
      setMessages([{ 
        role: 'bot', 
        text: `يا أهلاً يا دكتور ${user.name.split(' ')[0]}! نورت نيرسي. أنا المساعد الذكي بتاعك، محتاج مساعدة في الوصول لمادة معينة ولا أشرحلك حاجة صعبة؟` 
      }]);
    }
    updateSuggestions();
  }, [location.pathname, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateSuggestions = () => {
    const path = location.pathname;
    if (path === '/') setSuggestions(['إزاي أشترك؟', 'أقوى كورس أناتومي', 'يعني إيه نيرسي؟']);
    else if (path === '/dashboard') setSuggestions(['شغل آخر محاضرة', 'عايز امتحان سريع', 'تحميل مذكرات']);
    else if (path === '/wallet') setSuggestions(['رقم فودافون كاش', 'تفعيل كود', 'الدعم الفني']);
    else setSuggestions(['ساعدني أذاكر', 'جولة سريعة', 'نكتة تمريضية']);
  };

  const handleAction = (page: string) => {
    const routes: Record<string, string> = {
      'home': '/',
      'dashboard': '/dashboard',
      'community': '/community',
      'wallet': '/wallet',
      'profile': '/profile',
      'ai-vision': '/ai-vision'
    };
    if (routes[page]) navigate(routes[page]);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: textToSend,
        config: {
          systemInstruction: `أنت "نيرسي بوت" خبير تمريض ومساعد تقني ذكي.
          - لقبك هو "المساعد الذكي".
          - تحدث بلهجة مصرية مثقفة وودودة جداً.
          - استخدم Function Calling للتحويل بين الصفحات إذا طلب المستخدم ذلك.
          - شجع الطالب دائماً بكلمات مثل "يا بطل"، "يا دكتور"، "يا دكتورة".
          - لو سألك عن مواد، رشحله "أناتومي" أو "فسيولوجي".
          - المنصة مجانية وتهدف لخدمة التمريض في مصر.`,
          tools: [{ functionDeclarations: [navigationTool] }]
        }
      });

      // Handle Function Calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'navigate_to_page') {
            const { page, reason } = call.args as any;
            setMessages(prev => [...prev, { 
              role: 'bot', 
              text: reason || `حاضر يا دكتور، هحولك لصفحة الـ ${page} حالاً...` 
            }]);
            setTimeout(() => handleAction(page), 1500);
          }
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: response.text || "معلش يا دكتور، مسمعتكش كويس، ممكن تعيد؟" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "يا دكتور، يبدو إن فيه ضغط عالي على السيرفر، جرب كمان شوية." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-[2000] group perspective-1000"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-card border-2 border-brand-gold rounded-[2rem] flex items-center justify-center shadow-glow animate-float relative overflow-hidden group-hover:rotate-12 transition-all">
             <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Bot className="text-brand-gold" size={32} />
             <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-brand-card animate-pulse"></div>
          </div>
          <div className="absolute -top-12 right-0 bg-white text-brand-main px-4 py-1.5 rounded-xl font-black text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl -translate-y-2 group-hover:translate-y-0">
             محتاج مساعدة يا دكتور؟ ✨
          </div>
        </button>
      )}

      {/* Modern AI Chat Interface */}
      {isOpen && (
        <div className={`fixed right-8 z-[2000] bg-brand-card border border-white/10 rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col backdrop-blur-3xl transition-all duration-500 ease-out animate-scale-up ${
          isMinimized 
          ? 'bottom-8 w-72 h-20' 
          : 'bottom-8 w-[95%] md:w-[450px] h-[700px] max-h-[85vh]'
        }`}>
          
          {/* AI Visual Header */}
          <div className="p-6 bg-gradient-to-r from-brand-card to-brand-main border-b border-white/5 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-main shadow-glow">
                      <Sparkles size={24} fill="currentColor" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-brand-card"></div>
                </div>
                {!isMinimized && (
                  <div>
                    <h3 className="text-white font-black text-sm tracking-tight">نيرسي - المساعد الذكي</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                       <span className="text-[9px] text-brand-muted font-black uppercase tracking-widest">Active & Online</span>
                    </div>
                  </div>
                )}
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="p-2 text-brand-muted hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-brand-muted hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-brand-main/30">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                      <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                         <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-black ${
                           m.role === 'user' ? 'bg-white/10 text-white' : 'bg-brand-gold text-brand-main'
                         }`}>
                           {m.role === 'user' ? (user?.name?.charAt(0) || 'U') : <Bot size={16} />}
                         </div>
                         <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-xl ${
                           m.role === 'user' 
                           ? 'bg-brand-gold text-brand-main rounded-tr-none' 
                           : 'bg-brand-card border border-white/5 text-brand-text rounded-tl-none'
                         }`}>
                           {m.text}
                         </div>
                      </div>
                   </div>
                 ))}
                 {isLoading && (
                   <div className="flex justify-start animate-pulse">
                      <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                         <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                         </div>
                         <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">نيرسي بيفكر...</span>
                      </div>
                   </div>
                 )}
                 <div ref={chatEndRef} />
              </div>

              {/* Suggestions Chips */}
              <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-white/2 border-t border-white/5">
                 {suggestions.map((s, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleSendMessage(undefined, s)}
                     className="px-4 py-2 bg-brand-main border border-white/10 rounded-xl text-[10px] font-black text-brand-muted whitespace-nowrap hover:border-brand-gold hover:text-white transition-all flex items-center gap-2"
                   >
                     <Zap size={10} className="text-brand-gold" /> {s}
                   </button>
                 ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-6 bg-brand-card border-t border-white/5 shrink-0">
                 <div className="relative flex items-center gap-3">
                    <div className="flex-1 relative group">
                       <input 
                         type="text" 
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         placeholder="اسألني عن أي حاجة يا دكتور..."
                         className="w-full bg-brand-main/80 border border-white/10 rounded-2xl pr-6 pl-12 py-5 text-xs text-white outline-none focus:border-brand-gold transition-all"
                         disabled={isLoading}
                       />
                       <button 
                         type="button" 
                         className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors"
                       >
                         <Mic size={18} />
                       </button>
                    </div>
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="w-14 h-14 bg-brand-gold text-brand-main rounded-2xl flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Send size={24} className="rotate-180" />
                    </button>
                 </div>
                 <div className="mt-4 flex justify-center items-center gap-4 text-brand-muted opacity-30">
                    <div className="flex gap-1">
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Powered by Gemini 3</span>
                    <div className="flex gap-1">
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                       <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                 </div>
              </form>
            </>
          )}

          {isMinimized && (
            <div className="h-full flex items-center justify-between px-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center">
                     <Volume2 size={16} className="animate-pulse" />
                  </div>
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">المساعد الذكي يعمل بالخلفية</span>
               </div>
               <button onClick={() => setIsMinimized(false)} className="text-brand-gold text-[10px] font-black underline">توسيع</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
