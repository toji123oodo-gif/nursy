
import React, { useState, useEffect, useMemo } from 'react';
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
              <Link to={`/course/${course.id}`} key={course.id} className="group flex flex-col h-full premium-card rounded-[2.5rem] md:rounded-[3rem] overflow-hidden hover:scale-[1.01] transition-all duration-500">
                  <div className="h-64 relative overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={course.title} />
                    <div className="absolute top-6 left-6 bg-[#0a192f]/80 backdrop-blur-md border border-brand-gold/30 text-brand-gold px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest">
                      {course.subject}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b32] via-transparent to-transparent opacity-60"></div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-gold transition-colors duration-300 leading-tight">{course.title}</h3>
                    
                    <div className="flex items-center gap-5 text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-8">
                       <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <BookOpen size={13} className="text-brand-gold" /> {course.lessons.length} محاضرة
                       </span>
                       <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <Clock size={13} className="text-brand-gold" /> 15+ ساعة
                       </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                       <div className="flex flex-col">
                          {course.originalPrice && (
                            <span className="text-[10px] text-brand-muted/60 font-black line-through mb-1">{course.originalPrice} ج.م</span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-brand-gold tracking-tighter drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">{course.price}</span>
                            <span className="text-[10px] font-black text-brand-gold uppercase">ج.م</span>
                          </div>
                       </div>
                       
                       <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main group-hover:shadow-glow transition-all duration-500">
                          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
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
