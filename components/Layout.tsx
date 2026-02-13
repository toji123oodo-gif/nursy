
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { 
  Home, Book, Wallet, User, LogOut, Menu, X, 
  Activity, ChevronRight, Bell, Settings, Cloud,
  Moon, Sun, Users, HelpCircle, ExternalLink, Search, Command,
  Calendar, UploadCloud, Award, Trophy, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommandPalette } from './CommandPalette';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, theme, toggleTheme } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Updated Owner Emails
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];

  // Command Palette Keyboard Shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close sidebar on route change (Mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/dashboard/courses', label: 'My Courses', icon: Book },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/wallet', label: 'Billing', icon: Wallet },
  ];

  const toolsLinks = [
    { path: '/uploads', label: 'Contribute Content', icon: UploadCloud }, // Replaced Video AI
    { path: '/flashcards', label: 'Flashcards', icon: Activity },
    { path: '/certificates', label: 'Certificates', icon: Award },
    { path: '/leaderboard', label: 'Rankings', icon: Trophy },
  ];

  const isActive = (path: string) => {
      if (path === '/dashboard' && location.pathname === '/dashboard') return true;
      if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
      return false;
  };

  const isAdminOrOwner = user && (OWNERS.includes(user.email) || user.role === 'admin');

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#101010] flex font-sans text-sm">
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-white dark:bg-[#1E1E1E] border-r border-[#E5E5E5] dark:border-[#333] flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static shadow-xl lg:shadow-none`}>
        
        {/* Logo Area */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-[#E5E5E5] dark:border-[#333]">
          <div className="text-[#F38020]">
            <Cloud size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base text-main tracking-tight">Nursy<span className="text-[#F38020]">Platform</span></span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-500 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 no-scrollbar">
          <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
            Workspace
          </div>

          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${
                isActive(link.path) 
                ? 'bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb]' 
                : 'text-[#595959] dark:text-[#A3A3A3] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-main'
              }`}
            >
              <link.icon size={16} /> {link.label}
            </Link>
          ))}
          
          <div className="my-4 border-t border-[#E5E5E5] dark:border-[#333]"></div>

          <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
            Tools
          </div>
          {toolsLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${
                isActive(link.path) 
                ? 'bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb]' 
                : 'text-[#595959] dark:text-[#A3A3A3] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-main'
              }`}
            >
              <link.icon size={16} /> {link.label}
            </Link>
          ))}

          <div className="my-4 border-t border-[#E5E5E5] dark:border-[#333]"></div>

          <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
            Support
          </div>
           <Link to="/help" className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium text-muted hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-main transition-colors">
            <HelpCircle size={16} /> Help Center
           </Link>
           <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium text-muted hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-main transition-colors">
              <User size={16} /> My Profile
           </Link>

           {/* ADMIN SECTION - Visible to Owners AND Admin Role */}
           {isAdminOrOwner && (
             <>
               <div className="my-4 border-t border-[#E5E5E5] dark:border-[#333]"></div>
               <div className="px-3 py-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  Administration
               </div>
               <Link 
                  to="/admin" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${
                    isActive('/admin') 
                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-red-600'
                  }`}
               >
                  <Shield size={16} /> Platform Admin
               </Link>
             </>
           )}
        </div>

        {/* User Footer */}
        {user && (
          <div className="p-3 border-t border-[#E5E5E5] dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#E5E5E5] dark:bg-[#333] text-muted flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-main truncate">{user.name}</p>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 mb-16 lg:mb-0"> {/* Margin bottom for mobile nav */}
        {/* Top Header */}
        <header className="h-14 bg-white dark:bg-[#1E1E1E] border-b border-[#E5E5E5] dark:border-[#333] flex items-center justify-between px-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-10 sticky top-0">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-main p-1">
              <Menu size={20} />
            </button>
            
            {/* Quick Search Button */}
            <button 
              onClick={() => setIsPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-[4px] text-muted hover:border-gray-300 dark:hover:border-[#444] transition-colors w-64 group"
            >
               <Search size={14} className="group-hover:text-main" />
               <span className="text-xs">Search...</span>
               <span className="ml-auto text-[10px] border border-gray-200 dark:border-[#444] rounded px-1 flex items-center gap-0.5">
                 <Command size={8}/> K
               </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="h-4 w-px bg-[#E5E5E5] dark:bg-[#333] hidden md:block"></div>
             
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme} 
                className="text-muted hover:text-main transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#2C2C2C]"
                title="Toggle Theme"
             >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <button className="text-muted hover:text-main relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#1E1E1E]"></span>
             </button>
             <button onClick={logout} className="text-xs font-medium text-[#D94F4F] hover:underline hidden md:block">
               Log Out
             </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-0">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};
