import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import { useApp } from '../context/AppContext';
import { Play, Clock, BookOpen, Star, User, Shield, CheckCircle, Lock, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useApp();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl font-black text-white mb-4">الكورس غير موجود</h2>
            <Link to="/" className="text-brand-gold hover:underline">العودة للرئيسية</Link>
        </div>
    );
  }

  const handleEnroll = () => {
      if (!user) {
          navigate('/login');
      } else if (user.subscriptionTier === 'free') {
          navigate('/wallet');
      } else {
          navigate('/dashboard');
      }
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this course: ${course.title}`;

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
        
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0">
                <img src={course.image} className="w-full h-full object-cover blur-3xl opacity-30" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-main/20 via-brand-main/60 to-brand-main"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-12">
                <Link to="/" className="absolute top-8 right-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> العودة للرئيسية
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-full md:w-2/3">
                        <div className="flex items-center gap-2 text-brand-gold font-bold mb-4 bg-brand-gold/10 w-fit px-3 py-1 rounded-full border border-brand-gold/20">
                            <Star size={16} fill="currentColor" />
                            <span>الأكثر مبيعاً</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{course.title}</h1>
                        <p className="text-xl text-brand-muted max-w-2xl leading-relaxed mb-8">
                            تعلم كل ما يخص {course.title} من البداية للاحتراف مع شرح أكاديمي مبسط وتطبيقات عملية.
                        </p>

                        <div className="flex items-center gap-6 text-sm md:text-base font-medium text-white/80">
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-brand-gold" />
                                <span>15 ساعة شرح</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-brand-gold" />
                                <span>{course.lessons.length} محاضرات</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-brand-gold" />
                                <span>500+ طالب</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* About */}
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="text-brand-gold" />
                            عن هذا الكورس
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-2xl p-8 leading-relaxed text-brand-muted space-y-4">
                            <p>
                                يهدف هذا الكورس إلى تأسيس الطالب في مادة {course.subject} بشكل قوي، حيث نبدأ من الأساسيات وننتقل تدريجياً إلى المواضيع المتقدمة.
                            </p>
                            <p>
                                يتميز الشرح بالربط بين الجانب النظري والعملي، مع توفير صور توضيحية وفيديوهات 4K لتسهيل استيعاب المعلومة.
                            </p>
                        </div>
                    </section>

                    {/* Curriculum */}
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <BookOpen className="text-brand-gold" />
                            محتوى الكورس
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden">
                            {course.lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-main flex items-center justify-center text-brand-muted font-bold font-mono group-hover:text-brand-gold transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{lesson.title}</h4>
                                            <span className="text-xs text-brand-muted">{lesson.duration} دقيقة</span>
                                        </div>
                                    </div>
                                    {lesson.isLocked && user?.subscriptionTier !== 'pro' ? (
                                        <Lock size={18} className="text-brand-muted" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                            <Play size={14} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor */}
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="text-brand-gold" />
                            المحاضر
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                             <div className="w-20 h-20 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                 <User size={40} className="text-brand-gold" />
                             </div>
                             <div>
                                 <h4 className="text-xl font-bold text-white mb-1">{course.instructor}</h4>
                                 <p className="text-brand-muted text-sm">أستاذ {course.subject} بكلية التمريض، خبرة 15 عاماً في التدريس الأكاديمي والعملي.</p>
                             </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-brand-card border border-white/5 rounded-3xl p-6 shadow-2xl">
                        <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group cursor-pointer" onClick={handleEnroll}>
                            <img src={course.image} className="w-full h-full object-cover" alt="preview" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center shadow-glow animate-pulse">
                                    <Play size={32} fill="currentColor" className="text-brand-main ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-sm text-brand-muted line-through">500 ج.م</span>
                            <div className="text-4xl font-black text-white mt-1">{course.price} <span className="text-lg text-brand-gold">ج.م</span></div>
                        </div>

                        <button 
                            onClick={handleEnroll}
                            className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2 mb-4"
                        >
                            {user?.subscriptionTier === 'pro' ? 'اذهب للكورس' : 'اشترك الآن'}
                            <ArrowLeft size={20} />
                        </button>

                        <ul className="space-y-3 text-sm text-brand-muted border-t border-white/10 pt-6">
                            <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> وصول مدى الحياة</li>
                            <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> شهادة إتمام</li>
                            <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> دعم فني ومتابعة</li>
                        </ul>

                        {/* Social Share */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                <Share2 size={16} className="text-brand-gold" />
                                شارك الكورس مع أصدقائك
                            </p>
                            <div className="flex gap-2">
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] py-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                                    title="مشاركة عبر فيسبوك"
                                >
                                    <Facebook size={20} />
                                </a>
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] py-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                                    title="مشاركة عبر تويتر"
                                >
                                    <Twitter size={20} />
                                </a>
                                <a 
                                    href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                                    title="مشاركة عبر واتساب"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};