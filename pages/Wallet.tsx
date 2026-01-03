
import React from 'react';
import { 
  Heart, MessageCircle, Copy, Sparkles, Coffee, ShieldCheck, Info, Gift, HandCoins
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Wallet: React.FC = () => {
  const VODAFONE_NUMBER = "01093077151";

  return (
    <div className="min-h-screen bg-brand-main py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header - No Tier Mention */}
        <div className="bg-brand-card rounded-[3.5rem] p-10 md:p-14 border border-brand-gold/20 shadow-glow relative overflow-hidden ns-animate--fade-in-up">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/30 text-brand-gold font-black uppercase tracking-widest text-[10px]">
              <Heart size={14} fill="currentColor" className="animate-pulse" /> مجهود تطوعي بالكامل
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
              نيرسي مجانية <span className="text-brand-gold">للأبد</span>
            </h1>
            <p className="text-brand-muted text-lg font-medium max-w-2xl mx-auto">
              هدفنا هو توفير أفضل تعليم لطلاب التمريض في مصر بدون أي عوائق مادية. المنصة متاحة بالكامل مجاناً لكل الطلاب.
            </p>
          </div>
        </div>

        {/* Donation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <div className="bg-brand-card p-10 rounded-[3rem] border border-white/5 shadow-xl space-y-8 flex flex-col justify-between ns-animate--fade-in-up">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center shadow-inner">
                <Coffee size={32} />
              </div>
              <h3 className="text-2xl font-black text-white">ساعدنا في التطوير</h3>
              <p className="text-brand-muted text-sm font-medium leading-relaxed">
                استضافة الموقع، تخزين الفيديوهات، والبحث العلمي للمحتوى مكلف جداً. إذا استفدت من الموقع، يمكنك المساهمة بأي مبلغ بسيط لمساعدتنا على دفع تكاليف السيرفرات.
              </p>
            </div>
            
            <div className="bg-brand-main p-6 rounded-2xl border border-white/5 text-center">
              <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-2">فودافون كاش (دعم فني)</p>
              <h4 className="text-3xl font-black text-white font-mono mb-4">{VODAFONE_NUMBER}</h4>
              <button 
                onClick={() => { navigator.clipboard.writeText(VODAFONE_NUMBER); alert('تم نسخ الرقم'); }}
                className="bg-brand-gold/10 text-brand-gold px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:bg-brand-gold hover:text-brand-main transition-all"
              >
                <Copy size={14} /> نسخ الرقم
              </button>
            </div>
          </div>

          <div className="bg-brand-card p-10 rounded-[3rem] border border-white/5 shadow-xl space-y-8 flex flex-col justify-between ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shadow-inner">
                <HandCoins size={32} />
              </div>
              <h3 className="text-2xl font-black text-white">انضم لفريق العمل</h3>
              <p className="text-brand-muted text-sm font-medium leading-relaxed">
                هل أنت متميز في مادة معينة؟ هل تجيد التصميم أو البرمجة؟ يمكنك المساهمة بوقتك ومجهودك لتطوير نيرسي وجعلها أفضل لكل الطلاب في مصر.
              </p>
            </div>

            <a href={`https://wa.me/201093077151`} target="_blank" className="w-full bg-[#25D366] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 text-xl shadow-glow hover:scale-[1.02] transition-all">
              <MessageCircle fill="white" /> تواصل معنا للتطوع
            </a>
          </div>
        </div>

        {/* Vision Box */}
        <div className="bg-brand-gold/5 border border-brand-gold/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 ns-animate--fade-in-up">
           <div className="w-20 h-20 bg-brand-gold text-brand-main rounded-[2rem] flex items-center justify-center shrink-0 shadow-glow">
              <Sparkles size={40} />
           </div>
           <div className="text-center md:text-right">
              <h4 className="text-white font-black text-xl mb-2">رؤيتنا للمستقبل</h4>
              <p className="text-brand-muted text-sm font-medium leading-relaxed">
                نحن نؤمن أن التعليم حق للجميع. "نيرسي" ليست مشروعاً تجارياً، بل هي صدقة جارية تهدف لرفع مستوى مهنة التمريض في مصر من خلال توفير العلم لمن يستحقه بكل سهولة.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
