
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate, useLocation, Link } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  Mic2, BookOpen, Shield, Lock, ArrowLeft, Sparkles, Brain, 
  FileDown, List, LogIn, Zap, Play, CheckCircle, Clock, ChevronLeft,
  Users, Star, Award, GraduationCap, Target, Lightbulb, ClipboardCheck,
  PlayCircle, BookMarked, Share2
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-brand-main flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-white">الكورس غير موجود</h2>
          <Link to="/" className="text-brand-gold hover:underline">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  const handleEnroll = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      navigate('/dashboard');
    }
  };

  const outcomes = [
    "فهم أعمق للمصطلحات الطبية المعقدة بأسلوب مبسط.",
    "القدرة على ربط التشريح بوظائف الأعضاء الحيوية.",
    "الاستعداد الكامل لأسئلة امتحانات الميدتيرم والفاينال.",
    "توفير وقت المذاكرة بنسبة 40% من خلال البودكاست."
  ];

  return (
    <div className="min-h-screen pb-20 bg-brand-main selection:bg-brand-gold selection:text-brand-main">
      {/* Dynamic Header / Breadcrumbs */}
      <div className="absolute top-24 left-0 right-0 z-20 container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-main transition-all">
          <ChevronLeft size={24} />
        </Link>
        <button className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white hover:text-brand-gold transition-all">
          <Share2 size={20} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[65vh] md:h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={course.image} 
            className="w-full h-full object-cover scale-110 blur-xl opacity-30" 
            alt="bg" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-main via-brand-main/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 pb-16 relative z-10 text-right">
          <div className="max-w-4xl space-y-6 ns-animate--fade-in-up">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-brand-gold/20 backdrop-blur-xl px-5 py-2 rounded-full border border-brand-gold/30 text-brand-gold font-black uppercase tracking-widest text-[10px]">
                <Sparkles size={14} fill="currentColor" className="animate-pulse" />
                <span>محتوى تعليمي معتمد</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-white font-black text-[10px]">
                <Users size={14} /> +12,000 طالب
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight ns-text--gradient drop-shadow-2xl">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-brand-muted font-bold text-lg md:text-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <GraduationCap size={20} />
                </div>
                <span>المحاضر: {course.instructor || 'د. نيرسي'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Star size={20} fill="currentColor" />
                </div>
                <span>4.9 تقييم الطلاب</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Curriculum & About) */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Quick Benefits Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'ساعة شرح', val: '12+', icon: PlayCircle },
                { label: 'ملف PDF', val: '8', icon: FileDown },
                { label: 'اختبار ذكي', val: '15', icon: Brain },
                { label: 'شهادة إتمام', val: 'نعم', icon: Award },
              ].map((item, i) => (
                <div key={i} className="ns-card bg-brand-card/40 p-6 flex flex-col items-center text-center gap-2 border-white/5">
                  <item.icon size={20} className="text-brand-gold mb-1" />
                  <span className="text-xl font-black text-white">{item.val}</span>
                  <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Learning Outcomes */}
            <section className="space-y-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-4">
                <Target className="text-brand-gold" size={32} /> ماذا ستتعلم في هذا الكورس؟
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outcomes.map((outcome, i) => (
                  <div key={i} className="bg-brand-card/30 p-8 rounded-[2.5rem] border border-white/5 flex gap-6 group hover:border-brand-gold/30 transition-all">
                    <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Lightbulb size={24} />
                    </div>
                    <p className="text-brand-text/80 font-bold text-lg leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum Section */}
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-black text-white flex items-center gap-4">
                  <List className="text-brand-gold" size={32} /> المنهج الدراسي
                </h3>
                <span className="text-brand-muted text-sm font-bold">{course.lessons.length} محاضرة صوتية</span>
              </div>

              <div className="ns-card overflow-hidden divide-y divide-white/5 border-white/5">
                {course.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="group flex flex-col md:flex-row items-center justify-between p-8 hover:bg-white/[0.02] transition-all text-right gap-6">
                    <div className="flex items-center gap-8 w-full">
                      <div className="w-14 h-14 rounded-2xl bg-brand-main border border-white/5 flex items-center justify-center text-brand-gold font-black text-xl group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-main transition-all shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-black text-xl md:text-2xl mb-2">{lesson.title}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-brand-muted font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg">
                            <Mic2 size={12} className="text-brand-gold"/> {lesson.duration || '45 دقيقة'}
                          </span>
                          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg">
                            <FileDown size={12} className="text-brand-gold"/> مذكرات PDF
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-brand-muted font-black uppercase">متاحة</span>
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor Bio */}
            <section className="bg-brand-card p-10 md:p-14 rounded-[3.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-10">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] bg-brand-gold p-1 shrink-0 ns-shadow--glow">
                <div className="w-full h-full rounded-[3.2rem] bg-brand-card flex items-center justify-center text-brand-gold font-black text-6xl">
                  {(course.instructor || 'I').charAt(0)}
                </div>
              </div>
              <div className="text-center md:text-right space-y-4 flex-1">
                <h4 className="text-white font-black text-3xl">{course.instructor || 'محاضر نيرسي'}</h4>
                <p className="text-brand-gold text-xs font-black uppercase tracking-widest">محاضر معتمد وعضو هيئة تدريس</p>
                <p className="text-brand-muted text-lg font-medium leading-relaxed">
                  خبرة تزيد عن 10 سنوات في تبسيط المواد الطبية لآلاف الطلاب في كليات التمريض المصرية. يعتمد أسلوب الشرح على الربط بين النظري والتطبيق العملي في المستشفى.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar / Enrollment Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="ns-card p-10 space-y-10 shadow-2xl border-brand-gold/20 shadow-brand-gold/5 bg-brand-card/60 backdrop-blur-2xl">
                <div className="text-center space-y-4">
                  <span className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em]">باقة الوصول المجاني</span>
                  <div className="flex items-end justify-center gap-3">
                    <span className="text-7xl font-black text-white">مجاناً</span>
                    <span className="text-brand-muted font-bold text-sm mb-4 line-through">150ج</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleEnroll} 
                    className="w-full font-black py-7 rounded-3xl ns-surface--gold-gradient text-brand-main ns-shadow--premium hover:scale-[1.05] transition-all flex items-center justify-center gap-4 text-2xl group"
                  >
                    {isLoggedIn ? 'ابدأ المذاكرة الآن' : 'سجل مجاناً وابدأ'}
                    <Play size={24} fill="currentColor" />
                  </button>
                  <button className="w-full font-black py-5 rounded-3xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4 text-sm">
                    <BookMarked size={20} /> حفظ في المفضلة
                  </button>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <h5 className="text-white font-black text-[10px] uppercase tracking-widest mb-4">مميزات هذا الكورس:</h5>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm text-brand-muted font-bold">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={14} />
                      </div>
                      محاضرات صوتية عالية الجودة
                    </li>
                    <li className="flex items-center gap-3 text-sm text-brand-muted font-bold">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={14} />
                      </div>
                      مذكرات PDF شاملة المنهج
                    </li>
                    <li className="flex items-center gap-3 text-sm text-brand-muted font-bold">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={14} />
                      </div>
                      شهادة معتمدة من المنصة
                    </li>
                    <li className="flex items-center gap-3 text-sm text-brand-muted font-bold">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={14} />
                      </div>
                      دعم فني واستفسارات 24/7
                    </li>
                  </ul>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="ns-card p-8 bg-brand-gold/5 border-brand-gold/10 flex items-center gap-4">
                <Shield size={24} className="text-brand-gold" />
                <p className="text-[11px] text-brand-muted font-bold leading-relaxed">
                  محتوى آمن ومحمي بنظام التبصيم الرقمي. جميع الحقوق محفوظة لمنصة نيرسي التعليمية 2024.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
