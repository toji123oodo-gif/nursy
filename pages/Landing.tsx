
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, Activity, Microscope, Stethoscope, BedDouble, User, Filter, Zap, ChevronDown, Sparkles, GraduationCap, MessageCircle, Briefcase, MousePointer2, Smartphone, Users, FileCheck } from 'lucide-react';
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

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (selectedSubject === 'All') return courses;
    return courses.filter(c => c.subject === selectedSubject);
  }, [courses, selectedSubject]);

  return (
    <div className="pb-20">
      
      {/* Refined Welcome/Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2400&auto=format&fit=crop" 
                alt="Premium Nursing Education" 
                className="w-full h-full object-cover opacity-30 scale-105 animate-[fadeIn_2s_ease-out]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-main via-brand-main/90 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-brand-main/40 to-transparent"></div>
            
            {/* Animated particles / blobs */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px] animate-float"></div>
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-3/5 text-right">
              <div className="inline-flex items-center gap-3 n-glass text-brand-gold px-6 py-2.5 rounded-full text-sm font-black mb-10 border border-brand-gold/20 shadow-glow animate-fade-in-up">
                  <div className="p-1 bg-brand-gold text-brand-main rounded-full"><Sparkles size={14} /></div>
                  <span className="tracking-widest uppercase text-[10px] md:text-xs">المنصة الأولى لطلاب التمريض في مصر</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tighter text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Nursy<span className="text-brand-gold">.</span> <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-yellow-300 to-white">
                  طريقك للقمة <br/>في التمريض
                </span>
              </h1>
              
              <p className="text-brand-muted text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                شرح حصري لمناهج كليات التمريض والمعاهد الفنية. تعلم بأحدث التقنيات مع نخبة من أفضل الأساتذة وبأقل تكلفة اشتراك في مصر.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Link to="/dashboard" className="bg-brand-gold text-brand-main text-xl font-black py-5 px-12 rounded-2xl hover:bg-brand-goldHover transition-all transform hover:-translate-y-2 hover:scale-105 shadow-[0_20px_40px_rgba(251,191,36,0.3)] flex items-center justify-center gap-4 group">
                  <span>ابدأ التعلم الآن</span>
                  <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
                </Link>
                <button className="n-glass group px-12 py-5 rounded-2xl border border-white/10 hover:border-brand-gold/40 hover:bg-white/5 transition-all flex items-center justify-center gap-4 text-white font-bold text-lg">
                  <span>جولة في المنصة</span>
                  <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-main flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    <Play size={16} fill="currentColor" />
                  </div>
                </button>
              </div>
              
              <div className="mt-20 flex flex-wrap items-center justify-start gap-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="group cursor-default">
                      <h4 className="text-4xl font-black text-white group-hover:text-brand-gold transition-colors">50 <span className="text-lg">ج.م</span></h4>
                      <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">سعر رمزي شهرياً</p>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                  <div className="group cursor-default">
                      <h4 className="text-4xl font-black text-white group-hover:text-brand-gold transition-colors">150+</h4>
                      <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">فيديو عالي الجودة</p>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                  <div className="group cursor-default">
                      <h4 className="text-4xl font-black text-white group-hover:text-brand-gold transition-colors">5000+</h4>
                      <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">طالب مشترك</p>
                  </div>
              </div>
            </div>

            {/* Visual Floating Elements */}
            <div className="lg:w-2/5 relative hidden lg:block n-perspective animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="relative w-full aspect-square max-w-[500px] mx-auto group">
                    <div className="absolute inset-0 bg-brand-gold/10 blur-[100px] rounded-full animate-pulse group-hover:bg-brand-gold/20 transition-all duration-1000"></div>
                    
                    <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-all duration-1000 bg-brand-card">
                         <img 
                            src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=1200&auto=format&fit=crop" 
                            alt="Professional Healthcare Learning" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-transparent to-transparent"></div>
                    </div>
                    
                    {/* Floating Achievement Card */}
                    <div className="absolute -bottom-6 -left-12 n-glass p-6 rounded-3xl border border-white/20 shadow-2xl z-20 animate-float">
                        <div className="flex items-center gap-5">
                            <div className="bg-brand-gold p-4 rounded-2xl shadow-glow">
                                <Award className="text-brand-main" size={32} />
                            </div>
                            <div className="text-right">
                                <p className="font-black text-white text-xl">شهادة إتمام</p>
                                <p className="text-xs text-brand-muted font-bold">معتمدة من أكاديمية نيرسي</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Stats Card */}
                    <div className="absolute top-10 -right-10 n-glass p-5 rounded-3xl border border-white/20 shadow-2xl z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                <Activity size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-brand-muted font-bold">تحصيلك الدراسي</p>
                                <p className="font-black text-white">ممتاز 98%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <div className="n-glass p-3 rounded-full border border-white/10">
                <ChevronDown size={24} className="text-brand-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - REIMAGINED */}
      <section className="py-32 relative overflow-hidden bg-brand-main">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-24 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 text-brand-gold font-black bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20 mb-6 uppercase tracking-[0.2em] text-[10px]">
                    <MousePointer2 size={12} fill="currentColor" />
                    <span>لماذا نختار نيرسي؟</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                    تجربة تعليمية <span className="text-brand-gold">مختلفة</span> عن أي مكان تاني
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-l from-brand-gold to-yellow-200 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { 
                        title: "شرح أكاديمي مبسط", 
                        desc: "شرح يطابق المنهج الموحد لكليات التمريض المصرية، بنحول المعلومة الصعبة لقصة سهلة بتثبت في دماغك.", 
                        icon: GraduationCap, 
                        color: "brand-gold",
                        badge: "Academic"
                    },
                    { 
                        title: "أقل سعر في مصر", 
                        desc: "التعليم حق لكل طالب، عشان كدا وفرنا لك كل المحتوى بسعر رمزي جداً (50 ج.م) شهرياً، كأنك بتاخد درس بمليم.", 
                        icon: Zap, 
                        color: "blue-500",
                        badge: "Budget"
                    },
                    { 
                        title: "دعم فني وتفعيل فوري", 
                        desc: "فريقنا معاك 24 ساعة للرد على استفساراتك وتفعيل حسابك في دقايق عبر فودافون كاش أو انستا باي.", 
                        icon: MessageCircle, 
                        color: "green-500",
                        badge: "Support"
                    },
                    { 
                        title: "مذكرات ملخصة PDF", 
                        desc: "مش بس فيديوهات، هتقدر تحمل مذكرات ملخصة لكل محاضرة عشان تذاكر في أي وقت حتى لو مفيش إنترنت.", 
                        icon: FileCheck, 
                        color: "purple-500",
                        badge: "Resources"
                    },
                    { 
                        title: "تطوير مهني وعملي", 
                        desc: "مش بنعلمك نظري بس، بنعرفك إزاي تطبق اللي درسته في المستشفى عشان تكون ممرض محترف من أول يوم.", 
                        icon: Briefcase, 
                        color: "orange-500",
                        badge: "Career"
                    },
                    { 
                        title: "مجتمع طلاب نيرسي", 
                        desc: "انضم لأكبر تجمع لطلاب التمريض في مصر، تبادل خبرات، أسئلة، ومناقشات علمية مفيدة تحت إشراف الدكاترة.", 
                        icon: Users, 
                        color: "pink-500",
                        badge: "Community"
                    }
                ].map((item, idx) => (
                    <div 
                        key={idx} 
                        className="group bg-brand-card/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] hover:border-brand-gold/30 transition-all duration-500 relative overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        {/* Background Visual Shine */}
                        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-${item.color}/5 blur-[80px] rounded-full group-hover:bg-${item.color}/10 transition-all duration-700`}></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`w-20 h-20 bg-brand-main border border-white/10 rounded-[1.8rem] flex items-center justify-center group-hover:border-${item.color}/40 transition-all duration-500 group-hover:-rotate-12 shadow-2xl`}>
                                    <item.icon className={`text-${item.color}`} size={40} strokeWidth={2.5} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-brand-muted`}>
                                    {item.badge}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-5 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                            <p className="text-brand-muted leading-relaxed text-lg font-light group-hover:text-white/80 transition-colors">
                                {item.desc}
                            </p>
                        </div>
                        
                        {/* Decorative Line */}
                        <div className="absolute bottom-0 right-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-brand-gold/0 to-transparent group-hover:via-brand-gold/40 transition-all duration-700"></div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA Teaser */}
            <div className="mt-24 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="bg-brand-gold/5 border border-brand-gold/20 p-10 rounded-[3rem] inline-block max-w-4xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-right">
                        <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-brand-main shadow-glow shrink-0 animate-bounce-slow">
                            <Smartphone size={32} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white mb-2">تواصل معانا دلوقتي على واتساب</h4>
                            <p className="text-brand-muted font-medium">لو عندك أي استفسار قبل ما تشترك، فريقنا جاهز يرد عليك في أي وقت.</p>
                        </div>
                        <a 
                            href="https://wa.me/201093077151" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-brand-gold text-brand-main px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-glow flex items-center gap-3 whitespace-nowrap"
                        >
                            تواصل فوراً <MessageCircle size={18} fill="currentColor" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-right">
                <div className="flex items-center gap-2 text-brand-gold font-bold mb-4 uppercase tracking-widest text-sm">
                    <div className="w-8 h-0.5 bg-brand-gold"></div>
                    المحتوى التعليمي
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">اكتشف كورسـاتك</h2>
                <p className="text-brand-muted text-lg max-w-xl">مواد الكلية مشروحة بالتفصيل وبأبسط الطرق الممكنة.</p>
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap gap-3 justify-end n-glass p-2 rounded-2xl border border-white/5">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all border flex items-center gap-3 ${
                            selectedSubject === subject
                            ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-105'
                            : 'text-brand-muted border-transparent hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {subject !== 'All' && <div className={`${selectedSubject === subject ? 'text-brand-main' : 'text-brand-gold'}`}>{getCourseIcon(subject)}</div>}
                        {subject === 'All' ? 'الكل' : subject}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
               [1, 2, 3].map((_, i) => (
                   <div key={i} className="bg-brand-card rounded-[2.5rem] overflow-hidden border border-white/5 h-[500px] animate-pulse"></div>
               ))
            ) : (
                filteredCourses.map((course) => {
                const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
                
                return (
                <Link to={`/course/${course.id}`} key={course.id} className="block group relative animate-fade-in-up">
                    <div className="bg-brand-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-gold/50 transition-all duration-700 shadow-2xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] h-full flex flex-col">
                        
                        {/* Image Area */}
                        <div className="relative h-64 overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent z-10 opacity-60"></div>
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" />
                            
                            {/* Badges */}
                            <div className="absolute top-6 right-6 z-20">
                                <div className="n-glass text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 backdrop-blur-xl">
                                    {getCourseIcon(course.subject)}
                                    {course.subject}
                                </div>
                            </div>
                            
                            {discount > 0 && (
                                <div className="absolute top-6 left-6 z-20 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl animate-heartbeat">
                                    -{discount}%
                                </div>
                            )}

                            {/* Floating Instructor */}
                            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-brand-main/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
                                 <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-main shadow-glow">
                                    <User size={16} strokeWidth={3} />
                                 </div>
                                 <span className="text-white font-black text-xs">{course.instructor}</span>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-gold transition-colors duration-300 line-clamp-2">
                                {course.title}
                            </h3>
                            
                            <div className="flex items-center gap-6 text-[12px] font-bold text-brand-muted mb-8">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-brand-gold" />
                                    <span>{course.lessons.length} محاضرة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-brand-gold" />
                                    <span>محتوى شامل</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1 opacity-50">تكلفة الاشتراك</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white group-hover:text-brand-gold transition-colors">{course.price}</span>
                                        <span className="text-sm font-bold text-brand-muted">ج.م</span>
                                    </div>
                                </div>
                                
                                <div className="w-14 h-14 rounded-2xl bg-brand-main border border-white/10 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-main transition-all duration-500 shadow-inner group-hover:shadow-glow">
                                    <ArrowLeft size={28} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                )})
            )}
          </div>
          
          <div className="mt-20 text-center">
              <button className="n-glass px-10 py-4 rounded-2xl border border-white/10 text-white font-black text-sm hover:border-brand-gold/40 hover:bg-white/5 transition-all">
                  عرض جميع المواد الدراسية
              </button>
          </div>
        </div>
      </section>
    </div>
  );
};
