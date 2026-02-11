
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Plus, Edit2, Trash2, Layout } from 'lucide-react';
import { CourseEditorModal } from './course-editor/CourseEditorModal';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});

  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];
  const isOwner = user && OWNERS.includes(user.email);

  const openNewCourseModal = () => {
    if (!isOwner) return;
    setEditingCourse({
      id: '',
      title: '',
      instructor: '',
      subject: '',
      image: '',
      price: 0,
      lessons: []
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (course: Course) => {
    if (!isOwner) return;
    setEditingCourse(JSON.parse(JSON.stringify(course))); // Deep copy
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (courseData: Course) => {
      if (courses.find(c => c.id === courseData.id)) {
          await updateCourse(courseData);
      } else {
          await addCourse(courseData);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Layout size={20} className="text-brand-orange"/> Course Manager</h2>
            <p className="text-sm text-gray-500">Design your curriculum and manage content.</p>
         </div>
         {isOwner && (
           <button onClick={openNewCourseModal} className="btn-primary flex items-center gap-2 px-6 py-2.5">
             <Plus size={18}/> New Course
           </button>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-44 relative overflow-hidden">
               <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                  <button onClick={() => handleEditClick(course)} className="p-3 bg-white rounded-xl text-blue-600 shadow-xl hover:scale-110 transition-transform"><Edit2 size={20}/></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-3 bg-white rounded-xl text-red-600 shadow-xl hover:scale-110 transition-transform"><Trash2 size={20}/></button>
               </div>
            </div>
            <div className="p-5">
               <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">{course.title}</h4>
               <p className="text-xs text-gray-500 mt-1">{course.lessons?.length || 0} Lessons • {course.subject}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CourseEditorModal 
            initialCourse={editingCourse}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};
