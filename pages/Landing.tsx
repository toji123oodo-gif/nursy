import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, Activity, Microscope, Stethoscope, BedDouble } from 'lucide-react';
import { courses } from '../data/courses';
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
  const { user } = useApp();

  return (
    <div className="pb-20">
      
      {/* Navbar Placeholder within content area for Desktop Login Button */}
      <div className="hidden md:flex justify-end p-6 absolute top-0 left-0 w-full z-30">
        {!user && (
            <Link to="/login" className="bg-brand-gold hover:bg-brand-goldHover text-brand-main px-6 py-2.5 rounded-lg font-bold transition-all shadow-glow hover:shadow-glow-hover flex items-center gap-2">
                <span className="mb-0.5">تسجيل الدخول</span>
            </Link>
        )}
      </div>

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
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
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
                منصة تعليمية متخصصة لطلاب كليات التمريض. شرح أكاديمي مبسط، مراجعات شاملة، وتدريبات عملية تؤهلك لسوق العمل.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <Link to="/dashboard" className="bg-brand-gold text-brand-main text-lg font-bold py-4 px-10 rounded-xl hover:bg-brand-goldHover transition-all transform hover:-translate-y-1 shadow-glow flex items-center justify-center gap-3">
                  <span>ابدأ رحلة التعلم</span>
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
                      <h4 className="text-3xl font-black text-white">10K+</h4>
                      <p className="text-sm text-brand-muted">طالب تمريض</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                      <h4 className="text-3xl font-black text-white">5+</h4>
                      <p className="text-sm text-brand-muted">مواد أساسية</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                      <h4 className="text-3xl font-black text-white">4.8</h4>
                      <p className="text-sm text-brand-muted">تقييم ممتاز</p>
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
          <div className="flex justify-between items-end mb-16">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">المواد الدراسية</h2>
                <p className="text-brand-muted text-lg">اختر المادة وابدأ المذاكرة فوراً</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id} className="block group bg-brand-card rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-2 cursor-pointer">
                {/* Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-main/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-brand-main/80 backdrop-blur-sm text-brand-gold text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-gold/20 flex items-center gap-2">
                    {getCourseIcon(course.subject)}
                    {course.subject}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors min-h-[3.5rem]">{course.title}</h3>
                  <div className="flex items-center gap-2 text-brand-muted text-sm mb-6">
                    <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                        <CheckCircle size={12} className="text-brand-gold" />
                    </div>
                    <span className="line-clamp-1">{course.instructor}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-brand-main/50 rounded-lg p-2 text-center border border-white/5">
                          <BookOpen className="w-4 h-4 text-brand-muted mx-auto mb-1" />
                          <span className="text-xs text-white">{course.lessons.length} فصول</span>
                      </div>
                      <div className="bg-brand-main/50 rounded-lg p-2 text-center border border-white/5">
                          <Clock className="w-4 h-4 text-brand-muted mx-auto mb-1" />
                          <span className="text-xs text-white">15 ساعة</span>
                      </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-brand-muted">سعر الكورس</span>
                        <span className="text-2xl font-black text-brand-gold">{course.price} <span className="text-xs font-bold text-brand-muted">ج.م</span></span>
                    </div>
                    <div className="w-12 h-12 bg-white text-brand-main rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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