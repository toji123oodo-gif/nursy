
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Cloud, Loader2, AlertCircle, ArrowRight, Check, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, signup, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, formData.name, formData.phone);
      // Immediate navigation
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('البريد الإلكتروني مسجل بالفعل.');
      else if (err.code === 'auth/weak-password') setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      else setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
         <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-right">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">إنشاء حساب جديد</h2>
               <p className="text-sm text-gray-500 mt-2">ابدأ رحلتك التعليمية مع NursyPlatform اليوم.</p>
            </div>

            {error && (
               <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                  <span>{error}</span>
               </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">الاسم بالكامل</label>
                  <input 
                     type="text" 
                     className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                     placeholder="محمد أحمد"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     required
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                     <input 
                        type="email" 
                        className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                        placeholder="example@edu.eg"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                     <input 
                        type="tel" 
                        className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                        placeholder="01xxxxxxxxx"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        required
                     />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                  <input 
                     type="password" 
                     className="w-full bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#333] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F38020] focus:ring-1 focus:ring-[#F38020] transition-all"
                     placeholder="على الأقل 8 أحرف"
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     required
                  />
               </div>

               <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-lg flex gap-3 items-start">
                  <div className="mt-0.5 text-green-500"><ShieldCheck size={16} /></div>
                  <p className="text-xs text-gray-500 leading-tight">
                     بإنشاء حساب، أنت توافق على شروط الخدمة وسياسة الخصوصية. بياناتك مشفرة بالكامل.
                  </p>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:opacity-90 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
               >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'إنشاء الحساب'} 
                  {!isLoading && <ArrowRight size={16} className="rotate-180" />}
               </button>
            </form>

            <p className="text-center text-sm text-gray-500">
               لديك حساب بالفعل؟ <Link to="/login" className="text-[#F38020] font-medium hover:underline">تسجيل الدخول</Link>
            </p>
         </div>
      </div>

      {/* Left Side - Visual (On right for Signup to alternate) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F38020] relative flex-col justify-between p-12 text-white overflow-hidden order-1 lg:order-2">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-40"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-[#F38020]/90 to-black/60"></div>
         
         <div className="relative z-10 flex justify-end">
            <div className="flex items-center gap-2 text-white/80">
               <Cloud size={24} strokeWidth={2.5} />
               <span className="font-bold text-xl tracking-tight">NursyPlatform</span>
            </div>
         </div>

         <div className="relative z-10 max-w-lg ml-auto text-right">
            <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
               ابدأ مسيرتك المهنية <br/> في التمريض من هنا.
            </h1>
            <ul className="space-y-4 text-white/90 text-lg mb-8 inline-block text-right w-full">
               <li className="flex items-center justify-end gap-3">
                  <span>مناهج معتمدة رسمياً</span> <Check size={20} className="text-white" />
               </li>
               <li className="flex items-center justify-end gap-3">
                  <span>تحليل فيديو بالذكاء الاصطناعي</span> <Check size={20} className="text-white" />
               </li>
               <li className="flex items-center justify-end gap-3">
                  <span>شهادات موثقة</span> <Check size={20} className="text-white" />
               </li>
            </ul>
         </div>
      </div>
    </div>
  );
};
