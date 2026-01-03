
import React, { useState, useMemo } from 'react';
import { Award, Search, Sparkles, Filter, Info, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CertificateCard } from '../components/certificates/CertificateCard';
import { CertificatePreview } from '../components/certificates/CertificatePreview';

export const Certificates: React.FC = () => {
  const { user, courses } = useApp();
  const [previewData, setPreviewData] = useState<{title: string; date: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const completedCertificates = useMemo(() => {
    if (!user) return [];
    return courses.map(course => {
      const courseLessons = course.lessons.map(l => l.id);
      const userCompletedInCourse = user.completedLessons?.filter(id => courseLessons.includes(id)) || [];
      const isCompleted = userCompletedInCourse.length === course.lessons.length && course.lessons.length > 0;
      
      return {
        id: course.id,
        title: course.title,
        isUnlocked: isCompleted,
        date: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('ar-EG') : '2024/01/01'
      };
    }).filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [user, courses, searchTerm]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-main py-12 px-6">
      {previewData && (
        <CertificatePreview 
          userName={user.name} 
          courseTitle={previewData.title} 
          date={previewData.date} 
          onClose={() => setPreviewData(null)} 
        />
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="bg-brand-card rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden ns-animate--fade-in-up">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] animate-pulse"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-6 text-center md:text-right">
                <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20 text-brand-gold font-black uppercase tracking-widest text-[10px]">
                  <Award size={14} fill="currentColor" /> حائط الإنجازات
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  شهاداتك <span className="text-brand-gold">الموثقة</span>
                </h1>
                <p className="text-brand-muted text-lg font-medium max-w-md">
                   هنا تجد كل ثمار مجهودك وتعبك. كل شهادة هي خطوة حقيقية نحو مستقبلك المهني.
                </p>
              </div>
              <div className="w-40 h-40 bg-brand-main rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center shadow-inner group">
                 <p className="text-brand-gold font-black text-4xl mb-1">{completedCertificates.filter(c => c.isUnlocked).length}</p>
                 <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest">شهادة محققة</p>
              </div>
           </div>
        </div>

        {/* Filters and List */}
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث عن شهادة محددة..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-card border border-white/5 rounded-2xl pr-14 pl-6 py-4 text-white text-sm outline-none focus:border-brand-gold/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-4 text-brand-muted text-[10px] font-black uppercase tracking-[0.2em]">
                 <Sparkles size={16} className="text-brand-gold" /> استحقاق الجدارة التعليمية
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {completedCertificates.map((cert) => (
               <CertificateCard 
                 key={cert.id}
                 courseTitle={cert.title}
                 isUnlocked={cert.isUnlocked}
                 completionDate={cert.date}
                 onPreview={() => setPreviewData({title: cert.title, date: cert.date})}
               />
             ))}
           </div>

           {completedCertificates.length === 0 && (
             <div className="py-32 text-center bg-brand-card/20 rounded-[4rem] border-2 border-dashed border-white/5">
                <Award size={64} className="mx-auto text-brand-muted/20 mb-6" />
                <h3 className="text-xl font-black text-brand-muted">لم يتم العثور على شهادات تطابق البحث</h3>
             </div>
           )}
        </div>

        {/* Tip Box */}
        <div className="bg-brand-gold/5 border border-brand-gold/10 p-8 rounded-[2.5rem] flex items-center gap-6 ns-animate--fade-in-up">
           <div className="w-14 h-14 bg-brand-gold text-brand-main rounded-2xl flex items-center justify-center shrink-0 shadow-glow">
              <Info size={24} />
           </div>
           <div>
              <h4 className="text-white font-black text-lg mb-1">هل تعلم؟</h4>
              <p className="text-brand-muted text-xs font-bold leading-relaxed">
                 شهادات نيرسي معترف بها في العديد من المؤسسات التدريبية كدليل على حضورك وفهمك للمادة العلمية. يمكنك طباعتها وإضافتها لملفك الشخصي (CV).
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
