
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate } = ReactRouterDOM as any;
import { Cloud, Loader2, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        await signup(formData.email, formData.password, formData.name, formData.phone);
        navigate('/dashboard');
    } catch (err: any) {
        setError('Could not create account. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#101010] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
           <div className="inline-flex items-center gap-2 mb-4 text-[#F38020]">
              <Cloud size={32} strokeWidth={2} />
           </div>
           <h2 className="text-2xl font-bold text-main tracking-tight">Create your account</h2>
           <p className="text-sm text-muted mt-2">Start your learning journey with NursyPlatform.</p>
        </div>

        <div className="cf-card p-8 bg-white dark:bg-[#1E1E1E] shadow-md">
           {error && (
             <div className="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-3 rounded-[4px] flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</p>
             </div>
           )}

           <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-main">Full Name</label>
                 <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="cf-input" placeholder="John Doe" />
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-main">Phone Number</label>
                 <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="cf-input" placeholder="01xxxxxxxxx" />
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-main">Email Address</label>
                 <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="cf-input" placeholder="student@example.com" />
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-main">Password</label>
                 <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="cf-input" placeholder="Min. 8 characters" />
              </div>

              <div className="text-[11px] text-muted flex items-start gap-2 pt-2">
                 <div className="mt-0.5"><Check size={12} className="text-green-500" /></div>
                 <p>By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.</p>
              </div>

              <button type="submit" disabled={isLoading} className="w-full btn-primary py-2 text-sm justify-center mt-4">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Sign Up'}
              </button>
           </form>
        </div>

        <p className="text-center text-xs text-muted">
          Already have an account? <Link to="/login" className="text-[#0051C3] dark:text-[#68b5fb] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
