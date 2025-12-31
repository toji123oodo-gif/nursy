
import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Play, Clock, BookOpen, Star, User, Shield, CheckCircle, Lock, ArrowLeft, Share2, Facebook, Twitter, MessageCircle, Tag, TrendingDown, Award, GraduationCap, Briefcase, Download, Copy, Sparkles } from 'lucide-react';

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

  const handleCertificateDownload = () => {
      alert("جاري إصدار الشهادة... سيتم تحميل ملف PDF.");
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this course: ${course.title}`;
  
  const handleNativeShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: course.title,
                text: shareText,
                url: shareUrl,
            });
        } catch (err) {
            console.log('Error sharing', err);
        }
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert('تم نسخ الرابط للحافظة!');
    }
  };

  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen pb-32 lg:pb-20 animate-fade-in bg-brand-main">
        
        {/* Hero Section */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            {/* Background Blur & Image */}
            <div className="absolute inset-0">
                <img src={course.image} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-main/40 via-brand-main/80 to-brand-main"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
                <Link to="/" className="absolute top-8 right-6 text-brand-muted hover:text-white flex items-center gap-2 transition-all z-20 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <ArrowLeft size={18} /> <span className="hidden md:inline font-bold text-sm">العودة للرئيسية</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in-up">
                            <div className="flex items-center gap-2 text-brand-gold font-black bg-brand-gold/10 px-5 py-2 rounded-full border border-brand-gold/30 shadow-glow uppercase tracking-wider text-[10px]">
                                <Sparkles size={14} fill="currentColor" />
                                <span>Premium Nursing Content</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm text-xs">
                                <span>قسم {course.subject}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-fade-in-up delay-100">
                            <span className="text-white">
                                {course.title.split(' - ')[0]}
                            </span>
                            <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-yellow-200">
                                {course.title.split(' - ')[1] || ''}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-brand-muted max-w-3xl leading-relaxed mb-10 border-r-8 border-brand-gold pr-8 animate-fade-in-up delay-200 font-light">
                            انطلق في رحلة تعلم شاملة لمادة <span className="text-white font-bold">{course.title}</span>. صُمم هذا المسار ليكون مرجعك الأساسي من المستوى الأكاديمي حتى الممارسة المهنية.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/90 animate-fade-in-up delay-300">
                            <div className="flex items-center gap-2.5 bg-brand-card/80 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-xl">
                                <div className="p-1.5 bg-brand-gold/20 rounded-lg"><Clock size={18} className="text-brand-gold" /></div>
                                <span>15 ساعة محتوى</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-brand-card/80 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-xl">
                                <div className="p-1.5 bg-brand-gold/20 rounded-lg"><BookOpen size={18} className="text-brand-gold" /></div>
                                <span>{course.lessons.length} محاضرة شاملة</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-brand-card/80 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-xl">
                                <div className="p-1.5 bg-brand-gold/20 rounded-lg"><Award size={18} className="text-brand-gold" /></div>
                                <span>شهادة معتمدة</span>
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
                    
                    {/* About */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <Shield className="text-brand-gold" />
                                تفاصيل الدبلومة التعليمية
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-white/5 to-transparent mr-8"></div>
                        </div>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 leading-relaxed text-brand-muted space-y-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
                            <p className="text-lg">
                                هذه المادة ليست مجرد شرح أكاديمي، بل هي جسر بين المنهج الدراسي واحتياجات سوق العمل في المستشفيات. نركز على تبسيط المعلومة المعقدة باستخدام أحدث وسائل الشرح البصري.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                {[
                                    "شرح فيديو عالي الجودة 4K",
                                    "مذكرات تلخيص شاملة PDF",
                                    "بنك أسئلة لكل فصل",
                                    "متابعة دورية مع المحاضر"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-brand-main/50 p-4 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-all">
                                        <CheckCircle size={20} className="text-green-500 shrink-0" />
                                        <span className="text-white font-bold text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Curriculum */}
                    <section>
                         <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <BookOpen className="text-brand-gold" />
                                الخطة الدراسية (المنهج)
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-white/5 to-transparent mr-8"></div>
                        </div>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            {course.lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all group cursor-default">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-main flex items-center justify-center text-brand-muted font-black text-lg group-hover:text-brand-gold group-hover:scale-110 transition-all shadow-inner border border-white/5">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-lg mb-1 group-hover:text-brand-gold transition-colors">{lesson.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-brand-muted" />
                                                <span className="text-xs text-brand-muted font-bold">{lesson.duration || '45'} دقيقة محتوى</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {lesson.isLocked && user?.subscriptionTier !== 'pro' ? (
                                            <div className="flex items-center gap-2 bg-brand-main/80 px-4 py-2 rounded-xl border border-white/5">
                                                <Lock size={14} className="text-brand-muted" />
                                                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">Locked</span>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-main transition-all shadow-glow">
                                                <Play size={16} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor */}
                    <section>
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <User className="text-brand-gold" />
                            طاقم التدريس
                        </h3>
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl hover:border-brand-gold/20 transition-all">
                             <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-brand-gold/20 to-brand-main flex items-center justify-center shrink-0 border border-brand-gold/30 shadow-2xl">
                                 <User size={64} className="text-brand-gold" />
                             </div>
                             <div className="text-center md:text-right">
                                 <h4 className="text-3xl font-black text-white mb-3">{course.instructor}</h4>
                                 <p className="text-brand-muted text-lg leading-relaxed font-light">
                                     أستاذ متخصص في <span className="text-white font-bold">{course.subject}</span> وحاصل على زمالة أجنبية في التمريض المتخصص. خبرة تتجاوز الـ 15 عاماً في التدريس الأكاديمي.
                                 </p>
                             </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar - Desktop Only for Purchase Card */}
                <div className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-24 space-y-8">
                        {/* Enroll Card */}
                        <div className="bg-brand-card border border-brand-gold/30 rounded-[2.5rem] p-8 shadow-[0_25px_60px_-15px_rgba(251,191,36,0.15)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand-gold/20 transition-all duration-1000"></div>
                            
                            <div className="aspect-video rounded-3xl overflow-hidden mb-8 relative group cursor-pointer shadow-2xl border border-white/5" onClick={handleEnroll}>
                                <img src={course.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" alt="preview" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                    <div className="w-20 h-20 rounded-full bg-brand-gold flex items-center justify-center shadow-glow animate-pulse group-hover:scale-110 transition-transform">
                                        <Play size={36} fill="currentColor" className="text-brand-main ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="text-center mb-10 relative p-8 rounded-[2rem] bg-brand-main border border-brand-gold/10 overflow-hidden shadow-inner">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-brand-muted mb-3 font-black uppercase tracking-[0.2em]">قيمة الدبلومة الكاملة</span>
                                    
                                    {course.originalPrice && course.originalPrice > course.price ? (
                                        <div className="relative">
                                            <div className="absolute -top-6 -left-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform -rotate-12 animate-heartbeat z-10">
                                                خصم {discountPercentage}% لفترة محدودة
                                            </div>
                                            
                                            <div className="flex flex-col items-center">
                                                <span className="text-brand-muted/40 line-through text-xl decoration-red-500 decoration-2 mb-1 font-mono">
                                                    {course.originalPrice} ج.م
                                                </span>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-6xl font-black text-brand-gold leading-none drop-shadow-xl">
                                                        {course.price}
                                                    </span>
                                                    <span className="text-sm text-brand-gold font-black mb-1.5">ج.م</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-end gap-2">
                                            <span className="text-5xl font-black text-white leading-none tracking-tight">
                                                {course.price}
                                            </span>
                                            <span className="text-sm text-brand-muted font-black mb-1.5">ج.م</span>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-white/5 w-full">
                                        <p className="text-xs text-green-400 font-black flex items-center justify-center gap-2 bg-green-400/10 py-2.5 rounded-2xl border border-green-500/20">
                                            <Shield size={14} className="animate-pulse" />
                                            متاح مجاناً للمشتركين PRO
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleEnroll}
                                className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-[1.5rem] hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] flex items-center justify-center gap-3 mb-6 group active:scale-95"
                            >
                                <span className="text-xl">{user?.subscriptionTier === 'pro' ? 'دخول فوري للمحتوى' : 'سجل اشتراكك الآن'}</span>
                                <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
                            </button>

                            <div className="space-y-4 px-2">
                                {[
                                    { icon: <Clock size={16}/>, text: "وصول دائم لجميع المحاضرات" },
                                    { icon: <Award size={16}/>, text: "شهادة إتمام معتمدة مجانية" },
                                    { icon: <MessageCircle size={16}/>, text: "دعم فني خاص للطلاب" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-brand-muted text-sm font-bold">
                                        <div className="text-brand-gold">{item.icon}</div>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Social Share (Desktop) */}
                            <div className="mt-10 pt-8 border-t border-white/5">
                                <p className="text-white font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                    <Share2 size={14} className="text-brand-gold" />
                                    مشاركة المادة العلمية
                                </p>
                                <div className="flex gap-3">
                                    {[
                                        { icon: <Facebook size={20} />, color: "bg-[#1877F2]/10 text-[#1877F2]", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                                        { icon: <Twitter size={20} />, color: "bg-[#1DA1F2]/10 text-[#1DA1F2]", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
                                        { icon: <MessageCircle size={20} />, color: "bg-[#25D366]/10 text-[#25D366]", url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` }
                                    ].map((social, i) => (
                                        <a 
                                            key={i}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex-1 ${social.color} py-3 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-lg border border-white/5`}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Certificate Card */}
                        <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-700"></div>
                             
                             <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-gold/10 p-4 rounded-2xl border border-brand-gold/20">
                                    <Award className="text-brand-gold" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black">الشهادة المعتمدة</h3>
                                    <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Certified Achievement</p>
                                </div>
                             </div>
                             
                             <p className="text-sm text-brand-muted mb-6 leading-relaxed">
                                 بعد مشاهدة جميع المحاضرات واجتياز الاختبار النهائي، ستحصل تلقائياً على شهادة إتمام موثقة من منصة Nursy.
                             </p>

                             {user?.subscriptionTier === 'pro' ? (
                                 <button 
                                    onClick={handleCertificateDownload}
                                    className="w-full bg-white text-brand-main font-black py-4 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-glow"
                                 >
                                     <Download size={20} /> استخراج الشهادة الآن
                                 </button>
                             ) : (
                                 <div className="bg-brand-main border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3">
                                     <Lock size={18} className="text-brand-muted" />
                                     <span className="text-sm text-brand-muted font-bold">متاح فقط لأصحاب الاشتراك PRO</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Mobile Sticky Enroll Bar - Highly optimized for actionability */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-brand-main/80 backdrop-blur-3xl border-t border-white/10 px-4 py-5 lg:hidden animate-fade-in-up shadow-[0_-15px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4 max-w-lg mx-auto">
                {/* Mobile Share Button */}
                <button 
                    onClick={handleNativeShare}
                    className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.2rem] flex items-center justify-center text-brand-muted hover:text-white active:scale-90 transition-all shadow-lg"
                >
                    <Share2 size={24} />
                </button>
                
                <div className="flex flex-col justify-center min-w-[80px]">
                     <span className="text-[9px] text-brand-muted font-black uppercase tracking-widest mb-1">الاستثمار</span>
                     <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-white">
                            {course.price}
                        </span>
                        <span className="text-xs text-brand-gold font-bold mb-1">ج.م</span>
                    </div>
                </div>

                <button 
                    onClick={handleEnroll}
                    className="flex-1 bg-brand-gold text-brand-main font-black h-14 rounded-[1.2rem] hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95"
                >
                    <span className="text-lg">{user?.subscriptionTier === 'pro' ? 'ابدأ التعلم' : 'اشترك الآن'}</span>
                    <ArrowLeft size={22} strokeWidth={3} />
                </button>
            </div>
            
            {/* Safe Area Indicator for modern mobile screens */}
            <div className="h-2 md:hidden"></div>
        </div>
    </div>
  );
};
