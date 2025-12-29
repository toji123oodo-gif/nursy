import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('nursy_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(email, password);
    
    if (success) {
      if (rememberMe) {
        localStorage.setItem('nursy_remembered_email', email);
      } else {
        localStorage.removeItem('nursy_remembered_email');
      }
      navigate('/dashboard');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
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
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-white mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-white/20"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-brand-muted/30 bg-brand-main text-brand-gold focus:ring-brand-gold focus:ring-offset-0 accent-brand-gold cursor-pointer"
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
              {isSubmitting ? 'جاري التحميل...' : (
                <>
                  <span>دخول</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-brand-muted text-sm">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="text-brand-gold font-bold hover:underline">
                أنشئ حساب جديد
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-brand-muted/50">
            <p>حسابات التجربة:</p>
            <p>مجاني: free@nursy.com / 123456</p>
            <p>مشترك: pro@nursy.com / 123456</p>
        </div>
      </div>
    </div>
  );
};