
import React from 'react';
import { Brain, Play, Sparkles } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

export const FlashcardWidget: React.FC = () => {
  return (
    <div className="ns-card p-8 bg-brand-card border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-[60px] rounded-full"></div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
         <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Brain size={24} />
         </div>
         <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest">تحدي المراجعة</h4>
            <p className="text-[10px] text-brand-muted font-bold">5 كروت سريعة</p>
         </div>
      </div>

      <p className="text-brand-muted text-[11px] font-medium leading-relaxed mb-8 relative z-10">
        نشط ذاكرتك بمراجعة أهم مصطلحات درس الأمس في دقيقتين فقط.
      </p>

      <Link to="/flashcards" className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition-all relative z-10">
        ابدأ المراجعة <Play size={14} fill="currentColor" />
      </Link>
    </div>
  );
};
