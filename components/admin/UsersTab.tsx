
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../firebase';
import { 
  Sparkles, Trash2, CheckCircle, ShieldAlert, Monitor, 
  Smartphone, Search, Filter, Ban, UserX, ShieldCheck, 
  Zap, Mail, Phone, Calendar, ArrowUpRight
} from 'lucide-react';

interface Props {
  users: User[];
  searchTerm: string;
}

export const UsersTab: React.FC<Props> = ({ users, searchTerm }) => {
  const [filter, setFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleTier = async (u: User) => {
    const newTier = u.subscriptionTier === 'pro' ? 'free' : 'pro';
    try {
      await db.collection("users").doc(u.id).update({ 
        subscriptionTier: newTier,
        subscriptionExpiry: newTier === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      });
      setNotification(`تم تحديث اشتراك ${u.name.split(' ')[0]} إلى ${newTier.toUpperCase()}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (u: User) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطالب ${u.name}؟ سيتم مسح بياناته نهائياً.`)) return;
    await db.collection("users").doc(u.id).delete();
  };

  const filtered = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (u.phone || '').includes(searchTerm) || 
                         (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || u.subscriptionTier === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
       {/* Notification Toast */}
       {notification && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-brand-gold text-brand-main px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-sm shadow-premium animate-fade-in-up">
           <CheckCircle size={20} /> {notification}
         </div>
       )}

       {/* Control Bar */}
       <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-brand-card/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5">
         <div className="flex bg-brand-main/60 p-1.5 rounded-2xl border border-white/5 w-full lg:w-auto">
           {['all', 'pro', 'free'].map(f => (
             <button 
                key={f} 
                onClick={() => setFilter(f as any)} 
                className={`flex-1 lg:flex-none px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filter === f ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
             >
               {f === 'all' ? 'الكل' : f}
             </button>
           ))}
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] text-brand-muted font-black uppercase">نشط حالياً</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-brand-gold text-xs font-black">
                {filtered.length} <span className="text-brand-muted font-bold">طالب متاح</span>
            </span>
         </div>
       </div>

       {/* Enhanced Table / List */}
       <div className="bg-brand-card/20 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-right">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] text-brand-muted font-black uppercase tracking-[0.2em]">بيانات الطالب</th>
                <th className="p-8 text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] hidden md:table-cell">الجهاز المسجل</th>
                <th className="p-8 text-[10px] text-brand-muted font-black uppercase tracking-[0.2em]">نوع الاشتراك</th>
                <th className="p-8 text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] hidden xl:table-cell">تاريخ الانضمام</th>
                <th className="p-8 text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] text-left">الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u, idx) => (
                <tr key={u.id} className="group hover:bg-brand-gold/[0.02] transition-all duration-500">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-card to-brand-main border border-white/10 flex items-center justify-center text-brand-gold font-black text-xl shadow-inner group-hover:scale-110 group-hover:border-brand-gold/30 transition-all duration-500">
                          {(u.name || 'U').charAt(0)}
                        </div>
                        {u.subscriptionTier === 'pro' && (
                          <div className="absolute -top-2 -right-2 bg-brand-gold text-brand-main p-1 rounded-lg shadow-glow">
                             <Zap size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-white text-base group-hover:text-brand-gold transition-colors">{u.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="flex items-center gap-1.5 text-[10px] text-brand-muted font-mono"><Phone size={10} className="text-brand-gold"/> {u.phone}</span>
                           <span className="hidden sm:inline text-[8px] text-brand-muted/40">•</span>
                           <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-brand-muted font-mono"><Mail size={10}/> {(u.email || '').length > 20 ? (u.email || '').substring(0,17)+'...' : u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-8 hidden md:table-cell">
                    <div className="flex items-center gap-3 bg-brand-main/40 border border-white/5 px-4 py-2 rounded-xl w-fit group-hover:border-brand-gold/20 transition-all">
                      {u.lastDevice?.includes('Android') || u.lastDevice?.includes('iOS') ? 
                        <Smartphone size={14} className="text-brand-gold" /> : 
                        <Monitor size={14} className="text-brand-accent" />
                      }
                      <span className="text-[10px] text-brand-muted font-bold">{u.lastDevice || 'جهاز غير معروف'}</span>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                        u.subscriptionTier === 'pro' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]' 
                        : 'bg-brand-gold/5 text-brand-gold border-brand-gold/20'
                    }`}>
                      {u.subscriptionTier === 'pro' ? <ShieldCheck size={12} /> : <Zap size={12} />}
                      {u.subscriptionTier}
                    </div>
                  </td>

                  <td className="p-8 hidden xl:table-cell">
                    <div className="flex items-center gap-2 text-brand-muted font-mono text-[10px]">
                        <Calendar size={12} />
                        {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('ar-EG') : 'قديماً'}
                    </div>
                  </td>

                  <td className="p-8 text-left">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                       <button 
                        onClick={() => toggleTier(u)} 
                        title={u.subscriptionTier === 'pro' ? 'إلغاء PRO' : 'ترقية لـ PRO'}
                        className={`p-3 rounded-xl transition-all shadow-lg ${
                            u.subscriptionTier === 'pro' 
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                            : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-main'
                        }`}
                       >
                         {u.subscriptionTier === 'pro' ? <ShieldAlert size={18}/> : <Sparkles size={18}/>}
                       </button>
                       <button 
                        onClick={() => deleteUser(u)} 
                        title="حذف نهائي"
                        className="p-3 bg-white/5 text-brand-muted hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg border border-white/10"
                       >
                         <Trash2 size={18}/>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-32 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gold/[0.02] flex items-center justify-center">
                        <UserX size={200} className="text-brand-gold/5" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="w-24 h-24 bg-brand-card border border-white/5 rounded-full flex items-center justify-center mx-auto text-brand-gold/20">
                            <Search size={48} />
                        </div>
                        <h4 className="text-brand-muted font-black text-xl">لا يوجد طلاب يطابقون هذا البحث</h4>
                        <p className="text-brand-muted/50 text-xs">جرب البحث بالاسم، رقم الهاتف، أو البريد الإلكتروني</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};
