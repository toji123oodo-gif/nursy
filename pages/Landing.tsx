
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, GraduationCap, Award, Star, ArrowLeft, 
  Zap, Sparkles, Search, BookOpen, Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-5xl space-y-6 md:space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-brand-gold/10 px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-brand-gold/20">
              <Sparkles size={14} className="text-brand-gold" />
              <span className="text-brand-gold text-[8px] md:text-[10px] font-black uppercase tracking-widest">منصة التمريض رقم 1 في مصر</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              تعلم التمريض <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-yellow-200">بأسلوب عصري.</span>
            </h1>
            
            <p className="text-brand-muted text-sm md:text-2xl max-w-2xl font-medium leading-relaxed">
              شرح مبسط، ملفات PDF، واختبارات تفاعلية لكل كليات ومعاهد التمريض.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to={user ? "/dashboard" : "/signup"} className="bg-brand-gold text-brand-main px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl shadow-glow text-center">ابدأ الآن</Link>
              <Link to="/help" className="bg-white/5 text-white border border-white/10 px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl text-center">شاهد فيديو تعريفي</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 md:py-24 container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8 mb-12 border-b border-white/5 pb-8">
            <div className="text-center md:text-right">
                <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">المحاضرات المتاحة</h2>
                <p className="text-brand-muted text-sm md:text-lg mt-2">اختر تخصصك وابدأ المذاكرة فوراً.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input type="text" placeholder="ابحث عن مادة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-brand-card/50 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {subjects.map(subject => (
                        <button key={subject} onClick={() => setSelectedSubject(subject)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${selectedSubject === subject ? 'bg-brand-gold text-brand-main' : 'text-brand-muted bg-white/5'}`}>
                            {subject === 'All' ? 'الكل' : subject}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredCourses.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id} className="group bg-brand-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-gold/40 transition-all duration-500 flex flex-col h-full">
                  <div className="h-48 md:h-64 relative">
                    <img src={course.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={course.title} />
                    <div className="absolute top-4 left-4 bg-brand-main/80 text-brand-gold px-3 py-1 rounded-full font-black text-[8px] uppercase">{course.subject}</div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-brand-gold transition-colors mb-6">{course.title}</h3>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-2xl font-black text-brand-gold">{course.price} ج.م</span>
                          <span className="text-[10px] text-brand-muted font-bold">اشتراك كامل</span>
                       </div>
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main transition-all">
                          <ArrowLeft size={20} />
                       </div>
                    </div>
                  </div>
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
};
