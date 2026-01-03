
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { ChatMessage, ChatAttachment } from '../types';
import { 
  Send, Users, MessageSquare, Sparkles, Zap, 
  ShieldCheck, MoreVertical, Hash, Info, User,
  FileText, Mic, Download, Play, Pause, Paperclip,
  Brain, HelpCircle, X, ChevronRight, BookOpen
} from 'lucide-react';

const SUBJECT_CHANNELS = [
  { id: 'general', name: 'المجلس العام', icon: <Users size={18}/> },
  { id: 'anatomy', name: 'تشريح (Anatomy)', icon: <Brain size={18}/> },
  { id: 'physiology', name: 'فسيولوجي (Physiology)', icon: <Zap size={18}/> },
  { id: 'adult_health', name: 'تمريض بالغين', icon: <BookOpen size={18}/> },
  { id: 'exams', name: 'مناقشة الامتحانات', icon: <HelpCircle size={18}/> }
];

export const Community: React.FC = () => {
  const { user, courses } = useApp();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("community_channels")
      .doc(activeChannel)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .limitToLast(50)
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(msgs);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      });
    return () => unsubscribe();
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !user || isSending) return;

    setIsSending(true);
    try {
      await db.collection("community_channels")
        .doc(activeChannel)
        .collection("messages")
        .add({
          userId: user.id,
          userName: user.name,
          text: newMessage.trim(),
          timestamp: new Date().toISOString(),
          isPro: user.subscriptionTier === 'pro',
          userRole: user.role || 'student',
          attachment: attachment || null
        });
      setNewMessage('');
      setAttachment(null);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload - In real app, upload to Firebase Storage
    const isPdf = file.type === 'application/pdf';
    const isAudio = file.type.startsWith('audio/');

    if (isPdf || isAudio) {
      setAttachment({
        type: isPdf ? 'pdf' : 'audio',
        name: file.name,
        url: URL.createObjectURL(file), // Mock URL
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    } else {
      alert('يرجى اختيار ملف PDF أو ملف صوتي فقط.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-main py-6 px-4 md:px-6 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
        
        {/* Sidebar: Channels */}
        <div className="lg:col-span-3 space-y-4 hidden lg:flex flex-col h-full overflow-hidden">
          <div className="ns-card flex-1 p-6 bg-brand-card/40 border-white/5 flex flex-col overflow-hidden">
            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <Hash className="text-brand-gold" /> غرف المذاكرة
            </h3>
            <div className="space-y-2 overflow-y-auto no-scrollbar">
              {SUBJECT_CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${
                    activeChannel === ch.id 
                    ? 'bg-brand-gold text-brand-main shadow-glow' 
                    : 'text-brand-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`${activeChannel === ch.id ? 'text-brand-main' : 'text-brand-gold'}`}>
                    {ch.icon}
                  </div>
                  <span className="text-sm">{ch.name}</span>
                  {activeChannel === ch.id && <ChevronRight size={14} className="mr-auto" />}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
               <div className="bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/10">
                  <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={12}/> نصيحة نيرسي
                  </p>
                  <p className="text-[10px] text-brand-muted font-bold leading-relaxed">
                    شارك مذكراتك الصوتية مع زملائك في الغرفة المخصصة للمادة.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-9 ns-card overflow-hidden flex flex-col bg-brand-card/40 border-white/5 shadow-2xl relative">
          
          {/* Chat Header */}
          <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center shrink-0 backdrop-blur-md z-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center shadow-inner">
                   {SUBJECT_CHANNELS.find(c => c.id === activeChannel)?.icon || <MessageSquare size={24}/>}
                </div>
                <div>
                   <h2 className="text-xl font-black text-white">
                      {SUBJECT_CHANNELS.find(c => c.id === activeChannel)?.name}
                   </h2>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="text-[9px] text-brand-muted font-black uppercase tracking-widest">مساحة دراسية آمنة</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="p-3 bg-white/5 text-brand-muted hover:text-white rounded-xl transition-all hidden md:flex">
                   <Info size={18} />
                </button>
             </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-brand-main/20"
          >
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                  <BookOpen size={80} className="mb-6" />
                  <p className="font-black text-xl">ابدأ بمشاركة معلومة أو ملف دراسي في هذه الغرفة..</p>
               </div>
            )}
            {messages.map((msg, i) => {
              const isOwnMessage = msg.userId === user?.id;
              const msgDate = new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={msg.id} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                  <div className={`flex items-start gap-4 max-w-[85%] md:max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-inner mt-1 ${
                      msg.userRole === 'admin' ? 'bg-red-500 text-white' : (msg.isPro ? 'bg-brand-gold text-brand-main' : 'bg-white/10 text-brand-muted')
                    }`}>
                      {(msg.userName || 'U').charAt(0)}
                    </div>
                    
                    <div className={`space-y-2 ${isOwnMessage ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-2 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[11px] font-black text-white">{msg.userName}</span>
                        {msg.isPro && <Zap size={10} className="text-brand-gold fill-brand-gold" />}
                        {msg.userRole === 'admin' && <ShieldCheck size={10} className="text-red-500" />}
                      </div>
                      
                      {/* Message Content */}
                      <div className={`p-5 rounded-[2rem] text-sm md:text-base font-medium shadow-xl relative group/msg ${
                        isOwnMessage 
                        ? 'bg-brand-gold text-brand-main rounded-tr-none' 
                        : 'bg-brand-card border border-white/5 text-brand-text rounded-tl-none'
                      }`}>
                        {msg.text && <p className="mb-3 leading-relaxed">{msg.text}</p>}

                        {/* Attachments Display */}
                        {msg.attachment && (
                          <div className={`p-4 rounded-2xl flex items-center gap-4 border ${
                            isOwnMessage ? 'bg-brand-main/20 border-brand-main/10' : 'bg-brand-main/50 border-white/5'
                          }`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              msg.attachment.type === 'pdf' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                            }`}>
                              {msg.attachment.type === 'pdf' ? <FileText size={24}/> : <Mic size={24}/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <p className="text-[11px] font-black truncate">{msg.attachment.name}</p>
                               <p className={`text-[9px] font-bold ${isOwnMessage ? 'text-brand-main/60' : 'text-brand-muted'}`}>
                                  {msg.attachment.size} • {msg.attachment.type.toUpperCase()}
                               </p>
                            </div>
                            <button className={`p-2 rounded-lg transition-all ${
                              isOwnMessage ? 'bg-brand-main/20 hover:bg-brand-main/40' : 'bg-white/5 hover:bg-white/10'
                            }`}>
                               <Download size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className={`text-[9px] font-bold text-brand-muted uppercase tracking-widest px-2 ${isOwnMessage ? 'text-left' : 'text-right'}`}>
                        {msgDate}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachment Preview Bar */}
          {attachment && (
            <div className="px-8 py-4 bg-brand-gold/10 border-t border-brand-gold/20 flex items-center justify-between animate-fade-in-up">
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${attachment.type === 'pdf' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {attachment.type === 'pdf' ? <FileText size={20}/> : <Mic size={20}/>}
                  </div>
                  <div>
                    <p className="text-white text-xs font-black truncate max-w-xs">{attachment.name}</p>
                    <p className="text-brand-gold text-[10px] font-bold">جاهز للرفع في {SUBJECT_CHANNELS.find(c => c.id === activeChannel)?.name}</p>
                  </div>
               </div>
               <button onClick={() => setAttachment(null)} className="p-2 text-brand-muted hover:text-white">
                 <X size={20} />
               </button>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="p-6 md:p-8 bg-brand-card border-t border-white/5 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.2)]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,audio/*"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 bg-white/5 text-brand-muted rounded-2xl flex items-center justify-center hover:bg-brand-gold hover:text-brand-main transition-all border border-white/5 shrink-0"
              >
                <Paperclip size={24} />
              </button>

              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب سؤالك أو شارك معلومة..."
                  className="w-full bg-brand-main border border-white/10 rounded-[2rem] pr-8 pl-10 py-5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all placeholder:text-brand-muted/30 shadow-inner"
                  disabled={isSending}
                />
              </div>

              <button 
                type="submit"
                disabled={(!newMessage.trim() && !attachment) || isSending}
                className="w-14 h-14 bg-brand-gold text-brand-main rounded-[1.8rem] flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shrink-0"
              >
                <Send size={24} className="rotate-180" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Channel Switcher (Floating Button) */}
      <div className="lg:hidden fixed bottom-24 right-6 z-50">
         <button className="w-16 h-16 bg-brand-gold text-brand-main rounded-2xl shadow-glow flex items-center justify-center">
            <Hash size={32} />
         </button>
      </div>
    </div>
  );
};
