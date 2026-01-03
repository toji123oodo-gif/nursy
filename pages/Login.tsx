
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, Unlock, Loader2, Eye, EyeOff, ArrowLeft, Info, Sparkles, ChevronLeft, ShieldCheck } from 'lucide-react';
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
    <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
      setError('بيانات الدخول غير صحيحة، تأكد من كلمة المرور');
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
      setError('فشل تسجيل الدخول بواسطة جوجل');
      setIsSubmitting(false);
    }
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    }
    const formattedPhone = `+20${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    try {
      const confirmation = await auth.signInWithPhoneNumber(formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setPhoneStep('otp');
      setIsSubmitting(false);
    } catch (err: any) {
      setError('حدث خطأ في إرسال الكود، حاول مرة أخرى');
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
    <div className="min-h-screen flex items-center justify-center p-6 py-20 relative overflow-hidden bg-brand-main">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-xl relative z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
           <Link to="/" className="inline-block group mb-6">
             <div className="bg-brand-gold p-6 rounded-[2.5rem] shadow-glow group-hover:scale-110 transition-transform duration-500">
               <GraduationCap size={56} className="text-brand-main" />
             </div>
           </Link>
           <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">نيرسي</h1>
           <p className="text-brand-muted text-lg font-bold flex items-center justify-center gap-2">
             <ShieldCheck size={18} className="text-brand-gold" /> بوابة التمريض الأكاديمي في مصر
           </p>
        </div>

        {/* Login Card */}
        <div className="bg-brand-card/60 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
          {view === 'login' ? (
            <div className="space-y-10">
              
              {/* Refined Method Switcher */}
              <div className="p-1.5 bg-black/40 rounded-[2rem] border-2 border-white/5 relative flex overflow-hidden">
                <button
                  onClick={() => !isSubmitting && setLoginMethod('email')}
                  className={`flex-1 py-4.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 relative z-10 
                    ${loginMethod === 'email' ? 'text-brand-main' : 'text-brand-muted hover:text-white'}`}
                >
                  البريد الإلكتروني
                </button>
                <button
                  onClick={() => !isSubmitting && setLoginMethod('phone')}
                  className={`flex-1 py-4.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 relative z-10 
                    ${loginMethod === 'phone' ? 'text-brand-main' : 'text-brand-muted hover:text-white'}`}
                >
                  رقم الهاتف
                </button>
                
                {/* Slidder Indicator */}
                <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-gold rounded-[1.5rem] shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
                  style={{ 
                    right: loginMethod === 'email' ? '6px' : 'calc(50% + 0px)',
                    boxShadow: '0 0 15px rgba(251,191,36,0.3)'
                  }}
                ></div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-xs font-bold flex items-center gap-4 animate-shake">
                  <AlertCircle size={20} className="shrink-0" /> {error}
                </div>
              )}

              {loginMethod === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] pr-2">البريد الإلكتروني</label>
                    <div className="relative group">
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input 
                          type="email" 
                          required 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full bg-brand-main/50 border-2 border-white/5 rounded-[1.5rem] pr-16 pl-6 py-5.5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all placeholder:text-brand-muted/20" 
                          placeholder="example@mail.com" 
                          disabled={isSubmitting}
                        />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em]">كلمة المرور</label>
                      <button type="button" onClick={() => !isSubmitting && setView('forgot-password')} className="text-[10px] text-brand-gold font-black hover:underline underline-offset-4">نسيتها؟</button>
                    </div>
                    <div className="relative group">
                        <Unlock className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full bg-brand-main/50 border-2 border-white/5 rounded-[1.5rem] pr-16 pl-14 py-5.5 text-white text-lg font-bold focus:border-brand-gold/50 outline-none transition-all placeholder:text-brand-muted/20" 
                          placeholder="••••••••" 
                          disabled={isSubmitting}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Submission Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full font-black py-6 rounded-[2rem] shadow-glow transition-all duration-500 flex items-center justify-center gap-4 text-2xl tracking-tighter
                      ${isSubmitting ? 'bg-brand-gold/50 cursor-not-allowed scale-[0.98]' : 'bg-brand-gold text-brand-main hover:scale-[1.02] active:scale-95'}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-xl">جاري التحقق...</span>
                      </div>
                    ) : (
                      <>
                        <LogIn size={28} /> دخـول
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-8">
                  {phoneStep === 'input' ? (
                    <form onSubmit={requestOtp} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest pr-2">رقم الهاتف المصري</label>
                        <div className="relative group">
                          <Smartphone className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-black text-lg border-r border-white/10 pr-4 pointer-events-none">
                            +20
                          </div>
                          <input 
                            type="tel" 
                            required 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                            className="w-full bg-brand-main/50 border-2 border-white/5 rounded-[1.5rem] pr-16 pl-20 py-5.5 text-white text-xl font-black tracking-widest focus:border-brand-gold/50 outline-none transition-all" 
                            placeholder="01XXXXXXXXX" 
                            disabled={isSubmitting}
                            maxLength={11}
                          />
                        </div>
                      </div>
                      <div id="recaptcha-container" className="my-4"></div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting || phoneNumber.length < 10} 
                        className={`w-full font-black py-6 rounded-[2rem] shadow-glow transition-all duration-500 flex items-center justify-center gap-4 text-xl
                          ${isSubmitting ? 'bg-brand-gold/50 cursor-not-allowed' : 'bg-brand-gold text-brand-main hover:scale-[1.02] active:scale-95'}`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" size={24} />
                            <span>جاري إرسال الكود...</span>
                          </div>
                        ) : 'إرسال كود التحقق (SMS)'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={verifyOtp} className="space-y-10">
                      <div className="text-center space-y-6">
                        <p className="text-brand-muted font-bold text-lg">أدخل كود التحقق المكون من 6 أرقام</p>
                        <input 
                          type="text" 
                          required 
                          value={otpCode} 
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                          className="w-full bg-brand-main/40 border-2 border-brand-gold rounded-[2rem] px-4 py-8 text-center text-white text-5xl font-black tracking-[0.5em] outline-none shadow-glow transition-all" 
                          maxLength={6} 
                          autoFocus
                          disabled={isSubmitting}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting || otpCode.length < 6} 
                        className={`w-full font-black py-6 rounded-[2rem] shadow-glow transition-all duration-500 text-2xl
                          ${isSubmitting ? 'bg-brand-gold/50' : 'bg-brand-gold text-brand-main hover:scale-[1.02] active:scale-95'}`}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={28} /> : 'تأكيد ودخول'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => !isSubmitting && setPhoneStep('input')} 
                        className="w-full text-brand-muted text-sm font-black hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        تغيير الرقم؟ <ArrowLeft size={16} />
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="relative my-10 text-center">
                <hr className="border-white/5" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b1b32] px-6 text-[10px] text-brand-muted font-black uppercase tracking-[0.3em]">أو المتابعة عبر</span>
              </div>

              <button 
                onClick={handleGoogleLogin} 
                disabled={isSubmitting} 
                className="w-full bg-white text-gray-900 font-black py-5.5 rounded-[2rem] flex items-center justify-center gap-4 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 text-xl shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin text-gray-400" /> : <><GoogleIcon /> Google Account</>}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
               <div className="text-center">
                  <h3 className="text-3xl font-black text-white mb-3">نسيت كلمة المرور؟</h3>
                  <p className="text-lg text-brand-muted font-bold">أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة آمن</p>
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">البريد الإلكتروني</label>
                 <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-brand-main border-2 border-white/5 rounded-[1.5rem] px-8 py-5.5 text-white font-bold outline-none focus:border-brand-gold transition-all" 
                    placeholder="example@mail.com" 
                  />
               </div>
               <button className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow text-xl">إرسال رابط الاستعادة</button>
               <button onClick={() => setView('login')} className="w-full text-brand-muted text-sm font-black hover:text-white flex items-center justify-center gap-2"><ArrowLeft size={18} /> العودة لتسجيل الدخول</button>
            </div>
          )}
          
          <div className="mt-14 text-center pt-10 border-t border-white/5">
            <p className="text-brand-muted font-bold text-base">ليس لديك حساب في نيرسي؟</p>
            <Link to="/signup" className="text-brand-gold font-black hover:underline underline-offset-4 flex items-center justify-center gap-2 mt-4 text-lg">
              أنشئ حسابك التعليمي الآن <ChevronLeft size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
