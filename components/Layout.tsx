import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Wallet, Menu, X, User as UserIcon, LogOut, GraduationCap, LayoutDashboard, LogIn, UserPlus, ShieldAlert, Search, LifeBuoy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
        isActive(to)
          ? 'bg-brand-gold text-brand-main font-bold shadow-glow'
          : 'text-brand-muted hover:bg-brand-hover hover:text-brand-gold'
      }`}
    >
      <Icon size={22} className={`transition-transform duration-300 ${isActive(to) ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="text-lg">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-brand-main text-brand-text font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-brand-main/80 backdrop-blur-md border-b border-white/5 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="text-brand-gold" size={28} />
            <span className="font-black text-2xl tracking-wide text-white">Nursy</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed md:sticky md:top-0 h-screen w-72 bg-brand-card/50 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col justify-between z-40 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0 right-0 shadow-2xl' : 'translate-x-full md:translate-x-0 right-0 md:right-auto'}
        `}
      >
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 px-2 pt-2 group">
            <div className="bg-gradient-to-br from-brand-gold to-yellow-600 p-2.5 rounded-xl shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="text-brand-main h-7 w-7" />
            </div>
            <div>
                <h1 className="font-black text-3xl tracking-wide text-white leading-none">Nursy</h1>
                <p className="text-xs text-brand-gold font-bold tracking-widest mt-1">نيرسي للتعليم</p>
            </div>
          </Link>

          {/* Search Bar (Secret Trigger) */}
          <div className="mb-6 px-1">
             <div className="relative bg-brand-main/50 rounded-xl border border-white/10 overflow-hidden focus-within:border-brand-gold/50 transition-colors">
                <Search className="absolute right-3 top-3 text-brand-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-white px-10 py-3 outline-none placeholder:text-brand-muted/50"
                />
             </div>
          </div>

          <nav className="space-y-3">
            <NavLink to="/" icon={Home} label="الرئيسية" />
            {user && (
              <>
                <NavLink to="/dashboard" icon={LayoutDashboard} label="مساحة العمل" />
                <NavLink to="/wallet" icon={Wallet} label="رصيد الحساب" />
                <NavLink to="/help" icon={LifeBuoy} label="المساعدة والدعم" />
                
                {/* Admin Link - Only visible if secret code is 1221 */}
                {searchTerm === '1221' && (
                    <div className="pt-4 mt-4 border-t border-white/5 animate-pulse">
                        <NavLink to="/admin" icon={ShieldAlert} label="لوحة الأدمن" />
                    </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* User Profile or Login CTA */}
        <div className="space-y-4">
          {user ? (
             <div className="bg-brand-main rounded-2xl p-5 border border-white/5 shadow-lg">
                <Link to="/profile" className="flex items-center gap-3 mb-4 group cursor-pointer">
                    <div className="bg-brand-hover p-2.5 rounded-full ring-2 ring-brand-gold/20 group-hover:ring-brand-gold transition-all">
                        <UserIcon size={20} className="text-brand-gold" />
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-sm font-bold text-white truncate group-hover:text-brand-gold transition-colors">{user.name}</p>
                        <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full w-fit ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main' : 'bg-gray-600 text-gray-200'}`}>
                           {user.subscriptionTier === 'pro' ? '💎 مشترك' : 'مجاني'}
                        </div>
                    </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-all"
                >
                    <LogOut size={14} />
                    تسجيل الخروج
                </button>
            </div>
          ) : (
            <div className="space-y-3">
               <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors shadow-glow">
                  <LogIn size={18} />
                  تسجيل الدخول
               </Link>
               <Link to="/signup" className="flex items-center justify-center gap-2 w-full bg-brand-main border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-colors">
                  <UserPlus size={18} />
                  انشاء حساب
               </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative flex flex-col">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col">
            {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};