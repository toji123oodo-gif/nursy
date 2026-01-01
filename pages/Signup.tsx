
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle, User, Mail, Smartphone, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, Sparkles, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';

const ButtonLoader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <Loader2 className="animate-spin text-brand-main" size={20} />
    <span className="animate-pulse font-black text-sm">{label}</span>
  </div>
);

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (formData.password.length < 6) {
        setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
        setIsSubmitting(false);
        return;
    }

    try {
        await signup(formData.email, formData.password, formData.name, formData.phone, 'free');
        setIsSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('هذا البريد الإلكتروني مستخدم بالفعل');
        } else {
            setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-[90vh] flex items-center justify-center p-6">
            <div className="bg-brand-card border border-white/10 p-12 rounded-[3.5rem] text-center animate-scale-up shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gold/5 animate-pulse"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-green-500 shadow-glow animate-bounce-slow">
                        <CheckCircle2 size={56} />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">تم إنشاء الحساب!</h2>
                    <p className="text-brand-muted text-lg">مرحباً بك في عائلة نيرسي التعليمية...</p>
                    <div className="mt-10 flex justify-center">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-gold animate-shimmer w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10 animate-fade-in">
           <Link to="/" className="relative inline-block mb-6 group">
             <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative bg-gradient-to-br from-brand-gold to-yellow-600 p-5 rounded-3xl shadow-glow transform group-hover:scale-110 transition-all duration-500">
               <GraduationCap size={40} className="text-brand-main" strokeWidth={2.5} />
             </div>
             <div className="absolute -top-2 -right-2 bg-brand-main border border-brand-gold/30 p-1.5 rounded-lg text-brand-gold shadow-lg animate-bounce-slow">
                <Sparkles size={14} />
             </div>
           </Link>
           <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">إنشاء حساب جديد<span className="text-brand-gold">.</span></h1>
           <p className="text-brand-muted font-medium">خطوة واحدة تفصلك عن أقوى شرح لمناهج التمريض</p>
        </div>

        <div className="bg-brand-card/70 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/5 blur-[60px] pointer-events-none"></div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-xs font-bold animate-shake mb-8 flex items-start gap-4">
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="leading-relaxed">{error}</span>
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">الاسم بالكامل</label>
                        <div className="relative group">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                            <input 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-12 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-all" 
                                placeholder="مثال: أحمد محمد" 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">رقم الهاتف</label>
                        <div className="relative group">
                            <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                            <input 
                                type="tel" 
                                required 
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})} 
                                className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-12 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-all" 
                                placeholder="01XXXXXXXXX" 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">البريد الإلكتروني</label>
                    <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                        <input 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-12 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-all" 
                            placeholder="example@mail.com" 
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">كلمة المرور</label>
                    <div className="relative group">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            required 
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-12 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-all" 
                            placeholder="••••••••" 
                            disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-[1.8rem] shadow-glow hover:bg-brand-goldHover hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        {isSubmitting ? (
                            <ButtonLoader label="جاري إنشاء حسابك..." />
                        ) : (
                            <>
                                <span className="text-xl">ابدأ رحلة التعلم</span>
                                <UserPlus size={24} strokeWidth={3} className="group-hover:translate-x-[-4px] transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <div className="pt-6 text-center border-t border-white/5">
                    <p className="text-brand-muted text-sm font-medium">
                        لديك حساب بالفعل؟ {' '}
                        <Link to="/login" className="text-brand-gold font-black hover:text-white transition-colors border-b border-brand-gold/20 hover:border-white">سجل دخولك الآن</Link>
                    </p>
                </div>
            </form>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 animate-fade-in opacity-60">
            <div className="flex items-center gap-2 text-xs text-brand-muted font-bold">
                <Shield size={14} className="text-brand-gold" />
                <span>حماية كاملة للبيانات</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-muted font-bold">
                <CheckCircle size={14} className="text-brand-gold" />
                <span>وصول فوري للمواد</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-muted font-bold">
                <Zap size={14} className="text-brand-gold" />
                <span>أسرع منصة تعليمية</span>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
