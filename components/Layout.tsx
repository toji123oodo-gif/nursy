
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Wallet, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, LogIn, 
  ShieldAlert, LifeBuoy, ChevronDown, 
  CreditCard, Calendar, Bell, Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setExamHubOpen, language, toggleLanguage } = useApp();

  const isActive = (path: string) => location.pathname === path;
  const adminEmails = ['admin@nursy.com', 'toji123oodo@gmail.com'];
  const isAdmin = user && user.email && adminEmails.includes(user.email);

  const t = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    dashboard: language === 'ar' ? 'مساحة العمل' : 'Dashboard',
    wallet: language === 'ar' ? 'المحفظة' : 'Wallet',
    help: language === 'ar' ? 'المساعدة' : 'Help',
    exams: language === 'ar' ? 'جدول الامتحانات' : 'Exam Table',
    login: language === 'ar' ? 'دخول' : 'Login',
    logout: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
    profile: language === 'ar' ? 'ملفي الشخصي' : 'Profile',
    walletSub: language === 'ar' ? 'المحفظة والاشتراك' : 'Wallet & Subscription',
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`relative flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 rounded-full transition-all duration-300 font-bold text-[10px] md:text-sm group shrink-0
          ${active
            ? 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20'
            : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
      >
        <Icon size={14} className={`md:size-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="whitespace-nowrap">{label}</span>
        {active && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full shadow-glow"></span>
        )}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main`}>
      <header className="fixed top-0 left-0 right-0 z-[100] py-3 md:py-6">
        <div className="container mx-auto px-2 md:px-4">
          <div className={`mx-auto max-w-7xl px-3 md:px-6 py-2 rounded-full border border-white/10 flex items-center justify-between gap-2 md:gap-4 transition-all duration-500 bg-brand-main/40 backdrop-blur-2xl shadow-2xl ${
            isScrolled ? 'ring-1 ring-brand-gold/20 scale-[0.98]' : ''
          }`}>
            
            {/* Right Side (LTR: Left Side): Logo */}
            <Link to="/" className={`flex items-center gap-1.5 md:gap-2 group shrink-0 ${language === 'ar' ? 'order-last' : 'order-first'}`}>
              <h1 className="font-black text-sm md:text-2xl text-white tracking-tighter">Nursy<span className="text-brand-gold">.</span></h1>
              <div className="bg-brand-gold p-1 md:p-1.5 rounded-lg md:rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                  <GraduationCap className="text-brand-main h-4 w-4 md:h-6 md:w-6" />
              </div>
            </Link>

            {/* Middle: Universal Navigation */}
            <nav className="flex items-center gap-0.5 md:gap-1 bg-white/5 p-1 rounded-full border border-white/5 mx-auto overflow-x-auto no-scrollbar max-w-[50%] md:max-w-none">
                <NavLink to="/" icon={Home} label={t.home} />
                {user && <NavLink to="/dashboard" icon={LayoutDashboard} label={t.dashboard} />}
                {user && <NavLink to="/wallet" icon={Wallet} label={t.wallet} />}
                <NavLink to="/help" icon={LifeBuoy} label={t.help} />
            </nav>

            {/* Left Side (LTR: Right Side): Profile & Language */}
            <div className={`flex items-center gap-1.5 md:gap-3 shrink-0 ${language === 'ar' ? 'order-first' : 'order-last'}`}>
               
               {/* Language Switcher */}
               <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 md:gap-2 p-2 rounded-full bg-white/5 border border-transparent hover:border-brand-gold/20 text-brand-muted hover:text-brand-gold transition-all"
               >
                 <Languages size={14} className="md:size-4" />
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">{language === 'ar' ? 'EN' : 'AR'}</span>
               </button>

               {user ? (
                 <div className="flex items-center gap-1 md:gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-1.5 md:gap-2 p-0.5 rounded-full transition-all border ${
                          isProfileOpen ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white/5 border-transparent hover:border-white/10'
                        } ${language === 'ar' ? 'pr-0.5 pl-0.5 md:pr-4' : 'pl-0.5 pr-0.5 md:pl-4'}`}
                      >
                         <ChevronDown size={10} className={`hidden md:block text-brand-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                         <div className={`text-left hidden sm:block mx-1 ${language === 'en' ? 'order-last' : ''}`}>
                            <p className="text-[9px] font-black text-white leading-tight">{user.name.split(' ')[0]}</p>
                            <p className="text-[7px] text-brand-gold font-bold uppercase tracking-widest">{user.subscriptionTier}</p>
                         </div>
                         <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-brand-gold to-yellow-600 flex items-center justify-center text-brand-main shadow-lg">
                            <UserIcon size={12} strokeWidth={3} />
                         </div>
                      </button>

                      {isProfileOpen && (
                        <>
                          <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                          <div className={`absolute mt-3 w-56 md:w-64 bg-brand-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-scale-up ${language === 'ar' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}>
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <p className="text-xs font-black text-white truncate">{user.name}</p>
                                <p className="text-[9px] text-brand-muted truncate mt-1">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-all">
                                    <UserIcon size={16} /> {t.profile}
                                </Link>
                                <Link to="/wallet" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-all">
                                    <CreditCard size={16} /> {t.walletSub}
                                </Link>
                                <button onClick={() => { setExamHubOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-all">
                                  <Calendar size={16} /> {t.exams}
                                </button>
                                <hr className="my-2 border-white/5" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut size={16} /> {t.logout}
                                </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {isAdmin ? (
                      <Link to="/admin" className="p-1.5 md:p-2 text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-full transition-all relative">
                        <ShieldAlert size={18} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-main"></span>
                      </Link>
                    ) : (
                      <button className="p-1.5 md:p-2 text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-full transition-all relative">
                        <Bell size={18} />
                      </button>
                    )}
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                    <Link to="/login" className="group relative px-4 md:px-6 py-1.5 md:py-2.5 rounded-full overflow-hidden border border-white/10 transition-all duration-300 hover:border-brand-gold/50 bg-white/5">
                      <span className="relative z-10 flex items-center gap-2 text-brand-muted group-hover:text-white font-bold text-[10px] md:text-xs">
                        <LogIn size={14} />
                        {t.login}
                      </span>
                    </Link>
                 </div>
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
