
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Cloud, Loader2, AlertCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login, loginWithGoogle, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      // Force immediate navigation to avoid waiting for state updates
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. تأكد من الاتصال بالإنترنت.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
     try {
        setIsLoading(true);
        await loginWithGoogle();
        navigate('/dashboard', { replace: true });
     } catch (e: any) {
        if (e.code === 'auth/unauthorized-domain') {
           setError(`الدومين غير مصرح به: ${window.location.hostname}`);
        } else {
           setError('فشل الدخول عبر جوجل');
        }
        setIsLoading(false);
     }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0a0a0a] relative">
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-200 shadow-sm hover:scale-105 transition-all"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Left Side - Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#101010] relative flex-col justify-between p-12 text-white overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2187d800273a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#F38020] mb-2">
               <Cloud size={24} strokeWidth={2.5} />
               <span className="font-bold text-xl tracking-tight text-white">NursyPlatform</span>
            </div>
         </div>

         <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight font-sans">
               طور مهاراتك الطبية <br/> بأحدث تقنيات الذكاء الاصطناعي.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-sans">
               انضم لآلاف الطلاب في مصر واستمتع بتجربة تعليمية تفاعلية مصممة خصيصاً لكليات التمريض.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(64+i)}
                     </div>
                  ))}
               </div>
               <div className="text-sm">
                  <span className="block font-bold">4.9/5 تقييم</span>
                  <span className="text-gray-500">من +1,200 طالب</span>
               </div>
            </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
         <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-right">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">مرحباً بعودتك</h2>
               <p className="text-sm text-gray-500 mt-2">أدخل بياناتك للدخول إلى حسابك.</p>
            </div>

            {error && (
               <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                  <span>{error}</span>
               </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                  <input 
                     type="email" 
                     className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                     placeholder="name@example.com"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     required
                  />
               </div>
               <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                     <a href="#" className="text-xs text-[#F38020] hover:underline">نسيت كلمة المرور؟</a>
                  </div>
                  <input 
                     type="password" 
                     className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                     placeholder="••••••••"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     required
                  />
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#F38020] hover:bg-[#d66e16] text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
               >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'تسجيل الدخول'} 
                  {!isLoading && <ArrowRight size={16} className="rotate-180" />}
               </button>
            </form>

            <div className="relative">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-[#333]"></div></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#0a0a0a] px-2 text-gray-500">أو</span></div>
            </div>

            <button 
               onClick={handleGoogle}
               disabled={isLoading}
               className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#202020] text-gray-700 dark:text-gray-200 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
               Google Account
            </button>

            <p className="text-center text-sm text-gray-500">
               ليس لديك حساب؟ <Link to="/signup" className="text-[#F38020] font-medium hover:underline">إنشاء حساب جديد</Link>
            </p>
         </div>
      </div>
    </div>
  );
};
