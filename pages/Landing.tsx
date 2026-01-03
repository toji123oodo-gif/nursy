
import React, { useState, useMemo, useEffect, useRef } from 'react';
/* Fix: Using star import for react-router-dom to resolve "no exported member" errors */
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  Play, GraduationCap, Award, Star, ArrowLeft, 
  Zap, Sparkles, Search, BookOpen, Clock, ChevronLeft,
  ArrowRight, PlayCircle, X, Brain
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  // Parallax Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Reveal Effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ns-reveal--active');
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.ns-reveal');
    items.forEach(item => observer.observe(item));

    return () => items.forEach(item => observer.unobserve(item));
  }, [selectedSubject, searchQuery]);

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
    <div className="pb-32 overflow-x-hidden bg-brand-main">
      {/* Tutorial Video Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsTutorialOpen(false)}></div>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-up border border-white/10">
             <button 
               onClick={() => setIsTutorialOpen(false)} 
               className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-main transition-all"
             >
               <X size={24}/>
             </button>
             {/* Placeholder for real tutorial video */}
             <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Nursy Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
             ></iframe>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        
        <div 
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse ns-parallax"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] ns-parallax"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        ></div>

        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ transform: `scale(1.1) translateY(${scrollY * 0.1}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="parallax-bg"
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-10 ns-animate--fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={16} className="text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted">أول منصة صوتية للتمريض في مصر</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter mb-8 ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
            مستقبلك في <br />
            <span className="ns-text--gradient">التمريض</span> يبدأ هنا.
          </h1>
          
          <p className="text-brand-muted text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed ns-animate--fade-in-up" style={{ animationDelay: '0.3s' }}>
            استمتع بشرح صوتي (بودكاست) احترافي، <span className="text-brand-gold">تحليل ذكي للفيديوهات</span>، مذكرات PDF منظمة، واختبارات تفاعلية ذكية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 ns-animate--fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to={user ? "/dashboard" : "/signup"} className="ns-surface--gold-gradient text-brand-main px-12 py-6 rounded-3xl font-black text-xl ns-shadow--premium hover:scale-105 transition-all">
              ابدأ رحلة التميز
            </Link>
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="bg-white/5 text-white border border-white/10 px-12 py-6 rounded-3xl font-black text-xl hover:bg-white/10 transition-all flex items-center gap-3 group"
            >
              <PlayCircle className="text-brand-gold group-hover:scale-110 transition-transform" /> فيديو توضيحي
            </button>
          </div>
          
          <div className="mt-12 ns-animate--fade-in-up" style={{ animationDelay: '0.5s' }}>
             <Link to="/ai-vision" className="inline-flex items-center gap-4 px-8 py-3 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl text-brand-gold font-black text-sm hover:bg-brand-gold/20 transition-all shadow-glow">
                <Brain size={20} /> جرّب مساعد الذكاء الاصطناعي لتحليل الفيديوهات
             </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 ns-animate--float">
           <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-brand-gold rounded-full"></div>
           </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'طالب مسجل', val: '15,000+', icon: GraduationCap },
             { label: 'محاضرة صوتية', val: '800+', icon: Zap },
             { label: 'ذكاء اصطناعي', val: 'Video AI', icon: Brain }
           ].map((stat, i) => (
             <div key={i} className="ns-card--glass p-10 rounded-[3rem] text-center border-white/5 group hover:border-brand-gold/30 transition-all ns-reveal">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-gold group-hover:scale-110 transition-transform">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-4xl font-black text-white mb-2">{stat.val}</h3>
                <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pt-32 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-right ns-reveal">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">اكتشف محاضراتنا</h2>
            <p className="text-brand-muted text-lg font-medium">اختر المادة العلمية وابدأ المذاكرة بأذكى أسلوب.</p>
          </div>
          
          <div id="subject-filters" className="flex gap-3 bg-brand-card p-2 rounded-2xl border border-white/5 overflow-x-auto ns-util--no-scrollbar ns-reveal">
            {subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => setSelectedSubject(sub)}
                className={`px-8 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${selectedSubject === sub ? 'bg-brand-gold text-brand-main ns-shadow--premium' : 'text-brand-muted hover:text-white'}`}
              >
                {sub === 'All' ? 'الكل' : sub}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course, idx) => (
            <Link 
              to={`/course/${course.id}`} 
              key={course.id} 
              className="group bg-brand-card rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-brand-gold/40 transition-all duration-700 flex flex-col h-full shadow-lg hover:ns-shadow--premium ns-reveal"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
                <div className="h-64 relative overflow-hidden">
                  <img src={course.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={course.title} />
                  <div className="absolute top-6 left-6 bg-brand-main/80 backdrop-blur-md text-brand-gold px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10">
                    {course.subject}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-6 group-hover:text-brand-gold transition-colors leading-tight">{course.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold">
                        <BookOpen size={18} />
                     </div>
                     <span className="text-brand-muted text-sm font-bold">{course.lessons.length} محاضرة احترافية</span>
                  </div>

                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-brand-muted text-[10px] font-black uppercase mb-1">قيمة المادة</span>
                        <span className="text-3xl font-black text-white">{course.price} <span className="text-brand-gold text-sm font-black">ج.م</span></span>
                     </div>
                     <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main transition-all duration-500 shadow-inner">
                        <ArrowLeft size={24} />
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
