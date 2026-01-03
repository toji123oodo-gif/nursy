
import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Star, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizPlayer } from '../components/QuizPlayer';
import { AudioPlayer } from '../components/AudioPlayer';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StudyResources } from '../components/dashboard/StudyResources';
import { LessonSidebar } from '../components/dashboard/LessonSidebar';
import { LessonTabs } from '../components/dashboard/LessonTabs';
import { LessonNotes } from '../components/dashboard/LessonNotes';
import { LessonDiscussion } from '../components/dashboard/LessonDiscussion';
import { LeaderboardWidget } from '../components/dashboard/LeaderboardWidget';
import { FlashcardWidget } from '../components/dashboard/FlashcardWidget';

export const Dashboard: React.FC = () => {
  const { user, courses, updateUserData } = useApp();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'discussion' | 'notes'>('resources');

  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id);
      setActiveLessonId(courses[0].lessons[0]?.id || null);
    }
  }, [courses, activeCourseId]);

  const activeCourse = useMemo(() => 
    courses.find(c => c.id === activeCourseId) || courses[0], 
    [courses, activeCourseId]
  );
  
  const activeLesson = useMemo(() => 
    activeCourse?.lessons.find(l => l.id === activeLessonId) || activeCourse?.lessons[0], 
    [activeCourse, activeLessonId]
  );

  if (!user || !activeCourse || !activeLesson) return null;

  const isCompleted = (id: string) => user.completedLessons?.includes(id);
  
  const toggleCompletion = async (id: string) => {
    const isNowCompleted = !isCompleted(id);
    const updatedLessons = isNowCompleted 
      ? [...(user.completedLessons || []), id]
      : user.completedLessons?.filter(x => x !== id);
    
    const xpReward = isNowCompleted ? 50 : 0;
    
    await updateUserData({ 
      completedLessons: updatedLessons,
      xp: (user.xp || 0) + xpReward
    });
  };

  const courseProgress = Math.round(
    (user.completedLessons?.filter(id => 
      activeCourse.lessons.some(l => l.id === id)
    ).length || 0) / activeCourse.lessons.length * 100
  );

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      {isQuizActive && activeLesson.quiz && (
        <QuizPlayer 
          quiz={activeLesson.quiz} 
          onComplete={(score) => {
            if (score >= 50) {
               updateUserData({ xp: (user.xp || 0) + 100 });
            }
          }} 
          onClose={() => setIsQuizActive(false)} 
        />
      )}

      <div className="flex flex-col xl:flex-row gap-12">
        <div className="flex-1 space-y-8">
          
          <DashboardHeader 
            subject={activeCourse.subject} 
            title={activeCourse.title} 
            progress={courseProgress} 
          />

          <LessonTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="ns-animate--fade-in">
            {activeTab === 'resources' && (
              <div className="space-y-12">
                <AudioPlayer 
                  url={activeLesson.contents.find(c => c.type === 'audio')?.url || ''} 
                  title={activeLesson.title} 
                />

                <StudyResources 
                  pdfFiles={activeLesson.contents.filter(c => c.type === 'pdf')}
                  onQuizClick={() => setIsQuizActive(true)}
                />

                <button 
                  onClick={() => toggleCompletion(activeLesson.id)} 
                  className={`w-full py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-xl ${
                    isCompleted(activeLesson.id) 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-brand-card border border-white/10 text-white hover:border-brand-gold/50'
                  }`}
                >
                   {isCompleted(activeLesson.id) ? <CheckCircle size={32} /> : <Star size={32} />} 
                   {isCompleted(activeLesson.id) ? 'تـم الإنجاز بنجاح' : 'تحديد هذه المحاضرة كمكتملة'}
                </button>
              </div>
            )}

            {activeTab === 'discussion' && <LessonDiscussion />}
            
            {activeTab === 'notes' && <LessonNotes lessonId={activeLesson.id} />}
          </div>
        </div>

        <div className="xl:w-[450px] space-y-8">
           <LeaderboardWidget 
             xp={user.xp || 0} 
             rank={142} 
             streak={user.streak || 0} 
           />

           <FlashcardWidget />
           
           <LessonSidebar 
             lessons={activeCourse.lessons}
             activeLessonId={activeLesson.id}
             completedLessons={user.completedLessons || []}
             onLessonClick={(id) => { setActiveLessonId(id); setActiveTab('resources'); }}
           />
           <div className="ns-card p-8 bg-brand-gold/5 border-brand-gold/10 flex items-center gap-4">
              <Info className="text-brand-gold" size={24} />
              <p className="text-[11px] text-brand-muted font-bold leading-relaxed">
                مذاكرتك في هذا الفصل تغطي 40% من أسئلة امتحان الفاينال المتوقعة. استمر بتركيز!
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
