
import React from 'react';
import { X, Bell, Zap, Calendar, Sparkles, ChevronLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, title: 'محاضرة جديدة!', desc: 'تمت إضافة "تشريح القلب" في كورس الأناتومي.', type: 'academic', date: 'الآن', icon: <Sparkles className="text-brand-gold" /> },
    { id: 2, title: 'تنبيه الاشتراك', desc: 'باقي 3 أيام على انتهاء اشتراك الـ PRO.', type: 'finance', date: 'منذ ساعة', icon: <Zap className="text-orange-500" /> },
    { id: 3, title: 'تحديث الجدول', desc: 'تعديل موعد امتحان الميكروبيولوجي.', type: 'general', date: 'منذ يوم', icon: <Calendar className="text-brand-accent" /> }
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 z-[150] bg-brand-main/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div className={`fixed top-0 left-0 bottom-0 z-[160] w-full max-w-md bg-brand-card/95 backdrop-blur-3xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center">
                 <Bell size={24} className="animate-pulse" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white">الإشعارات</h3>
                 <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">مركز التحديثات المباشر</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 text-brand-muted hover:text-white rounded-xl transition-all"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-4 h-full overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
            <div key={n.id} className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer group">
              <div className="flex gap-5">
                 <div className="w-12 h-12 bg-brand-card rounded-2xl flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                   {n.icon}
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="text-white font-black text-sm">{n.title}</h4>
                       <span className="text-[9px] text-brand-muted font-bold uppercase">{n.date}</span>
                    </div>
                    <p className="text-brand-muted text-[11px] leading-relaxed mb-3">{n.desc}</p>
                    <div className="flex items-center gap-2 text-brand-gold text-[9px] font-black uppercase tracking-widest group-hover:translate-x-[-4px] transition-transform">
                       عرض التفاصيل <ChevronLeft size={10} />
                    </div>
                 </div>
              </div>
            </div>
          ))}
          <button className="w-full py-4 text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] hover:text-white transition-colors">تحديد الكل كمقروء</button>
        </div>
      </div>
    </>
  );
};
