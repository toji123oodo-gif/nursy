
import React from 'react';
import { Course } from '../../../types';
import { DollarSign } from 'lucide-react';

interface Props {
  course: Partial<Course>;
  onChange: (field: keyof Course, value: any) => void;
}

export const CourseSettingsSidebar: React.FC<Props> = ({ course, onChange }) => {
  return (
    <div className="w-80 bg-[#151515] border-l border-[#333] flex flex-col overflow-y-auto">
       <div className="p-6 space-y-6">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Course Settings</div>
          
          <div className="space-y-4">
             <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Title</label>
                <input 
                   value={course.title || ''}
                   onChange={e => onChange('title', e.target.value)}
                   className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                   placeholder="e.g. Advanced Anatomy"
                />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Instructor</label>
                <input 
                   value={course.instructor || ''}
                   onChange={e => onChange('instructor', e.target.value)}
                   className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                   placeholder="Dr. Name"
                />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Subject</label>
                <input 
                   value={course.subject || ''}
                   onChange={e => onChange('subject', e.target.value)}
                   className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                   placeholder="e.g. Anatomy"
                />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Cover Image</label>
                <div className="w-full aspect-video bg-[#222] rounded-lg border border-[#333] flex items-center justify-center overflow-hidden mb-2 relative group">
                   {course.image ? (
                      <img src={course.image} className="w-full h-full object-cover" />
                   ) : (
                      <span className="text-gray-600 text-lg font-bold">600 × 400</span>
                   )}
                   <input 
                      value={course.image || ''}
                      onChange={e => onChange('image', e.target.value)}
                      className="absolute bottom-0 left-0 w-full bg-black/80 text-white text-xs p-2 outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      placeholder="Image URL..."
                   />
                </div>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Price (EGP)</label>
                <div className="relative">
                   <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                   <input 
                      type="number"
                      value={course.price || 0}
                      onChange={e => onChange('price', Number(e.target.value))}
                      className="w-full bg-[#222] border border-[#333] rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                   />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
