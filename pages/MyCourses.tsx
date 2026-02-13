
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Search, BookOpen, Clock, Filter, ArrowRight, PlayCircle, Star } from 'lucide-react';

export const MyCourses: React.FC = () => {
  const { courses, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', ...Array.from(new Set(courses.map(c => c.subject)))];

  // Logic for Latest Additions (assuming courses are added in order, or we reverse)
  // Since we don't have a date field, we'll take the last 2.
  const latestCourses = [...courses].reverse().slice(0, 2);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-[#333] pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your learning journey and explore new topics.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search your library..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F38020] transition-colors"
           />
        </div>
      </div>

      {/* Latest Additions Section */}
      <div className="space-y-4">
         <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={18} /> Latest Additions
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestCourses.map(course => (
               <Link to={`/course/${course.id}`} key={course.id} className="group relative bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#333] hover:shadow-lg transition-all flex h-48 md:h-48">
                  <div className="w-1/3 relative overflow-hidden">
                     <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md mb-2 inline-block">{course.subject}</span>
                           <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-[#2C2C2C] px-1.5 py-0.5 rounded">NEW</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">Master {course.subject} with {course.instructor}.</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-[#F38020] group-hover:translate-x-1 transition-transform mt-3">
                        Start Learning <ArrowRight size={16} />
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>

      {/* Main Course List */}
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <BookOpen size={18} /> All Courses
            </h2>
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               {subjects.map(subj => (
                  <button
                     key={subj}
                     onClick={() => setSelectedSubject(subj)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                        selectedSubject === subj 
                        ? 'bg-[#F38020] text-white' 
                        : 'bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2C2C2C]'
                     }`}
                  >
                     {subj}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
               // Calculate mock progress based on course ID hash or user data if available
               const completed = user?.completedLessons?.filter(id => id.startsWith(course.id)).length || 0;
               const total = course.lessons.length;
               const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

               return (
                  <Link 
                     to={`/course/${course.id}`} 
                     key={course.id}
                     className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] overflow-hidden hover:border-[#F38020] transition-all group hover:shadow-lg flex flex-col h-full"
                  >
                     <div className="h-40 relative overflow-hidden">
                        <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                        <div className="absolute top-3 left-3">
                           <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                              {course.subject}
                           </span>
                        </div>
                        {progress > 0 && (
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-[#333]">
                              <div className="h-full bg-[#F38020]" style={{ width: `${progress}%` }}></div>
                           </div>
                        )}
                     </div>
                     
                     <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Dr. {course.instructor}</p>
                        
                        <div className="mt-auto flex items-center justify-between text-xs">
                           <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2C2C2C] px-2 py-1 rounded">
                              <PlayCircle size={12} /> {course.lessons.length} Lessons
                           </span>
                           {progress > 0 ? (
                              <span className="font-bold text-[#F38020]">{progress}% Complete</span>
                           ) : (
                              <span className="font-bold text-gray-400">Not Started</span>
                           )}
                        </div>
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
    </div>
  );
};
