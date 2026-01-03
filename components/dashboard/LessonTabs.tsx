
import React from 'react';
import { BookOpen, MessageSquare, Edit3, Sparkles } from 'lucide-react';

interface Props {
  activeTab: 'resources' | 'discussion' | 'notes';
  setActiveTab: (tab: 'resources' | 'discussion' | 'notes') => void;
}

export const LessonTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'resources', label: 'المصادر المتاحة', icon: BookOpen },
    { id: 'discussion', label: 'نقاش المحاضرة', icon: MessageSquare },
    { id: 'notes', label: 'ملاحظاتي الخاصة', icon: Edit3 },
  ];

  return (
    <div className="flex bg-brand-card/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/5 mb-10 overflow-x-auto ns-util--no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
            activeTab === tab.id 
            ? 'bg-brand-gold text-brand-main shadow-glow scale-[1.02]' 
            : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
          {tab.id === 'discussion' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>
      ))}
    </div>
  );
};
