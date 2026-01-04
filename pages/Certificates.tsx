
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Award, FileCheck, Lock, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export const Certificates: React.FC = () => {
  const { user, courses } = useApp();

  const certificates = useMemo(() => {
    if (!user) return [];
    return courses.map(course => {
      // Mock completion logic for demo
      const isCompleted = user.id === 'demo' || user.completedLessons?.length || 0 > 3; 
      
      return {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        issueDate: isCompleted ? 'Oct 12, 2024' : null,
        status: isCompleted ? 'issued' : 'locked',
        credentialId: isCompleted ? `CRT-${course.id.toUpperCase()}-${Math.floor(Math.random()*10000)}` : null
      };
    });
  }, [user, courses]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <h1 className="text-xl font-bold text-main">Credentials & Certificates</h1>
         <p className="text-xs text-muted mt-1">View and manage your verified educational achievements.</p>
      </div>

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {certificates.map((cert) => (
            <div 
               key={cert.id} 
               className={`cf-card flex flex-col transition-opacity ${cert.status === 'locked' ? 'opacity-60 bg-gray-50 dark:bg-[#151515]' : 'bg-white dark:bg-[#1E1E1E]'}`}
            >
               <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                     <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center ${cert.status === 'issued' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-200 dark:bg-[#333] text-gray-500'}`}>
                        {cert.status === 'issued' ? <Award size={20} /> : <Lock size={20} />}
                     </div>
                     {cert.status === 'issued' && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-green-600 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-[2px]">
                           <ShieldCheck size={10} /> VERIFIED
                        </div>
                     )}
                  </div>
                  
                  <h3 className="text-sm font-bold text-main mb-1 line-clamp-2">{cert.title}</h3>
                  <p className="text-xs text-muted">Instructor: {cert.instructor}</p>
                  
                  {cert.status === 'issued' && (
                     <div className="mt-4 pt-4 border-t border-[#E5E5E5] dark:border-[#333] space-y-1">
                        <div className="flex justify-between text-[10px]">
                           <span className="text-muted">Issued</span>
                           <span className="font-mono text-main">{cert.issueDate}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                           <span className="text-muted">ID</span>
                           <span className="font-mono text-main">{cert.credentialId}</span>
                        </div>
                     </div>
                  )}
               </div>

               {cert.status === 'issued' ? (
                  <div className="px-6 py-3 bg-[#FAFAFA] dark:bg-[#252525] border-t border-[#E5E5E5] dark:border-[#333] flex gap-2">
                     <button className="flex-1 btn-secondary text-xs h-8">
                        <Download size={12} /> PDF
                     </button>
                     <button className="flex-1 btn-secondary text-xs h-8">
                        <ExternalLink size={12} /> Verify
                     </button>
                  </div>
               ) : (
                  <div className="px-6 py-3 bg-gray-100 dark:bg-[#202020] border-t border-[#E5E5E5] dark:border-[#333] text-[10px] text-center text-muted">
                     Complete course to unlock
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};
