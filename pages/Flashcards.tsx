
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Brain, Zap, ArrowLeft, Layers } from 'lucide-react';
import { FlashcardDeck } from '../components/flashcards/FlashcardDeck';

export const Flashcards: React.FC = () => {
  const { courses } = useApp();
  
  // Navigation State
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // 1. Get Selected Course
  const selectedCourse = useMemo(() => 
    courses.find(c => c.id === selectedCourseId), 
  [courses, selectedCourseId]);

  // 2. Get Lessons with Flashcards
  const availableLessons = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.lessons.filter(l => l.flashcards && l.flashcards.length > 0);
  }, [selectedCourse]);

  // 3. Get Active Deck
  const activeDeck = useMemo(() => {
    if (!selectedCourse || !selectedLessonId) return [];
    const lesson = selectedCourse.lessons.find(l => l.id === selectedLessonId);
    return lesson?.flashcards || [];
  }, [selectedCourse, selectedLessonId]);

  // VIEW 1: SUBJECT SELECTION
  if (!selectedCourseId) {
    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Brain size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Flashcard Decks</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Select a subject to browse available flashcard decks and start mastering your terminology.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => {
                    const flashcardCount = course.lessons.reduce((acc, l) => acc + (l.flashcards?.length || 0), 0);
                    return (
                        <div 
                            key={course.id} 
                            onClick={() => setSelectedCourseId(course.id)}
                            className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-50 dark:bg-[#252525] rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <BookOpen size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-brand-blue"/>
                                </div>
                                <span className="bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                                    {flashcardCount} Cards
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{course.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{course.subject}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  }

  // VIEW 2: LESSON SELECTION
  if (!selectedLessonId) {
      return (
        <div className="max-w-3xl mx-auto space-y-8 py-8 px-4 animate-in fade-in slide-in-from-right-4">
            <button 
                onClick={() => setSelectedCourseId(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={16} /> Back to Subjects
            </button>

            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-[#333] pb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={selectedCourse?.image} className="w-full h-full object-cover" alt="Course" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse?.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{availableLessons.length} Decks Available</p>
                </div>
            </div>

            <div className="space-y-4">
                {availableLessons.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-[#151515] rounded-xl border border-dashed border-gray-300 dark:border-[#333]">
                        <Zap size={32} className="mx-auto text-gray-300 mb-2"/>
                        <p className="text-gray-500">No flashcards added to this course yet.</p>
                    </div>
                ) : (
                    availableLessons.map((lesson, idx) => (
                        <div 
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] p-5 rounded-xl cursor-pointer hover:border-brand-blue hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{lesson.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.flashcards?.length} Terms</p>
                                </div>
                            </div>
                            <Layers size={20} className="text-gray-400 group-hover:text-brand-blue" />
                        </div>
                    ))
                )}
            </div>
        </div>
      );
  }

  // VIEW 3: THE DECK (PLAYER)
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 animate-in fade-in zoom-in-95">
       <div className="flex items-center justify-between">
          <button 
                onClick={() => setSelectedLessonId(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={16} /> Exit Deck
          </button>
       </div>

       <FlashcardDeck 
          cards={activeDeck}
          onExit={() => setSelectedLessonId(null)}
       />
    </div>
  );
};
