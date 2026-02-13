
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { AcademicSchedule } from '../types';
import { 
  Calendar, MapPin, Clock, User, ArrowRight, Table as TableIcon, 
  ChevronDown, Layers, BookOpen, AlertCircle 
} from 'lucide-react';

export const Tables: React.FC = () => {
  const [schedules, setSchedules] = useState<AcademicSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection('schedules').orderBy('createdAt', 'desc').onSnapshot(snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicSchedule));
      setSchedules(data);
      if (data.length > 0 && !selectedId) {
         setSelectedId(data[0].id!);
      }
      setLoading(false);
    }, err => {
      console.error("Error fetching schedules:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeSchedule = schedules.find(s => s.id === selectedId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
               <TableIcon className="text-[#F38020]" size={32} /> الجداول الدراسية
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
               تصفح الجداول الرسمية للمحاضرات والسكاشن حسب الفرقة والمجموعة.
            </p>
         </div>
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38020] mb-4"></div>
            <p>جاري تحميل الجداول...</p>
         </div>
      ) : schedules.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-dashed border-gray-200 dark:border-[#333] text-center px-4">
            <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">لا توجد جداول</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
               لم يتم نشر أي جداول دراسية حتى الآن. يرجى المراجعة لاحقاً.
            </p>
         </div>
      ) : (
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar / Filter (Left) */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
               <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">اختر الجدول</h3>
               <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                  {schedules.map(sch => (
                     <button
                        key={sch.id}
                        onClick={() => setSelectedId(sch.id!)}
                        className={`flex-shrink-0 w-64 lg:w-full text-left p-4 rounded-xl border transition-all duration-200 group relative ${
                           selectedId === sch.id 
                           ? 'bg-white dark:bg-[#1E1E1E] border-[#F38020] shadow-md ring-1 ring-[#F38020]/20' 
                           : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444]'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-xs font-bold px-2 py-1 rounded-md ${selectedId === sch.id ? 'bg-orange-50 text-[#F38020] dark:bg-orange-900/20' : 'bg-gray-100 text-gray-500 dark:bg-[#252525] dark:text-gray-400'}`}>
                              {sch.semester} {sch.academic_year}
                           </span>
                           {selectedId === sch.id && <div className="w-2 h-2 rounded-full bg-[#F38020]"></div>}
                        </div>
                        <h4 className={`font-bold text-lg mb-1 ${selectedId === sch.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                           {sch.level}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                           <Layers size={14} /> المجموعة {sch.group}
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Table Display (Right/Main) */}
            <div className="flex-1 min-w-0">
               {activeSchedule && (
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                     {/* Schedule Info Header */}
                     <div className="p-6 border-b border-gray-200 dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525]">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                 <Calendar className="text-[#F38020]" size={20} />
                                 جدول {activeSchedule.level} - مجموعة {activeSchedule.group}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                 الفصل الدراسي: {activeSchedule.semester} • العام الجامعي: {activeSchedule.academic_year}
                              </p>
                           </div>
                           <div className="hidden md:block text-xs font-mono text-gray-400 bg-white dark:bg-[#1E1E1E] px-3 py-1.5 rounded border border-gray-200 dark:border-[#333]">
                              Updated: {new Date(activeSchedule.createdAt || '').toLocaleDateString()}
                           </div>
                        </div>
                     </div>

                     {/* Responsive Table Layout */}
                     <div className="overflow-x-auto">
                        {/* Desktop Table View */}
                        <table className="w-full text-left hidden md:table">
                           <thead className="bg-gray-50 dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#333]">
                              <tr>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">اليوم / الوقت</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">المادة</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المكان</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المحاضر</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                              {activeSchedule.schedule.map((item, idx) => (
                                 <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-6 py-4 align-top">
                                       <div className="flex flex-col">
                                          <span className="font-bold text-gray-900 dark:text-white text-sm">{item.day}</span>
                                          <span className="text-xs text-[#F38020] font-medium flex items-center gap-1 mt-1">
                                             <Clock size={12} /> {item.time}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                       <div className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{item.course_name}</div>
                                       <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#444]">
                                          {item.course_code}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                       <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                          <MapPin size={14} className="text-gray-400" /> {item.location}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                       <div className="flex flex-col gap-1">
                                          {item.staff.map((staff, sIdx) => (
                                             <div key={sIdx} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                <User size={12} className="text-gray-300" /> {staff}
                                             </div>
                                          ))}
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-100 dark:divide-[#333]">
                           {activeSchedule.schedule.map((item, idx) => (
                              <div key={idx} className="p-5 flex flex-col gap-3">
                                 <div className="flex justify-between items-start">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 text-[#F38020] px-3 py-1 rounded-lg text-sm font-bold">
                                       {item.day}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 dark:bg-[#2C2C2C] px-2 py-1 rounded">
                                       <Clock size={12} /> {item.time}
                                    </div>
                                 </div>
                                 
                                 <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">{item.course_name}</h4>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-50 dark:bg-[#252525] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#333]">
                                       {item.course_code}
                                    </span>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4 mt-1">
                                    <div className="flex items-start gap-2">
                                       <MapPin size={14} className="text-gray-400 mt-0.5" />
                                       <div>
                                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Location</p>
                                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.location}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                       <User size={14} className="text-gray-400 mt-0.5" />
                                       <div>
                                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Staff</p>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{item.staff.join(', ')}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};
