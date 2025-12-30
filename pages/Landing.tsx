import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, Activity, Microscope, Stethoscope, BedDouble, User, Filter } from 'lucide-react';
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
    // Simulate data fetching delay for visual effect
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Compute unique subjects from courses
  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  // Filter courses based on selection
  const filteredCourses = useMemo(() => {
    if (selectedSubject === 'All') return courses;
    return courses.filter(c => c.subject === selectedSubject);
  }, [courses, selectedSubject]);

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with heavy overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1576091160550-2187d80aeff2?q=80&w=2000&auto=format&fit=crop" 
                alt="Background" 
                className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-main via-brand-main/90 to-brand-main/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            <div className="md:w-1/2 text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full text-sm font-bold mb-8 border border-brand-gold/20 backdrop-blur-sm animate-fade-in-up">
                  <Star size={16} fill="currentColor" />
                  <span>المنصة الأولى لطلاب التمريض</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-white">
                Nursy.. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-yellow-200">بوابتك للتميز</span>
              </h1>
              
              <p className="text-brand-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
                اشتراك شهري شامل بـ <span className="text-brand-gold font-bold">50 ج.م فقط</span>. احصل على جميع الكورسات، الامتحانات، والملازم في مكان واحد.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <Link to="/dashboard" className="bg-brand-gold text-brand-main text-lg font-bold py-4 px-10 rounded-xl hover:bg-brand-goldHover transition-all transform hover:-translate-y-1 shadow-glow flex items-center justify-center gap-3">
                  <span>اشترك الآن</span>
                  <ArrowLeft size={22} strokeWidth={3} />
                </Link>
                <button className="group px-10 py-4 rounded-xl border border-white/10 hover:border-brand-gold/50 hover:bg-brand-card/50 transition-all flex items-center justify-center gap-3 text-white">
                  <span>تصفح المواد</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-main transition-colors">
                    <Play size={14} fill="currentColor" />
                  </div>
                </button>
              </div>
              
              {/* Stats */}
              <div className="mt-16 flex items-center justify-center md:justify-start gap-8 border-t border-white/5 pt-8">
                  <div>
                      <h4 className="text-3xl font-black text-white">50 ج.م</h4>
                      <p className="text-sm text-brand-muted">اشتراك شهري</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                      <h4 className="text-3xl font-black text-white">{courses.length}+</h4>
                      <p className="text-sm text-brand-muted">مواد شاملة</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                      <h4 className="text-3xl font-black text-white">30</h4>
                      <p className="text-sm text-brand-muted">يوم صلاحية</p>
                  </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="md:w-1/2 relative hidden md:block">
                <div className="relative w-full aspect-square max-w-[550px] mx-auto">
                    <div className="absolute inset-0 bg-brand-gold/20 blur-[100px] rounded-full animate-pulse"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1000&auto=format&fit=crop" 
                        alt="Nursy Student" 
                        className="relative z-10 rounded-3xl shadow-2xl rotate-3 border border-white/10 object-cover w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-brand-card/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl z-20 animate-bounce duration-[4000ms]">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500/20 p-3 rounded-full">
                                <Shield className="text-green-500" size={28} />
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg">مناهج معتمدة</p>
                                <p className="text-xs text-brand-muted">شرح يطابق الكلية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">المواد الدراسية</h2>
                <p className="text-brand-muted text-lg">جميع هذه المواد متاحة ضمن اشتراكك</p>
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap gap-2 justify-end">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                            selectedSubject === subject
                            ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow'
                            : 'bg-white/5 text-brand-muted border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {subject !== 'All' && getCourseIcon(subject)}
                        {subject === 'All' ? 'الكل' : subject}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
               // Loading Skeleton
               [1, 2, 3].map((_, i) => (
                   <div key={i} className="bg-brand-card rounded-2xl overflow-hidden border border-white/5">
                        <div className="h-56 bg-white/5 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                        <div className="p-6">
                            <div className="h-7 bg-white/5 rounded w-3/4 mb-4 animate-pulse"></div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-5 h-5 rounded-full bg-white/5 animate-pulse shrink-0"></div>
                                <div className="h-4 bg-white/5 rounded w-1/3 animate-pulse"></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="h-10 bg-white/5 rounded animate-pulse"></div>
                                <div className="h-10 bg-white/5 rounded animate-pulse"></div>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <div className="space-y-2">
                                    <div className="h-3 bg-white/5 rounded w-12 animate-pulse"></div>
                                    <div className="h-8 bg-white/5 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse"></div>
                            </div>
                        </div>
                   </div>
               ))
            ) : (
                filteredCourses.map((course) => (
                <Link to={`/course/${course.id}`} key={course.id} className="block group bg-[#112240] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:-translate-y-2 cursor-pointer relative">
                    
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#112240] to-transparent z-10 opacity-80"></div>
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        
                        {/* Subject Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                            {getCourseIcon(course.subject)}
                            {course.subject}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 relative z-20 -mt-10">
                        <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-brand-gold transition-colors">{course.title}</h3>
                        
                        <div className="flex items-center gap-2 text-brand-muted/80 text-xs mb-4">
                            <User size={12} />
                            <span>{course.instructor}</span>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                    <BookOpen size={12} className="text-brand-gold" />
                                    <span>{course.lessons.length} دروس</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                    <Clock size={12} className="text-brand-gold" />
                                    <span>15 ساعة</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">السعر</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-brand-gold drop-shadow-sm">{course.price} <span className="text-sm font-bold">ج.م</span></span>
                                    {course.originalPrice && (
                                        <span className="text-xs text-white/20 line-through decoration-white/20">{course.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            
                            <button className="w-10 h-10 rounded-full bg-brand-gold text-brand-main flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 transform group-hover:rotate-[-45deg]">
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                    </div>
                </Link>
                ))
            )}
            
            {!isLoading && filteredCourses.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <Filter className="text-brand-muted mb-4 opacity-50" size={48} />
                    <p className="text-white font-bold text-lg mb-2">لا توجد مواد في هذا القسم</p>
                    <p className="text-brand-muted text-sm">جرب اختيار قسم آخر لتصفح المواد المتاحة.</p>
                </div>
            )}
          </div>
          
        </div>
      </section>

      {/* Why Nursy - Dark Features */}
      <section className="py-20 bg-brand-main border-t border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "أقوى المحاضرين", desc: "نخبة من دكاترة كليات التمريض والطب لشرح المواد العلمية.", icon: Award },
                    { title: "جودة سينمائية", desc: "نستخدم معدات تصوير 4K وصوت محيطي لتجربة تعليمية ممتعة.", icon: Play },
                    { title: "تدريب عملي", desc: "فيديوهات محاكاة للمهارات التمريضية والعملية داخل المستشفيات.", icon: CheckCircle }
                ].map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-brand-card to-brand-main p-8 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all group">
                        <div className="w-16 h-16 bg-brand-card rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-300 shadow-lg">
                            <item.icon className="text-brand-gold group-hover:text-brand-main" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                        <p className="text-brand-muted leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};