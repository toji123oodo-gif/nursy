import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('free');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.name.length < 3) {
        setError('يرجى إدخال اسم صحيح');
        setIsSubmitting(false);
        return;
    }
    if (formData.password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setIsSubmitting(false);
        return;
    }

    try {
        await signup(
            formData.email, 
            formData.password, 
            formData.name, 
            formData.phone, 
            selectedPlan
        );
        navigate('/dashboard');
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            setError('البريد الإلكتروني مسجل بالفعل');
        } else if (err.code === 'auth/invalid-email') {
            setError('البريد الإلكتروني غير صالح');
        } else if (err.code === 'auth/weak-password') {
            setError('كلمة المرور ضعيفة جداً');
        } else {
            setError('حدث خطأ أثناء إنشاء الحساب');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-black text-white mb-2">إنشاء حساب جديد</h1>
           <p className="text-brand-muted">ابدأ رحلتك التعليمية مع Nursy</p>
        </div>

        <div className="bg-brand-card border border-white/5 p-6 md:p-10 rounded-3xl shadow-2xl overflow-hidden">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm font-bold mb-6 animate-fade-in">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="animate-fade-in">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">الاسم بالكامل</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/50"
                            placeholder="اكتب اسمك هنا"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">رقم الهاتف</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white font-mono focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/50"
                            placeholder="01xxxxxxxxx"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/50"
                            placeholder="name@example.com"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/50"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Plan Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-white mb-4">اختر الباقة المناسبة</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Free Plan */}
                        <div 
                            onClick={() => !isSubmitting && setSelectedPlan('free')}
                            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${selectedPlan === 'free' ? 'border-brand-muted bg-white/5' : 'border-white/5 hover:bg-white/5'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-white text-lg">الباقة المجانية</h3>
                                {selectedPlan === 'free' && <CheckCircle className="text-brand-muted" size={24} />}
                            </div>
                            <ul className="text-sm text-brand-muted space-y-2">
                                <li className="flex items-center gap-2"><Shield size={14} /> أول درسين فقط</li>
                                <li className="flex items-center gap-2"><Shield size={14} /> جودة عادية</li>
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div 
                            onClick={() => !isSubmitting && setSelectedPlan('pro')}
                            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden ${selectedPlan === 'pro' ? 'border-brand-gold bg-brand-gold/10' : 'border-white/5 hover:bg-white/5'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {selectedPlan === 'pro' && <div className="absolute top-0 right-0 bg-brand-gold text-brand-main text-xs font-bold px-3 py-1 rounded-bl-xl">موصى به</div>}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-brand-gold text-lg">الباقة الكاملة</h3>
                                {selectedPlan === 'pro' && <CheckCircle className="text-brand-gold" size={24} />}
                            </div>
                            <ul className="text-sm text-white space-y-2">
                                <li className="flex items-center gap-2 text-brand-gold"><Zap size={14} /> جميع الدروس مفتوحة</li>
                                <li className="flex items-center gap-2"><Zap size={14} /> تحميل ملفات PDF</li>
                                <li className="flex items-center gap-2"><Zap size={14} /> جودة 4K</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                        <span>إنشاء الحساب</span>
                        <UserPlus size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
                <p className="text-brand-muted text-sm">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-brand-gold font-bold hover:underline">
                    سجل دخولك الآن
                </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};