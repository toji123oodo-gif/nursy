
import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  Play, GraduationCap, Award, Star, ArrowLeft, 
  Zap, Sparkles, BookOpen, Clock, ChevronLeft,
  ArrowRight, PlayCircle, X, Brain, MessageSquare,
  ShieldCheck, Share2, MousePointer2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [scrollY, setScrollY] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  }, [selectedSubject]);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      return selectedSubject === 'All' || c.subject === selectedSubject;
    });
  }, [courses, selectedSubject]);

  return (
    <div className="pb-32 overflow-x-hidden bg-brand-main bg-mesh">
      {/* Tutorial Video Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-2xl animate-fade-in" onClick={() => setIsTutorialOpen(false)}></div>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up border border-white/10">
             <button 
               onClick={() => setIsTutorialOpen(false)} 
               className="absolute top-8 right-8 z-20 w-14 h-14 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-main transition-all backdrop-blur-md"
             >
               <X size={28}/>
             </button>
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

      {/* Hero Section 2.0 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        
        {/* Animated Background Elements */}
        <div 
          className="absolute top-1/4 -right-40 w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[140px] animate-pulse ns-parallax"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] ns-parallax"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        ></div>

        <div className="container mx-auto text-center relative z-10 max-w-6xl">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-12 ns-animate--fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={18} className="text-brand-gold animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-text">أكبر منصة تعليمية لطلاب التمريض في مصر</span>
          </div>
          
          <h1 className="text-7xl md:text-[11rem] font-black text-white leading-[0.9] tracking-tighter mb-10 ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
            مستقبلك في <br />
            <span className="ns-text--gradient text-glow">التمريض</span> يبدأ هنا.
          </h1>
          
          <p className="text-brand-muted text-xl md:text-3xl max-w-4xl mx-auto mb-16 font-medium leading-relaxed ns-animate--fade-in-up" style={{ animationDelay: '0.3s' }}>
            نقدم لك تجربة تعليمية فريدة تعتمد على <span className="text-brand-gold font-black">الشرح الصوتي</span> والذكاء الاصطناعي لتبسيط أصعب المواد الأكاديمية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 ns-animate--fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to={user ? "/dashboard" : "/signup"} className="ns-surface--gold-gradient text-brand-main px-14 py-7 rounded-[2rem] font-black text-2xl ns-shadow--premium hover:scale-105 active:scale-95 transition-all">
              ابدأ رحلة التميز الآن
            </Link>
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="bg-white/5 text-white border border-white/10 px-14 py-7 rounded-[2rem] font-black text-2xl hover:bg-white/10 transition-all flex items-center gap-4 group backdrop-blur-md"
            >
              <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-main group-hover:scale-110 transition-transform">
                <Play size={20} fill="currentColor" />
              </div>
              كيفية الاستخدام
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 ns-animate--float">
           <div className="w-8 h-14 border-2 border-white/20 rounded-full flex justify-center p-2 backdrop-blur-sm">
              <div className="w-1.5 h-3 bg-brand-gold rounded-full animate-bounce"></div>
           </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[700px]">
          
          {/* Main Feature: Podcasts */}
          <div className="md:col-span-7 bg-brand-card/40 border border-white/5 rounded-[4rem] p-12 flex flex-col justify-end relative overflow-hidden group ns-reveal">
            <div className="absolute top-12 left-12 w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-[2rem] flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Zap size={48} />
            </div>
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700">
               <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="podcasts" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-4xl font-black text-white tracking-tight">شروحات صوتية (بودكاست)</h3>
              <p className="text-brand-muted text-lg max-w-md font-medium">ذاكر في أي وقت وأي مكان، حتى وأنت في المواصلات، بأسلوب شرح ممتع ومبسط جداً.</p>
            </div>
          </div>

          {/* Secondary Feature: AI Vision */}
          <div className="md:col-span-5 bg-brand-gold text-brand-main rounded-[4rem] p-12 flex flex-col justify-between relative overflow-hidden group ns-reveal">
            <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-brand-main/10 rotate-12" />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-brand-main text-brand-gold rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain size={32} />
              </div>
              <h3 className="text-3xl font-black tracking-tight">تحليل ذكي للفيديوهات</h3>
              <p className="text-brand-main/80 text-lg font-bold">ارفع أي فيديو لعملية تمريضية، ودع ذكاء نيرسي الاصطناعي يشرح لك كل خطوة بالتفصيل.</p>
            </div>
            <Link to="/ai-vision" className="bg-brand-main text-brand-gold px-8 py-4 rounded-2xl font-black text-sm w-fit shadow-2xl hover:scale-105 transition-all">
              جرب المساعد الذكي
            </Link>
          </div>

          {/* Third Feature: Community */}
          <div className="md:col-span-5 bg-brand-card/40 border border-white/5 rounded-[4rem] p-12 flex items-center gap-8 group ns-reveal">
             <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-[2rem] flex items-center justify-center shrink-0">
                <MessageSquare size={32} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-white mb-2">مجتمع الفرسان</h3>
                <p className="text-brand-muted text-sm font-medium">شات مباشر يجمع طلاب التمريض من كل محافظات مصر لتبادل الخبرات والأسئلة.</p>
             </div>
          </div>

          {/* Fourth Feature: Certificates */}
          <div className="md:col-span-7 bg-brand-card/40 border border-white/5 rounded-[4rem] p-12 flex items-center justify-between group overflow-hidden ns-reveal">
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-white">شهادات معتمدة</h3>
               <p className="text-brand-muted text-sm font-medium">احصل على شهادة موثقة من المنصة بعد إتمام كل كورس ونجاحك في الاختبارات.</p>
            </div>
            <div className="w-32 h-32 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
               <Award size={64} />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 ns-reveal">
          <div className="space-y-4 text-right">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">أقوى الكورسات <span className="text-brand-gold">الأكاديمية</span></h2>
            <p className="text-brand-muted text-xl font-medium max-w-xl">اختر المادة اللي شايل همها، وسيب الباقي على نيرسي.</p>
          </div>
          
          <div className="flex gap-3 bg-brand-card/60 p-2 rounded-[2.5rem] border border-white/10 backdrop-blur-xl overflow-x-auto ns-util--no-scrollbar">
            {subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => setSelectedSubject(sub)}
                className={`px-10 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${selectedSubject === sub ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
              >
                {sub === 'All' ? 'كل المواد' : sub}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredCourses.map((course, idx) => (
            <Link 
              to={`/course/${course.id}`} 
              key={course.id} 
              className="group bg-brand-card/40 rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-brand-gold/40 transition-all duration-700 flex flex-col h-full shadow-xl hover:ns-shadow--premium ns-reveal"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
                <div className="h-72 relative overflow-hidden">
                  <img src={course.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={course.title} />
                  <div className="absolute top-8 left-8 bg-brand-main/80 backdrop-blur-md text-brand-gold px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-brand-gold/20">
                    {course.subject}
                  </div>
                  {course.price === 0 && (
                    <div className="absolute top-8 right-8 bg-green-500 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-glow-green animate-pulse">
                      مجاني لفترة
                    </div>
                  )}
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-3xl font-black text-white mb-8 group-hover:text-brand-gold transition-colors leading-tight">{course.title}</h3>
                  
                  <div className="flex items-center gap-6 mb-10">
                     <div className="flex items-center gap-3 text-brand-muted text-sm font-bold">
                        <BookOpen size={20} className="text-brand-gold" />
                        <span>{course.lessons.length} محاضرة</span>
                     </div>
                     <div className="flex items-center gap-3 text-brand-muted text-sm font-bold">
                        <Star size={20} className="text-brand-gold" fill="currentColor" />
                        <span>4.9 التقييم</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-brand-muted text-[10px] font-black uppercase mb-1 tracking-widest">المحاضر</span>
                        <span className="text-xl font-black text-white">{course.instructor || 'د. نيرسي'}</span>
                     </div>
                     <div className="w-16 h-16 bg-white/5 rounded-[1.8rem] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main transition-all duration-500 border border-white/10">
                        <ArrowLeft size={28} />
                     </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="container mx-auto px-6 pt-32">
         <div className="bg-brand-card/40 border border-white/10 rounded-[4rem] p-12 md:p-20 backdrop-blur-2xl flex flex-wrap justify-center md:justify-between items-center gap-12 text-center md:text-right ns-reveal">
            <div className="space-y-2">
               <h4 className="text-6xl font-black text-white">15,000+</h4>
               <p className="text-brand-muted font-bold text-lg uppercase tracking-widest">طالب تمريض مسجل</p>
            </div>
            <div className="w-px h-20 bg-white/10 hidden md:block"></div>
            <div className="space-y-2">
               <h4 className="text-6xl font-black text-white">850+</h4>
               <p className="text-brand-muted font-bold text-lg uppercase tracking-widest">محاضرة صوتية حصرية</p>
            </div>
            <div className="w-px h-20 bg-white/10 hidden md:block"></div>
            <div className="space-y-2">
               <h4 className="text-6xl font-black text-white">4.9/5</h4>
               <p className="text-brand-muted font-bold text-lg uppercase tracking-widest">تقييم الطلاب للمنصة</p>
            </div>
         </div>
      </section>
    </div>
  );
};
