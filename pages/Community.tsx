
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { 
  Send, Users, MessageSquare, Sparkles, Zap, 
  Hash, FileText, Mic, Download, Brain, 
  HelpCircle, X, Plus, Search, Heart, 
  Share2, MessageCircle, MoreHorizontal, Image as ImageIcon,
  Volume2, Globe, Command, Award, Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  isPro: boolean;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  attachments: {
    type: 'pdf' | 'audio' | 'image';
    url: string;
    name: string;
    size?: string;
  }[];
}

const SUBJECT_CHANNELS = [
  { id: 'general', name: 'المجلس العام', icon: <Globe size={18}/> },
  { id: 'anatomy', name: 'تشريح (Anatomy)', icon: <Brain size={18}/> },
  { id: 'physiology', name: 'فسيولوجي (Physiology)', icon: <Zap size={18}/> },
  { id: 'exams', name: 'بنك الأسئلة', icon: <HelpCircle size={18}/> }
];

export const Community: React.FC = () => {
  const { user } = useApp();
  const [activeChannel, setActiveChannel] = useState('general');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync Posts from Firebase
  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("social_posts")
      .where("channelId", "==", activeChannel)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(fetchedPosts);
      });
    return () => unsubscribe();
  }, [activeChannel]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && attachedFiles.length === 0) return;
    setIsPosting(true);

    const postData = {
      userId: user?.id,
      userName: user?.name,
      userRole: user?.role || 'student',
      isPro: user?.subscriptionTier === 'pro',
      content: newPostContent,
      channelId: activeChannel,
      timestamp: new Date().toISOString(),
      likes: 0,
      commentsCount: 0,
      attachments: attachedFiles // In real app, upload files to storage first
    };

    try {
      await db.collection("social_posts").add(postData);
      setNewPostContent('');
      setAttachedFiles([]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string, currentLikes: number) => {
    // Basic like toggle logic
    await db.collection("social_posts").doc(postId).update({
      likes: currentLikes + 1
    });
  };

  return (
    <div className="min-h-screen bg-brand-main relative overflow-hidden flex flex-col md:flex-row p-4 md:p-8 gap-8">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none"></div>

      {/* Sidebar - Subjects Navigation */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-6">
        <div className="ns-card bg-brand-card/40 backdrop-blur-3xl border-white/5 p-6 space-y-8">
           <h3 className="text-white font-black text-xl flex items-center gap-3">
             <Command size={20} className="text-brand-gold" /> المجتمعات
           </h3>
           <div className="space-y-2">
             {SUBJECT_CHANNELS.map(ch => (
               <button
                 key={ch.id}
                 onClick={() => setActiveChannel(ch.id)}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 ${
                   activeChannel === ch.id 
                   ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-glow' 
                   : 'bg-white/2 border-transparent hover:bg-white/5 text-brand-muted'
                 }`}
               >
                 {ch.icon}
                 <span className="text-sm font-black">{ch.name}</span>
               </button>
             ))}
           </div>
        </div>

        <div className="ns-card bg-brand-gold/5 border-brand-gold/10 p-6 space-y-4">
           <div className="flex items-center gap-3 text-brand-gold">
              <Award size={20} />
              <span className="text-xs font-black uppercase">أفضل المساهمين</span>
           </div>
           <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white">S</div>
                      <span className="text-[10px] text-white font-bold">د. سارة محمود</span>
                   </div>
                   <span className="text-[9px] text-brand-gold font-black">1.2k XP</span>
                </div>
              ))}
           </div>
        </div>
      </aside>

      {/* Main Content - Social Feed */}
      <main className="flex-1 max-w-3xl mx-auto w-full space-y-8 no-scrollbar pb-24">
        
        {/* Create Post Card */}
        <div className="ns-card bg-brand-card/60 backdrop-blur-3xl border-white/10 p-6 md:p-8 space-y-6 shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-main flex items-center justify-center font-black shadow-glow shrink-0">
                 {user?.name?.charAt(0) || 'U'}
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-3.5 text-right text-brand-muted hover:bg-white/10 transition-all text-sm font-medium"
              >
                عامل تلخيص النهاردة يا دكتور {user?.name?.split(' ')[0]}؟ شاركه مع زمايلك...
              </button>
           </div>
           <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-all text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-brand-gold/5">
                 <ImageIcon size={16} className="text-blue-400" /> إضافة صور
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-all text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-brand-gold/5">
                 <FileText size={16} className="text-red-400" /> ملفات PDF
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-all text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-brand-gold/5">
                 <Mic size={16} className="text-orange-400" /> تسجيل صوتي
              </button>
           </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-8">
           {posts.length > 0 ? posts.map((post) => (
             <article key={post.id} className="ns-card bg-brand-card/30 backdrop-blur-3xl border-white/5 p-6 md:p-8 space-y-6 shadow-xl hover:border-brand-gold/20 transition-all group animate-fade-in-up">
                
                {/* Post Header */}
                <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 ${post.isPro ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow' : 'bg-brand-main text-brand-muted border-white/5'}`}>
                         {post.userName.charAt(0)}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="text-white font-black text-sm">{post.userName}</h4>
                            {post.isPro && <Zap size={12} className="text-brand-gold fill-brand-gold" />}
                         </div>
                         <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest opacity-60">
                            {new Date(post.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })} • {post.userRole}
                         </p>
                      </div>
                   </div>
                   <button className="p-2 text-brand-muted hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                   </button>
                </div>

                {/* Post Content */}
                <div className="space-y-6">
                   <p className="text-brand-text/90 text-base md:text-lg leading-relaxed font-bold whitespace-pre-wrap">
                      {post.content}
                   </p>

                   {/* Post Attachments Grid */}
                   {post.attachments && post.attachments.length > 0 && (
                     <div className="grid grid-cols-1 gap-4">
                        {post.attachments.map((file, idx) => (
                          <div key={idx} className="bg-brand-main/50 border border-white/5 rounded-3xl p-5 flex items-center gap-5 group/file hover:border-brand-gold/30 transition-all">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                               file.type === 'pdf' ? 'bg-red-500/10 text-red-500' : (file.type === 'audio' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500')
                             }`}>
                                {file.type === 'pdf' ? <FileText size={28} /> : (file.type === 'audio' ? <Volume2 size={28} /> : <ImageIcon size={28} />)}
                             </div>
                             <div className="flex-1 overflow-hidden">
                                <p className="text-white text-xs font-black truncate">{file.name}</p>
                                <p className="text-[9px] text-brand-muted font-black uppercase tracking-widest mt-1">{file.size || 'Unknown size'} • {file.type}</p>
                             </div>
                             <button className="p-3 bg-white/5 rounded-xl text-brand-gold hover:bg-brand-gold hover:text-brand-main transition-all">
                                <Download size={20} />
                             </button>
                          </div>
                        ))}
                     </div>
                   )}
                </div>

                {/* Post Footer - Interactions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => toggleLike(post.id, post.likes)}
                        className="flex items-center gap-2 group/like"
                      >
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-muted group-hover/like:bg-red-500/10 group-hover/like:text-red-500 transition-all">
                            <Heart size={18} className={post.likes > 0 ? 'fill-red-500 text-red-500' : ''} />
                         </div>
                         <span className="text-xs font-black text-brand-muted group-hover/like:text-white transition-colors">{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-2 group/comm">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-muted group-hover/comm:bg-brand-gold/10 group-hover/comm:text-brand-gold transition-all">
                            <MessageCircle size={18} />
                         </div>
                         <span className="text-xs font-black text-brand-muted group-hover/comm:text-white transition-colors">{post.commentsCount}</span>
                      </button>
                   </div>

                   <button className="flex items-center gap-2 group/share px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
                      <Share2 size={16} className="text-brand-muted group-hover/share:text-brand-gold transition-colors" />
                      <span className="text-[10px] font-black text-brand-muted group-hover/share:text-white uppercase tracking-widest">مشاركة</span>
                   </button>
                </div>
             </article>
           )) : (
             <div className="py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-brand-card/50 rounded-full flex items-center justify-center mx-auto text-brand-muted/20">
                   <MessageSquare size={48} />
                </div>
                <h3 className="text-brand-muted font-black text-xl">مفيش منشورات هنا لسه..</h3>
                <p className="text-brand-muted/50 text-xs">كن أول من ينشر تلخيص أو معلومة طبية لزمايلك!</p>
             </div>
           )}
        </div>
      </main>

      {/* Right Sidebar - Info & Stats */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 gap-6">
         <div className="ns-card bg-brand-card/40 backdrop-blur-3xl border-white/5 p-6">
            <h4 className="text-white font-black text-sm mb-6 flex items-center gap-2">
               <Sparkles className="text-brand-gold" size={16} /> تلميح نيرسي الذكي
            </h4>
            <div className="bg-brand-gold/5 border border-brand-gold/10 p-4 rounded-2xl">
               <p className="text-[11px] text-brand-muted font-bold leading-relaxed">
                  مشاركة التلخيصات بتساعدك تثبت المعلومة في دماغك بنسبة 70% أكتر.. جرب تعمل تلخيص النهاردة!
               </p>
            </div>
         </div>

         <div className="ns-card bg-brand-card/40 backdrop-blur-3xl border-white/5 p-6">
            <h4 className="text-white font-black text-sm mb-6">قوانين المجتمع</h4>
            <ul className="space-y-4">
               {[
                  'الاحترام المتبادل بين الفرسان.',
                  'مشاركة المحتوى الأكاديمي الموثوق.',
                  'ممنوع الإعلانات أو المحتوى الخارجي.'
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-3 text-[10px] text-brand-muted font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1 shrink-0"></span>
                    {rule}
                 </li>
               ))}
            </ul>
         </div>
      </aside>

      {/* Floating Create Post Modal (Mobile & Desktop) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-2xl" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Plus className="text-brand-gold" /> إنشاء منشور جديد
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-brand-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>

             <form onSubmit={handleCreatePost} className="p-8 space-y-8">
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="اكتب التلخيص أو السؤال اللي عايز تشاركه..."
                  className="w-full h-48 bg-transparent text-white text-lg font-bold outline-none resize-none placeholder:text-brand-muted/20"
                  autoFocus
                ></textarea>

                {/* Selected Files Preview */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     {attachedFiles.map((f, i) => (
                       <div key={i} className="bg-brand-gold/10 border border-brand-gold/20 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] text-brand-gold font-black">
                          <FileText size={12} /> {f.name}
                          <button onClick={() => setAttachedFiles(f => f.filter((_, idx) => idx !== i))}><X size={10}/></button>
                       </div>
                     ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex gap-4">
                      <button type="button" className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold rounded-xl transition-all"><ImageIcon size={20}/></button>
                      <button type="button" className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold rounded-xl transition-all"><FileText size={20}/></button>
                      <button type="button" className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold rounded-xl transition-all"><Mic size={20}/></button>
                   </div>
                   <button 
                    type="submit"
                    disabled={isPosting || (!newPostContent.trim() && attachedFiles.length === 0)}
                    className="bg-brand-gold text-brand-main px-10 py-4 rounded-2xl font-black text-sm shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                   >
                     {isPosting ? 'جاري النشر...' : 'نشر الآن'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
