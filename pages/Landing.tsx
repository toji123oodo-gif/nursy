
import React, { useState, useEffect, useMemo } from 'react';
/* Import Link from react-router-dom */
import { Link } from 'react-router-dom';
import { 
  Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, 
  Activity, Microscope, Stethoscope, BedDouble, Zap, Sparkles, 
  GraduationCap, Search, ChevronLeft, ArrowRight
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
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-[-10%] w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 left-[-5%] w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20">
              <Sparkles size={16} className="text-brand-gold" />
              <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">أكبر منصة لطلاب التمريض في مصر</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
              ذاكر بذكاء، <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-yellow-200">وكن الأول على دفعتك.</span>
            </h1>
            
            <p className="text-brand-muted text-xl md:text-2xl max-w-2xl leading-relaxed font-medium">
              نيرسي بتقدملك شرح أكاديمي مبسط لكل مواد التمريض، مع اختبارات تفاعلية ومذكرات PDF شاملة.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <Link to={user ? "/dashboard" : "/signup"} className="bg-brand-gold text-brand-main px-12 py-6 rounded-[2rem] font-black text-xl shadow-glow hover:scale-105 transition-all flex items-center gap-4">
                ابدأ رحلتك الآن <ArrowLeft size={24} />
              </Link>
              <Link to="/help" className="bg-white/5 text-white border border-white/10 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all flex items-center gap-4">
                عرفني أكتر <Play size={24} />
              </Link>
            </div>

            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: 'طالب مسجل', val: '50K+', icon: GraduationCap },
                 { label: 'ساعة شرح', val: '200+', icon: Play },
                 { label: 'اختبار دوري', val: '1.2K', icon: Award },
                 { label: 'تقييم ممتاز', val: '4.9/5', icon: Star },
               ].map((stat, i) => (
                 <div key={i} className="space-y-1">
                   <div className="text-brand-gold font-black text-3xl">{stat.val}</div>
                   <div className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 relative container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-10">
            <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter flex items-center gap-4">
                    <Zap className="text-brand-gold" /> محاضرات نيرسي
                </h2>
                <p className="text-brand-muted text-lg">كل المواد الأكاديمية اللي محتاجها في مكان واحد.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="ابحث عن مادة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-card/50 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white text-sm outline-none focus:border-brand-gold transition-all"
                    />
                </div>
                <div id="subject-filters" className="flex bg-brand-card/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar gap-2">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                                selectedSubject === subject
                                ? 'bg-brand-gold text-brand-main shadow-glow'
                                : 'text-brand-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {subject === 'All' ? 'الكل' : subject}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <Link 
                to={`/course/${course.id}`} 
                key={course.id} 
                className="group relative flex flex-col h-full bg-[#0d1321] rounded-[3rem] overflow-hidden border border-white/5 hover:border-brand-gold/40 hover:shadow-[0_0_60px_-15px_rgba(251,191,36,0.25)] transition-all duration-700"
              >
                  <div className="h-64 relative overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms]" alt={course.title} />
                    <div className="absolute top-6 left-6 bg-brand-main/80 backdrop-blur-md border border-white/10 text-brand-gold px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] z-10">
                      {course.subject}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1321] via-transparent to-transparent opacity-90"></div>
                  </div>
                  
                  <div className="p-8 md:p-10 flex-1 flex flex-col relative">
                    {/* Floating Info Pills */}
                    <div className="flex items-center gap-3 mb-6">
                       <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 group-hover:border-brand-gold/20 transition-colors">
                          <BookOpen size={14} className="text-brand-gold" />
                          <span className="text-white font-bold text-[10px] uppercase tracking-wider">{course.lessons.length} Lessons</span>
                       </div>
                       <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 group-hover:border-brand-gold/20 transition-colors">
                          <Clock size={14} className="text-brand-gold" />
                          <span className="text-white font-bold text-[10px] uppercase tracking-wider">12+ Hours</span>
                       </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white mb-8 group-hover:text-brand-gold transition-colors duration-500 leading-[1.2] tracking-tight">
                        {course.title}
                    </h3>
                    
                    <div className="mt-auto pt-8 border-t border-white/5 flex items-end justify-between">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] mb-1">Premium Access</span>
                          <div className="flex items-baseline gap-2">
                             <span className="text-5xl font-black text-brand-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all group-hover:scale-110 origin-right">
                                {course.price}
                             </span>
                             <span className="text-sm font-black text-brand-gold/60 uppercase">ج.م</span>
                          </div>
                          {course.originalPrice && (
                             <span className="text-xs text-brand-muted/40 font-bold line-through ml-1">{course.originalPrice} EGP</span>
                          )}
                       </div>
                       
                       <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] group-hover:rotate-[-10deg] transition-all duration-500">
                          <ArrowLeft size={28} />
                       </div>
                    </div>

                    {/* Decorative hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 to-brand-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
};
