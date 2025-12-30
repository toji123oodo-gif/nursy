import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, ArrowRight, CheckCircle } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(false);
  
  // Phone State
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);

  // General State
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginWithGoogle, loginWithPhoneMock } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('nursy_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('nursy_remembered_email', email);
      } else {
        localStorage.removeItem('nursy_remembered_email');
      }
      navigate('/dashboard');
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
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError('فشل تسجيل الدخول باستخدام جوجل. حاول مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  // Phone Auth Functions
  const setupRecaptcha = () => {
    if (!auth) return; // Skip if in Mock Mode
    
    // Ensure container exists
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsSubmitting(true);

    // MOCK MODE for Phone
    if (!auth) {
      console.log("Mock Mode: Sending OTP to", phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Fake confirmation result
      setConfirmationResult({
        confirm: async (code: string) => {
          if (code === '123456') {
             await loginWithPhoneMock(phoneNumber);
             return { user: { uid: 'mock-phone-uid' } };
          }
          throw new Error("Invalid verification code");
        }
      });
      setPhoneStep('otp');
      setIsSubmitting(false);
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    // Format phone number to E.164 format (Assuming Egypt +20 default if missing)
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
      } else {
        setError('حدث خطأ في إرسال الرمز. تأكد من الرقم وحاول مجدداً.');
      }
      // Reset recaptcha
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
      navigate('/dashboard');
    } catch (err: any) {
      console.error("OTP Error:", err);
      setError('كود التحقق غير صحيح (للتجربة استخدم 123456).');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="inline-block bg-brand-gold p-4 rounded-2xl mb-4 shadow-glow">
             <GraduationCap size={40} className="text-brand-main" />
           </div>
           <h1 className="text-4xl font-black text-white mb-2">تسجيل الدخول</h1>
           <p className="text-brand-muted">مرحباً بك مجدداً في منصة Nursy</p>
        </div>

        <div className="bg-brand-card border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Tabs */}
          <div className="flex bg-brand-main/50 p-1 rounded-xl mb-6 relative z-10">
            <button
              onClick={() => { setLoginMethod('email'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                loginMethod === 'email' 
                ? 'bg-brand-card text-brand-gold shadow-sm' 
                : 'text-brand-muted hover:text-white'
              }`}
            >
              <Mail size={16} />
              البريد / ID
            </button>
            <button
              onClick={() => { setLoginMethod('phone'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                loginMethod === 'phone' 
                ? 'bg-brand-card text-brand-gold shadow-sm' 
                : 'text-brand-muted hover:text-white'
              }`}
            >
              <Smartphone size={16} />
              رقم الهاتف
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm font-bold animate-fade-in mb-6 relative z-10">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* EMAIL LOGIN FORM */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-6 relative z-10 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-white mb-2">البريد الإلكتروني أو ID</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50"
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-muted/30 bg-brand-main text-brand-gold focus:ring-brand-gold focus:ring-offset-0 accent-brand-gold cursor-pointer"
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe" className="text-sm text-brand-muted cursor-pointer select-none font-bold">
                  تذكرني
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                   <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>دخول</span>
                    <LogIn size={20} />
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
                    <label className="block text-sm font-bold text-white mb-2">رقم الهاتف</label>
                    <div className="relative" dir="ltr">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 pl-16 text-white text-lg font-mono placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50"
                        placeholder="1012345678"
                        disabled={isSubmitting}
                      />
                      <div className="absolute top-0 left-0 h-full px-3 flex items-center bg-white/5 border-r border-white/10 rounded-l-xl">
                         <span className="text-brand-muted font-bold text-sm">+20</span>
                      </div>
                    </div>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>إرسال الرمز</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6 animate-fade-in">
                  <div className="text-center mb-2">
                    <p className="text-brand-muted text-sm">تم إرسال الرمز إلى {phoneNumber}</p>
                    <button type="button" onClick={() => setPhoneStep('input')} className="text-brand-gold text-xs hover:underline mt-1">تغيير الرقم</button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">رمز التحقق (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-brand-main border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-center text-white text-2xl font-mono tracking-widest placeholder:text-brand-muted/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 disabled:opacity-50"
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
                        <span>تأكيد الرمز</span>
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Divider */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-card text-brand-muted">أو سجل باستخدام</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span>المتابعة باستخدام Google</span>
          </button>

          <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
            <p className="text-brand-muted text-sm">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="text-brand-gold font-bold hover:underline">
                أنشئ حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Types for Recaptcha
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}