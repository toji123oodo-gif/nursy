
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Wallet, Menu, X, User as UserIcon, LogOut, 
  GraduationCap, LayoutDashboard, LogIn, UserPlus, 
  ShieldAlert, Search, LifeBuoy, ChevronDown, 
  Bell, Settings, CreditCard, Sparkles, Star, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const isActive = (path: string) => location.pathname === path;
  const adminEmails = ['admin@nursy.com', 'toji123oodo@gmail.com'];
  const isAdmin = user && user.email && adminEmails.includes(user.email);

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
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-sm group
          ${active
            ? 'text-brand-gold bg-brand-gold/10'
            : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
      >
        <Icon size={16} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span>{label}</span>
        {active && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full shadow-glow"></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col selection:bg-brand-gold selection:text-brand-main">
      {/* Dynamic Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
          ? 'py-2 md:py-3' 
          : 'py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`mx-auto max-w-7xl px-4 md:px-6 py-2 rounded-full border transition-all duration-500 flex items-center justify-between gap-4 ${
            isScrolled 
            ? 'bg-brand-main/80 backdrop-blur-2xl border-white/10 shadow-2xl' 
            : 'bg-transparent border-transparent'
          }`}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-gradient-to-br from-brand-gold to-yellow-600 p-2 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                  <GraduationCap className="text-brand-main h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h1 className="font-black text-lg md:text-2xl text-white tracking-tighter">Nursy<span className="text-brand-gold">.</span></h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                <NavLink to="/" icon={Home} label="الرئيسية" />
                <NavLink to="/help" icon={LifeBuoy} label="المساعدة" />
                {user && (
                  <>
                    <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" />
                    <NavLink to="/wallet" icon={Wallet} label="المحفظة" />
                  </>
                )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
               {user ? (
                 <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link to="/admin" className="p-2 text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-full transition-all relative">
                        <ShieldAlert size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-main"></span>
                      </Link>
                    )}
                    
                    <div className="relative">
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-2 p-1 pr-1 md:pr-3 rounded-full transition-all border ${
                          isProfileOpen ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white/5 border-transparent hover:border-white/10'
                        }`}
                      >
                         <div className="text-right hidden sm:block mr-1">
                            <p className="text-[10px] font-black text-white leading-tight">{user.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-brand-gold font-bold uppercase tracking-widest">{user.subscriptionTier}</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-yellow-600 flex items-center justify-center text-brand-main shadow-lg">
                            <UserIcon size={14} strokeWidth={3} />
                         </div>
                         <ChevronDown size={12} className={`hidden md:block text-brand-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isProfileOpen && (
                        <>
                          <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                          <div className="absolute left-0 mt-3 w-60 bg-brand-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-scale-up origin-top-left">
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <p className="text-xs font-black text-white">{user.name}</p>
                                <p className="text-[10px] text-brand-muted truncate mt-1">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-all">
                                    <UserIcon size={16} /> ملفي الشخصي
                                </Link>
                                <Link to="/wallet" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-all">
                                    <CreditCard size={16} /> المحفظة والاشتراك
                                </Link>
                                <hr className="my-2 border-white/5" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut size={16} /> تسجيل الخروج
                                </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                    <Link to="/login" className="group relative px-4 md:px-6 py-2 md:py-2.5 rounded-full overflow-hidden border border-white/10 transition-all duration-300 hover:border-brand-gold/50">
                      <span className="relative z-10 flex items-center gap-2 text-brand-muted group-hover:text-white font-bold text-[10px] md:text-xs">
                        <LogIn size={14} className="group-hover:-translate-x-1 transition-transform" />
                        دخول
                      </span>
                    </Link>

                    <Link to="/signup" className="group relative px-5 md:px-7 py-2 md:py-2.5 bg-brand-gold rounded-full font-black text-[10px] md:text-xs text-brand-main overflow-hidden shadow-glow transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-2">
                       <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                       <span className="relative z-10">ابدأ الآن</span>
                    </Link>
                 </div>
               )}
               
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white bg-white/5 rounded-full border border-white/10">
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div className={`md:hidden fixed inset-0 z-[120] bg-brand-main/95 backdrop-blur-2xl transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <div className="flex justify-end p-6">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-white bg-white/5 rounded-full shadow-glow-hover"><X size={24} /></button>
           </div>
           <div className="container mx-auto px-8 pt-10 space-y-6 text-right">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-end gap-6 text-3xl font-black text-white hover:text-brand-gold transition-all hover:translate-x-[-10px]"><span className="text-brand-gold">.</span>الرئيسية <Home size={32} /></Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-end gap-6 text-3xl font-black text-white hover:text-brand-gold transition-all hover:translate-x-[-10px]"><span className="text-brand-gold">.</span>مساحة العمل <LayoutDashboard size={32} /></Link>
              <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-end gap-6 text-3xl font-black text-white hover:text-brand-gold transition-all hover:translate-x-[-10px]"><span className="text-brand-gold">.</span>المحفظة <Wallet size={32} /></Link>
              <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-end gap-6 text-3xl font-black text-white hover:text-brand-gold transition-all hover:translate-x-[-10px]"><span className="text-brand-gold">.</span>المساعدة <LifeBuoy size={32} /></Link>
              {user && (
                <button onClick={handleLogout} className="flex items-center justify-end gap-6 w-full text-3xl font-black text-red-500 pt-10 border-t border-white/5 mt-4">
                  <span>تسجيل الخروج</span> <LogOut size={32} />
                </button>
              )}
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-24 pb-28 md:pb-0">
         {children}
      </main>

      {/* Brilliant Floating Bottom Navigation - All 4 main links included */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100] h-20 bg-brand-card/70 backdrop-blur-3xl border border-white/10 px-4 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-[2.5rem] ring-1 ring-white/5">
          {/* Section: الرئيسية */}
          <Link to="/" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/') ? 'text-brand-gold -translate-y-2' : 'text-brand-muted'}`}>
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive('/') ? 'bg-brand-gold/20 shadow-glow' : 'bg-transparent'}`}>
              <Home size={22} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive('/') ? 'opacity-100' : 'opacity-0'}`}>الرئيسية</span>
            {isActive('/') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>}
          </Link>
          
          {/* Section: مساحة العمل */}
          <Link to="/dashboard" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/dashboard') ? 'text-brand-gold -translate-y-2' : 'text-brand-muted'}`}>
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive('/dashboard') ? 'bg-brand-gold/20 shadow-glow' : 'bg-transparent'}`}>
              <LayoutDashboard size={22} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive('/dashboard') ? 'opacity-100' : 'opacity-0'}`}>مساحة العمل</span>
            {isActive('/dashboard') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>}
          </Link>

          {/* Section: المحفظة */}
          <Link to="/wallet" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/wallet') ? 'text-brand-gold -translate-y-2' : 'text-brand-muted'}`}>
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive('/wallet') ? 'bg-brand-gold/20 shadow-glow' : 'bg-transparent'}`}>
              <Wallet size={22} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive('/wallet') ? 'opacity-100' : 'opacity-0'}`}>المحفظة</span>
            {isActive('/wallet') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>}
          </Link>

          {/* Section: المساعدة */}
          <Link to="/help" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/help') ? 'text-brand-gold -translate-y-2' : 'text-brand-muted'}`}>
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive('/help') ? 'bg-brand-gold/20 shadow-glow' : 'bg-transparent'}`}>
              <LifeBuoy size={22} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive('/help') ? 'opacity-100' : 'opacity-0'}`}>المساعدة</span>
            {isActive('/help') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>}
          </Link>
      </nav>
    </div>
  );
};
