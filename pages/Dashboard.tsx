import React, { useState, useEffect } from 'react';
import { Lock, Play, Star, Clock, AlertCircle, CheckCircle, XCircle, FileText, HelpCircle, ChevronLeft, Download, File, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

// Nursing Content Simulation
const activeCourse = {
    title: 'Anatomy - علم التشريح',
    chapter: 'Chapter 1: The Skeletal System',
    description: 'شرح تفصيلي للجهاز العظمي، أنواع العظام، والمفاصل. يتضمن هذا الدرس شرحاً نظرياً مع تطبيق عملي على الهيكل العظمي.'
};

const sampleLessons = [
  { id: 'l1', title: 'Introduction to Skeleton - مقدمة الجهاز العظمي', duration: '45:00', isLocked: false },
  { id: 'l2', title: 'Axial Skeleton - الهيكل المحوري', duration: '55:30', isLocked: false },
  { id: 'l3', title: 'Appendicular Skeleton - الهيكل الطرفي', duration: '60:00', isLocked: true }, 
  { id: 'l4', title: 'Joints & Movements - المفاصل والحركة', duration: '50:15', isLocked: true }, 
  { id: 'l5', title: 'Bone Tissue Histology - أنسجة العظام', duration: '48:00', isLocked: true }, 
];

// Mock Resources Data
const lessonResources = [
    { title: 'Lecture Notes (PDF)', size: '2.4 MB', type: 'pdf' },
    { title: 'Skeleton Diagram (High Res)', size: '1.1 MB', type: 'img' },
    { title: 'Extra Reading Materials', size: '500 KB', type: 'doc' },
];

// Mock Quiz Data
const lessonQuiz = [
    {
        id: 1,
        question: "How many bones are in the adult human body?",
        options: ["206", "205", "300", "210"],
        correct: 0
    },
    {
        id: 2,
        question: "Which represents the Axial Skeleton?",
        options: ["Arms & Legs", "Skull & Vertebral Column", "Hands & Feet", "Pelvis"],
        correct: 1
    },
    {
        id: 3,
        question: "What is the longest bone in the human body?",
        options: ["Humerus", "Tibia", "Femur", "Fibula"],
        correct: 2
    }
];

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
      setOpacity(0.2 + Math.random() * 0.3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-20 text-white/20 font-mono text-sm md:text-lg select-none whitespace-nowrap"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        opacity: opacity,
        transform: 'translate(-50%, -50%) rotate(-15deg)',
      }}
    >
      {userPhone}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useApp();
  const [activeLesson, setActiveLesson] = useState(sampleLessons[0]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'quiz' | 'resources'>('video');
  const [completedLessons, setCompletedLessons] = useState<string[]>(['l1']); // Pre-fill first lesson as completed for demo
  const [videoProgress, setVideoProgress] = useState(0);
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  const handleLessonClick = (lesson: typeof sampleLessons[0], index: number) => {
    if (isLessonAccessible(index)) {
      setActiveLesson(lesson);
      setShowUpgradeModal(false);
      // Reset logic when changing lesson
      setActiveTab('video');
      setQuizStarted(false);
      setShowResult(false);
      setScore(0);
      setCurrentQuestion(0);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  // Sync Progress with Completion Status
  useEffect(() => {
    if (completedLessons.includes(activeLesson.id)) {
        setVideoProgress(100);
    } else {
        setVideoProgress(0);
    }
  }, [activeLesson.id, completedLessons]);

  // Simulate Video Progress
  useEffect(() => {
    let interval: any;
    if (activeTab === 'video' && !completedLessons.includes(activeLesson.id) && videoProgress < 100) {
        interval = setInterval(() => {
            setVideoProgress(prev => {
                const next = prev + 0.2; // Simulate playback
                if (next >= 100) return 100;
                return next;
            });
        }, 100);
    }
    return () => clearInterval(interval);
  }, [activeTab, activeLesson.id, completedLessons, videoProgress]);


  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === lessonQuiz[currentQuestion].correct) {
        setScore(score + 1);
    }

    if (currentQuestion < lessonQuiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
    } else {
        setShowResult(true);
    }
  };

  const handleDownload = (title: string) => {
    if (user?.subscriptionTier === 'pro') {
        // Simulate download
        alert(`جاري تحميل الملف: ${title}`);
    } else {
        setShowUpgradeModal(true);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative">
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card border border-brand-gold/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-brand-gold/10 transform animate-scale-up">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-white"
            >
              <XCircle size={24} />
            </button>
            <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-brand-gold/30">
              <Lock size={40} className="text-brand-gold" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">هذا المحتوى للمشتركين فقط</h3>
            <p className="text-brand-muted mb-8">
              أنت تستخدم الباقة المجانية. للوصول إلى باقي المحاضرات والامتحانات، يرجى ترقية حسابك.
            </p>
            <Link 
              to="/wallet" 
              className="block w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow"
            >
              ترقية الحساب الآن
            </Link>
          </div>
        </div>
      )}

      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-black text-white mb-2">{activeCourse.title}</h1>
            <div className="flex items-center gap-2 text-brand-muted">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                <span>{activeCourse.chapter}</span>
            </div>
        </div>
        {user.subscriptionTier === 'free' && (
            <Link to="/wallet" className="bg-brand-card border border-brand-gold/30 text-brand-gold px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-gold hover:text-brand-main transition-colors flex items-center gap-2 animate-pulse">
                <Star size={16} />
                ترقية للنسخة الكاملة
            </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="flex bg-brand-card p-1 rounded-xl border border-white/5 w-fit overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('video')}
                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'video' ? 'bg-brand-gold text-brand-main shadow-lg' : 'text-brand-muted hover:text-white'}`}
              >
                <Play size={16} fill={activeTab === 'video' ? "currentColor" : "none"} />
                المحاضرة
              </button>
              <button 
                onClick={() => setActiveTab('quiz')}
                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'quiz' ? 'bg-brand-gold text-brand-main shadow-lg' : 'text-brand-muted hover:text-white'}`}
              >
                <HelpCircle size={16} />
                الامتحان
                <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">جديد</span>
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-lg' : 'text-brand-muted hover:text-white'}`}
              >
                <FileText size={16} />
                المرفقات
              </button>
          </div>

          {activeTab === 'video' && (
              // VIDEO VIEW
              <div className="animate-fade-in">
                
                {/* Lesson Progress Bar */}
                <div className="mb-4 flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-brand-muted flex items-center gap-1">
                            <Activity size={12} className="text-brand-gold" />
                            تقدم المشاهدة
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-gold">{Math.floor(videoProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-brand-gold to-yellow-600 h-full rounded-full transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.3)] relative"
                            style={{ width: `${videoProgress}%` }}
                        >
                            <div className="absolute right-0 top-0 h-full w-2 bg-white/50 blur-[2px]"></div>
                        </div>
                    </div>
                </div>

                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-video group">
                    <iframe 
                        className="w-full h-full absolute inset-0"
                        src="https://www.youtube.com/embed/jfKfPfyJRdk?si=0&theme=dark&color=white" // Using existing placeholder
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                    ></iframe>
                    
                    {/* Watermark for Security */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay">
                        <Watermark userPhone={user.email} />
                    </div>
                </div>

                <div className="bg-brand-card p-8 rounded-2xl border border-white/5 shadow-lg mt-6">
                    <div className="flex items-start justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white leading-snug">{activeLesson.title}</h2>
                        <button className="text-brand-muted hover:text-white transition-colors">
                            <AlertCircle size={20} />
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted pb-6 border-b border-white/5">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> جودة 4K</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5"><Clock size={14} /> {activeLesson.duration} دقيقة</span>
                        
                        {/* Toggle Completion Button */}
                        <button
                          onClick={() => toggleLessonCompletion(activeLesson.id)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-md border transition-all mr-auto ${
                            completedLessons.includes(activeLesson.id)
                            ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20'
                            : 'bg-white/5 text-brand-muted border-transparent hover:bg-white/10 hover:text-white'
                          }`}
                        >
                            <CheckCircle size={16} className={completedLessons.includes(activeLesson.id) ? "fill-green-500/20" : ""} />
                            {completedLessons.includes(activeLesson.id) ? 'مكتمل' : 'تحديد كمكتمل'}
                        </button>
                    </div>
                    
                    <p className="mt-6 text-brand-text leading-relaxed font-light text-lg opacity-90">
                        {activeCourse.description}
                    </p>
                </div>
              </div>
          )}

          {activeTab === 'quiz' && (
              // QUIZ VIEW
              <div className="bg-brand-card rounded-2xl border border-white/5 p-8 min-h-[400px] flex flex-col justify-center animate-fade-in relative overflow-hidden">
                   {/* Background Elements */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                   {!quizStarted ? (
                       <div className="text-center">
                           <div className="w-20 h-20 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                               <FileText size={32} className="text-brand-gold" />
                           </div>
                           <h2 className="text-2xl font-bold text-white mb-3">امتحان على المحاضرة</h2>
                           <p className="text-brand-muted mb-8 max-w-md mx-auto">اختبر معلوماتك في محتوى هذا الدرس. يتكون الامتحان من {lessonQuiz.length} أسئلة.</p>
                           <button 
                                onClick={() => setQuizStarted(true)}
                                className="bg-brand-gold text-brand-main font-bold py-3 px-8 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow"
                           >
                               ابدأ الامتحان الآن
                           </button>
                       </div>
                   ) : showResult ? (
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-main shadow-2xl relative">
                                <div className={`absolute inset-0 rounded-full opacity-20 ${score >= 2 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {score >= 2 ? <CheckCircle size={48} className="text-green-500" /> : <XCircle size={48} className="text-red-500" />}
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">النتيجة: {score} / {lessonQuiz.length}</h2>
                            <p className={`font-bold text-lg mb-8 ${score >= 2 ? 'text-green-400' : 'text-red-400'}`}>
                                {score >= 2 ? 'ممتاز! لقد استوعبت الدرس جيداً.' : 'حاول مراجعة الدرس مرة أخرى.'}
                            </p>
                            <button 
                                onClick={() => {setQuizStarted(false); setScore(0); setCurrentQuestion(0); setShowResult(false);}}
                                className="bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all"
                           >
                               إعادة الامتحان
                           </button>
                        </div>
                   ) : (
                       <div className="w-full max-w-lg mx-auto">
                           {/* Quiz Progress Bar */}
                           <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden">
                                <div 
                                    className="bg-brand-gold h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${((currentQuestion + 1) / lessonQuiz.length) * 100}%` }}
                                ></div>
                           </div>

                           <div className="flex justify-between items-center mb-8 text-sm font-bold text-brand-muted">
                               <span>السؤال {currentQuestion + 1} من {lessonQuiz.length}</span>
                               <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full">اختر الإجابة الصحيحة</span>
                           </div>
                           
                           <h3 className="text-xl font-bold text-white mb-8 leading-relaxed text-right" dir="ltr">
                               {lessonQuiz[currentQuestion].question}
                           </h3>

                           <div className="space-y-4">
                               {lessonQuiz[currentQuestion].options.map((option, idx) => (
                                   <button 
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className="w-full text-left p-4 rounded-xl bg-brand-main border border-white/5 hover:border-brand-gold/50 hover:bg-white/5 transition-all text-white font-medium flex items-center justify-between group"
                                   >
                                       <span dir="ltr">{option}</span>
                                       <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-brand-gold"></div>
                                   </button>
                               ))}
                           </div>
                       </div>
                   )}
              </div>
          )}

          {activeTab === 'resources' && (
              // RESOURCES VIEW
              <div className="bg-brand-card rounded-2xl border border-white/5 p-8 animate-fade-in">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="bg-brand-gold/10 p-3 rounded-full">
                          <FileText className="text-brand-gold" size={24} />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-white">ملفات ومرفقات الدرس</h2>
                          <p className="text-brand-muted text-sm">حمل الملازم والصور التوضيحية الخاصة بهذا الدرس</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lessonResources.map((res, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-brand-main border border-white/5 hover:border-brand-gold/30 transition-all group">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted">
                                      <File size={20} />
                                  </div>
                                  <div>
                                      <h4 className="text-white font-bold text-sm mb-1">{res.title}</h4>
                                      <p className="text-xs text-brand-muted">{res.size} • {res.type.toUpperCase()}</p>
                                  </div>
                              </div>
                              <button 
                                onClick={() => handleDownload(res.title)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${user.subscriptionTier === 'pro' ? 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-main' : 'bg-white/5 text-brand-muted hover:bg-white/10'}`}
                              >
                                  {user.subscriptionTier === 'pro' ? <Download size={18} /> : <Lock size={16} />}
                              </button>
                          </div>
                      ))}
                  </div>

                  {user.subscriptionTier === 'free' && (
                       <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl flex items-center gap-3">
                           <Lock className="text-yellow-500 shrink-0" size={20} />
                           <p className="text-yellow-200 text-sm">بعض الملفات قد تكون متاحة فقط للمشتركين في الباقة الكاملة.</p>
                       </div>
                  )}
              </div>
          )}

        </div>

        {/* Sidebar Lesson List */}
        <div className="space-y-4">
            <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="p-5 bg-black/20 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">محتويات الكورس</h3>
                    <span className="text-xs bg-brand-gold text-brand-main font-bold px-2 py-1 rounded">5 دروس</span>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {sampleLessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const isActive = activeLesson.id === lesson.id;
                        const isCompleted = completedLessons.includes(lesson.id);
                        
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson, idx)}
                                className={`w-full flex items-center gap-4 p-4 transition-all border-b border-white/5 last:border-0 text-right group relative
                                    ${isActive ? 'bg-brand-gold/10' : 'hover:bg-white/5'}
                                    ${!accessible ? 'bg-black/20' : ''}
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors relative
                                    ${isActive ? 'bg-brand-gold text-brand-main' : accessible ? 'bg-white/5 text-brand-muted' : 'bg-red-500/10 text-red-500'}
                                `}>
                                    {accessible ? (isActive ? <Play size={16} fill="currentColor" /> : <span className="font-bold font-mono">{idx + 1}</span>) : <Lock size={16} />}
                                    
                                    {/* Completion Indicator Badge */}
                                    {isCompleted && (
                                        <div className="absolute -top-1.5 -right-1.5 bg-brand-card rounded-full p-0.5 shadow-sm ring-1 ring-black/50">
                                            <CheckCircle size={14} className="text-green-500 fill-green-500/20" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 opacity-100">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm mb-1 transition-colors ${isActive ? 'text-brand-gold' : accessible ? 'text-white' : 'text-brand-muted'}`}>
                                            {lesson.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                                        <span>{lesson.duration}</span>
                                        {!accessible && <span className="text-red-400 text-[10px] border border-red-500/20 px-1 rounded">مشتركين فقط</span>}
                                        {isCompleted && <span className="text-green-500 text-[10px] px-1">تم الانتهاء</span>}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {user.subscriptionTier === 'free' && (
                <div className="bg-gradient-to-br from-yellow-600 to-brand-gold rounded-2xl p-6 text-brand-main text-center relative overflow-hidden shadow-glow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full"></div>
                    <Star className="mx-auto text-brand-main mb-3" size={32} fill="currentColor" />
                    <h3 className="font-black text-xl mb-1">افتح كل الدروس</h3>
                    <p className="text-sm font-semibold opacity-80 mb-6">احصل على وصول كامل للكورسات والامتحانات</p>
                    <Link to="/wallet" className="block w-full bg-brand-main text-brand-gold font-bold py-3.5 rounded-xl hover:bg-brand-hover transition-colors border border-brand-main/20 shadow-lg">
                        اشترك الآن بـ 250 ج.م
                    </Link>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};