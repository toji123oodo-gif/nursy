
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Wallet, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, LogIn, 
  ShieldAlert, LifeBuoy, ChevronDown, 
  CreditCard, Calendar, Bell, Languages, ShieldCheck, Zap,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setExamHubOpen, language, toggleLanguage } = useApp();

  const isActive = (path: string) => location.pathname === path;
  
  // تحقق متطور من صلاحيات الأدمن
  const adminEmails = ['admin@nursy.com', 'toji123oodo@gmail.com'];
  const isAdmin = user && user.email && adminEmails.includes(user.email);

  const t = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    dashboard: language === 'ar' ? 'مساحة العمل' : 'Dashboard',
    wallet: language === 'ar' ? 'المحفظة' : 'Wallet',
    help: language === 'ar' ? 'المساعدة' : 'Help',
    login: language === 'ar' ? 'دخول' : 'Login',
    admin: language === 'ar' ? 'الإدارة' : 'Admin',
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label, id }: { to: string; icon: any; label: string, id?: string }) => {
    const active = isActive(to);
    return (
      <Link
        id={id}
        to={to}
        className={`relative flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 rounded-full transition-all duration-300 font-bold text-[10px] md:text-sm group shrink-0
          ${active
            ? 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20'
            : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
      >
        <Icon size={14} className={`md:size-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main">
      <header className="fixed top-0 left-0 right-0 z-[100] py-3 md:py-6">
        <div className="container mx-auto px-2 md:px-4">
          <div className={`mx-auto max-w-7xl px-3 md:px-6 py-2 rounded-full border border-white/10 flex items-center justify-between gap-2 md:gap-4 transition-all duration-500 bg-brand-main/40 backdrop-blur-2xl shadow-2xl ${
            isScrolled ? 'ring-1 ring-brand-gold/20 scale-[0.98]' : ''
          }`}>
            
            {/* Logo */}
            <Link id="nav-logo" to="/" className={`flex items-center gap-2 group shrink-0 ${language === 'ar' ? 'order-last' : 'order-first'}`}>
              <h1 className="font-black text-sm md:text-2xl text-white tracking-tighter">Nursy<span className="text-brand-gold">.</span></h1>
              <div className="bg-brand-gold p-1.5 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                  <GraduationCap className="text-brand-main h-4 w-4 md:h-6 md:w-6" />
              </div>
            </Link>

            {/* Middle Navigation */}
            <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 mx-auto overflow-x-auto no-scrollbar max-w-[50%] md:max-w-none">
                <NavLink to="/" icon={Home} label={t.home} />
                {user && <NavLink to="/dashboard" icon={LayoutDashboard} label={t.dashboard} />}
                
                {/* Refined Admin Specialized Button */}
                {isAdmin && (
                  <Link to="/admin" className="admin-access-btn group/admin">
                    <div className="admin-pulse-ring"></div>
                    <div className="admin-btn-shimmer"></div>
                    <Settings size={14} className="md:size-4 text-brand-gold group-hover/admin:rotate-90 transition-transform duration-700" />
                    <span className="relative z-10 whitespace-nowrap">{t.admin}</span>
                  </Link>
                )}
                
                {user && <NavLink id="nav-wallet" to="/wallet" icon={Wallet} label={t.wallet} />}
            </nav>

            {/* Profile Section */}
            <div className={`flex items-center gap-1.5 md:gap-3 shrink-0 ${language === 'ar' ? 'order-first' : 'order-last'}`}>
               <button onClick={toggleLanguage} className="flex items-center gap-2 p-2 rounded-full bg-white/5 border border-transparent hover:border-brand-gold/20 text-brand-muted hover:text-brand-gold transition-all">
                 <Languages size={14} />
                 <span className="text-[10px] font-black uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
               </button>

               {user ? (
                 <div className="flex items-center gap-2">
                    <div className="relative">
                      <button 
                        id="nav-profile"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-2 p-0.5 rounded-full transition-all border ${isProfileOpen ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white/5 border-transparent'}`}
                      >
                         <div className="hidden sm:block mx-2 text-right">
                            <p className="text-[10px] font-black text-white leading-tight">{user.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-brand-gold font-bold uppercase tracking-widest">{isAdmin ? 'SUPER ADMIN' : user.subscriptionTier}</p>
                         </div>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-brand-main shadow-lg ${isAdmin ? 'bg-gradient-to-tr from-orange-500 to-brand-gold' : 'bg-brand-gold'}`}>
                            {isAdmin ? <ShieldCheck size={14} fill="currentColor" /> : <UserIcon size={14} strokeWidth={3} />}
                         </div>
                      </button>
                    </div>
                    <button id="nav-exams" onClick={() => setExamHubOpen(true)} className="p-2 text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-full transition-all">
                      <Calendar size={18} />
                    </button>
                 </div>
               ) : (
                 <Link to="/login" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-gold/50 text-brand-muted hover:text-white font-bold text-xs transition-all">
                   {t.login}
                 </Link>
               )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col pt-20 md:pt-32">
         {children}
      </main>
    </div>
  );
};
