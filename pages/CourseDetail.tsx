
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link, useNavigate } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  FileText, Brain, ChevronDown, ChevronRight, 
  Play, Lock, Clock, CheckCircle2, AlertCircle,
  BarChart3, Settings, Download, ArrowLeft,
  Layout as LayoutIcon, Maximize2, Menu, Share2,
  MessageSquare, Info, BookOpen, Image as ImageIcon
} from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';
import { QuizPlayer } from '../components/QuizPlayer';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'quiz'>('overview');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile/desktop toggle if needed

  const course = courses.find(c => c.id === courseId);
  
  // Set initial active lesson
  useEffect(() => {
     if (course && course.lessons?.length > 0 && !activeLessonId) {
        setActiveLessonId(course.lessons[0].id);
     }
  }, [course]);

  if (!course) return <div className="p-8 text-center text-muted">Course not found.</div>;

  const activeLesson = course.lessons?.find(l => l.id === activeLessonId);
  const isCompleted = (id: string) => user?.completedLessons?.includes(id);

  // Helper to calculate course progress
  const progress = course.lessons 
    ? Math.round((course.lessons.filter(l => isCompleted(l.id)).length / course.lessons.length) * 100)
    : 0;

  // Find the first PDF in the active lesson to use as the quiz reference source
  const lessonPdfUrl = activeLesson?.contents?.find(c => c.type === 'pdf')?.url;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#F9FAFB] dark:bg-[#101010]">
      
      {activeQuizId && (
        <QuizPlayer 
          quiz={course.lessons?.find(l => l.id === activeQuizId)?.quiz!} 
          onComplete={() => {}} 
          onClose={() => setActiveQuizId(null)} 
          pdfUrl={lessonPdfUrl} // Pass the PDF URL here
        />
      )}

      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E5E5E5] dark:border-[#333] px-4 py-3 sticky top-0 z-20 shadow-sm">
         <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
               <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors shrink-0">
                  <ArrowLeft size={18} className="text-gray-600 dark:text-gray-300" />
               </button>
               <div className="border-r border-gray-200 dark:border-[#444] h-6 mx-1 hidden sm:block"></div>
               <div>
                  <h1 className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                     {course.title}
                  </h1>
               </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
               <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                     <span className="text-brand-orange">{progress}% مكتمل</span>
                  </div>
                  <div className="w-32 h-1.5 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden">
                     <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
               </div>
               <button className="md:hidden p-2 text-gray-500 hover:text-brand-orange">
                  <Share2 size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col lg:flex-row overflow-hidden">
         
         {/* LEFT: Main Content Area */}
         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            
            {/* 1. Player Section (Cinema Mode) */}
            <div className="bg-black aspect-video w-full relative group flex items-center justify-center">
               {/* This is a placeholder for the actual video player */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60"></div>
               
               <div className="text-center relative z-10 p-6">
                  <div className="w-16 h-16 bg-[#F38020] rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(243,128,32,0.4)]">
                     <Play size={32} className="text-white ml-1" fill="currentColor" />
                  </div>
                  <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md">
                     {activeLesson?.title || 'Select a lesson to start'}
                  </h3>
                  {activeLesson?.duration && (
                     <p className="text-white/80 text-sm mt-2 font-mono flex items-center justify-center gap-2">
                        <Clock size={14} /> {activeLesson.duration}
                     </p>
                  )}
               </div>

               {/* Video Controls Mockup */}
               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/90 to-transparent px-4 flex items-center justify-between text-white/80">
                  <div className="flex gap-4 text-xs font-mono">
                     <span>00:00 / {activeLesson?.duration?.replace('m', ':00') || '10:00'}</span>
                  </div>
                  <Maximize2 size={16} className="cursor-pointer hover:text-white" />
               </div>
            </div>

            {/* 2. Content Tabs & Details */}
            <div className="flex-1 bg-white dark:bg-[#151515] p-4 md:p-8">
               <div className="max-w-4xl mx-auto">
                  {/* Tab Navigation */}
                  <div className="flex items-center gap-6 border-b border-gray-200 dark:border-[#333] mb-6 overflow-x-auto scrollbar-hide">
                     <button 
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${activeTab === 'overview' ? 'text-[#F38020] border-[#F38020]' : 'text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300'}`}
                     >
                        <Info size={16} /> نظرة عامة
                     </button>
                     <button 
                        onClick={() => setActiveTab('resources')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${activeTab === 'resources' ? 'text-[#F38020] border-[#F38020]' : 'text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300'}`}
                     >
                        <BookOpen size={16} /> المصادر والمرفقات
                        <span className="bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full">{activeLesson?.contents?.length || 0}</span>
                     </button>
                     <button 
                        onClick={() => setActiveTab('quiz')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${activeTab === 'quiz' ? 'text-[#F38020] border-[#F38020]' : 'text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300'}`}
                     >
                        <Brain size={16} /> الاختبارات
                     </button>
                  </div>

                  {/* Tab Content */}
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                     {activeTab === 'overview' && (
                        <div className="space-y-6">
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">عن هذا الدرس</h2>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                 {activeLesson?.description || "لا يوجد وصف متاح لهذا الدرس. يرجى مراجعة الفيديو والمرفقات للحصول على المعلومات الكاملة."}
                              </p>
                           </div>
                           
                           {/* Quick Stats */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-4 bg-gray-50 dark:bg-[#202020] rounded-xl border border-gray-100 dark:border-[#333]">
                                 <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">المادة</p>
                                 <p className="font-bold text-gray-900 dark:text-white">{course.subject}</p>
                              </div>
                              <div className="p-4 bg-gray-50 dark:bg-[#202020] rounded-xl border border-gray-100 dark:border-[#333]">
                                 <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">المحاضر</p>
                                 <p className="font-bold text-gray-900 dark:text-white">{course.instructor}</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'resources' && (
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">مواد تعليمية قابلة للتحميل</h3>
                           
                           {/* Audio Players */}
                           {activeLesson?.contents?.filter(c => c.type === 'audio').map(audio => (
                              <AudioPlayer key={audio.id} url={audio.url} title={audio.title} />
                           ))}

                           {/* Files List */}
                           <div className="grid grid-cols-1 gap-3">
                              {activeLesson?.contents?.filter(c => c.type !== 'audio').map(file => (
                                 <a 
                                    key={file.id} 
                                    href={file.url} 
                                    target="_blank"
                                    className="flex items-center justify-between p-4 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl hover:border-[#F38020] hover:shadow-md transition-all group"
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                          file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                                          file.type === 'image' ? 'bg-green-50 text-green-500' :
                                          'bg-blue-50 text-blue-500'
                                       } dark:bg-[#252525]`}>
                                          {file.type === 'pdf' && <FileText size={20} />}
                                          {file.type === 'video' && <Play size={20} />}
                                          {file.type === 'image' && <ImageIcon size={20} />}
                                          {file.type === 'article' && <FileText size={20} />}
                                       </div>
                                       <div>
                                          <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#F38020] transition-colors">{file.title}</p>
                                          <p className="text-xs text-gray-500">{file.fileSize || 'Unknown Size'} • {file.type.toUpperCase()}</p>
                                       </div>
                                    </div>
                                    <Download size={18} className="text-gray-400 group-hover:text-[#F38020]" />
                                 </a>
                              ))}
                              {(!activeLesson?.contents || activeLesson.contents.length === 0) && (
                                 <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 dark:border-[#333] rounded-xl">
                                    <FileText size={24} className="mx-auto mb-2 opacity-50"/>
                                    لا توجد مرفقات لهذا الدرس
                                 </div>
                              )}
                           </div>
                        </div>
                     )}

                     {activeTab === 'quiz' && (
                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-[#202020] rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
                           <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-4">
                              <Brain size={32} />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {activeLesson?.quiz ? activeLesson.quiz.title : "لا يوجد اختبار"}
                           </h3>
                           <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm text-center mb-6">
                              {activeLesson?.quiz 
                                ? `اختبر معلوماتك في هذا الدرس. يتكون الاختبار من ${activeLesson.quiz.questions.length} أسئلة.` 
                                : "لم يتم إضافة اختبار لهذا الدرس بعد."}
                           </p>
                           {activeLesson?.quiz && (
                              <button 
                                 onClick={() => setActiveQuizId(activeLesson.id)}
                                 className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
                              >
                                 بدء الاختبار الآن
                              </button>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Sidebar Playlist (Sticky on Desktop) */}
         <div className="w-full lg:w-[380px] bg-white dark:bg-[#1E1E1E] border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#333] flex flex-col shrink-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-[4rem]">
            <div className="p-5 border-b border-gray-200 dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525]">
               <h3 className="font-bold text-gray-900 dark:text-white mb-1">محتوى الكورس</h3>
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{user?.completedLessons?.length || 0} / {course.lessons?.length || 0} درس مكتمل</span>
                  <span>{progress}%</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-[#333] h-1 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto">
               {course.lessons?.map((lesson, idx) => {
                  const active = activeLessonId === lesson.id;
                  const locked = lesson.isLocked;
                  const done = isCompleted(lesson.id);

                  return (
                     <div
                        key={lesson.id}
                        onClick={() => !locked && setActiveLessonId(lesson.id)}
                        className={`
                           group flex items-start gap-4 p-4 border-b border-gray-100 dark:border-[#2a2a2a] cursor-pointer transition-all duration-200 relative
                           ${active ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#252525]'}
                           ${locked ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                     >
                        {/* Active Indicator Bar */}
                        {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38020]"></div>}

                        <div className="mt-1">
                           {locked ? (
                              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#333] text-gray-400 flex items-center justify-center">
                                 <Lock size={12} />
                              </div>
                           ) : done ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                                 <CheckCircle2 size={14} />
                              </div>
                           ) : active ? (
                              <div className="w-6 h-6 rounded-full bg-[#F38020] text-white flex items-center justify-center animate-pulse">
                                 <Play size={10} fill="currentColor" />
                              </div>
                           ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                 {idx + 1}
                              </div>
                           )}
                        </div>

                        <div className="flex-1">
                           <h4 className={`text-sm font-bold leading-tight mb-1 ${active ? 'text-[#F38020]' : 'text-gray-800 dark:text-gray-200 group-hover:text-[#F38020] transition-colors'}`}>
                              {lesson.title}
                           </h4>
                           <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1"><Clock size={10} /> {lesson.duration || '15m'}</span>
                              {lesson.quiz && <span className="flex items-center gap-1 text-blue-500"><Brain size={10} /> Quiz</span>}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

      </div>
    </div>
  );
};
