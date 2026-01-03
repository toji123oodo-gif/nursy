
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { ChatMessage } from '../types';
import { 
  Send, Users, MessageSquare, Sparkles, Zap, 
  ShieldCheck, MoreVertical, Hash, Info, User
} from 'lucide-react';

export const Community: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("public_chat")
      .orderBy("timestamp", "asc")
      .limitToLast(50)
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(msgs);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    setIsSending(true);
    try {
      await db.collection("public_chat").add({
        userId: user.id,
        userName: user.name,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isPro: user.subscriptionTier === 'pro',
        userRole: user.role || 'student'
      });
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-main py-10 px-4 md:px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 h-[80vh] md:h-[85vh]">
        
        {/* Sidebar Info - Hidden on mobile */}
        <div className="lg:col-span-3 space-y-6 hidden lg:flex flex-col">
          <div className="ns-card p-8 bg-brand-card/40 border-white/5 space-y-6">
            <h3 className="text-white font-black text-xl flex items-center gap-3">
              <Users className="text-brand-gold" /> المتواجدون
            </h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-brand-muted text-xs font-bold">124 طالب يذاكر الآن</span>
               </div>
               <p className="text-brand-muted text-[11px] leading-relaxed">
                 هذا الشات مخصص لتبادل المعلومات الدراسية فقط. يرجى الالتزام بآداب الحوار.
               </p>
            </div>
          </div>

          <div className="ns-card p-6 bg-brand-gold/5 border-brand-gold/10">
             <div className="flex items-center gap-3 mb-4 text-brand-gold">
               <Sparkles size={20} />
               <span className="text-xs font-black uppercase">قواعد المجتمع</span>
             </div>
             <ul className="space-y-3 text-[10px] text-brand-muted font-bold">
               <li className="flex items-center gap-2">✔ يمنع تبادل الروابط الخارجية</li>
               <li className="flex items-center gap-2">✔ يمنع الإعلانات لأي سناتر</li>
               <li className="flex items-center gap-2">✔ ساعد زملائك في فهم الدروس</li>
             </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-9 ns-card overflow-hidden flex flex-col bg-brand-card/40 border-white/5 shadow-2xl relative">
          
          {/* Chat Header */}
          <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center">
                   <MessageSquare size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white">المجلس العام لفرسان نيرسي</h2>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">Public Chat Room</span>
                     <span className="w-1 h-1 rounded-full bg-brand-muted"></span>
                     <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">تحديث لحظي</span>
                   </div>
                </div>
             </div>
             <button className="text-brand-muted hover:text-white p-2">
                <MoreVertical size={20} />
             </button>
          </div>

          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar bg-brand-main/20"
          >
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                  <MessageSquare size={80} className="mb-6" />
                  <p className="font-black text-xl">ابدأ المحادثة الآن..</p>
               </div>
            )}
            {messages.map((msg, i) => {
              const isOwnMessage = msg.userId === user?.id;
              const msgDate = new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={msg.id} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                  <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-inner ${
                      msg.userRole === 'admin' ? 'bg-red-500 text-white' : (msg.isPro ? 'bg-brand-gold text-brand-main' : 'bg-white/10 text-brand-muted')
                    }`}>
                      {(msg.userName || 'U').charAt(0)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] font-black text-white">{msg.userName}</span>
                        {msg.isPro && <Zap size={10} className="text-brand-gold fill-brand-gold" />}
                        {msg.userRole === 'admin' && <ShieldCheck size={10} className="text-red-500" />}
                      </div>
                      
                      <div className={`p-4 md:p-5 rounded-[1.8rem] text-sm md:text-base font-medium shadow-xl ${
                        isOwnMessage 
                        ? 'bg-brand-gold text-brand-main rounded-tr-none' 
                        : 'bg-brand-card border border-white/5 text-brand-text rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[8px] font-bold text-brand-muted uppercase tracking-widest px-1 ${isOwnMessage ? 'text-left' : 'text-right'}`}>
                        {msgDate}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 shrink-0">
            <form onSubmit={handleSendMessage} className="relative group">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك لزملائك..."
                className="w-full bg-brand-main border border-white/10 rounded-[2rem] pr-8 pl-20 py-5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all placeholder:text-brand-muted/30"
                disabled={isSending}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-brand-gold text-brand-main rounded-full flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={24} className="rotate-180" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
