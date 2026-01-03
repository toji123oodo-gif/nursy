
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle, User, Mail, Smartphone, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, Sparkles, Loader2, ChevronLeft, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (formData.password.length < 6) {
        setError('كلمة المرور يجب ألا تقل عن 6 أحرف');
        setIsSubmitting(false);
        return;
    }

    try {
        await signup(formData.email, formData.password, formData.name, formData.phone);
        navigate('/dashboard');
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('هذا البريد الإلكتروني مسجل بالفعل');
        } else {
            setError('فشل إنشاء الحساب، تأكد من البيانات');
        }
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-16 relative overflow-hidden bg-brand-main">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
        {/* Header Section */}
        <div className="text-center mb-10">
           <Link to="/" className="inline-block group mb-6">
             <div className="bg-brand-gold p-5 rounded-[2rem] shadow-glow group-hover:scale-110 transition-transform duration-500">
               <GraduationCap size={48} className="text-brand-main" />
             </div>
           </Link>
           <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">انضم إلى نيرسي</h1>
           <p className="text-brand-muted text-lg font-bold">أكبر صرح تعليمي لطلاب التمريض في مصر</p>
           
           {/* Trial Gift Badge */}
           <div className="mt-6 inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-6 py-2.5 rounded-full animate-bounce-slow">
              <Gift className="text-green-500" size={18} />
              <span className="text-green-500 font-black text-xs uppercase tracking-widest">سجل الآن واحصل على 30 يوم PRO مجاناً</span>
           </div>
        </div>

        {/* Signup Form Card */}
        <div className="bg-brand-card/40 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-[1.5rem] text-sm font-black mb-10 flex items-center gap-4 animate-shake">
                  <AlertCircle size={20} /> {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest pr-2">الاسم بالكامل</label>
                        <div className="relative group">
                            <User className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-main/50 border-2 border-white/5 rounded-2xl pr-14 pl-6 py-5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all" placeholder="أدخل اسمك" disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest pr-2">رقم الهاتف</label>
                        <div className="relative group">
                            <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                            <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-main/50 border-2 border-white/5 rounded-2xl pr-14 pl-6 py-5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all font-mono" placeholder="01XXXXXXXXX" disabled={isSubmitting} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest pr-2">البريد الإلكتروني</label>
                    <div className="relative group">
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-brand-main/50 border-2 border-white/5 rounded-2xl pr-14 pl-6 py-5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all" placeholder="example@mail.com" disabled={isSubmitting} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest pr-2">كلمة المرور</label>
                    <div className="relative group">
                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-brand-main/50 border-2 border-white/5 rounded-2xl pr-14 pl-14 py-5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all placeholder:tracking-normal font-mono" placeholder="••••••••" disabled={isSubmitting} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-[2rem] flex items-start gap-4">
                  <Shield size={24} className="text-brand-gold shrink-0 mt-1" />
                  <p className="text-brand-muted text-xs leading-relaxed font-bold">
                    بإنشاء الحساب، أنت توافق على قوانين حماية المحتوى والخصوصية في نيرسي. يمنع مشاركة الحسابات لضمان استمرارية الخدمة.
                  </p>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl tracking-tighter">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><UserPlus size={28} /> إنشاء حسابي</>}
                </button>

                <div className="pt-10 text-center border-t border-white/5">
                    <p className="text-brand-muted font-bold text-base">لديك حساب بالفعل؟ <Link to="/login" className="text-brand-gold font-black hover:underline flex items-center justify-center gap-1 mt-2">سجل دخولك الآن <ChevronLeft size={18} /></Link></p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
