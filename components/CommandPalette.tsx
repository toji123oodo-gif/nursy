
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { 
  Search, Book, User, CreditCard, Moon, Sun, 
  LogOut, ArrowRight, Command, FileText 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { courses, theme, toggleTheme, logout } = useApp();

  const staticActions = [
    { id: 'theme', title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: theme === 'dark' ? Sun : Moon, action: toggleTheme },
    { id: 'profile', title: 'My Profile', icon: User, action: () => navigate('/profile') },
    { id: 'billing', title: 'Billing & Wallet', icon: CreditCard, action: () => navigate('/wallet') },
    { id: 'logout', title: 'Log Out', icon: LogOut, action: logout },
  ];

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).map(c => ({
    id: c.id,
    title: c.title,
    icon: Book,
    action: () => navigate(`/course/${c.id}`),
    group: 'Courses'
  }));

  const filteredActions = staticActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase())).map(a => ({
    ...a,
    group: 'Actions'
  }));

  const results = [...filteredCourses, ...filteredActions];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
          onClose();
        }
      }
    };

    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Reset selection when query changes
  useEffect(() => setSelectedIndex(0), [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-[2px] flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-lg shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-[#333]">
          <Search className="text-gray-400" size={18} />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-main placeholder:text-gray-400 h-6"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-[10px] bg-gray-100 dark:bg-[#333] text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#444]">ESC</div>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {results.length === 0 ? (
             <div className="px-4 py-8 text-center text-sm text-muted">
                No results found.
             </div>
          ) : (
            results.map((item, idx) => (
              <div key={item.id + idx}>
                {(idx === 0 || results[idx - 1].group !== item.group) && (
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {item.group}
                  </div>
                )}
                <button
                  onClick={() => { item.action(); onClose(); }}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors cursor-default ${
                    idx === selectedIndex 
                    ? 'bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb]' 
                    : 'text-main hover:bg-gray-50 dark:hover:bg-[#252525]'
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={idx === selectedIndex ? 'text-[#0051C3] dark:text-[#68b5fb]' : 'text-gray-400'} />
                    <span>{item.title}</span>
                  </div>
                  {idx === selectedIndex && <ArrowRight size={14} />}
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#333] text-[10px] text-gray-400 flex justify-between">
           <span>Use arrows to navigate</span>
           <span className="flex items-center gap-1"><Command size={10}/>K to open</span>
        </div>
      </div>
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};
