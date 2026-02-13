
import React, { useState, useEffect, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  FileText, Brain, ChevronRight, 
  Play, Lock, Clock, CheckCircle2,
  Download, ArrowLeft, Share2,
  Info, BookOpen, Image as ImageIcon, Zap,
  Music, Video, MessageSquare, Edit3
} from 'lucide-react';
import { QuizPlayer } from '../components/QuizPlayer';
import { FlashcardDeck } from '../components/flashcards/FlashcardDeck';
import { LessonDiscussion } from '../components/dashboard/LessonDiscussion';
import { LessonNotes } from '../components/dashboard/LessonNotes';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'quiz' | 'flashcards' | 'discussion' | 'notes'>('overview');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  
  useEffect(() => {
     if (course && course.lessons?.length > 0 && !activeLessonId) {
        setActiveLessonId(course.lessons[0].id);
     }
  }, [course]);

  const activeLesson = useMemo(() => 
    course?.lessons?.find(l => l.id === activeLessonId),
  [course, activeLessonId]);

  // Treat all contents as downloadable resources (including videos)
  const downloadableResources = useMemo(() => 
    activeLesson?.contents || [],
  [activeLesson]);

  if (!course) return <div className="p-8 text-center text-muted">Course not found.</div>;

  const isCompleted = (id: string) => user?.completedLessons?.includes(id);
  const progress = course.lessons 
    ? Math.round((course.lessons.filter(l => isCompleted(l.id)).length / course.lessons.length) * 100)
    : 0;

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, url: string, filename: string) => {
    e.preventDefault();
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#F9FAFB] dark:bg-[#101010]">
      
      {activeQuizId && (
        <QuizPlayer 
          quiz={course.lessons?.find(l => l.id === activeQuizId)?.quiz!} 
          onComplete={() => {}} 
          onClose={() => setActiveQuizId(null)} 
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
               <button className="p-2 text-gray-500 hover:text-brand-orange">
                  <Share2 size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col lg:flex-row overflow-hidden">
         
         {/* LEFT: Main Content Area */}
         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            
            {/* Content Tabs & Details */}
            <div className="flex-1 bg-white dark:bg-[#151515] p-4 md:p-8">
               <div className="max-w-4xl mx-auto">
                  {/* Tab Navigation */}
                  <div className="flex items-center gap-6 border-b border-gray-200 dark:border-[#333] mb-6 overflow-x-auto scrollbar-hide">
                     {[
                        { id: 'overview', label: 'نظرة عامة', icon: Info },
                        { id: 'resources', label: 'المصادر', icon: BookOpen, count: downloadableResources.length },
                        { id: 'quiz', label: 'الاختبارات', icon: Brain },
                        { id: 'flashcards', label: 'Flashcards', icon: Zap, count: activeLesson?.flashcards?.length },
                        { id: 'discussion', label: 'النقاشات', icon: MessageSquare },
                        { id: 'notes', label: 'ملاحظاتي', icon: Edit3 },
                     ].map(tab => (
                        <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'text-[#F38020] border-[#F38020]' : 'text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300'}`}
                        >
                          <tab.icon size={16} /> {tab.label}
                          {tab.count !== undefined && (
                            <span className="bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
                          )}
                        </button>
                     ))}
                  </div>

                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                     {activeTab === 'overview' && (
                        <div className="space-y-6">
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{activeLesson?.title}</h2>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                 {activeLesson?.description || "لا يوجد وصف متاح لهذا الدرس."}
                              </p>
                           </div>
                           
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
                           <div className="grid grid-cols-1 gap-3">
                              {downloadableResources.length > 0 ? downloadableResources.map(file => (
                                 <a 
                                    key={file.id} 
                                    href={file.url} 
                                    onClick={(e) => handleDownload(e, file.url, file.title)}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl hover:border-[#F38020] hover:shadow-md transition-all group cursor-pointer"
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                          file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                                          file.type === 'image' ? 'bg-green-50 text-green-500' :
                                          file.type === 'audio' ? 'bg-purple-50 text-purple-500' :
                                          file.type === 'video' ? 'bg-orange-50 text-orange-500' :
                                          'bg-blue-50 text-blue-500'
                                       } dark:bg-[#252525]`}>
                                          {file.type === 'pdf' && <FileText size={20} />}
                                          {file.type === 'video' && <Video size={20} />}
                                          {file.type === 'image' && <ImageIcon size={20} />}
                                          {file.type === 'article' && <FileText size={20} />}
                                          {file.type === 'audio' && <Music size={20} />}
                                       </div>
                                       <div>
                                          <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#F38020] transition-colors">{file.title}</p>
                                          <p className="text-xs text-gray-500">{file.fileSize || 'Unknown Size'} • {file.type.toUpperCase()}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-[#F38020] font-bold">
                                       تحميل <Download size={18} />
                                    </div>
                                 </a>
                              )) : (
                                <div className="text-center py-12 bg-gray-50 dark:bg-[#202020] rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
                                  <p className="text-gray-500">لا توجد مرفقات إضافية لهذا الدرس.</p>
                                </div>
                              )}
                           </div>
                        </div>
                     )}

                     {activeTab === 'flashcards' && (
                        <div className="space-y-4">
                           {activeLesson?.flashcards && activeLesson.flashcards.length > 0 ? (
                              <FlashcardDeck cards={activeLesson.flashcards} />
                           ) : (
                              <div className="text-center py-12 bg-gray-50 dark:bg-[#202020] rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
                                 <Zap size={32} className="mx-auto text-gray-300 mb-2"/>
                                 <p className="text-gray-500">لا توجد بطاقات تعليمية لهذا الدرس.</p>
                              </div>
                           )}
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

                     {activeTab === 'discussion' && (
                        <div className="animate-in fade-in duration-500">
                           <LessonDiscussion />
                        </div>
                     )}

                     {activeTab === 'notes' && (
                        <div className="animate-in fade-in duration-500">
                           <LessonNotes lessonId={activeLessonId || 'default'} />
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Sidebar Playlist */}
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
