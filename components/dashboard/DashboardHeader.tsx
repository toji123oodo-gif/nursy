
import React from 'react';
import { Layout } from 'lucide-react';

interface Props {
  subject: string;
  title: string;
  progress: number;
}

export const DashboardHeader: React.FC<Props> = ({ subject, title, progress }) => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8 ns-animate--fade-in-up">
      <div className="space-y-2 text-right">
        <span className="bg-brand-gold/10 text-brand-gold px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          {subject}
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
          {title}
        </h2>
      </div>
      <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-inner">
        <div className="w-12 h-12 bg-brand-main rounded-xl flex items-center justify-center text-brand-gold shadow-inner">
          <Layout size={20}/>
        </div>
        <div>
          <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">إنجازك في المادة</p>
          <p className="text-xl font-black text-white">{progress}%</p>
        </div>
      </div>
    </div>
  );
};
