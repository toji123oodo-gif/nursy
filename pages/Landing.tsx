
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, 
  Activity, Microscope, Stethoscope, BedDouble, User, Filter, Zap, ChevronDown, 
  Sparkles, GraduationCap, MessageCircle, Briefcase, MousePointer2, Smartphone, 
  Users, FileCheck, Search, UserPlus, LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const getCourseIcon = (subject: string) => {
  switch(subject) {
    case 'Anatomy': return <Skull size={14} />;
    case 'Physiology': return <Activity size={14} />;
    case 'Microbiology': return <Microscope size={14} />;
    case 'Adult Nursing': return <BedDouble size={14} />;
    case 'Health': return <Stethoscope size={14} />;
    default: return <BookOpen size={14} />;
  }
};

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSubject = selectedSubject === 'All' || c.subject === selectedSubject;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [courses, selectedSubject, searchQuery]);

  return (
    <div className="pb-20">
      
      {/* Hero Section - Optimized for Mobile */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2400&auto=format&fit=crop" 
                alt="Premium Nursing Education" 
                className="w-full h-full object-cover opacity-15 md:opacity-20 scale-105 animate-[fadeIn_2s_ease-out]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-brand-main/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-10 md:pt-20">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-gold/10 text-brand-gold px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-black mb-6 md:mb-8 border border-brand-gold/20 animate-fade-in-up">
                <Sparkles size={14} className="animate-pulse" />
                <span className="tracking-widest uppercase">المنصة التعليمية الأولى لطلاب التمريض في مصر</span>
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] tracking-tighter text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                مستقبلك يبدأ مع <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-400 to-white">
                  Nursy Premium
                </span>
            </h1>
            
            <p className="text-brand-muted text-lg md:text-2xl mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                شرح حصري لمناهج كليات التمريض والمعاهد الفنية. تعلم بأحدث التقنيات مع نخبة من الأساتذة.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto px-4 md:px-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link to="/dashboard" className="group relative bg-brand-gold text-brand-main text-lg md:text-xl font-black py-4 md:py-5 px-8 md:px-14 rounded-2xl overflow-hidden shadow-glow hover:shadow-[0_20px_50px_rgba(251,191,36,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                  <span className="relative z-10">ابدأ التعلم الآن</span>
                  <ArrowLeft size={24} strokeWidth={3} className="relative z-10 group-hover:-translate-x-2 transition-transform" />
                </Link>

                <Link to="/signup" className="group relative bg-white/5 border border-white/10 text-white text-lg md:text-xl font-black py-4 md:py-5 px-8 md:px-14 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-brand-gold/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                  <span className="relative z-10">سجل مجاناً</span>
                  <UserPlus size={22} className="relative z-10 group-hover:scale-110 transition-transform text-brand-gold" />
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 md:py-24 relative" id="courses">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 md:mb-16 gap-8">
            <div className="text-right w-full lg:w-auto">
                <div className="flex items-center justify-end gap-2 text-brand-gold font-bold mb-3 md:mb-4 uppercase tracking-[0.3em] text-[10px] md:text-xs">
                    <div className="w-8 md:w-10 h-0.5 bg-brand-gold"></div>
                    تطوير المحتوى التعليمي
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4">اكتشف كورسـاتك</h2>
                <p className="text-brand-muted text-base md:text-lg max-w-xl">اختر مادتك وابدأ رحلة التفوق الآن.</p>
            </div>

            {/* Filters and Search - Responsive */}
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                <div className="relative group w-full md:w-auto">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="ابحث عن مادة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-brand-card/50 border border-white/10 rounded-2xl pr-12 pl-6 py-3.5 md:py-4 text-white text-sm md:text-base outline-none focus:border-brand-gold transition-all w-full md:w-64"
                    />
                </div>
                <div className="flex bg-brand-card/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide no-scrollbar">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${
                                selectedSubject === subject
                                ? 'bg-brand-gold text-brand-main shadow-glow'
                                : 'text-brand-muted hover:text-white'
                            }`}
                        >
                            {subject === 'All' ? 'الكل' : subject}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
               [1, 2, 3].map((_, i) => (
                   <div key={i} className="bg-brand-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 h-[400px] md:h-[450px] animate-pulse"></div>
               ))
            ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                <Link to={`/course/${course.id}`} key={course.id} className="group relative">
                    <div className="h-full bg-brand-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-gold/50 transition-all duration-500 flex flex-col hover:-translate-y-2 shadow-xl hover:shadow-glow/20">
                        {/* Image */}
                        <div className="relative h-48 md:h-56 overflow-hidden">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-60"></div>
                            <div className="absolute top-4 right-4 bg-brand-main/80 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/10 text-[9px] md:text-[10px] font-black text-brand-gold flex items-center gap-2">
                                {getCourseIcon(course.subject)}
                                {course.subject}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                            <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 group-hover:text-brand-gold transition-colors">{course.title}</h3>
                            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-brand-muted mb-6">
                                <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-brand-gold" /> {course.lessons.length} دروس</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-gold" /> محتوى شامل</span>
                            </div>
                            
                            <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] md:text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-1">سعر الكورس</p>
                                    <p className="text-xl md:text-2xl font-black text-white">{course.price} <span className="text-xs">ج.م</span></p>
                                </div>
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-main rounded-xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main transition-all">
                                    {/* Fix: Using className for responsive icon sizing instead of invalid 'md:size' prop */}
                                    <ArrowLeft className="w-[18px] h-[18px] md:w-5 md:h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                ))
            ) : (
                <div className="col-span-full py-20 text-center bg-brand-card/30 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
                    <Search size={40} className="mx-auto mb-4 text-brand-muted opacity-20" />
                    <p className="text-brand-muted font-bold">لا توجد نتائج تطابق بحثك</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="container mx-auto px-6 py-8 md:py-12">
         <div className="bg-brand-gold p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-glow flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 text-center md:text-right">
                <h3 className="text-2xl md:text-4xl font-black text-brand-main mb-3 md:mb-4">هل لديك أي استفسار؟</h3>
                <p className="text-brand-main/80 font-bold text-base md:text-lg">فريق دعم نيرسي متواجد لمساعدتك 24/7.</p>
            </div>
            <a href="https://wa.me/201093077151" target="_blank" rel="noopener noreferrer" className="relative z-10 w-full md:w-auto bg-brand-main text-brand-gold px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                <MessageCircle fill="currentColor" size={24} /> تواصل معنا الآن
            </a>
         </div>
      </section>
    </div>
  );
};
