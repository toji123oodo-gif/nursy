
import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
// Added List to the lucide-react imports to fix the error on line 56
import { Mic2, Clock, BookOpen, Shield, Lock, ArrowLeft, Sparkles, Brain, FileDown, List } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const course = courses.find(c => c.id === courseId);
  if (!course) return null;

  const handleEnroll = () => {
    if (!user) navigate('/login', { state: { from: location.pathname } });
    else if (user.subscriptionTier === 'free') navigate('/wallet');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pb-32 bg-brand-main">
        <div className="relative h-[450px] overflow-hidden">
            <div className="absolute inset-0">
                <img src={course.image} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-main/40 via-brand-main/80 to-brand-main"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-12 text-right">
                <div className="max-w-4xl space-y-6">
                    <div className="inline-flex items-center gap-2 text-brand-gold font-black bg-brand-gold/10 px-5 py-2 rounded-full border border-brand-gold/30 uppercase tracking-wider text-[10px]">
                        <Sparkles size={14} fill="currentColor" />
                        <span>Premium Audio Content</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{course.title}</h1>
                    <div className="flex items-center gap-6 text-brand-muted font-bold text-sm">
                        <span className="flex items-center gap-2"><Mic2 size={18} className="text-brand-gold" /> شروحات بودكاست</span>
                        <span className="flex items-center gap-2"><BookOpen size={18} className="text-brand-gold" /> {course.lessons.length} محاضرة</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><Shield className="text-brand-gold" /> عن الكورس</h3>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 text-brand-muted text-lg leading-relaxed">
                            هذا الكورس يعتمد على نظام البودكاست التعليمي، حيث يتم شرح المادة العلمية صوتياً بأسلوب مبسط وشيق، مع توفير مذكرات ورقية PDF شاملة واختبارات دورية لقياس المستوى.
                        </div>
                    </section>

                    <section>
                        {/* The fix below addresses the "Cannot find name 'List'" error by ensuring List is imported */}
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><List className="text-brand-gold" /> المنهج التعليمي</h3>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] overflow-hidden">
                            {course.lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all text-right">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-brand-main flex items-center justify-center text-brand-gold font-black">{idx + 1}</div>
                                        <div>
                                            <h4 className="text-white font-bold">{lesson.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-brand-muted font-black uppercase mt-1">
                                                <span className="flex items-center gap-1"><Mic2 size={12}/> صوتي</span>
                                                <span className="flex items-center gap-1"><FileDown size={12}/> مذكرة PDF</span>
                                                {lesson.quiz && <span className="flex items-center gap-1 text-brand-gold"><Brain size={12}/> اختبار</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {lesson.isLocked && user?.subscriptionTier !== 'pro' ? <Lock size={16} className="text-brand-muted" /> : <Mic2 size={16} className="text-brand-gold" />}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-brand-card border border-brand-gold/30 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                        <div className="text-center space-y-2">
                            <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">قيمة الاشتراك</span>
                            <div className="flex items-end justify-center gap-2">
                                <span className="text-5xl font-black text-white">{course.price}</span>
                                <span className="text-sm text-brand-gold font-black mb-1.5">ج.م</span>
                            </div>
                        </div>
                        <button onClick={handleEnroll} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl">
                            سجل الآن <ArrowLeft size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
