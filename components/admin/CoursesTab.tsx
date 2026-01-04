
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, ContentItem, Question } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Save, FileText, Mic, 
  Video, Upload, Check, ChevronDown, ChevronRight,
  MoreVertical, FileJson, Brain, Layout, DollarSign, Image as ImageIcon, Lock
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize with safe default values to prevent undefined errors
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const OWNER_EMAIL = "toji123oodo@gmail.com";
  const isOwner = user?.email === OWNER_EMAIL;

  const openNewCourseModal = () => {
    if (!isOwner) return;
    setEditingCourse({
      id: '',
      title: '',
      instructor: '',
      subject: '',
      image: 'https://placehold.co/600x400',
      price: 0,
      lessons: []
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCourse?.title || !isOwner) return;
    
    // Ensure data integrity before saving
    const courseData: Course = {
        id: editingCourse.id || 'c-' + Date.now(),
        title: editingCourse.title,
        instructor: editingCourse.instructor || 'Instructor',
        subject: editingCourse.subject || 'General',
        image: editingCourse.image || 'https://placehold.co/600x400',
        price: Number(editingCourse.price) || 0,
        lessons: (editingCourse.lessons || []).map(l => ({
            ...l,
            contents: l.contents || [],
            quiz: l.quiz || { id: 'q-'+Date.now(), title: 'Quiz', questions: [] }
        }))
    };

    if (editingCourse.id) await updateCourse(courseData);
    else await addCourse(courseData);
    
    setIsModalOpen(false);
  };

  const addLesson = () => {
    if (!editingCourse) return;
    const newLesson: Lesson = {
      id: 'l-' + Date.now(),
      title: 'New Lesson',
      isLocked: false,
      contents: [],
      quiz: { id: 'q-' + Date.now(), title: 'Quiz', questions: [] }
    };
    setEditingCourse({
      ...editingCourse,
      lessons: [...(editingCourse.lessons || []), newLesson]
    });
    setExpandedLesson(newLesson.id);
  };

  const updateLesson = (index: number, field: keyof Lesson, value: any) => {
    if (!editingCourse?.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setEditingCourse({ ...editingCourse, lessons: updatedLessons });
  };

  const addResource = (lessonIndex: number, type: 'video' | 'audio' | 'pdf') => {
    if (!editingCourse?.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    const newContent: ContentItem = {
      id: 'r-' + Date.now(),
      type,
      title: `New ${type}`,
      url: ''
    };
    updatedLessons[lessonIndex].contents = [...(updatedLessons[lessonIndex].contents || []), newContent];
    setEditingCourse({ ...editingCourse, lessons: updatedLessons });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, lessonIndex: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse?.lessons) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
           const updatedLessons = [...editingCourse.lessons!];
           const currentQuiz = updatedLessons[lessonIndex].quiz || { id: 'q-'+Date.now(), title: 'Quiz', questions: [] };
           
           const newQuestions: Question[] = json.map((q: any, i) => ({
             id: q.id || `qn-${Date.now()}-${i}`,
             text: q.text || 'Question text',
             options: q.options || [],
             correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
             explanation: q.explanation
           }));
           
           currentQuiz.questions = [...currentQuiz.questions, ...newQuestions];
           updatedLessons[lessonIndex].quiz = currentQuiz;
           setEditingCourse({...editingCourse, lessons: updatedLessons});
           alert(`Imported ${newQuestions.length} questions.`);
        }
      } catch (err) {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm transition-colors">
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Course Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOwner ? 'Create, edit, and organize curriculum content.' : 'View course curriculum and status.'}
            </p>
         </div>
         {isOwner && (
           <button 
             onClick={openNewCourseModal} 
             className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-orange-500/20"
           >
             <Plus size={18}/> Create New Course
           </button>
         )}
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="group bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col relative">
            
            {!isOwner && (
               <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full" title="Read Only">
                     <Lock size={14} />
                  </div>
               </div>
            )}

            <div className="h-48 bg-gray-100 dark:bg-[#252525] relative overflow-hidden">
               <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
               
               {/* Only show edit actions if user is Owner */}
               {isOwner && (
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button 
                      onClick={() => { setEditingCourse(JSON.parse(JSON.stringify(course))); setIsModalOpen(true); }} 
                      className="p-3 bg-white rounded-full text-gray-900 hover:text-blue-600 hover:scale-110 transition-all shadow-lg"
                      title="Edit Course"
                    >
                      <Edit2 size={20}/>
                    </button>
                    <button 
                      onClick={() => { if(confirm('Delete course?')) deleteCourse(course.id); }} 
                      className="p-3 bg-white rounded-full text-gray-900 hover:text-red-600 hover:scale-110 transition-all shadow-lg"
                      title="Delete Course"
                    >
                      <Trash2 size={20}/>
                    </button>
                 </div>
               )}
               
               <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-md border border-white/10">
                  {course.subject}
               </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold mb-1 line-clamp-1 text-lg">{course.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                 <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#444]">
                    {course.instructor.charAt(0)}
                 </span> 
                 {course.instructor}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#333] pt-4">
                 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#252525] px-2 py-1 rounded border border-gray-100 dark:border-[#333]">
                    {course.lessons.length} Lessons
                 </span>
                 <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {course.price === 0 ? 'Free' : `${course.price} EGP`}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SCREEN EDITOR MODAL - Only render if Owner */}
      {isModalOpen && editingCourse && isOwner && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#333]">
             
             {/* Modal Header */}
             <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-white dark:bg-[#1E1E1E]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center">
                     <Layout size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {editingCourse.id ? 'Edit Course Content' : 'Create New Course'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {editingCourse.lessons?.length || 0} Lessons • {editingCourse.subject || 'Uncategorized'}
                      </p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors">
                    Discard
                  </button>
                  <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-orange-500/20">
                     <Save size={18}/> Save Changes
                  </button>
               </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Metadata */}
                <div className="w-80 border-r border-gray-200 dark:border-[#333] overflow-y-auto bg-gray-50/50 dark:bg-[#181818] p-6">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Course Settings</h4>
                   
                   <div className="space-y-5">
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Title</label>
                         <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="cf-input bg-white dark:bg-[#252525]" placeholder="Course Title" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Instructor</label>
                         <input type="text" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="cf-input bg-white dark:bg-[#252525]" placeholder="Dr. Name" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Subject</label>
                         <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="cf-input bg-white dark:bg-[#252525]" placeholder="e.g. Anatomy" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Cover Image</label>
                         <div className="space-y-2">
                            <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-[#252525] overflow-hidden border border-gray-200 dark:border-[#333]">
                               {editingCourse.image && <img src={editingCourse.image} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex gap-2">
                               <input type="text" value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="cf-input bg-white dark:bg-[#252525] text-xs" placeholder="Image URL" />
                            </div>
                         </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Price (EGP)</label>
                         <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="cf-input bg-white dark:bg-[#252525] pl-8" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Main Content: Lessons */}
                <div className="flex-1 bg-white dark:bg-[#1E1E1E] flex flex-col min-w-0">
                   {/* Lessons Toolbar */}
                   <div className="px-8 py-6 border-b border-gray-200 dark:border-[#333] flex justify-between items-center">
                      <div>
                         <h4 className="text-lg font-bold text-gray-900 dark:text-white">Syllabus</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage lessons, videos, and quizzes.</p>
                      </div>
                      <button 
                        onClick={addLesson}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                      >
                        <Plus size={16} /> Add Lesson
                      </button>
                   </div>

                   <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gray-50 dark:bg-[#161616]">
                      {(editingCourse.lessons || []).length === 0 && (
                         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl text-gray-400">
                            <Layout size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">No lessons yet</p>
                            <p className="text-xs mt-1">Click "Add Lesson" to start building curriculum.</p>
                         </div>
                      )}

                      {(editingCourse.lessons || []).map((lesson, index) => (
                        <div key={lesson.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden transition-all">
                           {/* Lesson Header */}
                           <div 
                             className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] border-b border-transparent hover:border-gray-200 dark:hover:border-[#333] transition-colors"
                             onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                           >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#252525] flex items-center justify-center text-gray-500 border border-gray-200 dark:border-[#333]">
                                 {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <input 
                                   type="text" 
                                   value={lesson.title}
                                   onClick={(e) => e.stopPropagation()}
                                   onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                   className="w-full bg-transparent border-none outline-none font-bold text-gray-900 dark:text-white placeholder:text-gray-400"
                                   placeholder="Lesson Title"
                                 />
                              </div>
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                 <button 
                                   onClick={() => updateLesson(index, 'isLocked', !lesson.isLocked)}
                                   className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
                                      lesson.isLocked 
                                      ? 'bg-gray-100 dark:bg-[#333] text-gray-500 border-gray-200 dark:border-[#444]' 
                                      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                   }`}
                                 >
                                    {lesson.isLocked ? 'Locked' : 'Published'}
                                 </button>
                                 <button 
                                   onClick={() => {
                                      const updated = [...editingCourse.lessons!];
                                      updated.splice(index, 1);
                                      setEditingCourse({...editingCourse, lessons: updated});
                                   }}
                                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                 >
                                    <Trash2 size={16}/>
                                 </button>
                                 {expandedLesson === lesson.id ? <ChevronDown size={18} className="text-gray-400"/> : <ChevronRight size={18} className="text-gray-400"/>}
                              </div>
                           </div>

                           {/* Lesson Body */}
                           {expandedLesson === lesson.id && (
                              <div className="p-6 bg-gray-50/50 dark:bg-[#151515] border-t border-gray-200 dark:border-[#333] grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-top-2">
                                 
                                 {/* Column 1: Media Content */}
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                       <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Media & Resources</h5>
                                       <div className="flex gap-2">
                                          <button onClick={() => addResource(index, 'video')} className="p-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:text-blue-500"><Video size={14}/></button>
                                          <button onClick={() => addResource(index, 'audio')} className="p-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:text-purple-500"><Mic size={14}/></button>
                                          <button onClick={() => addResource(index, 'pdf')} className="p-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:text-red-500"><FileText size={14}/></button>
                                       </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                       {(lesson.contents || []).length === 0 && <div className="text-xs text-gray-400 italic text-center py-4 border border-dashed border-gray-300 dark:border-[#444] rounded">No resources added</div>}
                                       
                                       {(lesson.contents || []).map((content, cIdx) => (
                                          <div key={content.id} className="bg-white dark:bg-[#1E1E1E] p-3 rounded-lg border border-gray-200 dark:border-[#333] space-y-2">
                                             <div className="flex items-center gap-2">
                                                <div className="text-gray-400">
                                                   {content.type === 'video' ? <Video size={14}/> : content.type === 'audio' ? <Mic size={14}/> : <FileText size={14}/>}
                                                </div>
                                                <input 
                                                  value={content.title}
                                                  onChange={(e) => {
                                                     const updated = [...editingCourse.lessons!];
                                                     updated[index].contents[cIdx].title = e.target.value;
                                                     setEditingCourse({...editingCourse, lessons: updated});
                                                  }}
                                                  className="flex-1 text-xs font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                                                  placeholder="Resource Title"
                                                />
                                                <button 
                                                  onClick={() => {
                                                     const updated = [...editingCourse.lessons!];
                                                     updated[index].contents.splice(cIdx, 1);
                                                     setEditingCourse({...editingCourse, lessons: updated});
                                                  }}
                                                  className="text-gray-400 hover:text-red-500"
                                                >
                                                   <X size={14}/>
                                                </button>
                                             </div>
                                             <input 
                                                value={content.url}
                                                onChange={(e) => {
                                                   const updated = [...editingCourse.lessons!];
                                                   updated[index].contents[cIdx].url = e.target.value;
                                                   setEditingCourse({...editingCourse, lessons: updated});
                                                }}
                                                className="w-full text-xs bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded px-2 py-1.5 outline-none focus:border-brand-orange text-gray-600 dark:text-gray-300"
                                                placeholder="URL (https://...)"
                                             />
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Column 2: Quiz Editor */}
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                       <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quiz Questions</h5>
                                       <div className="flex gap-2">
                                          <label className="cursor-pointer p-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:text-green-500 text-xs flex items-center gap-1">
                                             <FileJson size={14}/> Import
                                             <input type="file" className="hidden" accept=".json" onChange={(e) => handleFileUpload(e, index)} />
                                          </label>
                                          <button 
                                            onClick={() => {
                                               const updated = [...editingCourse.lessons!];
                                               const quiz = updated[index].quiz || { id: 'q-'+Date.now(), title: 'Quiz', questions: [] };
                                               quiz.questions.push({
                                                  id: 'qn-'+Date.now(), text: '', options: ['', '', '', ''], correctOptionIndex: 0
                                               });
                                               updated[index].quiz = quiz;
                                               setEditingCourse({...editingCourse, lessons: updated});
                                            }}
                                            className="p-1.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded hover:bg-brand-orange/20"
                                          >
                                             <Plus size={14}/>
                                          </button>
                                       </div>
                                    </div>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                       {(!lesson.quiz?.questions || lesson.quiz.questions.length === 0) && (
                                          <div className="text-xs text-gray-400 italic text-center py-4 border border-dashed border-gray-300 dark:border-[#444] rounded">No questions added</div>
                                       )}

                                       {(lesson.quiz?.questions || []).map((q, qIdx) => (
                                          <div key={q.id} className="bg-white dark:bg-[#1E1E1E] p-3 rounded-lg border border-gray-200 dark:border-[#333] group">
                                             <div className="flex gap-2 mb-2">
                                                <span className="text-xs font-bold text-brand-orange mt-1">Q{qIdx+1}</span>
                                                <textarea 
                                                  value={q.text}
                                                  onChange={(e) => {
                                                     const updated = [...editingCourse.lessons!];
                                                     updated[index].quiz!.questions[qIdx].text = e.target.value;
                                                     setEditingCourse({...editingCourse, lessons: updated});
                                                  }}
                                                  className="flex-1 text-sm bg-transparent outline-none resize-none h-10 border-b border-transparent focus:border-brand-orange text-gray-900 dark:text-white"
                                                  placeholder="Enter question text..."
                                                />
                                                <button 
                                                  onClick={() => {
                                                     const updated = [...editingCourse.lessons!];
                                                     updated[index].quiz!.questions.splice(qIdx, 1);
                                                     setEditingCourse({...editingCourse, lessons: updated});
                                                  }}
                                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                   <Trash2 size={14}/>
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
                                                           const updated = [...editingCourse.lessons!];
                                                           updated[index].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                           setEditingCourse({...editingCourse, lessons: updated});
                                                        }}
                                                        className="accent-brand-orange cursor-pointer"
                                                      />
                                                      <input 
                                                        type="text" 
                                                        value={opt}
                                                        onChange={(e) => {
                                                           const updated = [...editingCourse.lessons!];
                                                           updated[index].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                                           setEditingCourse({...editingCourse, lessons: updated});
                                                        }}
                                                        className={`flex-1 text-xs px-2 py-1 rounded bg-gray-50 dark:bg-[#252525] border outline-none text-gray-700 dark:text-gray-300 ${
                                                           q.correctOptionIndex === oIdx 
                                                           ? 'border-green-400 bg-green-50 dark:bg-green-900/10' 
                                                           : 'border-gray-200 dark:border-[#333] focus:border-brand-orange'
                                                        }`}
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
      )}
    </div>
  );
};
