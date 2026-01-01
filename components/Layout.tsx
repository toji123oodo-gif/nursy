
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Menu, X, User as UserIcon, LogOut, GraduationCap, LayoutDashboard, LogIn, UserPlus, ShieldAlert, Search, LifeBuoy, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const isActive = (path: string) => location.pathname === path;

  // List of Admin Emails
  const adminEmails = ['admin@nursy.com', 'toji123oodo@gmail.com'];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label, mobileOnly = false }: { to: string; icon: any; label: string; mobileOnly?: boolean }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold text-sm whitespace-nowrap group
          ${mobileOnly ? 'md:hidden w-full py-4 rounded-xl' : ''}
          ${active
            ? 'bg-brand-gold/10 text-brand-gold shadow-[0_0_15px_rgba(251,191,36,0.1)]'
            : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
      >
        <Icon size={mobileOnly ? 20 : 18} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span>{label}</span>
        {active && !mobileOnly && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-brand-gold rounded-full mb-1"></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-brand-main/90 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* 1. Logo Section (Right) */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 relative z-20">
              <div className="bg-gradient-to-br from-brand-gold to-yellow-600 p-2.5 rounded-xl shadow-lg shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-300">
                  <GraduationCap className="text-brand-main h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="hidden lg:block">
                  <h1 className="font-black text-2xl tracking-wide text-white leading-none">Nursy<span className="text-brand-gold">.</span></h1>
              </div>
            </Link>

            {/* 2. Desktop Navigation (Center - Absolute styling for perfect centering or Flex-1) */}
            <nav className="hidden md:flex items-center justify-center flex-1 gap-1 lg:gap-2">
              <div className="n-glass rounded-full p-1.5 flex items-center shadow-inner">
                  <NavLink to="/" icon={Home} label="الرئيسية" />
                  <NavLink to="/help" icon={LifeBuoy} label="المساعدة" />
                  {user && (
                    <>
                      <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" />
                      <NavLink to="/wallet" icon={Wallet} label="المحفظة" />
                      {(searchTerm === '1221' || (user.email && adminEmails.includes(user.email))) && (
                        <NavLink to="/admin" icon={ShieldAlert} label="الأدمن" />
                      )}
                    </>
                  )}
              </div>
            </nav>

            {/* 3. Actions Section (Left) */}
            <div className="hidden md:flex items-center gap-5 shrink-0 z-20">
               {/* Search Bar */}
               <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-3">
                    <Search className="h-4 w-4 text-brand-muted group-focus-within:text-brand-gold transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-brand-card/30 border border-white/5 text-white text-sm rounded-full focus:bg-brand-card focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 block w-32 focus:w-48 pl-4 pr-10 py-2.5 transition-all duration-300 outline-none placeholder:text-brand-muted/50 shadow-sm hover:bg-brand-card/50"
                  />
               </div>

               {user ? (
                 <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                    <Link to="/profile" className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-3 rounded-xl transition-all group border border-transparent hover:border-white/5">
                       <div className="text-right hidden xl:block">
                          <p className="text-sm font-bold text-white leading-tight group-hover:text-brand-gold transition-colors">{user.name.split(' ')[0]}</p>
                          <p className="text-[10px] text-brand-muted font-mono">{user.subscriptionTier === 'pro' ? 'PREMIUM' : 'FREE PLAN'}</p>
                       </div>
                       <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-card to-brand-main flex items-center justify-center border border-white/10 group-hover:border-brand-gold transition-colors shadow-lg">
                          <UserIcon size={16} className="text-brand-gold" />
                       </div>
                    </Link>
                 </div>
               ) : (
                 <div className="flex items-center gap-3">
                    <Link to="/login" className="text-brand-muted hover:text-white font-bold text-sm transition-colors px-2">
                      تسجيل دخول
                    </Link>
                    <Link to="/signup" className="group bg-white text-brand-main px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center gap-2 overflow-hidden relative">
                       <span className="relative z-10">ابدأ الآن</span>
                       <UserPlus size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                       <div className="absolute inset-0 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>
                    </Link>
                 </div>
               )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
                {user && (
                    <Link to="/profile" className="w-9 h-9 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
                        <UserIcon size={18} className="text-brand-gold" />
                    </Link>
                )}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white bg-white/5 p-2 rounded-lg hover:bg-brand-gold hover:text-brand-main transition-colors border border-white/5"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden bg-brand-main/95 backdrop-blur-xl border-t border-white/5 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="container mx-auto px-4 py-6 space-y-2">
              
              {/* Mobile Search */}
              <div className="mb-6 px-2 relative">
                  <Search className="absolute right-6 top-3.5 text-brand-muted h-4 w-4" />
                  <input
                    type="text"
                    placeholder="ابحث عن كورس..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-card/50 border border-white/10 rounded-xl px-4 pr-10 py-3 text-white outline-none focus:border-brand-gold focus:bg-brand-card transition-all"
                  />
              </div>

              <div className="space-y-1">
                <NavLink to="/" icon={Home} label="الرئيسية" mobileOnly />
                <NavLink to="/help" icon={LifeBuoy} label="المساعدة والدعم" mobileOnly />
                {user ? (
                    <>
                    <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" mobileOnly />
                    <NavLink to="/wallet" icon={Wallet} label="المحفظة والاشتراكات" mobileOnly />
                    {(searchTerm === '1221' || (user.email && adminEmails.includes(user.email))) && (
                        <NavLink to="/admin" icon={ShieldAlert} label="لوحة تحكم الأدمن" mobileOnly />
                    )}
                    <div className="border-t border-white/5 my-4 pt-4">
                        <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-red-400 bg-red-500/5 hover:bg-red-500/10 font-bold transition-colors"
                        >
                        <LogOut size={20} />
                        تسجيل الخروج
                        </button>
                    </div>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mt-6 px-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-brand-card border border-white/10 text-white py-3.5 rounded-xl font-bold hover:bg-white/5 transition-colors">
                        <LogIn size={18} />
                        دخول
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-brand-gold text-brand-main py-3.5 rounded-xl font-bold hover:bg-brand-goldHover transition-colors shadow-glow">
                        <UserPlus size={18} />
                        انشاء حساب
                    </Link>
                    </div>
                )}
              </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full max-w-full overflow-x-hidden">
         {children}
      </main>

    </div>
  );
};
