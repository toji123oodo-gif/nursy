
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Phone, Edit2, LogOut, CheckCircle, Save, X, 
  Clock, Mail, Award, BookOpen, Zap, ShieldCheck, Monitor, 
  Smartphone, UserCheck, Star, Sparkles, ChevronLeft, Loader2, AlertCircle, HelpCircle,
  ArrowRight, TrendingUp, Medal, Flame, CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressRing = ({ progress, size = 120 }: { progress: number, size?: number }) => {
  const stroke = 8;
  const radius = (size / 2) - (stroke * 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 transition-all duration-1000" width={size} height={size}>
        <circle className="text-white/5" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle className="text-brand-gold transition-all duration-1000 ease-out" strokeWidth={stroke} strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} filter="url(#glow-profile)" />
        <defs>
          <filter id="glow-profile"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{progress}%</span>
        <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest mt-1">إنجازك</span>
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, phone: user.phone });
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setIsSaving(true);
    try { 
      await updateUserData(formData); 
      setIsEditing(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } 
    catch (error) { 
      console.error("Failed to update profile", error); 
    } 
    finally { 
      setIsSaving(false); 
    }
  };

  const completedCount = user.completedLessons?.length || 0;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const activityData = [45, 80, 55, 95, 70, 90, 100]; // Mock activity data

  return (
    <div className="min-h-screen bg-brand-main pb-32 pt-12">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        {/* Success Notification */}
        {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-brand-main px-8 py-4 rounded-2xl font-black text-sm shadow-glow flex items-center gap-3 animate-fade-in-up">
            <CheckCircle size={20} /> تم تحديث بياناتك بنجاح!
          </div>
        )}

        {/* Header Section: User Identity & Tier */}
        <div className="relative bg-brand-card/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 md:p-16 shadow-2xl overflow-hidden animate-scale-up">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-pulse"></div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              {/* Profile Picture Placeholder */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-tr from-brand-gold via-yellow-400 to-brand-gold p-1.5 shadow-glow group-hover:scale-105 transition-transform duration-700">
                    <div className="w-full h-full bg-brand-card rounded-[3.2rem] flex items-center justify-center text-brand-gold font-black text-6xl md:text-8xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-brand-main border-4 border-brand-card w-14 h-14 rounded-2xl flex items-center justify-center text-brand-gold shadow-xl">
                  <Award size={28} />
                </div>
              </div>

              {/* Identity Info */}
              <div className="flex-1 text-center lg:text-right space-y-8">
                <div>
                  <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{user.name}</h1>
                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${user.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/30'}`}>
                      {user.subscriptionTier === 'pro' ? <Zap size={14} fill="currentColor" /> : <Star size={14} />}
                      {user.subscriptionTier === 'pro' ? 'Premium (PRO)' : 'Free Tier'}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-2xl text-brand-muted text-xs font-bold border border-white/5">
                      <Mail size={16} className="text-brand-gold" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-2xl text-brand-muted text-xs font-bold border border-white/5">
                      <Smartphone size={16} className="text-brand-gold" /> {user.phone || 'لم يتم الربط'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className={`px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${isEditing ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-gold text-brand-main shadow-glow hover:scale-105'}`}
                  >
                    {isEditing ? <><X size={20}/> إلغاء التعديل</> : <><Edit2 size={20}/> تعديل الحساب</>}
                  </button>
                  <button onClick={logout} className="px-10 py-5 bg-white/5 text-brand-muted border border-white/10 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all">
                    <LogOut size={20}/> خروج آمن
                  </button>
                </div>
              </div>

              {/* Progress Ring (Desktop) */}
              <div className="hidden xl:flex flex-col items-center gap-6 bg-brand-main/50 p-10 rounded-[3.5rem] border border-white/5 shadow-inner">
                <ProgressRing progress={progressPercentage} size={160} />
                <div className="text-center">
                   <p className="text-white font-black text-xl flex items-center gap-2 justify-center">الوحش الأكاديمي <Flame size={20} className="text-orange-500 animate-pulse"/></p>
                   <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">Academy Streak: 12 Days</p>
                </div>
              </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Column 1: Settings & Info */}
            <div className="lg:col-span-7 space-y-10">
                {/* Editable Section */}
                <div className="bg-brand-card/80 border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4 mb-10">
                    <UserCheck className="text-brand-gold" /> 
                    إعدادات الحساب {isEditing && <span className="text-xs text-brand-gold font-bold bg-brand-gold/10 px-3 py-1 rounded-full animate-pulse">وضع التعديل</span>}
                  </h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] px-2">اسمك الثلاثي (يظهر في الشهادات)</label>
                      {isEditing ? (
                        <div className="relative group">
                          <UserIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                          <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl pr-14 pl-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" 
                            placeholder="أدخل اسمك بالكامل..."
                          />
                        </div>
                      ) : (
                        <div className="bg-brand-main/60 p-6 rounded-2xl text-white font-black text-lg border border-white/5 flex items-center gap-4">
                          <UserIcon size={20} className="text-brand-muted" /> {user.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] px-2">رقم الواتساب (للتواصل والدعم)</label>
                      {isEditing ? (
                        <div className="relative group">
                          <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                          <input 
                            type="tel" 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                            className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl pr-14 pl-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" 
                            placeholder="01XXXXXXXXX"
                          />
                        </div>
                      ) : (
                        <div className="bg-brand-main/60 p-6 rounded-2xl text-white font-black text-lg border border-white/5 flex items-center gap-4">
                          <Phone size={20} className="text-brand-muted" /> {user.phone || 'لم يتم إدخال رقم'}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-2xl shadow-glow text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={24}/> حفظ التغييرات</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subscription Card for Free Users */}
                {user.subscriptionTier === 'free' && (
                  <Link to="/wallet" className="block group">
                    <div className="bg-gradient-to-br from-brand-gold to-yellow-600 p-10 rounded-[3.5rem] shadow-glow flex items-center justify-between overflow-hidden relative transition-all group-hover:scale-[1.02]">
                       <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                          <Zap size={200} fill="white" />
                       </div>
                       <div className="relative z-10 space-y-4">
                          <h4 className="text-brand-main text-3xl font-black tracking-tighter">طور حسابك لـ PRO الآن</h4>
                          <p className="text-brand-main/80 font-bold max-w-xs">افتح جميع المحاضرات الصوتية، حمل المذكرات PDF، وشارك في الاختبارات المتقدمة.</p>
                          <div className="inline-flex items-center gap-2 bg-brand-main text-brand-gold px-6 py-3 rounded-2xl font-black text-sm mt-4">
                             اشترك الآن <ChevronLeft size={18} />
                          </div>
                       </div>
                       <div className="hidden md:block">
                          <CreditCard size={100} className="text-brand-main/20" />
                       </div>
                    </div>
                  </Link>
                )}
            </div>

            {/* Column 2: Stats & Security */}
            <div className="lg:col-span-5 space-y-10">
                {/* Momentum Chart */}
                <div className="bg-brand-card rounded-[3.5rem] border border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden h-full">
                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><TrendingUp className="text-brand-gold" /> نشاط المذاكرة</h3>
                    <div className="flex items-end justify-between gap-3 h-48 md:h-64 pt-6 px-2">
                      {activityData.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className="w-full max-w-[40px] relative flex flex-col justify-end h-full">
                            <div className="w-full bg-brand-gold/10 rounded-2xl relative overflow-hidden transition-all duration-700 hover:bg-brand-gold/20 cursor-pointer" style={{ height: `${val}%` }}>
                              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-brand-gold/40 to-transparent"></div>
                            </div>
                          </div>
                          <span className="text-[10px] text-brand-muted font-black uppercase">{['S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Security Status */}
                <div className="bg-brand-card/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-10 shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center border border-green-500/20">
                      <ShieldCheck size={40}/>
                    </div>
                    <h3 className="text-2xl font-black text-white">مركز الحماية</h3>
                    <p className="text-brand-muted text-xs font-medium leading-relaxed">
                      حسابك محمي بنظام "التبصيم الرقمي". يمنع مشاركة الحسابات لضمان عدم التعرض للحظر التلقائي. جميع المحاضرات مسجلة باسمك ورقم هاتفك.
                    </p>
                    <div className="flex items-center gap-3 bg-brand-main/60 text-brand-muted px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-white/5">
                      <Monitor size={14}/> متصل من: {user.lastDevice || 'جهاز تعليمي موثق'}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
