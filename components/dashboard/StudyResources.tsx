
import React from 'react';
import { FileText, FileDown, Brain } from 'lucide-react';
import { ContentItem } from '../../types';

interface Props {
  pdfFiles: ContentItem[];
  onQuizClick: () => void;
}

export const StudyResources: React.FC<Props> = ({ pdfFiles, onQuizClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="bg-brand-card p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full group-hover:bg-brand-gold/10 transition-colors"></div>
        <h4 className="text-white font-black text-2xl mb-8 flex items-center gap-4">
          <FileText className="text-brand-gold" /> الملحقات (PDF)
        </h4>
        <div className="space-y-4">
          {pdfFiles.map(f => (
            <div key={f.id} className="bg-brand-main p-6 rounded-3xl flex items-center justify-between border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center">
                  <FileText size={18}/>
                </div>
                <span className="text-sm font-bold text-white">{f.title}</span>
              </div>
              <button className="p-3 bg-brand-gold text-brand-main rounded-xl hover:scale-110 transition-all">
                <FileDown size={20}/>
              </button>
            </div>
          ))}
          {pdfFiles.length === 0 && (
            <p className="text-brand-muted text-center py-6 font-bold italic">لا توجد ملفات مرفقة حالياً</p>
          )}
        </div>
      </div>
      
      <div className="bg-brand-card p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-xl flex flex-col items-center justify-center text-center group">
        <div className="w-20 h-20 bg-brand-main rounded-3xl flex items-center justify-center text-brand-gold mb-6 shadow-premium group-hover:scale-110 transition-transform">
          <Brain size={40} />
        </div>
        <h4 className="text-white font-black text-2xl mb-4">اختبر معلوماتك</h4>
        <p className="text-brand-muted text-sm mb-8 font-medium px-4">تأكد من استيعابك للمحاضرة عبر اختبار سريع وتفاعلي.</p>
        <button 
          onClick={onQuizClick} 
          className="w-full ns-surface--gold-gradient text-brand-main font-black py-5 rounded-2xl ns-shadow--premium hover:scale-[1.03] transition-all text-xl"
        >
          ابدأ الاختبار الآن
        </button>
      </div>
    </div>
  );
};
