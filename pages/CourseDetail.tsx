
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  FileText, Brain, ChevronDown, ChevronRight, 
  Play, Lock, Clock, CheckCircle2, AlertCircle,
  BarChart3, Settings, Download, ArrowLeft,
  Layout as LayoutIcon, Maximize2
} from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';
import { QuizPlayer } from '../components/QuizPlayer';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { user, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'content' | 'overview'>('content');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  
  // Set initial active lesson
  React.useEffect(() => {
     if (course && course.lessons.length > 0 && !activeLessonId) {
        setActiveLessonId(course.lessons[0].id);
     }
  }, [course]);

  if (!course) return <div className="p-8 text-center text-muted">Configuration not found.</div>;

  const activeLesson = course.lessons.find(l => l.id === activeLessonId);
  const isCompleted = (id: string) => user?.completedLessons?.includes(id);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {activeQuizId && (
        <QuizPlayer 
          quiz={course.lessons.find(l => l.id === activeQuizId)?.quiz!} 
          onComplete={() => {}} 
          onClose={() => setActiveQuizId(null)} 
        />
      )}

      {/* Breadcrumb & Controls */}
      <div className="mb-4 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-2">
            <Link to="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors">
               <ArrowLeft size={16} className="text-main" />
            </Link>
            <div>
               <h1 className="text-lg font-bold text-main leading-tight">{course.title}</h1>
               <p className="text-xs text-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {activeLesson?.title || 'Select a lesson'}
               </p>
            </div>
         </div>
         <div className="flex gap-2">
             <button 
               onClick={() => setActiveTab(activeTab === 'content' ? 'overview' : 'content')}
               className="btn-secondary text-xs"
             >
               <LayoutIcon size={14} /> View
             </button>
         </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
         
         {/* LEFT: Content Area (Scrollable) */}
         <div className="flex-1 flex flex-col bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333] rounded-[8px] shadow-sm overflow-hidden">
            {activeLesson ? (
               <div className="flex-1 overflow-y-auto">
                  {/* Mock Video Player Area */}
                  <div className="aspect-video bg-black flex items-center justify-center relative group">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <Play size={48} className="text-white opacity-80" fill="white" />
                     <span className="absolute bottom-4 left-4 text-white text-xs font-mono">Video Playback Placeholder</span>
                  </div>

                  <div className="p-8 max-w-4xl mx-auto space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold text-main mb-2">{activeLesson.title}</h2>
                        <p className="text-muted leading-relaxed">
                           In this lesson, we cover the fundamental aspects of the topic. Please review the attached audio notes and PDF documents before taking the quiz.
                        </p>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Lesson Materials</h3>
                        
                        {/* Audio Content */}
                        {activeLesson.contents.filter(c => c.type === 'audio').map(audio => (
                           <AudioPlayer key={audio.id} url={audio.url} title={audio.title} />
                        ))}

                        {/* PDF & Quiz Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {activeLesson.contents.filter(c => c.type === 'pdf').map(pdf => (
                              <a 
                                 key={pdf.id} href={pdf.url} target="_blank" 
                                 className="flex items-center gap-3 p-4 border border-[#E5E5E5] dark:border-[#333] rounded-[6px] hover:border-[#F38020] transition-all group bg-[#FAFAFA] dark:bg-[#252525]"
                              >
                                 <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded border border-[#E5E5E5] dark:border-[#333] text-red-500">
                                    <FileText size={20} />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-main truncate">{pdf.title}</p>
                                    <p className="text-[10px] text-muted">{pdf.fileSize || '1.2 MB'}</p>
                                 </div>
                                 <Download size={16} className="text-muted group-hover:text-main" />
                              </a>
                           ))}

                           {activeLesson.quiz && (
                              <button 
                                 onClick={() => setActiveQuizId(activeLesson.id)}
                                 className="flex items-center gap-3 p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 rounded-[6px] hover:shadow-md transition-all text-left"
                              >
                                 <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded border border-blue-100 dark:border-blue-800 text-[#0051C3] dark:text-[#68b5fb]">
                                    <Brain size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-[#0051C3] dark:text-[#68b5fb]">Take Lesson Quiz</p>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-300">Test your knowledge</p>
                                 </div>
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-muted">Select a lesson to start</div>
            )}
         </div>

         {/* RIGHT: Playlist / Syllabus */}
         <div className="w-80 flex flex-col bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333] rounded-[8px] shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#E5E5E5] dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525]">
               <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Course Syllabus</h3>
               <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[45%]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-muted">45%</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto">
               {course.lessons.map((lesson, idx) => {
                  const active = activeLessonId === lesson.id;
                  const locked = lesson.isLocked;
                  const done = isCompleted(lesson.id);

                  return (
                     <button
                        key={lesson.id}
                        onClick={() => !locked && setActiveLessonId(lesson.id)}
                        disabled={locked}
                        className={`w-full text-left p-4 border-b border-[#E5E5E5] dark:border-[#333] transition-colors flex gap-3 ${
                           active 
                           ? 'bg-blue-50/50 dark:bg-[#2B3A4F] border-l-4 border-l-[#0051C3] dark:border-l-[#68b5fb]' 
                           : 'hover:bg-gray-50 dark:hover:bg-[#252525] border-l-4 border-l-transparent'
                        } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                     >
                        <div className="mt-0.5">
                           {locked ? (
                              <Lock size={14} className="text-muted" />
                           ) : done ? (
                              <CheckCircle2 size={14} className="text-green-500" />
                           ) : (
                              <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] ${active ? 'border-[#0051C3]' : 'border-gray-400'}`}></div>
                           )}
                        </div>
                        <div>
                           <p className={`text-xs font-semibold mb-0.5 ${active ? 'text-[#0051C3] dark:text-[#68b5fb]' : 'text-main'}`}>
                              {idx + 1}. {lesson.title}
                           </p>
                           <p className="text-[10px] text-muted flex items-center gap-2">
                              <Clock size={10} /> {lesson.duration || '10m'}
                           </p>
                        </div>
                     </button>
                  );
               })}
            </div>
         </div>

      </div>
    </div>
  );
};
