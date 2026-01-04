
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Cloud, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import firebase from 'firebase/compat/app';
import { auth } from '../firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
     try {
        await loginWithGoogle();
        navigate('/dashboard');
     } catch (e) {
        setError('Google authentication failed.');
     }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#101010] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
           <div className="inline-flex items-center gap-2 mb-4 text-[#F38020]">
              <Cloud size={32} strokeWidth={2} />
           </div>
           <h2 className="text-2xl font-bold text-main tracking-tight">Log in to NursyPlatform</h2>
           <p className="text-sm text-muted mt-2">Access your educational resources and analytics.</p>
        </div>

        {/* Card */}
        <div className="cf-card p-8 bg-white dark:bg-[#1E1E1E] shadow-md">
           {error && (
             <div className="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-3 rounded-[4px] flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</p>
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-main">Email Address</label>
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="cf-input"
                   placeholder="student@example.com"
                 />
              </div>

              <div className="space-y-1.5">
                 <div className="flex justify-between">
                    <label className="text-xs font-semibold text-main">Password</label>
                    <a href="#" className="text-xs text-[#0051C3] dark:text-[#68b5fb] hover:underline">Forgot password?</a>
                 </div>
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="cf-input"
                   placeholder="••••••••"
                 />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary py-2 text-sm justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Log In'}
              </button>
           </form>

           <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-[#E5E5E5] dark:bg-[#333] flex-1"></div>
              <span className="text-xs text-muted">OR</span>
              <div className="h-px bg-[#E5E5E5] dark:bg-[#333] flex-1"></div>
           </div>

           <button 
             onClick={handleGoogle}
             className="w-full btn-secondary py-2 justify-center"
           >
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
             Continue with Google
           </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted">
          Don't have an account? <Link to="/signup" className="text-[#0051C3] dark:text-[#68b5fb] hover:underline">Sign up</Link>
        </p>
        
        <div className="flex justify-center gap-4 text-[10px] text-muted mt-8">
           <a href="#" className="hover:text-main">Privacy Policy</a>
           <span>•</span>
           <a href="#" className="hover:text-main">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};
