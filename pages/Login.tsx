import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, ArrowRight, CheckCircle, Globe, Unlock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../src/firebase';

// Simple Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

type LoginMethod = 'email' | 'phone';
type PhoneStep = 'input' | 'otp';

export const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  
  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone State
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);

  // General State
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(''); 
  const [showMockGoogle, setShowMockGoogle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginWithGoogle, loginWithGoogleMock } = useApp();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorDetails('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/welcome');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم حظر الحساب مؤقتاً لكثرة المحاولات. حاول لاحقاً.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setErrorDetails('');
    setShowMockGoogle(false);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/welcome');
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        setError('النطاق الحالي غير مصرح به في Firebase.');
        setErrorDetails(`يرجى إضافة النطاق "${domain}" إلى قائمة Authorized Domains في Firebase Console > Authentication > Settings.`);
        setShowMockGoogle(true);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق النافذة قبل اكتمال تسجيل الدخول.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('تم إلغاء طلب تسجيل الدخول.');
      } else {
        setError('فشل تسجيل الدخول باستخدام جوجل.');
        setErrorDetails(err.message);
      }
      setIsSubmitting(false);
    }
  };

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorDetails('');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsSubmitting(true);
    setupRecaptcha();
    
    const appVerifier = window.recaptchaVerifier;
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+20${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;

    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setPhoneStep('otp');
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Phone Auth Error:", err);
      setIsSubmitting(false);
      if (err.code === 'auth/invalid-phone-number') {
        setError('رقم الهاتف غير صالح.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('محاولات كثيرة جداً. حاول لاحقاً.');
      } else if (err.code === 'auth/unauthorized-domain') {
         const domain = window.location.hostname;
         setError('النطاق الحالي غير مصرح به.');
         setErrorDetails(`يرجى إضافة "${domain}" في إعدادات Firebase.`);
      } else {
        setError('حدث خطأ في إرسال الرمز.');
        setErrorDetails(err.message);
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!confirmationResult || !otpCode) {
      setError('الرمز غير صحيح');
      setIsSubmitting(false);
      return;
    }

    try {
      await confirmationResult.confirm(otpCode);
      navigate('/welcome');
    } catch (err: any) {
      console.error("OTP Error:", err);
      setError('كود التحقق غير صحيح.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="inline-block bg-brand-gold p-4 rounded-2xl mb-4 shadow-glow transform hover:scale-105 transition-transform">
             <GraduationCap size={40} className="text-brand-main" />
           </div>
           <h1 className="text-4xl font-black text-white mb-2 tracking-tight">تسجيل الدخول</h1>
           <p className="text-brand-muted font-medium">مرحباً بك مجدداً في منصة Nursy</p>
        </div>

        <div className="bg-brand-card border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-[80px] pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-700"></div>
          
          {/* Tabs */}
          <div className="flex bg-brand-main/50 p-1.5 rounded-2xl mb-8 relative z-10 border border-white/5 shadow-inner">
            <button
              onClick={() => { setLoginMethod('email'); setError(''); setErrorDetails(''); setShowMockGoogle(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                loginMethod === 'email' 
                ? 'bg-brand-card text-brand-gold shadow-lg ring-1 ring-white/5' 
                : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail size={18} />
              البريد الإلكتروني
            </button>
            <button
              onClick={() => { setLoginMethod('phone'); setError(''); setErrorDetails(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                loginMethod === 'phone' 
                ? 'bg-brand-card text-brand-gold shadow-lg ring-1 ring-white/5' 
                : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone size={18} />
              رقم الهاتف
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold animate-fade-in mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
              {errorDetails && (
                <div className="text-[10px] font-normal opacity-70 mt-3 p-3 bg-black/40 rounded-xl border border-white/5 break-all font-mono leading-relaxed" dir="ltr">
                  {errorDetails}
                </div>
              )}
              {showMockGoogle && (
                 <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                    <p className="text-xs text-brand-muted mb-3 text-center">هل تريد المتابعة في الوضع التجريبي؟</p>
                    <button 
                        onClick={() => { loginWithGoogleMock(); navigate('/welcome'); }}
                        className="bg-brand-gold text-brand-main text-xs font-bold py-3 px-4 rounded-xl hover:bg-brand-goldHover transition-all flex items-center gap-2 w-full justify-center shadow-lg active:scale-95"
                    >
                        <Unlock size={14} />
                        دخول تجريبي (Mock Login)
                    </button>
                 </div>
              )}
            </div>
          )}

          {/* EMAIL LOGIN FORM */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-6 relative z-10 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-white mb-2 mr-1">البريد الإلكتروني</label>
                <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted/60" size={18} />
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-main border border-white/10 hover:border-brand-gold/30 rounded-2xl px-12 py-4 text-white placeholder:text-brand-muted/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50 shadow-inner"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 mr-1">كلمة المرور</label>
                <div className="relative">
                    <Unlock className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted/60" size={18} />
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-main border border-white/10 hover:border-brand-gold/30 rounded-2xl px-12 py-4 text-white placeholder:text-brand-muted/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50 shadow-inner"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              >
                {isSubmitting ? (
                   <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-lg">دخول</span>
                    <LogIn size={22} className="group-hover:translate-x-[-4px] transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PHONE LOGIN FORM */}
          {loginMethod === 'phone' && (
            <div className="space-y-6 relative z-10 animate-fade-in">
              {phoneStep === 'input' ? (
                <form onSubmit={requestOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 mr-1">رقم الهاتف</label>
                    <div className="relative" dir="ltr">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-brand-main border border-white/10 hover:border-brand-gold/30 rounded-2xl px-4 py-4 pl-20 text-white text-xl font-mono placeholder:text-brand-muted/30 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50 shadow-inner"
                        placeholder="1012345678"
                        disabled={isSubmitting}
                      />
                      <div className="absolute top-0 left-0 h-full px-4 flex items-center bg-white/5 border-r border-white/10 rounded-l-2xl">
                         <span className="text-brand-gold font-black text-sm">+20</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-muted mt-2 mr-1">سيتم إرسال رمز تحقق عبر رسالة نصية SMS</p>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-lg">إرسال الرمز</span>
                        <ArrowRight size={22} className="rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6 animate-fade-in">
                  <div className="text-center mb-4 bg-brand-main/40 p-3 rounded-2xl border border-white/5">
                    <p className="text-brand-muted text-xs">تم إرسال الرمز إلى <span className="text-white font-mono">{phoneNumber}</span></p>
                    <button type="button" onClick={() => setPhoneStep('input')} className="text-brand-gold text-xs font-bold hover:underline mt-2 flex items-center justify-center gap-1 mx-auto">تعديل الرقم</button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-3 text-center">رمز التحقق (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-brand-main border border-brand-gold/40 hover:border-brand-gold rounded-2xl px-4 py-5 text-center text-white text-3xl font-mono tracking-[0.5em] placeholder:text-brand-muted/20 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all duration-300 disabled:opacity-50 shadow-2xl"
                      placeholder="------"
                      maxLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-lg">تأكيد الرمز</span>
                        <CheckCircle size={22} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Divider */}
          <div className="relative my-10 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-brand-card text-brand-muted font-bold text-xs uppercase tracking-widest">أو عبر المنصات</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-white text-gray-900 font-black py-4 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
          >
            <GoogleIcon />
            <span>المتابعة باستخدام Google</span>
          </button>

          <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
            <p className="text-brand-muted text-sm font-medium">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="text-brand-gold font-black hover:underline hover:text-brand-goldHover transition-colors mr-1">
                أنشئ حساب جديد
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center text-brand-muted/40 text-[10px] uppercase tracking-[0.2em]">
            &copy; 2025 Nursy Educational Platform - All Rights Reserved
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}