
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, Unlock, Loader2, Eye, EyeOff, ArrowLeft, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import firebase from 'firebase/compat/app';
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

export const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
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
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('هذا النطاق غير مصرح به في Firebase. يرجى إضافته في الإعدادات.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('تسجيل دخول جوجل غير مفعل في Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول قبل الإكمال.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('تم إلغاء الطلب، يرجى المحاولة مرة أخرى.');
      } else {
        setError(`فشل تسجيل الدخول: ${err.message || 'خطأ غير معروف'}`);
      }
      setIsSubmitting(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setupRecaptcha();
    const formattedPhone = `+20${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    try {
      const confirmation = await auth.signInWithPhoneNumber(formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setPhoneStep('otp');
      setIsSubmitting(false);
    } catch (err: any) {
      setError('خطأ في إرسال كود التحقق. تأكد من تفعيل Phone Auth.');
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(otpCode);
      navigate('/dashboard');
    } catch (err: any) {
      setError('كود التحقق غير صحيح');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
           <Link to="/" className="inline-block mb-6">
             <div className="bg-brand-gold p-4 rounded-2xl shadow-glow">
               <GraduationCap size={40} className="text-brand-main" />
             </div>
           </Link>
           <h1 className="text-4xl font-black text-white mb-2">تسجيل الدخول</h1>
           <p className="text-brand-muted">أهلاً بك مجدداً في نيرسي</p>
        </div>

        <div className="bg-brand-card border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          {view === 'login' ? (
            <>
              <div className="flex bg-brand-main/50 p-1 rounded-xl mb-8">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${loginMethod === 'email' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
                >
                  البريد الإلكتروني
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${loginMethod === 'phone' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
                >
                  رقم الهاتف
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-[11px] font-bold mb-6 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} /> {error}
                  </div>
                  {error.includes('غير مفعل') && (
                    <div className="mt-1 p-2 bg-white/5 rounded-lg flex items-start gap-2">
                      <Info size={12} className="mt-0.5 text-brand-gold" />
                      <span className="text-[9px] text-brand-muted font-normal">تأكد من تفعيل خيار Google في Firebase Console -> Authentication -> Sign-in method</span>
                    </div>
                  )}
                </div>
              )}

              {loginMethod === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-brand-muted font-bold mr-1">البريد الإلكتروني</label>
                    <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="example@mail.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-brand-muted font-bold mr-1">كلمة المرور</label>
                      <button type="button" onClick={() => setView('forgot-password')} className="text-[10px] text-brand-gold hover:underline">نسيت كلمة المرور؟</button>
                    </div>
                    <div className="relative">
                        <Unlock className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> دخول</>}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {phoneStep === 'input' ? (
                    <form onSubmit={requestOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs text-brand-muted font-bold mr-1">رقم الهاتف</label>
                        <div className="relative">
                          <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                          <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-brand-main border border-white/10 rounded-xl px-12 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="01XXXXXXXXX" />
                        </div>
                      </div>
                      <div id="recaptcha-container"></div>
                      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'إرسال كود التحقق'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={verifyOtp} className="space-y-6">
                      <div className="text-center space-y-4">
                        <p className="text-sm text-brand-muted">أدخل الكود المرسل لهاتفك</p>
                        <input type="text" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full bg-brand-main border-2 border-brand-gold rounded-xl px-4 py-5 text-center text-white text-3xl font-bold tracking-widest outline-none" maxLength={6} />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow transition-all">تأكيد الكود</button>
                      <button type="button" onClick={() => setPhoneStep('input')} className="w-full text-brand-muted text-xs hover:text-white transition-colors">تعديل الرقم</button>
                    </form>
                  )}
                </div>
              )}

              <div className="relative my-8 text-center">
                <hr className="border-white/5" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-card px-4 text-[10px] text-brand-muted font-bold uppercase tracking-widest">أو</span>
              </div>

              <button onClick={handleGoogleLogin} disabled={isSubmitting} className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin text-gray-400" /> : <><GoogleIcon /> الدخول بحساب Google</>}
              </button>
            </>
          ) : (
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-white text-center">استعادة كلمة المرور</h3>
               <p className="text-sm text-brand-muted text-center">أدخل بريدك الإلكتروني لنرسل لك رابط الاستعادة</p>
               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-brand-main border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="example@mail.com" />
               <button className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow">إرسال الرابط</button>
               <button onClick={() => setView('login')} className="w-full text-brand-muted text-xs hover:text-white flex items-center justify-center gap-2"><ArrowLeft size={14} /> العودة للدخول</button>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <p className="text-brand-muted text-sm">ليس لديك حساب؟ <Link to="/signup" className="text-brand-gold font-bold hover:underline">سجل الآن</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
