
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, Unlock, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const ButtonLoader = () => (
  <div className="flex items-center gap-2">
    <Loader2 className="animate-spin" size={20} />
    <span className="animate-pulse">جاري التحميل...</span>
  </div>
);

type LoginMethod = 'email' | 'phone';
type PhoneStep = 'input' | 'otp';

export const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginWithGoogle } = useApp();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
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
      console.error(err);
      setError('فشل تسجيل الدخول باستخدام جوجل.');
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
      setError('حدث خطأ في إرسال الرمز.');
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(otpCode);
      navigate('/dashboard');
    } catch (err: any) {
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
          
          <div className="flex bg-brand-main/40 p-1.5 rounded-2xl mb-8 relative z-10 border border-white/5 shadow-inner backdrop-blur-sm">
            <button
              onClick={() => setLoginMethod('email')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-black transition-all duration-300 border-2 ${
                loginMethod === 'email' 
                ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-[1.02]' 
                : 'bg-transparent text-brand-muted border-transparent hover:text-white hover:bg-white/5'
              } disabled:opacity-50`}
            >
              <Mail size={18} strokeWidth={loginMethod === 'email' ? 3 : 2} />
              البريد الإلكتروني
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-black transition-all duration-300 border-2 ${
                loginMethod === 'phone' 
                ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-[1.02]' 
                : 'bg-transparent text-brand-muted border-transparent hover:text-white hover:bg-white/5'
              } disabled:opacity-50`}
            >
              <Smartphone size={18} strokeWidth={loginMethod === 'phone' ? 3 : 2} />
              رقم الهاتف
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold animate-fade-in mb-8 relative z-10 flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-6 relative z-10 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-white mb-2 mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-gold" size={18} />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-main border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-brand-muted/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 shadow-inner disabled:opacity-50"
                        placeholder="example@mail.com"
                        disabled={isSubmitting}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 mr-1">كلمة المرور</label>
                <div className="relative group">
                    <Unlock className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-gold" size={18} />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-main border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-brand-muted/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 shadow-inner disabled:opacity-50"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                    />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95 relative overflow-hidden group/btn ${isSubmitting ? 'cursor-not-allowed' : ''}`}
              >
                {isSubmitting && <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>}
                {isSubmitting ? (
                   <ButtonLoader />
                ) : (
                  <>
                    <span className="text-lg">دخول</span>
                    <LogIn size={22} />
                  </>
                )}
              </button>
            </form>
          )}

          {loginMethod === 'phone' && (
            <div className="space-y-6 relative z-10 animate-fade-in">
              {phoneStep === 'input' ? (
                <form onSubmit={requestOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 mr-1">رقم الهاتف</label>
                    <div className="relative group" dir="ltr">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-brand-main border border-white/10 rounded-2xl px-4 py-4 pl-20 text-white text-xl font-mono placeholder:text-brand-muted/30 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all duration-300 shadow-inner disabled:opacity-50"
                        placeholder="10XXXXXXXX"
                        disabled={isSubmitting}
                      />
                      <div className="absolute top-0 left-0 h-full px-4 flex items-center bg-white/5 border-r border-white/10 rounded-l-2xl">
                         <span className="text-brand-gold font-black text-sm">+20</span>
                      </div>
                    </div>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group/btn"
                  >
                    {isSubmitting && <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>}
                    {isSubmitting ? <ButtonLoader /> : 'إرسال الرمز'}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-3 text-center">رمز التحقق (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-brand-main border border-brand-gold/40 rounded-2xl px-4 py-5 text-center text-white text-3xl font-mono tracking-[0.5em] focus:border-brand-gold outline-none transition-all shadow-2xl disabled:opacity-50"
                      placeholder="------"
                      maxLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-brand-gold text-brand-main font-black py-4.5 rounded-2xl relative overflow-hidden group/btn"
                  >
                    {isSubmitting && <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>}
                    {isSubmitting ? <ButtonLoader /> : 'تأكيد الرمز'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="relative my-10 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-brand-card text-brand-muted font-bold text-xs">أو المتابعة عبر</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={isSubmitting} 
            className="w-full bg-white text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-gray-50 transition-colors disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>يرجى الانتظار...</span>
              </div>
            ) : (
              <>
                <GoogleIcon />
                <span>Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
