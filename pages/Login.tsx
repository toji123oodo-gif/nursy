import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../src/firebase';

type PhoneStep = 'input' | 'otp';

export const Login: React.FC = () => {
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | any>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginWithPhoneMock } = useApp();
  const navigate = useNavigate();

  // Phone Auth Functions
  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => { }
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

    // MOCK MODE
    if (!auth) {
      console.log("Mock Mode: Sending OTP to", phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
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

    // REAL MODE
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
      } else {
        setError('حدث خطأ في إرسال الرمز. تأكد من الرقم وحاول مجدداً.');
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
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm font-bold animate-fade-in mb-6 relative z-10">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

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

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}