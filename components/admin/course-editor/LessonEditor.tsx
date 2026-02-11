
import React, { useState } from 'react';
import { Lesson } from '../../../types';
import { Trash2, ChevronDown, Layout } from 'lucide-react';
import { ContentTab } from './tabs/ContentTab';
import { QuizTab } from './tabs/QuizTab';
import { FlashcardsTab } from './tabs/FlashcardsTab';

interface Props {
  lesson: Lesson;
  index: number;
  courseId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updatedLesson: Lesson) => void;
  onDelete: () => void;
}

export const LessonEditor: React.FC<Props> = ({ 
  lesson, index, courseId, isExpanded, onToggleExpand, onChange, onDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'flashcards' | 'settings'>('content');

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden transition-all">
      {/* Lesson Header */}
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#252525]"
        onClick={onToggleExpand}
      >
         <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-500 hover:text-red-500">
            <Trash2 size={16}/>
         </button>
         
         <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase">Lesson {index + 1}</span>
            <input 
               value={lesson.title}
               onClick={e => e.stopPropagation()}
               onChange={e => onChange({ ...lesson, title: e.target.value })}
               className="bg-transparent border-none outline-none text-white font-bold text-sm w-full"
               placeholder="Lesson Title"
            />
         </div>

         <ChevronDown size={18} className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
         <div className="border-t border-[#333] p-6 bg-[#151515]">
            
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#333] mb-6 text-sm font-medium text-gray-500">
               <button onClick={() => setActiveTab('settings')} className={`pb-2 hover:text-white ${activeTab === 'settings' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Settings</button>
               <button onClick={() => setActiveTab('flashcards')} className={`pb-2 hover:text-white ${activeTab === 'flashcards' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Flashcards</button>
               <button onClick={() => setActiveTab('quiz')} className={`pb-2 hover:text-white ${activeTab === 'quiz' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Quiz</button>
               <button onClick={() => setActiveTab('content')} className={`pb-2 hover:text-white flex items-center gap-2 ${activeTab === 'content' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Content <Layout size={14}/></button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'content' && (
               <ContentTab 
                  contents={lesson.contents || []} 
                  courseId={courseId}
                  onChange={(newContents) => onChange({ ...lesson, contents: newContents })}
               />
            )}

            {activeTab === 'quiz' && (
               <QuizTab 
                  quiz={lesson.quiz}
                  onChange={(newQuiz) => onChange({ ...lesson, quiz: newQuiz })}
               />
            )}

            {activeTab === 'flashcards' && (
               <FlashcardsTab 
                  flashcards={lesson.flashcards}
                  onChange={(newCards) => onChange({ ...lesson, flashcards: newCards })}
               />
            )}
            
            {activeTab === 'settings' && (
               <div className="text-gray-500 text-sm">
                  <p>Lesson Lock Status, Duration overrides, etc. (Coming Soon)</p>
               </div>
            )}
         </div>
      )}
    </div>
  );
};
