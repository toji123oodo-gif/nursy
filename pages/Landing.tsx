
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  Play, ShieldCheck, Zap, Brain, Globe, 
  ArrowRight, BarChart3, Moon, Sun, UploadCloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Landing: React.FC = () => {
  const { user, theme, toggleTheme } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-[#101010]">
      {/* Navigation */}
      <nav className="border-b border-[#E5E5E5] dark:border-[#333] sticky top-0 bg-white/80 dark:bg-[#101010]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F38020] rounded-[4px] flex items-center justify-center text-white">
                 <Brain size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight text-main">Nursy<span className="text-[#F38020]">Platform</span></span>
           </div>
           
           <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
              <a href="#features" className="hover:text-main transition-colors">Features</a>
              <a href="#solutions" className="hover:text-main transition-colors">Solutions</a>
              <a href="#pricing" className="hover:text-main transition-colors">Pricing</a>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className="p-2 text-muted hover:text-main transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {user ? (
                <Link to="/dashboard" className="btn-primary">Dashboard <ArrowRight size={14}/></Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-muted hover:text-main px-3 py-2">Log In</Link>
                  <Link to="/signup" className="btn-primary">Get Started</Link>
                </>
              )}
           </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Typography Driven */}
      <section className="pt-24 pb-20 px-6 border-b border-[#E5E5E5] dark:border-[#333]">
         <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/50 text-[#F38020] text-xs font-semibold uppercase tracking-wider">
               <Zap size={12} fill="currentColor" /> New: Community Uploads
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-main tracking-tight leading-[1.1]">
               The Operating System for <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F38020] to-orange-600">Nursing Education</span>
            </h1>
            
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
               Nursy combines advanced accredited curriculum with community-driven resources to help Egyptian nursing students master clinical skills faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
               {user ? (
                 <Link to="/dashboard" className="h-12 px-8 rounded-[4px] bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center hover:bg-black/80 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto">
                    Go to Dashboard
                 </Link>
               ) : (
                 <Link to="/signup" className="h-12 px-8 rounded-[4px] bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center hover:bg-black/80 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto">
                    Start Learning Free
                 </Link>
               )}
               <button className="h-12 px-8 rounded-[4px] border border-[#E5E5E5] dark:border-[#333] text-main font-semibold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#202020] transition-colors w-full sm:w-auto">
                  <Play size={16} className="mr-2" /> View Demo
               </button>
            </div>

            <div className="pt-12 flex items-center justify-center gap-8 grayscale opacity-50">
               {/* Mock Logos */}
               <div className="text-sm font-bold text-[#333] dark:text-[#666]">CAIRO UNIV</div>
               <div className="text-sm font-bold text-[#333] dark:text-[#666]">ALEX MED</div>
               <div className="text-sm font-bold text-[#333] dark:text-[#666]">AIN SHAMS</div>
               <div className="text-sm font-bold text-[#333] dark:text-[#666]">MANSOURA</div>
            </div>
         </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6 bg-[#FAFAFA] dark:bg-[#161616]" id="features">
         <div className="max-w-6xl mx-auto">
            <div className="mb-16">
               <h2 className="text-3xl font-bold text-main mb-4">Enterprise-grade learning tools</h2>
               <p className="text-muted text-lg">Everything you need to succeed in your clinical studies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Main Card - Student Contributions */}
               <div className="md:col-span-2 cf-card p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
                  <div className="relative z-10 max-w-md">
                     <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-[#0051C3] rounded-[4px] flex items-center justify-center mb-4">
                        <UploadCloud size={20} />
                     </div>
                     <h3 className="text-xl font-bold text-main mb-2">Student Contributions Center</h3>
                     <p className="text-muted">Share and discover notes, summaries, and helpful videos from your peers. A complete repository built by students, for students.</p>
                  </div>
                  <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none"></div>
               </div>

               {/* Secondary Card */}
               <div className="cf-card p-8 min-h-[300px]">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-[#F38020] rounded-[4px] flex items-center justify-center mb-4">
                     <Globe size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-main mb-2">Community Hub</h3>
                  <p className="text-muted mb-6">Connect with peers across Egypt. Share resources, ask TAs, and collaborate in real-time.</p>
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-[#1E1E1E]"></div>
                     ))}
                     <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center text-[10px] font-bold text-muted">+1k</div>
                  </div>
               </div>

               {/* Third Card */}
               <div className="cf-card p-8">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-[4px] flex items-center justify-center mb-4">
                     <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-main mb-2">Verified Certificates</h3>
                  <p className="text-muted">Earn blockchain-verified certificates for every completed course. Export directly to LinkedIn.</p>
               </div>

               {/* Fourth Card */}
               <div className="md:col-span-2 cf-card p-8 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-bold text-main mb-2">Analytics & Insights</h3>
                     <p className="text-muted max-w-lg">Track your learning velocity, quiz performance, and identifying knowledge gaps with precision.</p>
                  </div>
                  <div className="hidden md:block text-[#F38020]">
                     <BarChart3 size={48} strokeWidth={1} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101010] border-t border-[#E5E5E5] dark:border-[#333] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
               <h4 className="font-bold text-main mb-4">Platform</h4>
               <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-main">Browse Courses</a></li>
                  <li><a href="#" className="hover:text-main">Contributions</a></li>
                  <li><a href="#" className="hover:text-main">Flashcards</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-main mb-4">Resources</h4>
               <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-main">Documentation</a></li>
                  <li><a href="#" className="hover:text-main">Help Center</a></li>
                  <li><a href="#" className="hover:text-main">Community</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-main mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-main">About Us</a></li>
                  <li><a href="#" className="hover:text-main">Careers</a></li>
                  <li><a href="#" className="hover:text-main">Legal</a></li>
               </ul>
            </div>
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#F38020] rounded-[2px]"></div>
                  <span className="font-bold text-main">Nursy</span>
               </div>
               <p className="text-xs text-muted">© 2024 Nursy Inc.<br/>All rights reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
