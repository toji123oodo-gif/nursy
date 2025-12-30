import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Play, Clock, BookOpen, Star, User, Shield, CheckCircle, Lock, ArrowLeft, Share2, Facebook, Twitter, MessageCircle, Tag, TrendingDown, Award, GraduationCap, Briefcase, Download, Copy } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

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
          // Navigate to login, passing current location to return after login
          navigate('/login', { state: { from: location.pathname } });
      } else if (user.subscriptionTier === 'free') {
          // User is logged in but free -> go to wallet for upgrade
          navigate('/wallet');
      } else {
          // User is logged in and pro -> go to dashboard
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
    <div className="min-h-screen pb-32 lg:pb-20 animate-fade-in">
        
        {/* Hero Section */}
        <div className="relative h-[450px] md:h-[550px] overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0">
                <img src={course.image} className="w-full h-full object-cover blur-3xl opacity-30 scale-110" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-main/20 via-brand-main/60 to-brand-main"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-12">
                <Link to="/" className="absolute top-8 right-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors z-20">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">العودة للرئيسية</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up">
                            <div className="flex items-center gap-2 text-brand-gold font-bold bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                <Star size={16} fill="currentColor" />
                                <span className="text-sm">الأكثر مبيعاً</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                <span className="text-sm">{course.subject}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-2xl animate-fade-in-up delay-100">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 relative z-10">
                                {course.title}
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-brand-muted max-w-2xl leading-relaxed mb-8 border-r-4 border-brand-gold/50 pr-6 animate-fade-in-up delay-200">
                            تعلم كل ما يخص {course.title} من البداية للاحتراف مع شرح أكاديمي مبسط وتطبيقات عملية شاملة.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-white/80 animate-fade-in-up delay-300">
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                                <Clock size={20} className="text-brand-gold" />
                                <span>15 ساعة شرح</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                                <BookOpen size={20} className="text-brand-gold" />
                                <span>{course.lessons.length} محاضرات</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                                <User size={20} className="text-brand-gold" />
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
                        <div className="bg-brand-card border border-white/5 rounded-2xl p-8 leading-relaxed text-brand-muted space-y-4 shadow-lg hover:border-brand-gold/20 transition-colors">
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
                        <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                            {course.lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-main flex items-center justify-center text-brand-muted font-bold font-mono group-hover:text-brand-gold transition-colors shadow-inner">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1 group-hover:text-brand-gold transition-colors">{lesson.title}</h4>
                                            <span className="text-xs text-brand-muted">{lesson.duration} دقيقة</span>
                                        </div>
                                    </div>
                                    {lesson.isLocked && user?.subscriptionTier !== 'pro' ? (
                                        <Lock size={18} className="text-brand-muted" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
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
                        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 flex items-center gap-6 shadow-lg hover:border-brand-gold/20 transition-colors">
                             <div className="w-20 h-20 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0 border border-brand-gold/30">
                                 <User size={40} className="text-brand-gold" />
                             </div>
                             <div>
                                 <h4 className="text-xl font-bold text-white mb-1">{course.instructor}</h4>
                                 <p className="text-brand-muted text-sm">أستاذ {course.subject} بكلية التمريض، خبرة 15 عاماً في التدريس الأكاديمي والعملي.</p>
                             </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar - Desktop Only for Purchase Card */}
                <div className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        {/* Enroll Card */}
                        <div className="bg-brand-card border border-white/5 rounded-3xl p-6 shadow-2xl">
                            <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group cursor-pointer" onClick={handleEnroll}>
                                <img src={course.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt="preview" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center shadow-glow animate-pulse">
                                        <Play size={32} fill="currentColor" className="text-brand-main ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="text-center mb-6 relative p-4 rounded-xl bg-brand-main/50 border border-white/5 overflow-hidden">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-brand-muted mb-2">قيمة الكورس</span>
                                    
                                    {course.originalPrice && course.originalPrice > course.price ? (
                                        <div className="relative">
                                            {/* Discount Badge */}
                                            <div className="absolute -top-3 -left-12 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg transform -rotate-12 animate-pulse">
                                                وفر {discountPercentage}%
                                            </div>
                                            
                                            <div className="flex flex-col items-center">
                                                <span className="text-brand-muted/60 line-through text-lg decoration-red-500/50 decoration-2">
                                                    {course.originalPrice} ج.م
                                                </span>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-4xl font-black text-brand-gold leading-none drop-shadow-sm">
                                                        {course.price}
                                                    </span>
                                                    <span className="text-sm text-brand-gold/80 font-bold mb-1">ج.م</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-end gap-1">
                                            <span className="text-3xl font-black text-white leading-none tracking-tight">
                                                {course.price}
                                            </span>
                                            <span className="text-sm text-brand-muted font-bold mb-1">ج.م</span>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-white/5 w-full">
                                        <p className="text-xs text-green-400 font-bold flex items-center justify-center gap-1 bg-green-400/10 py-1 rounded-lg">
                                            <CheckCircle size={12} />
                                            متاح مجاناً مع اشتراك الـ 50 ج.م
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleEnroll}
                                className="w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2 mb-4 group"
                            >
                                {user?.subscriptionTier === 'pro' ? 'اذهب للكورس' : 'اشترك الآن'}
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>

                            <ul className="space-y-3 text-sm text-brand-muted border-t border-white/10 pt-6">
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> وصول مدى الحياة</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> شهادة إتمام</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500" /> دعم فني ومتابعة</li>
                            </ul>

                            {/* Social Share (Desktop) */}
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

                        {/* Certificate Card */}
                        <div className="bg-brand-card border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none"></div>
                             
                             <div className="flex items-center gap-3 mb-4">
                                <div className="bg-brand-gold/20 p-2.5 rounded-xl">
                                    <Award className="text-brand-gold" size={24} />
                                </div>
                                <h3 className="text-white font-bold">شهادة معتمدة</h3>
                             </div>
                             
                             <p className="text-sm text-brand-muted mb-4">
                                 احصل على شهادة إتمام عند الانتهاء من الكورس لتعزيز سيرتك الذاتية.
                             </p>

                             {user?.subscriptionTier === 'pro' ? (
                                 <button 
                                    onClick={handleCertificateDownload}
                                    className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                 >
                                     <Download size={18} /> تحميل الشهادة
                                 </button>
                             ) : (
                                 <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                                     <Lock size={16} className="text-red-400" />
                                     <span className="text-xs text-red-300 font-bold">متاح فقط للمشتركين</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Mobile Sticky Enroll Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-card/95 backdrop-blur-xl border-t border-white/10 p-4 lg:hidden animate-fade-in-up shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 max-w-lg mx-auto">
                {/* Mobile Share Button */}
                <button 
                    onClick={handleNativeShare}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-muted hover:text-white active:scale-95 transition-all"
                    title="مشاركة الكورس"
                >
                    <Share2 size={20} />
                </button>
                
                <div className="flex-1">
                     <div className="flex items-end gap-1">
                        <span className="text-xl font-black text-brand-gold">
                            {course.price}
                        </span>
                        <span className="text-xs text-brand-gold/80 font-bold mb-1">ج.م</span>
                    </div>
                </div>
                <button 
                    onClick={handleEnroll}
                    className="flex-[2] bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow flex items-center justify-center gap-2"
                >
                    {user?.subscriptionTier === 'pro' ? 'ابدأ' : 'اشترك'}
                    <ArrowLeft size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};