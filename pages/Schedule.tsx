
import React from 'react';
import { Clock, MapPin, Video, CheckCircle2, MoreVertical, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Schedule: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const events = [
    { id: 1, time: '09:00 AM', title: 'Anatomy: Skeletal System', type: 'lecture', status: 'done', duration: '1h 30m' },
    { id: 2, time: '11:00 AM', title: 'Physiology Quiz Preparation', type: 'study', status: 'live', duration: '45m' },
    { id: 3, time: '02:00 PM', title: 'Community Health Discussion', type: 'meeting', status: 'upcoming', duration: '1h' },
    { id: 4, time: '04:30 PM', title: 'Review: Medical Terminology', type: 'task', status: 'upcoming', duration: '30m' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <div>
            <h1 className="text-xl font-bold text-main">Your Schedule</h1>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
               <CalendarIcon size={12} /> {today}
            </p>
         </div>
         <button className="btn-secondary text-xs">Sync Calendar</button>
      </div>

      {/* Timeline Container: Adjusted left margin for mobile */}
      <div className="relative border-l border-[#E5E5E5] dark:border-[#333] ml-2 md:ml-4 space-y-8">
         {events.map((event, idx) => {
            const isLive = event.status === 'live';
            const isDone = event.status === 'done';

            return (
               <div key={event.id} className="relative pl-6 md:pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                     isLive ? 'bg-red-500 border-red-500 animate-pulse' : 
                     isDone ? 'bg-white dark:bg-[#1E1E1E] border-green-500' : 
                     'bg-white dark:bg-[#1E1E1E] border-gray-300 dark:border-[#444]'
                  }`}></div>

                  <div className={`cf-card p-4 transition-all ${isLive ? 'border-red-200 shadow-glow ring-1 ring-red-100 dark:ring-red-900/20' : ''}`}>
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <span className={`text-xs font-mono font-bold ${isLive ? 'text-red-500' : 'text-muted'}`}>
                              {event.time}
                           </span>
                           {isLive && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-bold animate-pulse">LIVE</span>}
                        </div>
                        <button className="text-muted hover:text-main"><MoreVertical size={14}/></button>
                     </div>
                     
                     <h3 className={`font-bold text-sm mb-1 ${isDone ? 'text-muted line-through' : 'text-main'}`}>
                        {event.title}
                     </h3>
                     
                     <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-3">
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-[#2C2C2C] px-2 py-0.5 rounded"><Clock size={10}/> {event.duration}</span>
                        {event.type === 'lecture' && <span className="flex items-center gap-1"><Video size={12}/> Online Class</span>}
                        {event.type === 'meeting' && <span className="flex items-center gap-1"><MapPin size={12}/> Room A</span>}
                     </div>

                     {isLive && (
                        <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-[4px] text-xs font-bold transition-colors shadow-md shadow-red-500/20">
                           Join Now
                        </button>
                     )}
                  </div>
               </div>
            )
         })}
      </div>
      
      {/* Empty State for Evening */}
      <div className="relative pl-6 md:pl-8 ml-2 md:ml-4">
         <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 bg-gray-100 dark:bg-[#333] border-gray-300 dark:border-[#444]"></div>
         <div className="p-4 border border-dashed border-[#E5E5E5] dark:border-[#333] rounded-[4px] text-center bg-gray-50/50 dark:bg-[#151515]">
            <p className="text-xs text-muted">No more events scheduled.</p>
            <button className="text-xs text-[#F38020] font-medium mt-1 hover:underline">+ Add Task</button>
         </div>
      </div>
    </div>
  );
};
