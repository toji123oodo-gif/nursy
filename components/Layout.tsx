
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM as any;
import { 
  Home, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, Bell, 
  Settings, Search, Menu, X, Calendar, 
  Sparkles, ChevronDown, Award,
  MessageSquare, Zap, Target, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, logout, setExamHubOpen, language } = useApp();

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

  const navLinks = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/dashboard', label: 'المذاكرة', icon: LayoutDashboard, protected: true },
    { path: '/community', label: 'المجتمع', icon: MessageSquare },
    { path: '/wallet', label: 'الدعم', icon: Zap, protected: true },
  ];

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main overflow-x-hidden">
      
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      {/* --- Desktop Header --- */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-4 md:px-8 ${isScrolled ? 'pt-4' : 'pt-8'}`}>
        <div className={`container mx-auto max-w-7xl h-20 rounded-[2rem] border transition-all duration-700 flex items-center justify-between px-8 shadow-2xl ${
          isScrolled 
          ? 'bg-brand-card/80 backdrop-blur-2xl border-white/10' 
          : 'bg-brand-card/20 backdrop-blur-md border-white/5'
        }`}>
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-brand-gold w-10 h-10 md:w-12 md:h-12 rounded-2xl ns-shadow--glow flex items-center justify-center group-hover:rotate-[15deg] transition-all duration-500">
              <GraduationCap className="text-brand-main h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <h1 className="font-black text-xl md:text-2xl text-white tracking-tighter leading-none">Nursy</h1>
               <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em]">Nursing Hub</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {navLinks.map((link) => (
                (!link.protected || user) && (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`relative px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-500 flex items-center gap-2 group ${
                      isActive(link.path) 
                      ? 'text-brand-gold bg-brand-gold/5' 
                      : 'text-brand-muted hover:text-white'
                    }`}
                  >
                    <link.icon size={16} className={isActive(link.path) ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                    {link.label}
                    {isActive(link.path) && (
                      <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-brand-gold shadow-glow rounded-full"></div>
                    )}
                  </Link>
                )
              ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-4">
             <div className="hidden md:flex relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="ابحث عن محاضرة..." 
                  className="bg-white/5 border border-white/5 rounded-xl pr-10 pl-4 py-2 text-[10px] font-bold text-white outline-none focus:border-brand-gold/50 w-40 focus:w-60 transition-all"
                />
             </div>

             <button 
               onClick={() => setIsNotificationsOpen(true)} 
               className="p-3 rounded-xl bg-white/5 text-brand-muted hover:text-brand-gold transition-all relative border border-white/5"
             >
               <Bell size={18} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-card"></span>
             </button>

             {user ? (
               <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                    className={`flex items-center gap-3 p-1 rounded-2xl transition-all duration-500 border ${
                      isProfileOpen ? 'bg-brand-gold/10 border-brand-gold/50' : 'bg-white/5 border-white/10'
                    }`}
                  >
                     <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center text-brand-main font-black shadow-glow">
                        {(user.name || 'U').charAt(0)}
                     </div>
                     <div className="hidden xl:flex flex-col text-right ml-2">
                        <span className="text-[10px] font-black text-white leading-none mb-1">{user.name.split(' ')[0]}</span>
                        <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest">Level {user.level || 1}</span>
                     </div>
                     <ChevronDown size={14} className={`text-brand-muted mr-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full mt-4 left-0 md:left-auto md:right-0 w-72 bg-brand-card/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-4 ns-animate--scale-up z-[200]">
                      <div className="p-4 bg-white/5 rounded-2xl mb-4">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-brand-muted uppercase">التقدم الدراسي</span>
                            <span className="text-[9px] font-black text-brand-gold">{user.xp || 0} XP</span>
                         </div>
                         <div className="h-1.5 bg-brand-main rounded-full overflow-hidden">
                            <div className="h-full bg-brand-gold shadow-glow" style={{ width: `${(user.xp % 500) / 5}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-1">
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-brand-muted hover:text-white hover:bg-brand-gold/10 transition-all text-xs font-bold">
                           <UserIcon size={16} className="text-brand-gold" /> حسابي الشخصي
                        </Link>
                        <Link to="/certificates" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-brand-muted hover:text-white hover:bg-brand-gold/10 transition-all text-xs font-bold">
                           <Award size={16} className="text-brand-gold" /> شهاداتي المعتمدة
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-brand-muted hover:text-white hover:bg-brand-gold/10 transition-all text-xs font-bold">
                             <Settings size={16} className="text-brand-gold" /> لوحة الإدارة
                          </Link>
                        )}
                        <div className="h-px bg-white/5 my-2"></div>
                        <button onClick={logout} className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold">
                           <LogOut size={16} /> تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  )}
               </div>
             ) : (
               <Link to="/login" className="px-8 py-3 rounded-2xl bg-brand-gold text-brand-main font-black text-xs ns-shadow--glow hover:scale-105 transition-all">دخول</Link>
             )}
          </div>
        </div>
      </header>

      {/* --- Mobile Floating Navigation --- */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[150] px-4">
         <div className="bg-brand-card/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex items-center justify-around relative">
            
            <Link to="/" className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-500 ${isActive('/') ? 'text-brand-gold' : 'text-brand-muted opacity-50'}`}>
               <Home size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
               <span className="text-[7px] font-black uppercase tracking-widest">الرئيسية</span>
            </Link>

            <Link to="/community" className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-500 ${isActive('/community') ? 'text-brand-gold' : 'text-brand-muted opacity-50'}`}>
               <MessageSquare size={22} strokeWidth={isActive('/community') ? 2.5 : 2} />
               <span className="text-[7px] font-black uppercase tracking-widest">المجتمع</span>
            </Link>

            {/* Central Main Action Button */}
            <Link to="/dashboard" className="relative -mt-12 group">
               <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all duration-500 transform group-active:scale-90 ${
                 isActive('/dashboard') ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-brand-main border-4 border-brand-card text-brand-gold'
               }`}>
                  <BookOpen size={28} strokeWidth={2.5} />
               </div>
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[7px] font-black text-white uppercase tracking-widest opacity-80">مذاكرة</div>
               <div className="absolute inset-0 bg-brand-gold rounded-[1.8rem] animate-ping opacity-20 group-active:hidden"></div>
            </Link>

            <button onClick={() => setExamHubOpen(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-brand-muted opacity-50">
               <Calendar size={22} strokeWidth={2} />
               <span className="text-[7px] font-black uppercase tracking-widest">الجدول</span>
            </button>

            <Link to="/profile" className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-500 ${isActive('/profile') ? 'text-brand-gold' : 'text-brand-muted opacity-50'}`}>
               <UserIcon size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
               <span className="text-[7px] font-black uppercase tracking-widest">بروفايل</span>
            </Link>

            {/* Indicator Dot for Active Route */}
            {isActive('/') && <div className="absolute bottom-1 right-[11.5%] w-1 h-1 bg-brand-gold rounded-full shadow-glow"></div>}
            {isActive('/community') && <div className="absolute bottom-1 right-[31.5%] w-1 h-1 bg-brand-gold rounded-full shadow-glow"></div>}
            {isActive('/profile') && <div className="absolute bottom-1 left-[11.5%] w-1 h-1 bg-brand-gold rounded-full shadow-glow"></div>}
         </div>
      </div>

      <main className="flex-1 pt-32 pb-36 lg:pb-12">
         {children}
      </main>
    </div>
  );
};
