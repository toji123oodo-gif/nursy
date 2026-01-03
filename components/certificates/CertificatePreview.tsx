
import React from 'react';
import { X, Award, ShieldCheck, QrCode, Download, Share2, Sparkles } from 'lucide-react';

interface Props {
  userName: string;
  courseTitle: string;
  date: string;
  onClose: () => void;
}

export const CertificatePreview: React.FC<Props> = ({ userName, courseTitle, date, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-2xl animate-fade-in" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl animate-scale-up">
        {/* Certificate Paper Design */}
        <div className="bg-white p-1 md:p-4 rounded-xl shadow-[0_0_100px_rgba(251,191,36,0.3)]">
          <div className="bg-[#fdfcf0] border-[12px] border-[#c5a059] p-8 md:p-16 text-center relative overflow-hidden">
            
            {/* Background Textures */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#c5a059 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 border-[40px] border-[#c5a059]/10 rounded-full"></div>
            
            {/* Header */}
            <div className="flex flex-col items-center gap-6 mb-12">
               <div className="w-24 h-24 bg-[#c5a059] rounded-full flex items-center justify-center text-white shadow-xl">
                  <Award size={48} />
               </div>
               <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#1a1a1a] uppercase tracking-[0.2em] border-b-2 border-[#c5a059] pb-4 px-10">شهادة إتمام كورس</h1>
            </div>

            {/* Content */}
            <div className="space-y-10 relative z-10">
               <p className="text-[#666] text-lg italic font-serif">نشهد نحن منصة نيرسي للتعليم الطبي بأن الطالب:</p>
               <h2 className="text-4xl md:text-6xl font-black text-[#c5a059] font-sans drop-shadow-sm">{userName}</h2>
               <p className="text-[#666] text-lg font-serif">قد أتم بنجاح كافة متطلبات الكورس التدريبي بعنوان:</p>
               <h3 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] leading-tight">{courseTitle}</h3>
               
               <div className="flex flex-col md:flex-row items-center justify-around pt-12 gap-10">
                  <div className="text-center space-y-2">
                     <p className="text-[#999] text-[10px] font-bold uppercase tracking-widest">تاريخ الإصدار</p>
                     <p className="text-[#1a1a1a] font-bold border-t border-[#c5a059]/30 pt-2 px-6">{date}</p>
                  </div>
                  
                  <div className="relative">
                     <div className="w-24 h-24 bg-white p-2 border border-[#c5a059]/30 shadow-inner rounded-lg">
                        <QrCode size="100%" className="text-[#1a1a1a]" />
                     </div>
                     <p className="text-[#999] text-[8px] font-bold mt-2">تأكيد صحة الشهادة</p>
                  </div>

                  <div className="text-center space-y-2">
                     <p className="text-[#999] text-[10px] font-bold uppercase tracking-widest">ختم الاعتماد</p>
                     <div className="flex items-center justify-center text-[#c5a059]">
                        <ShieldCheck size={48} />
                     </div>
                  </div>
               </div>
            </div>

            <p className="mt-16 text-[#c5a059] font-black tracking-[0.5em] text-[10px] uppercase">Nursy Premium Education Platform</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
           <button className="bg-brand-gold text-brand-main px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-glow hover:scale-105 transition-all">
              <Download size={20} /> تحميل بجودة عالية (PDF)
           </button>
           <button onClick={onClose} className="bg-white/5 text-white p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <X size={24} />
           </button>
        </div>
      </div>
    </div>
  );
};
