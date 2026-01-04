
import React from 'react';
import { Award, Star, Edit2, LogOut, X, ShieldCheck, Crown } from 'lucide-react';
import { User } from '../../types';

interface Props {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onLogout: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ user, isEditing, onEditToggle, onLogout }) => {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#333] relative group">
      {/* Premium Background Banner */}
      <div className="h-48 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F38020] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white flex items-center gap-2">
                <Crown size={14} className="text-yellow-400" /> عضوية النخبة
            </span>
        </div>
      </div>

      <div className="px-8 pb-8 relative">
        <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
            {/* Avatar with Gold Ring */}
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-900 to-black p-[4px] shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#252525] flex items-center justify-center text-5xl font-bold text-[#F38020]">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full border-4 border-white dark:border-[#1E1E1E] shadow-sm" title="Verified Student">
                    <ShieldCheck size={18} />
                </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-right mb-2">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{user.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{user.email}</span>
                    <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span className="text-sm text-[#F38020] font-bold flex items-center gap-1">
                        <Star size={14} fill="currentColor" /> {user.xp || 0} XP
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">
                       نشط حالياً
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2 w-full md:w-auto">
                <button 
                onClick={onEditToggle} 
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isEditing 
                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                    : 'bg-gray-100 dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
                >
                {isEditing ? <X size={18}/> : <Edit2 size={18}/>}
                {isEditing ? 'إلغاء' : 'تعديل الملف'}
                </button>
                <button onClick={onLogout} className="px-4 py-2.5 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <LogOut size={20}/>
                </button>
            </div>
        </div>

        {/* Gamification Stats Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-[#333]">
             <div className="text-center md:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">المستوى الأكاديمي</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">المستوى {user.level || 1}</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">الجامعة</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{user.university || 'غير محدد'}</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">الفرقة الدراسية</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{user.academicYear || 'عام'}</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">نوع الاشتراك</p>
                <p className="text-lg font-bold text-[#F38020] mt-1 flex items-center justify-center md:justify-start gap-2">
                    <Crown size={16} fill="currentColor" /> منحة كاملة
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};
