
import React from 'react';
import { Send, User, ThumbsUp, MessageSquare } from 'lucide-react';

export const LessonDiscussion: React.FC = () => {
  const mockComments = [
    { id: 1, user: 'أحمد محمود', text: 'الجزء الخاص بعضلات الطرف العلوي فيه تفاصيل كتير، حد معاه ملخص؟', date: 'منذ ساعتين', likes: 5 },
    { id: 2, user: 'د. سارة (معيد)', text: 'تفضل يا أحمد، هتلاقي ملخص في المرفقات رقم 2 بيشرح الموضوع بالرسم.', date: 'منذ ساعة', likes: 12 },
    { id: 3, user: 'نور الهدى', text: 'المحاضرة دي سهلت عليا حاجات كتير كنت فاكراها صعبة.. شكراً نيرسي!', date: 'منذ 10 دقائق', likes: 2 }
  ];

  return (
    <div className="ns-card p-10 md:p-14 space-y-10 ns-animate--fade-in-up">
      <h4 className="text-2xl font-black text-white flex items-center gap-3">
        <MessageSquare className="text-brand-gold" /> مجتمع المحاضرة
      </h4>

      <div className="space-y-6">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-6 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-main border border-white/10 flex items-center justify-center text-brand-gold font-black shrink-0 shadow-inner">
              {(comment.user || 'U').charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-sm">{comment.user}</span>
                <span className="text-[9px] text-brand-muted font-bold uppercase">{comment.date}</span>
              </div>
              <div className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 group-hover:border-brand-gold/20 transition-all">
                <p className="text-brand-muted text-sm leading-relaxed">{comment.text}</p>
              </div>
              <div className="flex gap-4 px-2">
                <button className="flex items-center gap-2 text-[10px] text-brand-muted font-black hover:text-brand-gold transition-colors">
                  <ThumbsUp size={12} /> {comment.likes} إعجاب
                </button>
                <button className="text-[10px] text-brand-muted font-black hover:text-brand-gold transition-colors">رد</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative pt-6">
        <input 
          type="text" 
          placeholder="اكتب استفسارك أو شارك برأيك..."
          className="w-full bg-brand-main/80 border border-white/10 rounded-2xl pr-14 pl-24 py-5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 mt-3 text-brand-gold"><User size={20} /></div>
        <button className="absolute left-3 top-1/2 -translate-y-1/2 mt-3 bg-brand-gold text-brand-main px-6 py-2.5 rounded-xl font-black text-xs shadow-glow">إرسال</button>
      </div>
    </div>
  );
};
