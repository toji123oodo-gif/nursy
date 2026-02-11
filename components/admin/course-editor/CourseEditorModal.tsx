
import React, { useState } from 'react';
import { Course, Lesson } from '../../../types';
import { Save, Loader2, Plus } from 'lucide-react';
import { CourseSettingsSidebar } from './CourseSettingsSidebar';
import { LessonEditor } from './LessonEditor';

interface Props {
  initialCourse: Partial<Course>;
  onClose: () => void;
  onSave: (course: Course) => Promise<void>;
}

export const CourseEditorModal: React.FC<Props> = ({ initialCourse, onClose, onSave }) => {
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>(initialCourse);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(
    initialCourse.lessons && initialCourse.lessons.length > 0 ? initialCourse.lessons[0].id : null
  );

  const executeSave = async () => {
    if (!editingCourse.title) return;
    setIsSaving(true);
    try {
        const isNewCourse = !editingCourse.id || editingCourse.id === '';
        const courseId = isNewCourse ? 'c-' + Date.now() : editingCourse.id!;

        const courseData: Course = {
            id: courseId,
            title: editingCourse.title || 'New Course',
            instructor: editingCourse.instructor || 'Instructor',
            subject: editingCourse.subject || 'General',
            image: editingCourse.image || 'https://placehold.co/600x400',
            price: Number(editingCourse.price) || 0,
            lessons: editingCourse.lessons || []
        };

        await onSave(courseData);
        onClose();
    } catch (error) {
        alert(`Error saving: ${error}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSettingsChange = (field: keyof Course, value: any) => {
    setEditingCourse(prev => ({ ...prev, [field]: value }));
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: 'l-' + Date.now(),
      title: 'New Lesson',
      contents: [],
      isLocked: false,
      flashcards: []
    };
    setEditingCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setExpandedLessonId(newLesson.id);
  };

  const updateLesson = (index: number, updatedLesson: Lesson) => {
    const updatedLessons = [...(editingCourse.lessons || [])];
    updatedLessons[index] = updatedLesson;
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const deleteLesson = (index: number) => {
    if(!confirm("Delete this lesson?")) return;
    const updatedLessons = [...(editingCourse.lessons || [])];
    updatedLessons.splice(index, 1);
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#121212] flex flex-col overflow-hidden text-gray-200">
         
         {/* 1. Header Bar */}
         <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#1a1a1a]">
           <div className="flex items-center gap-4">
              <button 
                onClick={executeSave} 
                disabled={isSaving}
                className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2"
              >
                 {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-sm font-bold">
                 Discard
              </button>
           </div>
           
           <div className="text-center">
              <h2 className="text-white font-bold">{editingCourse.title || 'New Course'}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{editingCourse.lessons?.length || 0} Lessons</p>
           </div>

           <div className="w-24"></div>
         </div>

         {/* 2. Main Editor Body */}
         <div className="flex-1 flex overflow-hidden">
            
            {/* Left: Curriculum (Main Content) */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
               <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end mb-4">
                     <h3 className="text-xl font-bold text-white">Curriculum</h3>
                     <button onClick={addLesson} className="text-sm bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Plus size={16}/> Add Lesson
                     </button>
                  </div>

                  {(!editingCourse.lessons || editingCourse.lessons.length === 0) && (
                     <div className="border-2 border-dashed border-[#333] rounded-2xl p-12 text-center text-gray-500">
                        <p>No lessons added yet. Click "Add Lesson" to start.</p>
                     </div>
                  )}

                  {editingCourse.lessons?.map((lesson, idx) => (
                     <LessonEditor 
                        key={lesson.id}
                        lesson={lesson}
                        index={idx}
                        courseId={editingCourse.id || 'temp'}
                        isExpanded={expandedLessonId === lesson.id}
                        onToggleExpand={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}
                        onChange={(updated) => updateLesson(idx, updated)}
                        onDelete={() => deleteLesson(idx)}
                     />
                  ))}
               </div>
            </div>

            {/* Right: Sidebar Settings */}
            <CourseSettingsSidebar 
                course={editingCourse} 
                onChange={handleSettingsChange}
            />

         </div>
    </div>
  );
};
