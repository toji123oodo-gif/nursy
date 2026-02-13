
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  Search, BookOpen, Clock, Filter, ArrowRight, 
  PlayCircle, Star, Sparkles, LayoutGrid, List as ListIcon,
  Zap, MoreHorizontal
} from 'lucide-react';

export const MyCourses: React.FC = () => {
  const { courses, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const subjects = ['All', ...Array.from(new Set(courses.map(c => c.subject)))];

  // Logic for Latest Additions (last 3 added)
  const latestCourses = [...courses].reverse().slice(0, 3); 

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-8 pb-24 md:pb-12 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
           <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                 مكتبة الكورسات <BookOpen className="text-brand-orange" size={32} />
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base max-w-lg">
                 استكشف محتوى أكاديمي متطور، صمم خصيصاً لطلاب التمريض في مصر.
              </p>
           </div>
           
           {/* View Toggle (Desktop Only) */}
           <div className="hidden md:flex bg-white dark:bg-[#1E1E1E] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#333] text-brand-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                 <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#333] text-brand-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                 <ListIcon size={20} />
              </button>
           </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
           </div>
           <input 
             type="text" 
             placeholder="ابحث عن مادة، موضوع، أو دكتور..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl pl-12 pr-4 py-4 text-sm md:text-base shadow-sm focus:shadow-md focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none"
           />
        </div>
      </div>

      {/* --- FEATURED CAROUSEL (Mobile Optimized) --- */}
      {selectedSubject === 'All' && !searchTerm && (
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Sparkles className="text-yellow-500 fill-yellow-500" size={18} /> أضيف حديثاً
              </h2>
           </div>
           
           {/* Horizontal Scroll Container */}
           <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {latestCourses.map(course => (
                 <Link 
                    to={`/course/${course.id}`} 
                    key={course.id} 
                    className="snap-center shrink-0 w-[85vw] md:w-[400px] relative group overflow-hidden rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-md hover:shadow-xl transition-all duration-300"
                 >
                    <div className="absolute top-3 right-3 z-10">
                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">جديد</span>
                    </div>
                    
                    <div className="h-48 overflow-hidden relative">
                       <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 mb-2 inline-block">
                             {course.subject}
                          </span>
                          <h3 className="font-bold text-lg leading-tight line-clamp-1">{course.title}</h3>
                       </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center bg-white dark:bg-[#1E1E1E]">
                       <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center font-bold">
                             {course.instructor.charAt(0)}
                          </div>
                          Dr. {course.instructor}
                       </div>
                       <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                          <PlayCircle size={16} fill="currentColor" />
                       </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>
      )}

      {/* --- MAIN LIST --- */}
      <div className="space-y-6">
         {/* Sticky Filter Header */}
         <div className="sticky top-[60px] z-10 bg-[#F9FAFB]/95 dark:bg-[#101010]/95 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-gray-200/50 dark:border-[#333]/50 transition-all">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
               {subjects.map(subj => (
                  <button
                     key={subj}
                     onClick={() => setSelectedSubject(subj)}
                     className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                        selectedSubject === subj 
                        ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-orange-500/20 scale-105' 
                        : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2C2C2C]'
                     }`}
                  >
                     {subj === 'All' ? 'الكل' : subj}
                  </button>
               ))}
            </div>
         </div>

         {/* Course Grid */}
         <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filteredCourses.map((course, idx) => {
               // Calculate mock progress based on course ID hash or user data if available
               const completed = user?.completedLessons?.filter(id => id.startsWith(course.id)).length || 0;
               const total = course.lessons.length;
               const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

               return (
                  <Link 
                     to={`/course/${course.id}`} 
                     key={course.id}
                     className={`group bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-200 dark:border-[#333] overflow-hidden hover:border-brand-orange/50 dark:hover:border-brand-orange/50 hover:shadow-xl transition-all duration-300 flex ${viewMode === 'list' ? 'flex-row h-32 md:h-40' : 'flex-col h-full'} animate-in fade-in slide-in-from-bottom-4`}
                     style={{ animationDelay: `${idx * 50}ms` }}
                  >
                     {/* Image Section */}
                     <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 md:w-48' : 'h-48'}`}>
                        <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        
                        {/* Subject Badge */}
                        <div className="absolute top-3 left-3">
                           <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-white/20">
                              {course.subject}
                           </span>
                        </div>

                        {/* Progress Bar (Bottom of image in grid, bottom of card in list) */}
                        {viewMode === 'grid' && progress > 0 && (
                           <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/30 backdrop-blur">
                              <div className="h-full bg-brand-orange shadow-[0_0_10px_rgba(243,128,32,0.8)]" style={{ width: `${progress}%` }}></div>
                           </div>
                        )}
                     </div>
                     
                     {/* Content Section */}
                     <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-brand-orange transition-colors">
                                 {course.title}
                              </h3>
                              {viewMode === 'list' && (
                                 <div className="p-2 text-gray-400 group-hover:text-brand-orange"><ArrowRight size={18} className="rotate-180"/></div>
                              )}
                           </div>
                           
                           <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                              Dr. {course.instructor}
                           </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                           {/* Meta Info */}
                           <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2C2C2C] px-2 py-1 rounded-md font-medium">
                                 <PlayCircle size={10} /> {course.lessons.length}
                              </span>
                              {progress > 0 ? (
                                 <span className="text-[10px] font-bold text-brand-orange">{progress}% مكتمل</span>
                              ) : (
                                 <span className="text-[10px] font-medium text-gray-400">لم يبدأ</span>
                              )}
                           </div>

                           {/* Action Button (Grid View) */}
                           {viewMode === 'grid' && (
                              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#252525] flex items-center justify-center text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                 <ArrowRight size={14} className="rotate-180" />
                              </div>
                           )}
                        </div>
                     </div>
                  </Link>
               );
            })}
         </div>

         {/* Empty State */}
         {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-dashed border-gray-200 dark:border-[#333] text-center px-4">
               <div className="w-20 h-20 bg-gray-50 dark:bg-[#252525] rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-300 dark:text-gray-600" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">لا توجد نتائج</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                  حاول البحث بكلمات مختلفة أو تغيير الفلتر المختار.
               </p>
               <button 
                 onClick={() => { setSearchTerm(''); setSelectedSubject('All'); }}
                 className="mt-6 text-brand-orange text-sm font-bold hover:underline"
               >
                  مسح كل الفلاتر
               </button>
            </div>
         )}
      </div>
    </div>
  );
};
