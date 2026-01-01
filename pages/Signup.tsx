
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle, User, Mail, Smartphone, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, Sparkles, Loader2 } from 'lucide-react';
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
        setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
        setIsSubmitting(false);
        return;
    }

    try {
        await signup(formData.email, formData.password, formData.name, formData.phone, 'free');
        navigate('/dashboard');
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('هذا البريد الإلكتروني مستخدم بالفعل');
        } else {
            setError('حدث خطأ أثناء إنشاء الحساب');
        }
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
           <Link to="/" className="inline-block mb-6">
             <div className="bg-brand-gold p-4 rounded-2xl shadow-glow">
               <GraduationCap size={40} className="text-brand-main" />
             </div>
           </Link>
           <h1 className="text-4xl font-black text-white mb-2">إنشاء حساب جديد</h1>
           <p className="text-brand-muted">انضم الآن لأقوى منصة تعليمية للتمريض</p>
        </div>

        <div className="bg-brand-card border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold mb-8 flex items-center gap-3">
                  <AlertCircle size={18} /> {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted font-bold mr-1">الاسم بالكامل</label>
                        <div className="relative">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="الاسم" disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-brand-muted font-bold mr-1">رقم الهاتف</label>
                        <div className="relative">
                            <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                            <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="01XXXXXXXXX" disabled={isSubmitting} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-brand-muted font-bold mr-1">البريد الإلكتروني</label>
                    <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="example@mail.com" disabled={isSubmitting} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-brand-muted font-bold mr-1">كلمة المرور</label>
                    <div className="relative">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="••••••••" disabled={isSubmitting} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> إنشاء الحساب</>}
                </button>

                <div className="pt-6 text-center border-t border-white/5">
                    <p className="text-brand-muted text-sm">لديك حساب بالفعل؟ <Link to="/login" className="text-brand-gold font-bold hover:underline">سجل دخولك</Link></p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
