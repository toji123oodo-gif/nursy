
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Phone, Edit2, LogOut, CheckCircle, Save, X, 
  Clock, Mail, Award, BookOpen, Zap, ShieldCheck, Monitor, 
  Smartphone, UserCheck, Star, Sparkles, ChevronLeft, Loader2, AlertCircle, HelpCircle,
  ArrowRight, TrendingUp, Medal, Flame
} from 'lucide-react';
/* Import Link from react-router-dom */
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
        <circle className="text-brand-gold transition-all duration-1000 ease-out" strokeWidth={stroke} strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} filter="url(#glow)" />
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{progress}%</span>
        <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest mt-1">المعدل</span>
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, phone: user.phone });
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return;
    setIsSaving(true);
    try { await updateUserData(formData); setIsEditing(false); } 
    catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  const completedCount = user.completedLessons?.length || 0;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const activityData = [40, 75, 50, 90, 60, 85, 100];

  return (
    <div className="min-h-screen bg-brand-main pb-32 pt-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Header Section */}
        <div className="relative bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px]"></div>
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-tr from-brand-gold to-yellow-600 p-1 shadow-glow flex items-center justify-center">
                  <div className="w-full h-full bg-brand-card rounded-[2.8rem] flex items-center justify-center text-brand-gold font-black text-6xl md:text-8xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
              </div>
              <div className="flex-1 text-center lg:text-right space-y-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">{user.name}</h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <span className="px-5 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest">طالب متميز</span>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-brand-muted text-xs">
                      <Mail size={14}/> {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button onClick={() => setIsEditing(true)} className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-white/10 transition-all"><Edit2 size={18}/> تعديل</button>
                  <button onClick={logout} className="px-8 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all"><LogOut size={18}/> خروج</button>
                </div>
              </div>
              <div className="hidden xl:flex flex-col items-center gap-4 bg-brand-main/40 p-8 rounded-[3rem] border border-white/5">
                <ProgressRing progress={progressPercentage} size={150} />
                <p className="text-white font-black text-lg flex items-center gap-2">الوحش الأكاديمي <Flame size={18} className="text-orange-500"/></p>
              </div>
            </div>
        </div>

        {/* Momentum Chart */}
        <div className="bg-brand-card rounded-[3.5rem] border border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden">
            <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4"><TrendingUp className="text-brand-gold" /> زخم المذاكرة الأسبوعي</h3>
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

        {/* Account Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-brand-card rounded-[4rem] border border-white/5 p-10 md:p-14 shadow-2xl space-y-10">
               <h3 className="text-2xl font-black text-white flex items-center gap-4"><UserCheck className="text-brand-gold" /> بيانات الحساب</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">اسمك الكامل</label>
                    {isEditing ? (
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-brand-gold" />
                    ) : (
                      <div className="bg-brand-main/50 p-5 rounded-2xl text-white font-bold">{user.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">رقم الهاتف</label>
                    {isEditing ? (
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-brand-gold" />
                    ) : (
                      <div className="bg-brand-main/50 p-5 rounded-2xl text-white font-bold">{user.phone}</div>
                    )}
                  </div>
                  {isEditing && (
                    <button onClick={handleSave} disabled={isSaving} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow">
                      {isSaving ? <Loader2 className="animate-spin mx-auto" /> : 'حفظ التعديلات'}
                    </button>
                  )}
               </div>
            </div>

            <div className="bg-brand-card rounded-[4rem] border border-white/5 p-10 md:p-14 shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center"><ShieldCheck size={48}/></div>
                <h3 className="text-3xl font-black text-white">مركز الأمان</h3>
                <p className="text-brand-muted font-medium">حسابك مؤمن بنظام الووتر مارك والحماية من النسخ. لا تقم بمشاركة بياناتك مع أي شخص لضمان استمرار الخدمة.</p>
                <div className="flex items-center gap-4 bg-green-500/10 text-green-500 px-6 py-3 rounded-2xl font-black text-xs">
                  <Monitor size={16}/> متصل من: {user.lastDevice || 'جهاز موثق'}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
