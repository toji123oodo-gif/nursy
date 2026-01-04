
import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Loader2, Cloud, AlertCircle, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const { login, signup, loginWithGoogle } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name, phone);
      }
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مسجل بالفعل');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)');
      } else {
        setError('حدث خطأ غير متوقع، حاول مرة أخرى');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('تم إلغاء تسجيل الدخول');
      } else if (err.code === 'auth/unauthorized-domain') {
        // Smart domain suggestion for Cloudflare Pages
        const host = window.location.hostname;
        let suggestion = host;
        if (host.includes('.pages.dev')) {
           const parts = host.split('.');
           // If subdomain is like hash.project.pages.dev, grab project.pages.dev
           if (parts.length >= 3) {
             suggestion = parts.slice(-3).join('.');
           }
        }
        setError(`خطأ: الدومين غير مصرح به.\nالحل: اذهب إلى Firebase Console > Auth > Settings > Authorized Domains وأضف هذا الدومين: ${suggestion}`);
      } else {
        setError('فشل الاتصال بجوجل. تأكد من إعدادات Firebase واتصال الإنترنت.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#333] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with toggle */}
        <div className="relative p-6 pb-0">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-50 dark:bg-[#2C2C2C] p-1 rounded-full"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#F38020] rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
               <Cloud size={24} strokeWidth={2.5} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">NursyPlatform</h2>
               <p className="text-xs text-gray-500">بوابتك للتعليم الطبي المتطور</p>
            </div>
          </div>

          <div className="flex bg-gray-100 dark:bg-[#252525] p-1 rounded-lg mb-6">
            <button
              onClick={() => { setView('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                view === 'login' 
                ? 'bg-white dark:bg-[#333] text-[#F38020] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              تسجيل دخول
            </button>
            <button
              onClick={() => { setView('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                view === 'signup' 
                ? 'bg-white dark:bg-[#333] text-[#F38020] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              إنشاء حساب
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-0">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-start gap-3">
               <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
               <div className="flex flex-col gap-1">
                 <p className="text-xs text-red-700 dark:text-red-300 font-medium whitespace-pre-wrap">{error}</p>
                 {error.includes('Settings') && (
                   <div className="flex items-center gap-1 mt-1 p-1 bg-white/50 rounded border border-red-100 text-[10px] font-mono select-all">
                     <Globe size={10} />
                     {window.location.hostname.includes('.pages.dev') 
                       ? window.location.hostname.split('.').slice(-3).join('.') 
                       : window.location.hostname}
                   </div>
                 )}
               </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">الاسم</label>
                    <div className="relative">
                       <User size={14} className="absolute left-3 top-3 text-gray-400" />
                       <input 
                         type="text" 
                         required 
                         className="cf-input pl-9" 
                         placeholder="الاسم كامل"
                         value={name}
                         onChange={e => setName(e.target.value)}
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">الهاتف</label>
                    <div className="relative">
                       <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                       <input 
                         type="tel" 
                         required 
                         className="cf-input pl-9" 
                         placeholder="01xxxxxxxxx"
                         value={phone}
                         onChange={e => setPhone(e.target.value)}
                       />
                    </div>
                 </div>
              </div>
            )}

            <div className="space-y-1">
               <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
               <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="email" 
                    required 
                    className="cf-input pl-9" 
                    placeholder="example@student.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">كلمة المرور</label>
               <div className="relative">
                  <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="password" 
                    required 
                    className="cf-input pl-9" 
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
               </div>
               {view === 'login' && (
                 <div className="text-right">
                   <button type="button" className="text-[10px] text-[#0051C3] dark:text-[#68b5fb] hover:underline">
                     نسيت كلمة المرور؟
                   </button>
                 </div>
               )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary py-2.5 rounded-lg text-sm shadow-md shadow-orange-500/10 mt-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (view === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#333]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#1E1E1E] px-2 text-gray-500">أو المتابعة باستخدام</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full btn-secondary py-2.5 rounded-lg justify-center border-gray-200 hover:bg-gray-50 dark:border-[#333] dark:hover:bg-[#252525]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                  Google Account
                </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-6">
             محمي بواسطة reCAPTCHA وتطبق سياسة الخصوصية وشروط الخدمة من Google.
          </p>
        </div>
      </div>
    </div>
  );
};
