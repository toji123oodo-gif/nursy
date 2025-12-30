import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Shield, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../src/firebase';

type Step = 'details' | 'otp';

export const Signup: React.FC = () => {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('free');
  
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { registerPhoneUser } = useApp();
  const navigate = useNavigate();

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'signup-recaptcha', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.name.length < 3) {
        setError('يرجى إدخال اسم صحيح');
        setIsSubmitting(false);
        return;
    }
    if (formData.phone.length < 10) {
        setError('يرجى إدخال رقم هاتف صحيح');
        setIsSubmitting(false);
        return;
    }

    // MOCK MODE
    if (!auth) {
        console.log("Mock Mode: Sending Signup OTP to", formData.phone);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfirmationResult({
            confirm: async (code: string) => {
                if (code === '123456') {
                    return { user: { uid: `mock-user-${Date.now()}` } };
                }
                throw new Error("Invalid verification code");
            }
        });
        setStep('otp');
        setIsSubmitting(false);
        return;
    }

    // REAL MODE
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+20${formData.phone.startsWith('0') ? formData.phone.substring(1) : formData.phone}`;

    try {
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setStep('otp');
    } catch (err: any) {
        console.error("Signup Phone Error", err);
        if (err.code === 'auth/invalid-phone-number') {
            setError('رقم الهاتف غير صالح');
        } else if (err.code === 'auth/too-many-requests') {
            setError('محاولات كثيرة جداً. حاول لاحقاً');
        } else {
            setError('حدث خطأ أثناء إرسال الرمز');
        }
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');

      try {
          const result = await confirmationResult.confirm(otpCode);
          
          // Register user data in Context/Storage
          await registerPhoneUser(result.user.uid, {
              name: formData.name,
              phone: formData.phone,
              subscriptionTier: selectedPlan
          });

          navigate('/dashboard');
      } catch (err) {
          console.error(err);
          setError('كود التحقق غير صحيح');
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

            {step === 'details' ? (
                <form onSubmit={handleSendOtp} className="animate-fade-in">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                            <div className="relative" dir="ltr">
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 pl-16 text-white font-mono focus:border-brand-gold outline-none transition-all placeholder:text-brand-muted/50"
                                    placeholder="1012345678"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute top-0 left-0 h-full px-3 flex items-center bg-white/5 border-r border-white/10 rounded-l-xl">
                                    <span className="text-brand-muted font-bold text-sm">+20</span>
                                </div>
                            </div>
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

                    <div id="signup-recaptcha"></div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <span>إرسال رمز التحقق</span>
                            <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="animate-fade-in space-y-6">
                    <div className="text-center">
                        <p className="text-brand-muted text-sm">تم إرسال رمز التحقق إلى {formData.phone}</p>
                        <button type="button" onClick={() => setStep('details')} className="text-brand-gold text-xs hover:underline mt-1">تعديل البيانات</button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-white mb-2">رمز التحقق (OTP)</label>
                        <input
                            type="text"
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-center text-white text-2xl font-mono tracking-widest placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all"
                            placeholder="------"
                            maxLength={6}
                            disabled={isSubmitting}
                        />
                        {!auth && <p className="text-xs text-brand-muted mt-2 text-center">Mock Mode: Code is 123456</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <span>إتمام التسجيل</span>
                            <UserPlus size={20} />
                            </>
                        )}
                    </button>
                </form>
            )}

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