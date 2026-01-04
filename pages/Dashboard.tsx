
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  Search, Play, BookOpen, Clock, 
  Award, Calendar, ArrowRight, Zap, MoreHorizontal
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock data for student-friendly stats
  const stats = [
    { label: 'كورساتي', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'ساعات المذاكرة', value: '12h', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'الامتحانات', value: '2', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'متوسط الدرجات', value: '88%', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
             أهلاً بك، {user.name.split(' ')[0]} 👋
           </h1>
           <p className="text-gray-500 dark:text-gray-400">
             جاهز تكمل رحلتك التعليمية النهاردة؟
           </p>
        </div>
        <div className="flex gap-3">
           <button className="btn-secondary rounded-full px-6">الجدول</button>
           <button className="btn-primary rounded-full px-6 shadow-lg shadow-orange-500/20">
             استكمل المذاكرة <Play size={16} fill="currentColor" />
           </button>
        </div>
      </div>

      {/* 2. Simple Stats Grid (Widget Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-100 dark:border-[#333] shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
             <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
             </div>
             <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
             <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 3. Featured / Continue Learning (Hero Card) */}
      {courses.length > 0 && (
        <div className="w-full bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#F38020] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                 <img src={courses[0].image} alt="Course" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 text-center md:text-right">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-3">
                    <Zap size={12} className="text-[#F38020]" fill="currentColor" /> استكمل آخر درس
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold mb-2">{courses[0].title}</h2>
                 <p className="text-gray-400 text-sm mb-4">المحاضرة 3: مقدمة في علم التشريح ووظائف الأعضاء</p>
                 
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#F38020] h-full w-[65%] shadow-[0_0_10px_rgba(243,128,32,0.5)]"></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400">
                    <span>تم إنجاز 65%</span>
                    <span>باقي 15 دقيقة</span>
                 </div>
              </div>

              <Link to={`/course/${courses[0].id}`} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shrink-0 w-full md:w-auto text-center">
                 تابع الدرس
              </Link>
           </div>
        </div>
      )}

      {/* 4. Course Grid (Replacing the Table) */}
      <div>
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">كورساتي المشترك بها</h3>
            
            <div className="relative hidden md:block">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="بحث في الكورسات..." 
                 className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-full px-4 pr-10 py-2 text-sm w-64 focus:outline-none focus:border-[#F38020]"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
               <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-[#333] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {/* Image Header */}
                  <div className="h-40 overflow-hidden relative">
                     <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                        {course.subject}
                     </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg">{course.title}</h4>
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                     </div>
                     
                     <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        د. {course.instructor}
                     </p>

                     {/* Progress */}
                     <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                           <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                           <span className="text-[#F38020]">45%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-[#333] h-2 rounded-full overflow-hidden">
                           <div className="bg-[#F38020] h-full w-[45%] rounded-full"></div>
                        </div>
                     </div>

                     <Link 
                        to={`/course/${course.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-[#2C2C2C] hover:bg-gray-100 dark:hover:bg-[#333] text-gray-900 dark:text-white py-3 rounded-xl text-sm font-bold transition-colors border border-gray-200 dark:border-[#444]"
                     >
                        الذهاب للكورس <ArrowRight size={16} className="rotate-180" />
                     </Link>
                  </div>
               </div>
            ))}
         </div>

         {filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-dashed border-gray-300 dark:border-[#333]">
               <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500">لا توجد كورسات مطابقة للبحث</p>
            </div>
         )}
      </div>
    </div>
  );
};
