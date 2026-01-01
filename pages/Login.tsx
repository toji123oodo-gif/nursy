
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, Smartphone, Mail, Unlock, Loader2, Sparkles, Send, Info, CheckCircle2, Eye, EyeOff, ChevronRight, KeyRound, ArrowLeft, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, sendPasswordResetEmail } from 'firebase/auth';
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

const ButtonLoader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <div className="relative flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-brand-main/20 rounded-full"></div>
        <div className="absolute w-5 h-5 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
    </div>
    <span className="animate-pulse font-black text-sm tracking-tight">{label}</span>
  </div>
);

type LoginView = 'login' | 'forgot-password';
type LoginMethod = 'email' | 'phone';
type PhoneStep = 'input' | 'otp';

export const Login: React.FC = () => {
  const [view, setView] = useState<LoginView>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);
  const [error, setError] = useState<{ message: string; isTechnical?: boolean }>({ message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, loginWithGoogle } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setError({ message: '' });
  }, [loginMethod, view]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ message: '' });
    if (!email.includes('@')) {
        setError({ message: 'يرجى إدخال بريد إلكتروني صحيح' });
        return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      setIsSuccess(true);
      // Fast transition: 600ms is perfect for feedback without waiting
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      setError({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError({ message: 'يرجى إدخال البريد الإلكتروني أولاً' });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setError({ message: 'فشل إرسال رابط استعادة كلمة المرور' });
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError({ message: '' });
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError({ message: 'فشل تسجيل الدخول باستخدام جوجل.' });
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
    setError({ message: '' });
    if (!phoneNumber || phoneNumber.length < 10) {
      setError({ message: 'يرجى إدخال رقم هاتف صحيح' });
      return;
    }
    setIsSubmitting(true);
    setupRecaptcha();
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+20${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setPhoneStep('otp');
      setIsSubmitting(false);
    } catch (err: any) {
      setError({ message: 'حدث خطأ في إرسال الرمز.' });
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ message: '' });
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(otpCode);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      setError({ message: 'كود التحقق غير صحيح.' });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
      return (
          <div className="min-h-[90vh] flex items-center justify-center p-6 bg-brand-main">
              <div className="bg-brand-card border border-brand-gold/20 p-12 rounded-[3.5rem] text-center animate-scale-up shadow-[0_0_100px_rgba(251,191,36,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gold/5 animate-pulse"></div>
                  <div className="relative z-10">
                      <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-green-500 shadow-glow animate-bounce-slow">
                          <CheckCircle2 size={56} className="animate-pulse" />
                      </div>
                      <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">مرحباً بك مجدداً!</h2>
                      <p className="text-brand-muted text-lg flex items-center justify-center gap-2">
                         <Zap size={18} className="text-brand-gold" /> جاري فتح مساحة العمل...
                      </p>
                      <div className="mt-10 flex justify-center">
                          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-gold animate-[shimmer_0.6s_infinite] w-full origin-right"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-lg relative z-10 py-10">
        <div className="text-center mb-12 animate-fade-in">
           <Link to="/" className="relative inline-block mb-8 group">
             <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
             <div className="relative bg-gradient-to-br from-brand-gold to-yellow-600 p-6 rounded-[2.5rem] shadow-glow transform group-hover:scale-110 transition-all duration-500">
               <GraduationCap size={48} className="text-brand-main" strokeWidth={2.5} />
             </div>
             <div className="absolute -top-3 -right-3 bg-brand-main border border-brand-gold/30 p-2 rounded-xl text-brand-gold shadow-lg animate-bounce-slow">
                <Sparkles size={18} />
             </div>
           </Link>
           <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">
             {view === 'login' ? (
                <>سجل دخولك<span className="text-brand-gold">.</span></>
             ) : (
                <>استعادة الحساب<span className="text-brand-gold">.</span></>
             )}
           </h1>
           <p className="text-brand-muted font-medium text-lg">
             {view === 'login' ? 'رحلتك نحو التميز في التمريض تبدأ هنا' : 'أدخل بريدك الإلكتروني لنرسل لك رابط الاستعادة'}
           </p>
        </div>

        <div className="bg-brand-card/70 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 blur-[80px] pointer-events-none opacity-40"></div>
          
          {view === 'login' ? (
            <>
              {/* Refined Tab Switcher */}
              <div className="relative flex bg-brand-main/40 p-1.5 rounded-[2.2rem] mb-12 border border-white/5 shadow-inner ring-1 ring-white/5 overflow-hidden">
                {/* Active Highlight Slider */}
                <div 
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-gold rounded-[2rem] shadow-[0_4px_20px_rgba(251,191,36,0.3)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${loginMethod === 'phone' ? 'translate-x-[-100%]' : 'translate-x-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]"></div>
                </div>
                
                <button
                  onClick={() => !isSubmitting && setLoginMethod('email')}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] text-sm font-black transition-all duration-500 ${
                    loginMethod === 'email' ? 'text-brand-main' : 'text-brand-muted hover:text-white'
                  }`}
                >
                  <Mail size={18} className={`${loginMethod === 'email' ? 'scale-110' : ''} transition-transform`} />
                  البريد الإلكتروني
                </button>
                <button
                  onClick={() => !isSubmitting && setLoginMethod('phone')}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] text-sm font-black transition-all duration-500 ${
                    loginMethod === 'phone' ? 'text-brand-main' : 'text-brand-muted hover:text-white'
                  }`}
                >
                  <Smartphone size={18} className={`${loginMethod === 'phone' ? 'scale-110' : ''} transition-transform`} />
                  رقم الهاتف
                </button>
              </div>

              {error.message && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-xs font-bold animate-shake mb-8 flex items-start gap-4">
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="leading-relaxed">{error.message}</span>
                </div>
              )}

              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-8 animate-fade-in">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">البريد الإلكتروني</label>
                    <div className="relative group">
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input
                            type="email"
                            required
                            autoFocus
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if(error.message) setError({message:''}); }}
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-14 py-5 text-white text-base focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 outline-none transition-all duration-300"
                            placeholder="example@mail.com"
                            disabled={isSubmitting}
                        />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="block text-[11px] font-black text-brand-muted uppercase tracking-[0.2em]">كلمة المرور</label>
                      <button 
                        type="button" 
                        onClick={() => setView('forgot-password')}
                        className="text-[10px] font-black text-brand-gold hover:text-white transition-colors uppercase tracking-widest"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                    <div className="relative group">
                        <Unlock className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if(error.message) setError({message:''}); }}
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-14 py-5 text-white text-base focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 outline-none transition-all duration-300"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative ${isSubmitting ? 'opacity-90 cursor-wait' : 'hover:scale-[1.01] active:scale-95'}`}
                  >
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    {isSubmitting ? (
                       <ButtonLoader label="جاري الدخول..." />
                    ) : (
                      <>
                        <span className="text-xl">دخول فوري</span>
                        <LogIn size={24} strokeWidth={3} className="group-hover:translate-x-[-4px] transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {loginMethod === 'phone' && (
                <div className="space-y-8 animate-fade-in">
                  {phoneStep === 'input' ? (
                    <form onSubmit={requestOtp} className="space-y-10">
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">رقم الهاتف</label>
                        <div className="relative group" dir="ltr">
                          <input
                            type="tel"
                            required
                            autoFocus
                            value={phoneNumber}
                            onChange={(e) => { setPhoneNumber(e.target.value); if(error.message) setError({message:''}); }}
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-6 py-5 pl-24 text-white text-3xl font-mono font-black tracking-widest focus:border-brand-gold outline-none transition-all shadow-inner"
                            placeholder="10XXXXXXXX"
                            disabled={isSubmitting}
                          />
                          <div className="absolute top-0 left-0 h-full px-6 flex items-center bg-white/5 border-r border-white/10 rounded-l-2xl">
                             <span className="text-brand-gold font-black text-lg">+20</span>
                          </div>
                        </div>
                      </div>
                      <div id="recaptcha-container" className="flex justify-center"></div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative ${isSubmitting ? 'opacity-90 cursor-wait' : 'hover:scale-[1.01] active:scale-95'}`}
                      >
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        {isSubmitting ? <ButtonLoader label="طلب الكود..." /> : (
                            <>
                                <span className="text-xl">إرسال كود التحقق</span>
                                <Send size={24} strokeWidth={3} className="rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                            </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={verifyOtp} className="space-y-10">
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/30">
                            <KeyRound size={14} className="text-brand-gold" />
                            <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">تحقق من الرسائل القصيرة</span>
                        </div>
                        <input
                          type="text"
                          required
                          autoFocus
                          value={otpCode}
                          onChange={(e) => { setOtpCode(e.target.value); if(error.message) setError({message:''}); }}
                          className="w-full bg-brand-main border-2 border-brand-gold/40 rounded-[2.5rem] px-4 py-8 text-center text-white text-5xl font-mono font-black tracking-[0.3em] focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all shadow-glow"
                          placeholder="------"
                          maxLength={6}
                          disabled={isSubmitting}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={`w-full bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative ${isSubmitting ? 'opacity-90 cursor-wait' : 'hover:scale-[1.01] active:scale-95'}`}
                      >
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        {isSubmitting ? <ButtonLoader label="جاري التحقق..." /> : <span className="text-xl">تأكيد ودخول</span>}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => !isSubmitting && setPhoneStep('input')} 
                        className="w-full text-brand-muted text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-2 group"
                      >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> تعديل رقم الهاتف
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-6 bg-brand-card text-brand-muted font-black text-[11px] uppercase tracking-[0.3em]">أو</span></div>
              </div>

              <button 
                onClick={handleGoogleLogin} 
                disabled={isSubmitting} 
                className={`w-full bg-white text-gray-900 font-black py-5 rounded-[1.8rem] flex items-center justify-center gap-4 shadow-xl hover:bg-gray-50 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 ${isSubmitting ? 'cursor-wait' : ''}`}
              >
                {isSubmitting ? <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div> : <><GoogleIcon /><span className="text-base">Google Account</span></>}
              </button>
            </>
          ) : (
            /* Forgot Password View */
            <div className="animate-fade-in space-y-10">
               {resetSent ? (
                 <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-gold shadow-glow">
                        <Mail size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white">تحقق من بريدك!</h3>
                    <p className="text-brand-muted leading-relaxed">أرسلنا لك رابطاً لاستعادة كلمة المرور.</p>
                    <button 
                      onClick={() => { setView('login'); setResetSent(false); }}
                      className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      العودة لتسجيل الدخول
                    </button>
                 </div>
               ) : (
                 <form onSubmit={handleForgotPassword} className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[11px] font-black text-brand-muted uppercase tracking-[0.2em] mr-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-brand-main/40 border border-white/10 rounded-2xl px-6 py-5 text-white text-base focus:border-brand-gold outline-none transition-all shadow-inner"
                            placeholder="example@mail.com"
                        />
                    </div>
                    {error.message && <p className="text-red-400 text-xs font-bold text-center">{error.message}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative ${isSubmitting ? 'opacity-90 cursor-wait' : 'hover:scale-[1.01] active:scale-95'}`}
                    >
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        {isSubmitting ? <ButtonLoader label="جاري الإرسال..." /> : <span className="text-xl">إرسال رابط الاستعادة</span>}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setView('login')}
                      className="w-full text-brand-muted text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-2 group"
                    >
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> عد للدخول
                    </button>
                 </form>
               )}
            </div>
          )}
          
          <div className="mt-12 text-center border-t border-white/5 pt-8">
            <p className="text-brand-muted text-base font-medium">
                ليس لديك حساب؟ {' '}
                <Link to="/signup" className="text-brand-gold font-black hover:text-white transition-colors border-b-2 border-brand-gold/20 hover:border-white">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
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
