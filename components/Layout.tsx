
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM as any;
import { 
  Home, Heart, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, Bell, Languages, 
  ShieldCheck, Zap, Settings, UserCircle, Search, 
  Menu, X, Calendar, Star, Sparkles, ChevronDown, Award,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, logout, setExamHubOpen, language, toggleLanguage } = useApp();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const t = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    dashboard: language === 'ar' ? 'المواد' : 'Courses',
    community: language === 'ar' ? 'المجتمع' : 'Community',
    support: language === 'ar' ? 'ادعمنا' : 'Support Us',
    profile: language === 'ar' ? 'حسابي' : 'Profile',
    certificates: language === 'ar' ? 'شهاداتي' : 'My Certificates',
    search: language === 'ar' ? 'ابحث...' : 'Search...'
  };

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main overflow-x-hidden">
      
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-4' : 'py-4 md:py-8'}`}>
        <div className="container mx-auto px-4">
          <div className={`mx-auto max-w-7xl px-4 md:px-8 py-2 md:py-3 rounded-full border transition-all duration-500 flex items-center justify-between gap-2 md:gap-4 ${
            isScrolled ? 'bg-brand-main/80 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-brand-main/40 backdrop-blur-md border-white/5'
          }`}>
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-brand-gold p-1.5 md:p-2 rounded-xl ns-shadow--glow group-hover:rotate-12 transition-all">
                <GraduationCap className="text-brand-main h-4 w-4 md:h-6 md:w-6" />
              </div>
              <h1 className="font-black text-lg md:text-2xl text-white tracking-tighter">Nursy</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                <Link to="/" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isActive('/') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-white'}`}>{t.home}</Link>
                {user && <Link to="/dashboard" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isActive('/dashboard') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-white'}`}>{t.dashboard}</Link>}
                <Link to="/community" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isActive('/community') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-white'}`}>{t.community}</Link>
                <Link to="/wallet" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isActive('/wallet') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-white'}`}>{t.support}</Link>
            </nav>

            <div className="flex items-center gap-2">
               <button onClick={() => setIsNotificationsOpen(true)} className="p-2 rounded-full bg-white/5 text-brand-muted hover:text-brand-gold transition-all relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
               </button>

               {user ? (
                 <div className="relative flex items-center gap-2" ref={dropdownRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-0.5 rounded-full bg-white/5 border border-white/10 transition-all hover:border-brand-gold/50">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-main font-black">
                          {(user.name || 'U').charAt(0)}
                       </div>
                       <ChevronDown size={14} className={`text-brand-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileOpen && (
                      <div className="absolute top-full mt-4 left-0 md:left-auto md:right-0 w-64 bg-brand-card/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl p-3 ns-animate--scale-up z-[200]">
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
                           <UserCircle size={16} /> {t.profile}
                        </Link>
                        <Link to="/certificates" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
                           <Award size={16} /> {t.certificates}
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold mt-2">
                           <LogOut size={16} /> خروج
                        </button>
                      </div>
                    )}
                 </div>
               ) : (
                 <Link to="/login" className="px-5 py-2 rounded-full bg-brand-gold text-brand-main font-black text-xs ns-shadow--glow">دخول</Link>
               )}
            </div>
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-lg">
         <div className="bg-brand-card/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-2 flex items-center justify-around">
            <Link to="/" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted'}`}>
               <Home size={20} />
               <span className="text-[8px] font-black uppercase">{t.home}</span>
            </Link>
            <Link to="/dashboard" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/dashboard') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted'}`}>
               <LayoutDashboard size={20} />
               <span className="text-[8px] font-black uppercase">{t.dashboard}</span>
            </Link>
            <Link to="/community" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/community') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted'}`}>
               <MessageSquare size={20} />
               <span className="text-[8px] font-black uppercase">{t.community}</span>
            </Link>
            <button onClick={() => setExamHubOpen(true)} className="flex flex-col items-center gap-1 p-3 rounded-2xl text-brand-muted">
               <Calendar size={20} />
               <span className="text-[8px] font-black uppercase">الجدول</span>
            </button>
            <Link to="/profile" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/profile') ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted'}`}>
               <UserIcon size={20} />
               <span className="text-[8px] font-black uppercase">{t.profile}</span>
            </Link>
         </div>
      </div>

      <main className="flex-1 pt-24 pb-32 md:pb-12">
         {children}
      </main>
    </div>
  );
};
