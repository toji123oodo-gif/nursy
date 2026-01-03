
import React from 'react';
import { Award, Zap, Star, Edit2, LogOut, X } from 'lucide-react';
import { User } from '../../types';

interface Props {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onLogout: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ user, isEditing, onEditToggle, onLogout }) => {
  return (
    <div className="relative bg-brand-card/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 md:p-16 shadow-2xl overflow-hidden ns-animate--scale-up">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="relative group">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-tr from-brand-gold via-yellow-400 to-brand-gold p-1.5 ns-shadow--glow group-hover:scale-105 transition-transform duration-700">
              <div className="w-full h-full bg-brand-card rounded-[3.2rem] flex items-center justify-center text-brand-gold font-black text-6xl md:text-8xl">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-brand-main border-4 border-brand-card w-14 h-14 rounded-2xl flex items-center justify-center text-brand-gold shadow-xl">
            <Award size={28} />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-right space-y-8">
          <div>
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{user.name}</h1>
              <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${user.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/30'}`}>
                {user.subscriptionTier === 'pro' ? <Zap size={14} fill="currentColor" /> : <Star size={14} />}
                {user.subscriptionTier === 'pro' ? 'Premium (PRO)' : 'Free Tier'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button 
              onClick={onEditToggle} 
              className={`px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${isEditing ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-gold text-brand-main ns-shadow--glow hover:scale-105'}`}
            >
              {isEditing ? <><X size={20}/> إلغاء التعديل</> : <><Edit2 size={20}/> تعديل الحساب</>}
            </button>
            <button onClick={onLogout} className="px-10 py-5 bg-white/5 text-brand-muted border border-white/10 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20}/> خروج آمن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
