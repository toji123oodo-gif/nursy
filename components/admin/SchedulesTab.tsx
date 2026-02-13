
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { AcademicSchedule } from '../../types';
import { 
  Table, FileJson, Save, Trash2, RefreshCw, 
  CheckCircle2, AlertTriangle, Eye, Calendar, Copy
} from 'lucide-react';

export const SchedulesTab: React.FC = () => {
  const [schedules, setSchedules] = useState<AcademicSchedule[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [previewData, setPreviewData] = useState<AcademicSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');

  // Load Schedules
  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection('schedules').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicSchedule));
      setSchedules(data);
    });
    return () => unsubscribe();
  }, []);

  const handleParse = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Basic Validation
      if (!parsed.semester || !parsed.academic_year || !parsed.level || !parsed.group || !Array.isArray(parsed.schedule)) {
        throw new Error("Invalid JSON format. Missing required fields (semester, academic_year, level, group, schedule).");
      }

      setPreviewData(parsed);
    } catch (err: any) {
      setError(err.message);
      setPreviewData(null);
    }
  };

  const handleSave = async () => {
    if (!previewData) return;
    setIsSaving(true);
    try {
      await db.collection('schedules').add({
        ...previewData,
        createdAt: new Date().toISOString()
      });
      setJsonInput('');
      setPreviewData(null);
      setActiveView('list');
    } catch (e: any) {
      alert("Error saving schedule: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      await db.collection('schedules').doc(id).delete();
    }
  };

  const loadTemplate = () => {
    const template = {
      "semester": "Spring",
      "academic_year": "2025-2026",
      "level": "Level 1",
      "group": "B",
      "schedule": [
        {
          "day": "Saturday/Sunday",
          "time": "9-10 / 10-11",
          "course_name": "Medicine & Surgery",
          "course_code": "CMS 113",
          "location": "I 122",
          "staff": ["Dr. Asmaa"]
        }
      ]
    };
    setJsonInput(JSON.stringify(template, null, 2));
    setError(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Navigation Toggle */}
      <div className="flex bg-white dark:bg-[#1E1E1E] p-1 rounded-xl border border-gray-200 dark:border-[#333] w-fit">
        <button 
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'list' ? 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Table size={16} /> All Schedules
        </button>
        <button 
          onClick={() => setActiveView('create')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'create' ? 'bg-[#F38020] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <FileJson size={16} /> Insert JSON Table
        </button>
      </div>

      {activeView === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {schedules.map(sch => (
             <div key={sch.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative">
                <button 
                  onClick={() => handleDelete(sch.id!)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{sch.level} - Group {sch.group}</h3>
                      <p className="text-xs text-gray-500">{sch.semester} {sch.academic_year}</p>
                   </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 dark:border-[#333] pt-3">
                   {sch.schedule.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                         <span className="text-gray-500 font-medium">{item.course_name}</span>
                         <span className="text-gray-400">{item.day.split('/')[0]}</span>
                      </div>
                   ))}
                   {sch.schedule.length > 3 && (
                      <p className="text-[10px] text-gray-400 text-center pt-1">+ {sch.schedule.length - 3} more classes</p>
                   )}
                </div>
             </div>
           ))}
           {schedules.length === 0 && (
             <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-[#333] rounded-xl text-gray-400">
                No schedules found. Switch to "Insert JSON" to create one.
             </div>
           )}
        </div>
      )}

      {activeView === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* Left: Input */}
           <div className="space-y-4">
              <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-[#333]">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <FileJson size={18} className="text-gray-400"/> JSON Input
                    </h3>
                    <button onClick={loadTemplate} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                       <Copy size={12} /> Load Template
                    </button>
                 </div>
                 <textarea 
                   value={jsonInput}
                   onChange={e => setJsonInput(e.target.value)}
                   className="w-full h-[500px] font-mono text-xs bg-gray-50 dark:bg-[#151515] text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-[#333] rounded-lg p-4 focus:outline-none focus:border-brand-orange resize-none"
                   placeholder={`Paste your JSON here...\n{\n  "semester": "Spring",\n  ...`}
                 ></textarea>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={handleParse} 
                   disabled={!jsonInput}
                   className="flex-1 btn-secondary py-3 font-bold"
                 >
                    <Eye size={18} className="mr-2"/> Preview Table
                 </button>
              </div>
           </div>

           {/* Right: Preview */}
           <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-gray-200 dark:border-[#333] flex flex-col h-full min-h-[500px]">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-[#333] pb-2">
                 Table Preview
              </h3>

              {error ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-red-500 text-center p-6">
                    <AlertTriangle size={48} className="mb-4 opacity-50" />
                    <p className="font-bold">Invalid JSON</p>
                    <p className="text-sm mt-2 font-mono bg-red-50 dark:bg-red-900/10 p-2 rounded">{error}</p>
                 </div>
              ) : previewData ? (
                 <div className="flex-1 flex flex-col">
                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                       <div className="bg-gray-50 dark:bg-[#252525] p-3 rounded-lg">
                          <span className="block text-xs text-gray-500 uppercase">Year / Semester</span>
                          <span className="font-bold dark:text-white">{previewData.academic_year} - {previewData.semester}</span>
                       </div>
                       <div className="bg-gray-50 dark:bg-[#252525] p-3 rounded-lg">
                          <span className="block text-xs text-gray-500 uppercase">Level / Group</span>
                          <span className="font-bold dark:text-white">{previewData.level} - {previewData.group}</span>
                       </div>
                    </div>

                    <div className="flex-1 overflow-auto border border-gray-200 dark:border-[#333] rounded-lg">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 dark:bg-[#252525] text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-[#333]">
                             <tr>
                                <th className="p-3">Day / Time</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">Loc</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                             {previewData.schedule.map((row, i) => (
                                <tr key={i} className="group hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                   <td className="p-3">
                                      <div className="font-bold text-gray-900 dark:text-white">{row.day}</div>
                                      <div className="text-xs text-gray-500">{row.time}</div>
                                   </td>
                                   <td className="p-3">
                                      <div className="font-medium text-gray-800 dark:text-gray-200">{row.course_name}</div>
                                      <div className="text-xs text-blue-600 dark:text-blue-400">{row.course_code}</div>
                                      <div className="text-[10px] text-gray-400 mt-0.5">{row.staff.join(', ')}</div>
                                   </td>
                                   <td className="p-3 text-xs font-mono text-gray-500">
                                      {row.location}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="mt-6 w-full btn-primary py-3 font-bold shadow-lg"
                    >
                       {isSaving ? <RefreshCw className="animate-spin mr-2" size={18}/> : <CheckCircle2 className="mr-2" size={18}/>}
                       Save to Database
                    </button>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Table size={48} className="mb-3 opacity-20" />
                    <p>Paste JSON and click preview to verify.</p>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
