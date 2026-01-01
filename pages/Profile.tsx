
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Phone, Calendar, Shield, Edit2, LogOut, CheckCircle, Save, X, 
  Clock, Mail, Award, BookOpen, Zap, ShieldCheck, Monitor, 
  Smartphone, UserCheck, Star, Sparkles, ChevronLeft, Loader2, AlertCircle, HelpCircle,
  ArrowRight, Target, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return;
    
    setIsSaving(true);
    try {
        await updateUserData(formData);
        setIsEditing(false);
    } catch (error) {
        console.error("Failed to update profile", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
        name: user.name,
        phone: user.phone
    });
    setIsEditing(false);
  };

  const completedCount = user.completedLessons?.length || 0;
  const totalLessonsInEnrolled = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercentage = totalLessonsInEnrolled > 0 ? Math.round((completedCount / totalLessonsInEnrolled) * 100) : 0;

  const stats = [
    { label: 'كورسات متاحة', val: courses.length, icon: BookOpen, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    { label: 'دروس مكتملة', val: completedCount, icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'نسبة الإنجاز', val: `${progressPercentage}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  ];

  const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : true;

  return (
    <div className="min-h-screen bg-brand-main pb-32 pt-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Profile Premium Header */}
        <div className="relative mb-12 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/5 rounded-[3.5rem] blur-3xl"></div>
          <div className="relative bg-brand-card border border-white/10 rounded-[3.5rem] p-8 md:p-14 shadow-2xl overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px] group-hover:bg-brand-gold/10 transition-colors duration-1000"></div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-tr from-brand-gold to-yellow-600 p-1.5 shadow-glow relative group/avatar">
                  <div className="w-full h-full bg-brand-card rounded-[2.8rem] flex items-center justify-center text-brand-gold font-black text-6xl md:text-8xl overflow-hidden">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -bottom-3 -right-3 bg-red-500 text-white p-3 rounded-2xl shadow-xl border-4 border-brand-card">
                      <ShieldCheck size={24} />
                    </div>
                  )}
                  {user.subscriptionTier === 'pro' && !isExpired && (
                    <div className="absolute -top-4 -left-4 bg-brand-gold text-brand-main p-2.5 rounded-2xl animate-bounce-slow shadow-glow border-4 border-brand-card">
                      <Star size={20} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Details */}
              <div className="flex-1 text-center lg:text-right space-y-6">
                <div>
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{user.name}</h1>
                    <div className="flex gap-2">
                       <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}`}>
                        {user.role === 'admin' ? 'Admin / مدير' : 'Student / طالب'}
                      </span>
                      {user.subscriptionTier === 'pro' && !isExpired && (
                        <span className="px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          Premium Member
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-brand-muted font-bold text-base">
                    <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
                      <Mail size={18} className="text-brand-gold" /> 
                      <span className="opacity-80">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
                      <Smartphone size={18} className="text-brand-gold" /> 
                      <span className="opacity-80">{user.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 hover:border-brand-gold/30 transition-all active:scale-95 shadow-xl">
                    <Edit2 size={18} /> تعديل البيانات
                  </button>
                  <button onClick={logout} className="flex items-center gap-3 px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-xl">
                    <LogOut size={18} /> تسجيل الخروج
                  </button>
                </div>
              </div>

              {/* Quick Status */}
              <div className="hidden xl:flex flex-col items-center gap-4 bg-brand-main/40 p-8 rounded-[3rem] border border-white/5 shadow-inner">
                <p className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em]">نشاط الحساب</p>
                <div className="w-24 h-24 rounded-full border-4 border-brand-gold/20 border-t-brand-gold flex items-center justify-center relative">
                  <span className="text-2xl font-black text-white">{progressPercentage}%</span>
                  <Flame size={16} className="absolute -top-1 text-orange-500 animate-pulse" fill="currentColor" />
                </div>
                <p className="text-[10px] text-brand-gold font-bold">طالب مجتهد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {stats.map((s, i) => (
            <div key={i} className="bg-brand-card p-10 rounded-[3rem] border border-white/5 shadow-2xl flex items-center gap-8 group hover:border-brand-gold/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-12 translate-x-12 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className={`w-20 h-20 ${s.bg} ${s.color} rounded-[1.8rem] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform shadow-xl`}>
                <s.icon size={36} />
              </div>
              <div className="relative z-10">
                <p className="text-xs text-brand-muted font-black uppercase tracking-widest mb-1.5">{s.label}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">{s.val}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-7 space-y-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Account Details Card */}
            <div className="bg-brand-card rounded-[4rem] border border-white/5 p-10 md:p-14 shadow-2xl relative">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl font-black text-white flex items-center gap-5">
                  <UserCheck className="text-brand-gold" size={32} /> البيانات الأساسية
                </h3>
                {isEditing && (
                   <button onClick={handleCancel} className="p-3 bg-white/5 text-brand-muted hover:text-white rounded-2xl transition-all"><X size={20} /></button>
                )}
              </div>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.4em] pr-2">اسم الطالب الثلاثي</label>
                  {isEditing ? (
                    <div className="relative">
                      <UserIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-brand-main border-2 border-brand-gold/20 rounded-3xl px-16 py-5 text-white text-xl font-black outline-none focus:border-brand-gold transition-all shadow-inner"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  ) : (
                    <div className="bg-brand-main/50 border border-white/5 rounded-3xl px-8 py-6 text-white text-xl font-black flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                      {user.name}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.4em] pr-2">رقم الهاتف (للووتر مارك)</label>
                  {isEditing ? (
                    <div className="relative">
                      <Smartphone className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-brand-main border-2 border-brand-gold/20 rounded-3xl px-16 py-5 text-white text-xl font-black outline-none focus:border-brand-gold transition-all font-mono shadow-inner"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  ) : (
                    <div className="bg-brand-main/50 border border-white/5 rounded-3xl px-8 py-6 text-white text-xl font-mono font-black tracking-widest flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                      {user.phone}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-6 pt-6">
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving} 
                      className="flex-[2] bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-xl"
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={24} /> حفظ كافة التغييرات</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security & Access Section */}
            <div className="bg-brand-card rounded-[4rem] border border-white/5 p-10 md:p-14 shadow-2xl relative overflow-hidden group">
               <Shield className="absolute -bottom-16 -left-16 text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-1000" size={300} />
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-12">
                   <h3 className="text-2xl font-black text-white flex items-center gap-5">
                    <ShieldCheck className="text-brand-gold" size={28} /> مركز الأمان والجلسة
                   </h3>
                   <div className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">مؤمن حالياً</div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-brand-main/50 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold shadow-inner"><Monitor size={28} /></div>
                      <div>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1.5">الجهاز الموثق</p>
                        <p className="text-white font-black text-lg">{user.lastDevice || 'غير معروف'}</p>
                      </div>
                    </div>
                    <div className="bg-brand-main/50 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold shadow-inner"><Clock size={28} /></div>
                      <div>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1.5">آخر تسجيل دخول</p>
                        <p className="text-white font-black text-lg">{user.lastSeen ? new Date(user.lastSeen).toLocaleDateString('ar-EG') : 'الآن'}</p>
                      </div>
                    </div>
                 </div>

                 <div className="mt-12 p-8 bg-brand-gold/5 border border-brand-gold/10 rounded-[2.5rem] flex items-start gap-6">
                    <AlertCircle size={32} className="text-brand-gold shrink-0 mt-1" />
                    <p className="text-brand-muted text-sm leading-relaxed font-bold">
                      حسابك مراقب بنظام الحماية الذكي. يمنع منعاً باتاً مشاركة الحساب أو محاولة التسجيل من أكثر من جهاز في وقت واحد، حيث سيؤدي ذلك لحظر الحساب تلقائياً للحفاظ على خصوصيتك.
                    </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Premium/Subscription Status */}
          <div className="lg:col-span-5 space-y-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Subscription Premium Card */}
            <div className={`rounded-[4.5rem] p-12 md:p-14 shadow-2xl relative overflow-hidden flex flex-col h-full border ${user.subscriptionTier === 'pro' && !isExpired ? 'bg-gradient-to-br from-brand-gold/30 to-brand-card border-brand-gold/40' : 'bg-brand-card border-white/5'}`}>
              {user.subscriptionTier === 'pro' && !isExpired && (
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-gold/20 blur-[100px] rounded-full animate-pulse"></div>
              )}
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-3 tracking-tighter">حالة العضوية</h3>
                    <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em]">{user.subscriptionTier === 'pro' ? 'Nursy Elite Member' : 'Free Learning Access'}</p>
                  </div>
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-glow-hover transition-all duration-500 ${user.subscriptionTier === 'pro' && !isExpired ? 'bg-brand-gold text-brand-main scale-110 rotate-6' : 'bg-white/5 text-brand-muted opacity-40'}`}>
                    <Sparkles size={40} />
                  </div>
                </div>

                {user.subscriptionTier === 'pro' && !isExpired ? (
                  <div className="space-y-12 flex-1 flex flex-col">
                    <div className="bg-brand-main/80 rounded-[3rem] p-10 border border-white/5 text-center shadow-inner relative group">
                       <div className="absolute inset-0 bg-brand-gold/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.4em] mb-6">صلاحية الوصول الكامل</p>
                       <div className="flex flex-col items-center justify-center gap-2 text-white">
                          <span className="text-xs text-brand-gold font-bold uppercase tracking-widest">تنتهي في</span>
                          <span className="text-5xl font-black font-mono tracking-tighter">{expiryDate?.toLocaleDateString('ar-EG')}</span>
                       </div>
                       <div className="mt-10 h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div className="h-full bg-brand-gold rounded-full shadow-glow animate-pulse" style={{ width: '85%' }}></div>
                       </div>
                       <p className="mt-5 text-[10px] text-brand-muted font-black tracking-widest uppercase">مازال أمامك متسع من الوقت للتعلم</p>
                    </div>

                    <div className="space-y-6 flex-1">
                      {[
                        'مشاهدة غير محدودة لجميع المحاضرات',
                        'تحميل كافة الملازم والملفات PDF',
                        'دعم فني خاص عبر الواتساب',
                        'تفعيل جودة الـ 4K للمحاضرات'
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-5 text-white/90 font-bold text-base transition-transform hover:translate-x-[-10px] cursor-default">
                           <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 border border-brand-gold/20">
                             <CheckCircle size={16} className="text-brand-gold" />
                           </div>
                           {feat}
                        </div>
                      ))}
                    </div>

                    <Link to="/dashboard" className="w-full bg-brand-gold text-brand-main font-black py-7 rounded-[2.5rem] shadow-glow hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl tracking-tighter mt-12">
                       ابدأ المذاكرة الآن <ChevronLeft size={28} strokeWidth={3} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-12 flex-1 flex flex-col">
                    <p className="text-brand-muted leading-relaxed font-bold text-lg">أنت حالياً تستخدم النسخة المحدودة. اشترك في نيرسي PRO لفتح جميع أبواب المنهج والملفات الحصرية.</p>
                    
                    <div className="bg-brand-main/60 rounded-[3.5rem] p-12 border border-dashed border-white/10 text-center flex flex-col items-center justify-center flex-1">
                       <Zap size={60} className="text-brand-muted opacity-10 mb-6" />
                       <span className="text-2xl font-black text-white/40 tracking-tight">لا يوجد اشتراك مفعّل</span>
                    </div>

                    <div className="space-y-4 pt-10">
                      <Link to="/wallet" className="w-full bg-brand-gold text-brand-main font-black py-7 rounded-[2.5rem] shadow-glow hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl tracking-tighter">
                         تفعيل عضوية PRO <Zap size={24} fill="currentColor" />
                      </Link>
                      <p className="text-center text-[10px] text-brand-muted font-bold uppercase tracking-[0.2em]">تبدأ الاشتراكات من 50 ج.م فقط</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Support Quick Link Card */}
            <div className="bg-brand-card/50 rounded-[3.5rem] border border-white/10 p-10 flex items-center justify-between group hover:border-brand-gold/40 transition-all cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center text-brand-muted group-hover:text-brand-gold group-hover:bg-brand-gold/10 transition-all duration-500 shadow-xl border border-white/5">
                    <HelpCircle size={36}/>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xl mb-1.5">تحتاج للمساعدة؟</h4>
                    <p className="text-brand-muted text-sm font-bold">فريق نيرسي متاح للرد على استفساراتك</p>
                  </div>
               </div>
               <Link to="/help" className="p-5 bg-white/5 text-brand-muted rounded-2xl group-hover:bg-brand-gold group-hover:text-brand-main transition-all shadow-lg active:scale-90">
                  <ArrowRight size={28} className="rotate-180" />
               </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
