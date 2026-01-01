
import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Play, Clock, BookOpen, Star, User, Shield, CheckCircle, Lock, ArrowLeft, Award, GraduationCap, Briefcase, Download, Sparkles } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-brand-main">
            <div className="bg-brand-card p-10 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-4">الكورس غير موجود</h2>
                <Link to="/" className="inline-flex items-center gap-2 bg-brand-gold text-brand-main font-bold py-3 px-8 rounded-xl hover:bg-brand-goldHover transition-all">
                    <ArrowLeft size={18} /> العودة للرئيسية
                </Link>
            </div>
        </div>
    );
  }

  const handleEnroll = () => {
      if (!user) {
          navigate('/login', { state: { from: location.pathname } });
      } else if (user.subscriptionTier === 'free') {
          navigate('/wallet');
      } else {
          navigate('/dashboard');
      }
  };

  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen pb-32 lg:pb-20 animate-fade-in bg-brand-main">
        
        {/* Hero Section */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            <div className="absolute inset-0">
                <img src={course.image} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-main/40 via-brand-main/80 to-brand-main"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
                <Link to="/" className="absolute top-8 right-6 text-brand-muted hover:text-white flex items-center gap-2 transition-all z-20 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <ArrowLeft size={18} /> <span className="hidden md:inline font-bold text-sm">العودة للرئيسية</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <div className="flex items-center gap-2 text-brand-gold font-black bg-brand-gold/10 px-5 py-2 rounded-full border border-brand-gold/30 uppercase tracking-wider text-[10px]">
                                <Sparkles size={14} fill="currentColor" />
                                <span>Premium Nursing Content</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm text-xs">
                                <span>قسم {course.subject}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white">
                            {course.title}
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-brand-muted max-w-3xl leading-relaxed mb-10 font-light">
                            انطلق في رحلة تعلم شاملة لمادة <span className="text-white font-bold">{course.title}</span>.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/90">
                            <div className="flex items-center gap-2.5 bg-brand-card/80 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                                <Clock size={18} className="text-brand-gold" />
                                <span>15 ساعة محتوى</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-brand-card/80 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                                <BookOpen size={18} className="text-brand-gold" />
                                <span>{course.lessons.length} محاضرة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16">
                    <section>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
                            <Shield className="text-brand-gold" />
                            تفاصيل الكورس
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 text-brand-muted">
                            <p className="text-lg leading-relaxed">
                                شرح أكاديمي شامل يركز على تبسيط المعلومة المعقدة باستخدام أحدث وسائل الشرح البصري.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
                            <BookOpen className="text-brand-gold" />
                            المنهج الدراسي
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] overflow-hidden">
                            {course.lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-brand-main flex items-center justify-center text-brand-muted font-black">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{lesson.title}</h4>
                                            <span className="text-xs text-brand-muted">{lesson.duration || '45'} دقيقة</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {lesson.isLocked && user?.subscriptionTier !== 'pro' ? (
                                            <Lock size={16} className="text-brand-muted" />
                                        ) : (
                                            <Play size={16} fill="currentColor" className="text-brand-gold" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-brand-card border border-brand-gold/30 rounded-[2.5rem] p-8 shadow-xl">
                            <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/5">
                                <img src={course.image} className="w-full h-full object-cover" alt="preview" />
                            </div>

                            <div className="text-center mb-10">
                                <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest block mb-2">قيمة الكورس</span>
                                <div className="flex items-end justify-center gap-2">
                                    <span className="text-5xl font-black text-white">{course.price}</span>
                                    <span className="text-sm text-brand-gold font-black mb-1.5">ج.م</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleEnroll}
                                className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl hover:bg-brand-goldHover transition-all flex items-center justify-center gap-3"
                            >
                                <span className="text-xl">سجل الآن</span>
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
