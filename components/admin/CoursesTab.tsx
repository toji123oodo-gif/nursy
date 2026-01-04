
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, ContentItem, Question } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Save, FileText, Mic, 
  Video, Upload, Check, ChevronDown, ChevronRight,
  MoreVertical, FileJson, Brain, Layout
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editingCourse?.title) return;
    
    // Ensure all required fields exist to prevent future crashes
    const courseData = {
        ...editingCourse,
        id: editingCourse.id || 'c' + Date.now(),
        lessons: editingCourse.lessons || [],
        price: editingCourse.price || 0,
        image: editingCourse.image || 'https://placehold.co/600x400',
        subject: editingCourse.subject || 'General',
        instructor: editingCourse.instructor || 'Staff'
    } as Course;

    if (editingCourse.id) await updateCourse(courseData);
    else await addCourse(courseData);
    
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, lessonIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
           const newLessons = [...(editingCourse?.lessons || [])];
           
           // Ensure quiz object exists
           if (!newLessons[lessonIndex].quiz) {
             newLessons[lessonIndex].quiz = { id: 'q'+Date.now(), title: 'Quiz', questions: [] };
           }
           
           const newQuestions: Question[] = json.map((q: any, i) => ({
             id: q.id || `qn-${Date.now()}-${i}`,
             text: q.text || 'No question text',
             options: q.options || [],
             correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
             explanation: q.explanation
           }));
           
           newLessons[lessonIndex].quiz!.questions = [
             ...newLessons[lessonIndex].quiz!.questions, 
             ...newQuestions
           ];
           setEditingCourse({...editingCourse, lessons: newLessons});
           alert(`Successfully imported ${newQuestions.length} questions.`);
        }
      } catch (err) {
        alert("Invalid JSON format. Expected an array of questions.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header Action */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm transition-colors">
         <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course Management</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Create, edit, and organize curriculum content.</p>
         </div>
         <button 
           onClick={() => {
             // Initialize with safe defaults to prevent blank screen
             setEditingCourse({
               lessons: [], price: 0, subject: '', 
               image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800', 
               instructor: '', title: ''
             }); 
             setIsModalOpen(true);
           }} 
           className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-orange-500/20"
         >
           <Plus size={18}/> Create New Course
         </button>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="group bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-100 dark:bg-[#252525] relative overflow-hidden">
               <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
               <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} className="p-2 bg-white/90 dark:bg-black/90 rounded-full text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm">
                    <Edit2 size={16}/>
                  </button>
                  <button onClick={() => { if(confirm('Delete course?')) deleteCourse(course.id); }} className="p-2 bg-white/90 dark:bg-black/90 rounded-full text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 shadow-sm">
                    <Trash2 size={16}/>
                  </button>
               </div>
               <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                  {course.subject}
               </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold mb-1 line-clamp-1 text-lg">{course.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                 <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300">
                    {course.instructor.charAt(0)}
                 </span> 
                 {course.instructor}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#333] pt-4">
                 <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{course.lessons.length} Lessons</span>
                 <span className="text-sm font-bold text-gray-900 dark:text-white">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SCREEN COURSE EDITOR MODAL */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#333]">
             
             {/* Modal Header */}
             <div className="p-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
               <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {editingCourse.id ? 'Edit Course Content' : 'Create New Course'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage lessons, quizzes, and resources.</p>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors">Cancel</button>
                  <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
                     <Save size={18}/> Save Changes
                  </button>
               </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Course Metadata */}
                <div className="w-80 border-r border-gray-200 dark:border-[#333] p-6 overflow-y-auto bg-white dark:bg-[#1E1E1E]">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Basic Info</h4>
                   <div className="space-y-4">
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Course Title</label>
                         <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="cf-input" placeholder="e.g. Anatomy 101" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Instructor Name</label>
                         <input type="text" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="cf-input" placeholder="Dr. Name" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Subject Category</label>
                         <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="cf-input" placeholder="e.g. Physiology" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Cover Image URL</label>
                         <div className="flex gap-2">
                            <input type="text" value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="cf-input text-xs" />
                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-[#333] shrink-0 overflow-hidden border border-gray-200 dark:border-[#444]">
                               <img src={editingCourse.image} className="w-full h-full object-cover" />
                            </div>
                         </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Price (EGP)</label>
                         <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="cf-input" />
                      </div>
                   </div>
                </div>

                {/* Main Content: Lessons & Quizzes */}
                <div className="flex-1 bg-gray-50 dark:bg-[#151515] p-8 overflow-y-auto">
                   <div className="max-w-3xl mx-auto">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layout size={18} className="text-gray-400" /> Syllabus & Content
                         </h4>
                         <button 
                           onClick={() => setEditingCourse({
                             ...editingCourse, 
                             // SAFELY add new lesson
                             lessons: [...(editingCourse.lessons || []), {
                               id: 'l'+Date.now(), 
                               title: 'New Lesson', 
                               isLocked: false, 
                               contents: [], 
                               quiz: { id: 'q'+Date.now(), title: 'Quiz', questions: [] }
                             }]
                           })}
                           className="text-sm font-bold text-brand-blue bg-blue-50 dark:bg-[#2B3A4F] hover:bg-blue-100 dark:hover:bg-[#333] px-4 py-2 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                         >
                           + Add Lesson
                         </button>
                      </div>

                      <div className="space-y-4">
                         {(editingCourse.lessons || []).length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl">
                               <p className="text-gray-400">No lessons yet. Add one to get started.</p>
                            </div>
                         )}

                         {(editingCourse.lessons || []).map((lesson, lIdx) => (
                           <div key={lesson.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden transition-all">
                              {/* Lesson Header */}
                              <div 
                                className="p-4 flex items-center gap-4 bg-white dark:bg-[#1E1E1E] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525]"
                                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                              >
                                 <div className="p-1 text-gray-400">
                                    {expandedLesson === lesson.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                                 </div>
                                 <span className="font-mono text-xs font-bold text-gray-400">#{lIdx + 1}</span>
                                 <input 
                                   type="text" 
                                   value={lesson.title}
                                   onClick={(e) => e.stopPropagation()}
                                   onChange={(e) => {
                                      const ls = [...(editingCourse.lessons || [])];
                                      ls[lIdx].title = e.target.value;
                                      setEditingCourse({...editingCourse, lessons: ls});
                                   }}
                                   className="flex-1 font-bold text-gray-900 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-blue-500"
                                   placeholder="Lesson Title..."
                                 />
                                 <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={() => {
                                         const ls = [...(editingCourse.lessons || [])];
                                         ls[lIdx].isLocked = !ls[lIdx].isLocked;
                                         setEditingCourse({...editingCourse, lessons: ls});
                                      }}
                                      className={`text-xs px-2 py-1 rounded font-bold border ${lesson.isLocked ? 'bg-gray-100 dark:bg-[#333] border-gray-300 dark:border-[#444] text-gray-600 dark:text-gray-400' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'}`}
                                    >
                                       {lesson.isLocked ? 'Locked' : 'Published'}
                                    </button>
                                    <button 
                                      onClick={() => {
                                         const ls = [...(editingCourse.lessons || [])];
                                         ls.splice(lIdx, 1);
                                         setEditingCourse({...editingCourse, lessons: ls});
                                      }}
                                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    >
                                       <Trash2 size={16}/>
                                    </button>
                                 </div>
                              </div>

                              {/* Expanded Content Editor */}
                              {expandedLesson === lesson.id && (
                                 <div className="p-6 border-t border-gray-100 dark:border-[#333] bg-gray-50/50 dark:bg-[#151515] space-y-6 animate-in slide-in-from-top-2">
                                    
                                    {/* 1. Resources Section */}
                                    <div>
                                       <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Lesson Resources</h5>
                                       <div className="space-y-3">
                                          {(lesson.contents || []).map((content, cIdx) => (
                                             <div key={content.id} className="flex gap-2 items-center">
                                                <div className="w-8 h-8 rounded bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-center text-gray-500">
                                                   {content.type === 'video' ? <Video size={14}/> : content.type === 'audio' ? <Mic size={14}/> : <FileText size={14}/>}
                                                </div>
                                                <select 
                                                  value={content.type}
                                                  onChange={e => {
                                                     const ls = [...(editingCourse.lessons || [])];
                                                     ls[lIdx].contents[cIdx].type = e.target.value as any;
                                                     setEditingCourse({...editingCourse, lessons: ls});
                                                  }}
                                                  className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded text-xs py-1.5 px-2 outline-none text-gray-900 dark:text-white"
                                                >
                                                   <option value="video">Video</option>
                                                   <option value="audio">Audio</option>
                                                   <option value="pdf">PDF</option>
                                                </select>
                                                <input 
                                                  type="text" 
                                                  value={content.title}
                                                  onChange={e => {
                                                     const ls = [...(editingCourse.lessons || [])];
                                                     ls[lIdx].contents[cIdx].title = e.target.value;
                                                     setEditingCourse({...editingCourse, lessons: ls});
                                                  }}
                                                  className="flex-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded text-xs py-1.5 px-3 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                                                  placeholder="Resource Title"
                                                />
                                                <input 
                                                  type="text" 
                                                  value={content.url}
                                                  onChange={e => {
                                                     const ls = [...(editingCourse.lessons || [])];
                                                     ls[lIdx].contents[cIdx].url = e.target.value;
                                                     setEditingCourse({...editingCourse, lessons: ls});
                                                  }}
                                                  className="flex-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded text-xs py-1.5 px-3 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                                                  placeholder="URL (https://...)"
                                                />
                                                <button 
                                                  onClick={() => {
                                                     const ls = [...(editingCourse.lessons || [])];
                                                     ls[lIdx].contents.splice(cIdx, 1);
                                                     setEditingCourse({...editingCourse, lessons: ls});
                                                  }}
                                                  className="text-gray-400 hover:text-red-500"
                                                >
                                                   <X size={16}/>
                                                </button>
                                             </div>
                                          ))}
                                          <div className="flex gap-2 mt-2">
                                             <button 
                                               onClick={() => {
                                                  const ls = [...(editingCourse.lessons || [])];
                                                  ls[lIdx].contents = [...(ls[lIdx].contents || []), {id: 'c'+Date.now(), type: 'video', title: 'New Video', url: ''}];
                                                  setEditingCourse({...editingCourse, lessons: ls});
                                               }}
                                               className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                             >
                                                <Plus size={12}/> Add Resource
                                             </button>
                                          </div>
                                       </div>
                                    </div>

                                    {/* 2. Quiz Section */}
                                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-lg p-4">
                                       <div className="flex justify-between items-center mb-4">
                                          <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                             <Brain size={14} className="text-[#F38020]" /> Quiz & Questions
                                          </h5>
                                          <div className="flex gap-2">
                                             <label className="cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-[#333] rounded-md hover:bg-gray-200 dark:hover:bg-[#444] transition-colors">
                                                <FileJson size={14}/> Import JSON
                                                <input type="file" className="hidden" accept=".json" onChange={(e) => handleFileUpload(e, lIdx)} />
                                             </label>
                                             <button 
                                               onClick={() => {
                                                  const ls = [...(editingCourse.lessons || [])];
                                                  if (!ls[lIdx].quiz) ls[lIdx].quiz = { id: 'q'+Date.now(), title: 'Quiz', questions: [] };
                                                  ls[lIdx].quiz!.questions = [...(ls[lIdx].quiz!.questions || []), {
                                                     id: 'qn'+Date.now(), text: '', options: ['', '', '', ''], correctOptionIndex: 0
                                                  }];
                                                  setEditingCourse({...editingCourse, lessons: ls});
                                               }}
                                               className="text-xs font-bold text-white bg-[#F38020] hover:bg-[#c7620e] px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                                             >
                                                <Plus size={14}/> Add Question
                                             </button>
                                          </div>
                                       </div>

                                       <div className="space-y-4">
                                          {(lesson.quiz?.questions || []).length === 0 && (
                                             <p className="text-xs text-gray-400 italic text-center py-2">No questions added yet.</p>
                                          )}
                                          {(lesson.quiz?.questions || []).map((q, qIdx) => (
                                             <div key={q.id} className="bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded p-3">
                                                <div className="flex gap-2 mb-2">
                                                   <span className="font-mono text-xs text-gray-400 pt-2">Q{qIdx+1}</span>
                                                   <textarea 
                                                     value={q.text}
                                                     onChange={e => {
                                                        const ls = [...(editingCourse.lessons || [])];
                                                        ls[lIdx].quiz!.questions[qIdx].text = e.target.value;
                                                        setEditingCourse({...editingCourse, lessons: ls});
                                                     }}
                                                     className="flex-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded p-2 text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none h-16"
                                                     placeholder="Question Text..."
                                                   />
                                                   <button 
                                                     onClick={() => {
                                                        const ls = [...(editingCourse.lessons || [])];
                                                        ls[lIdx].quiz!.questions.splice(qIdx, 1);
                                                        setEditingCourse({...editingCourse, lessons: ls});
                                                     }}
                                                     className="text-gray-400 hover:text-red-500 h-fit"
                                                   >
                                                      <X size={14}/>
                                                   </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pl-6">
                                                   {q.options.map((opt, oIdx) => (
                                                      <div key={oIdx} className="flex items-center gap-2">
                                                         <input 
                                                           type="radio" 
                                                           name={`q-${q.id}`} 
                                                           checked={q.correctOptionIndex === oIdx}
                                                           onChange={() => {
                                                              const ls = [...(editingCourse.lessons || [])];
                                                              ls[lIdx].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                              setEditingCourse({...editingCourse, lessons: ls});
                                                           }}
                                                           className="accent-green-600 cursor-pointer"
                                                         />
                                                         <input 
                                                           type="text" 
                                                           value={opt}
                                                           onChange={e => {
                                                              const ls = [...(editingCourse.lessons || [])];
                                                              ls[lIdx].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                                              setEditingCourse({...editingCourse, lessons: ls});
                                                           }}
                                                           className={`flex-1 text-xs border rounded px-2 py-1 outline-none dark:bg-[#1E1E1E] dark:text-white ${q.correctOptionIndex === oIdx ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-[#333]'}`}
                                                           placeholder={`Option ${oIdx+1}`}
                                                         />
                                                      </div>
                                                   ))}
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
