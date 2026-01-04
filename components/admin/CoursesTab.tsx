
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, ContentItem, Question } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Save, FileText, Mic, 
  Video, Upload, Check, ChevronDown, ChevronRight,
  MoreVertical, FileJson, Brain, Layout, DollarSign, 
  Image as ImageIcon, Lock, Clock, AlertCircle, Settings, 
  AlignLeft, List, HelpCircle, CheckCircle2, BookOpen
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<'content' | 'quiz' | 'settings'>('content');
  const [showMobileSettings, setShowMobileSettings] = useState(false); // Mobile toggle for metadata
  
  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];
  const isOwner = user && OWNERS.includes(user.email);

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
    setExpandedLesson(null);
    setShowMobileSettings(false);
    setShowBulkImport(false);
    setBulkImportText('');
  };

  const handleEditClick = (course: Course) => {
    if (!isOwner) return;
    setEditingCourse(JSON.parse(JSON.stringify(course)));
    setIsModalOpen(true);
    setExpandedLesson(null);
    setShowMobileSettings(false);
    setShowBulkImport(false);
    setBulkImportText('');
  };

  const handleSave = async () => {
    if (!editingCourse?.title || !isOwner) return;
    try {
        const courseData: Course = {
            id: editingCourse.id || 'c-' + Date.now(),
            title: editingCourse.title || 'Untitled Course',
            instructor: editingCourse.instructor || 'Instructor',
            subject: editingCourse.subject || 'General',
            image: editingCourse.image || 'https://placehold.co/600x400',
            price: Number(editingCourse.price) || 0,
            lessons: (editingCourse.lessons || []).map(l => ({
                ...l,
                contents: l.contents || [],
                quiz: l.quiz ? {
                    ...l.quiz,
                    timeLimit: Number(l.quiz.timeLimit) || 0,
                    passingScore: Number(l.quiz.passingScore) || 50
                } : undefined
            }))
        };

        if (editingCourse.id) await updateCourse(courseData);
        else await addCourse(courseData);
        
        setIsModalOpen(false);
    } catch (error) {
        console.error("Failed to save course:", error);
        alert("Error saving course. Please check the console.");
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: 'l-' + Date.now(),
      title: 'New Lesson',
      description: '',
      isLocked: false,
      contents: [],
      quiz: { 
          id: 'q-' + Date.now(), 
          title: 'Lesson Quiz', 
          questions: [],
          timeLimit: 10,
          passingScore: 50
      }
    };
    setEditingCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setExpandedLesson(newLesson.id);
    setActiveLessonTab('content');
  };

  const updateLesson = (index: number, field: keyof Lesson, value: any) => {
    if (!editingCourse.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const addResource = (lessonIndex: number, type: 'video' | 'audio' | 'pdf' | 'article') => {
    if (!editingCourse.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    const newContent: ContentItem = {
      id: 'r-' + Date.now(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      url: '',
      textContent: type === 'article' ? '' : undefined
    };
    
    // Ensure contents array exists
    const currentContents = updatedLessons[lessonIndex].contents || [];
    updatedLessons[lessonIndex].contents = [...currentContents, newContent];
    
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const handleBulkImport = (lessonIndex: number) => {
    if (!bulkImportText.trim() || !editingCourse.lessons) return;
    
    const newQuestions: Question[] = bulkImportText.trim().split('\n').filter(line => line.trim()).map((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        // Require: Question text | 4 options | Answer index
        // Optional: Page Number (7th item)
        if (parts.length < 6) return null;
        
        const text = parts[0];
        // Take next 4 parts as options
        const options = parts.slice(1, 5);
        // Answer index
        const ansIndex = parseInt(parts[5]);
        // Page Ref (Optional)
        const pageRef = parts.length > 6 ? parseInt(parts[6]) : undefined;
        
        const correctOptionIndex = isNaN(ansIndex) ? 0 : Math.min(Math.max(ansIndex, 0), 3);

        return {
            id: `qn-bulk-${Date.now()}-${i}`,
            text,
            options,
            correctOptionIndex,
            referencePage: isNaN(pageRef || NaN) ? undefined : pageRef
        };
    }).filter(q => q !== null) as Question[];

    if (newQuestions.length === 0) {
        alert("لم يتم العثور على أسئلة صالحة. تأكد من الصيغة:\nالسؤال؟ | خيار 1 | خيار 2 | خيار 3 | خيار 4 | رقم الإجابة | (اختياري) رقم الصفحة");
        return;
    }

    const updatedLessons = [...editingCourse.lessons];
    const currentQuiz = updatedLessons[lessonIndex].quiz || { id: 'q-'+Date.now(), title: 'Quiz', questions: [] };
    
    currentQuiz.questions = [...(currentQuiz.questions || []), ...newQuestions];
    updatedLessons[lessonIndex].quiz = currentQuiz;
    
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
    setBulkImportText('');
    setShowBulkImport(false);
    alert(`تم استيراد ${newQuestions.length} سؤال بنجاح.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, lessonIndex: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse.lessons) return;

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
             explanation: q.explanation,
             referencePage: q.referencePage
           }));
           
           currentQuiz.questions = [...currentQuiz.questions, ...newQuestions];
           updatedLessons[lessonIndex].quiz = currentQuiz;
           setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
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
              {isOwner ? 'Build and manage your educational curriculum.' : 'View available curriculum.'}
            </p>
         </div>
         {isOwner && (
           <button 
             onClick={openNewCourseModal} 
             className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-orange-500/20 whitespace-nowrap"
           >
             <Plus size={18}/> <span className="hidden sm:inline">Create New Course</span><span className="sm:hidden">New</span>
           </button>
         )}
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="group bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col relative">
            {/* ... (Course Card rendering) ... */}
            {!isOwner && (
               <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full" title="Read Only">
                     <Lock size={14} />
                  </div>
               </div>
            )}

            <div className="h-48 bg-gray-100 dark:bg-[#252525] relative overflow-hidden">
               <img 
                 src={course.image || 'https://placehold.co/600x400'} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 alt={course.title}
                 onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'; }}
               />
               
               {isOwner && (
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button 
                      onClick={() => handleEditClick(course)} 
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
                  {course.subject || 'General'}
               </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold mb-1 line-clamp-1 text-lg">{course.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                 <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#444]">
                    {(course.instructor || 'I').charAt(0)}
                 </span> 
                 {course.instructor || 'Unknown Instructor'}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#333] pt-4">
                 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#252525] px-2 py-1 rounded border border-gray-100 dark:border-[#333]">
                    {course.lessons?.length || 0} Lessons
                 </span>
                 <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {course.price === 0 ? 'Free' : `${course.price} EGP`}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SCREEN EDITOR MODAL */}
      {isModalOpen && isOwner && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#333]">
             {/* ... Modal Header & Sidebar (Same as previous) ... */}
             <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#1E1E1E] gap-3">
               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center shrink-0">
                     <Layout size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {editingCourse.id ? 'Edit Course' : 'New Course'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {editingCourse.lessons?.length || 0} Lessons
                      </p>
                  </div>
               </div>
               
               <button 
                 onClick={() => setShowMobileSettings(!showMobileSettings)}
                 className="lg:hidden w-full sm:w-auto py-2 px-4 bg-gray-100 dark:bg-[#252525] rounded text-xs font-bold text-gray-600 dark:text-gray-300"
               >
                 {showMobileSettings ? 'Hide Details' : 'Show Course Details'}
               </button>

               <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors">
                    Discard
                  </button>
                  <button onClick={handleSave} className="flex-1 sm:flex-none btn-primary px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                     <Save size={18}/> Save
                  </button>
               </div>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className={`w-full lg:w-72 border-r border-gray-200 dark:border-[#333] overflow-y-auto bg-gray-50/50 dark:bg-[#181818] p-6 ${showMobileSettings ? 'block' : 'hidden lg:block'}`}>
                   {/* ... Settings ... */}
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Course Settings</h4>
                   <div className="space-y-5">
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Title</label>
                         <input 
                           type="text" 
                           value={editingCourse.title || ''} 
                           onChange={e => setEditingCourse(prev => ({...prev, title: e.target.value}))} 
                           className="cf-input bg-white dark:bg-[#252525]" 
                           placeholder="Course Title" 
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Instructor</label>
                         <input 
                           type="text" 
                           value={editingCourse.instructor || ''} 
                           onChange={e => setEditingCourse(prev => ({...prev, instructor: e.target.value}))} 
                           className="cf-input bg-white dark:bg-[#252525]" 
                           placeholder="Dr. Name" 
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Subject</label>
                         <input 
                           type="text" 
                           value={editingCourse.subject || ''} 
                           onChange={e => setEditingCourse(prev => ({...prev, subject: e.target.value}))} 
                           className="cf-input bg-white dark:bg-[#252525]" 
                           placeholder="e.g. Anatomy" 
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Cover Image</label>
                         <div className="space-y-2">
                            <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-[#252525] overflow-hidden border border-gray-200 dark:border-[#333]">
                               <img 
                                 src={editingCourse.image || 'https://placehold.co/600x400'} 
                                 className="w-full h-full object-cover" 
                                 alt="Cover"
                                 onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'; }}
                               />
                            </div>
                            <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={editingCourse.image || ''} 
                                 onChange={e => setEditingCourse(prev => ({...prev, image: e.target.value}))} 
                                 className="cf-input bg-white dark:bg-[#252525] text-xs" 
                                 placeholder="Image URL" 
                               />
                            </div>
                         </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Price (EGP)</label>
                         <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input 
                              type="number" 
                              value={editingCourse.price || 0} 
                              onChange={e => setEditingCourse(prev => ({...prev, price: Number(e.target.value)}))} 
                              className="cf-input bg-white dark:bg-[#252525] pl-8" 
                            />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Main Content: Lessons */}
                <div className={`flex-1 bg-white dark:bg-[#1E1E1E] flex flex-col min-w-0 ${showMobileSettings ? 'hidden lg:flex' : 'flex'}`}>
                   {/* ... Lessons Toolbar ... */}
                   <div className="px-4 md:px-8 py-6 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-gray-50/30 dark:bg-[#202020]">
                      <div>
                         <h4 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">Structure your lessons, add media, and configure exams.</p>
                      </div>
                      <button 
                        onClick={addLesson}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md whitespace-nowrap"
                      >
                        <Plus size={16} /> Add Lesson
                      </button>
                   </div>

                   <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-gray-50 dark:bg-[#161616]">
                      {(editingCourse.lessons || []).length === 0 && (
                         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl text-gray-400">
                            <Layout size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">Curriculum is empty</p>
                            <p className="text-xs mt-1">Click "Add Lesson" to start building.</p>
                         </div>
                      )}

                      {(editingCourse.lessons || []).map((lesson, index) => (
                        <div key={lesson.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden transition-all">
                           {/* ... Lesson Header ... */}
                           <div 
                             className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${expandedLesson === lesson.id ? 'bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-[#333]' : 'hover:bg-gray-50 dark:hover:bg-[#252525]'}`}
                             onClick={() => {
                                setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id);
                                setActiveLessonTab('content');
                             }}
                           >
                              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-[#333] flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-bold border border-gray-300 dark:border-[#444] shrink-0">
                                 {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <input 
                                   type="text" 
                                   value={lesson.title}
                                   onClick={(e) => e.stopPropagation()}
                                   onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                   className="w-full bg-transparent border-none outline-none font-bold text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
                                   placeholder="Lesson Title"
                                 />
                              </div>
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                 <span className="hidden sm:inline text-[10px] text-gray-400 px-2 py-1 bg-gray-100 dark:bg-[#333] rounded">
                                    {(lesson.contents?.length || 0)} items
                                 </span>
                                 <button 
                                   onClick={() => {
                                      if (!editingCourse.lessons) return;
                                      const updated = [...editingCourse.lessons];
                                      updated.splice(index, 1);
                                      setEditingCourse(prev => ({...prev, lessons: updated}));
                                   }}
                                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                 >
                                    <Trash2 size={16}/>
                                 </button>
                                 {expandedLesson === lesson.id ? <ChevronDown size={18} className="text-gray-400"/> : <ChevronRight size={18} className="text-gray-400"/>}
                              </div>
                           </div>

                           {/* Expanded Lesson Content */}
                           {expandedLesson === lesson.id && (
                              <div className="flex flex-col h-[600px]">
                                 {/* Internal Tabs */}
                                 <div className="flex border-b border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#1A1A1A] px-2 overflow-x-auto">
                                    {[
                                        { id: 'content', label: 'Content', icon: Layout },
                                        { id: 'quiz', label: 'Quiz', icon: Brain },
                                        { id: 'settings', label: 'Settings', icon: Settings },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveLessonTab(tab.id as any)}
                                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                                                activeLessonTab === tab.id 
                                                ? 'border-[#F38020] text-[#F38020] bg-white dark:bg-[#1E1E1E]' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            <tab.icon size={14} /> {tab.label}
                                        </button>
                                    ))}
                                 </div>

                                 <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/30 dark:bg-[#181818]">
                                    
                                    {/* TAB 1: CONTENT */}
                                    {activeLessonTab === 'content' && (
                                        <div className="space-y-6">
                                            {/* ... Content Resources ... */}
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Materials</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    <button onClick={() => addResource(index, 'video')} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:border-blue-400 hover:text-blue-500 text-xs font-medium transition-colors"><Video size={14}/> Vid</button>
                                                    <button onClick={() => addResource(index, 'audio')} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:border-purple-400 hover:text-purple-500 text-xs font-medium transition-colors"><Mic size={14}/> Aud</button>
                                                    <button onClick={() => addResource(index, 'pdf')} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:border-red-400 hover:text-red-500 text-xs font-medium transition-colors"><FileText size={14}/> PDF</button>
                                                    <button onClick={() => addResource(index, 'article')} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded hover:border-orange-400 hover:text-orange-500 text-xs font-medium transition-colors"><AlignLeft size={14}/> Txt</button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {(lesson.contents || []).length === 0 && (
                                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-[#333] rounded-lg">
                                                        <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                                                        <p className="text-xs text-gray-400">No content added yet.</p>
                                                    </div>
                                                )}

                                                {(lesson.contents || []).map((content, cIdx) => (
                                                    <div key={content.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-sm group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 text-gray-400">
                                                                {content.type === 'video' ? <Video size={18}/> : content.type === 'audio' ? <Mic size={18}/> : content.type === 'pdf' ? <FileText size={18}/> : <AlignLeft size={18}/>}
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex justify-between">
                                                                    <input 
                                                                        value={content.title}
                                                                        onChange={(e) => {
                                                                            if (!editingCourse.lessons) return;
                                                                            const updated = [...editingCourse.lessons];
                                                                            updated[index].contents[cIdx].title = e.target.value;
                                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                        }}
                                                                        className="w-full text-sm font-bold bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-300"
                                                                        placeholder="Resource Title"
                                                                    />
                                                                    <button 
                                                                        onClick={() => {
                                                                            if (!editingCourse.lessons) return;
                                                                            const updated = [...editingCourse.lessons];
                                                                            updated[index].contents.splice(cIdx, 1);
                                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                        }}
                                                                        className="text-gray-400 hover:text-red-500"
                                                                    >
                                                                        <X size={16}/>
                                                                    </button>
                                                                </div>
                                                                
                                                                {content.type !== 'article' ? (
                                                                    <input 
                                                                        value={content.url}
                                                                        onChange={(e) => {
                                                                            if (!editingCourse.lessons) return;
                                                                            const updated = [...editingCourse.lessons];
                                                                            updated[index].contents[cIdx].url = e.target.value;
                                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                        }}
                                                                        className="w-full text-xs bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded px-3 py-2 outline-none focus:border-brand-orange text-gray-600 dark:text-gray-300 font-mono"
                                                                        placeholder="https://..."
                                                                    />
                                                                ) : (
                                                                    <textarea 
                                                                        value={content.textContent || ''}
                                                                        onChange={(e) => {
                                                                            if (!editingCourse.lessons) return;
                                                                            const updated = [...editingCourse.lessons];
                                                                            updated[index].contents[cIdx].textContent = e.target.value;
                                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                        }}
                                                                        className="w-full h-24 text-xs bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded px-3 py-2 outline-none focus:border-brand-orange text-gray-600 dark:text-gray-300 resize-none"
                                                                        placeholder="Write article content here..."
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 2: QUIZ */}
                                    {activeLessonTab === 'quiz' && (
                                        <div className="space-y-6">
                                            {/* Quiz Config Bar */}
                                            <div className="bg-blue-50 dark:bg-[#1a202c] p-4 rounded-lg border border-blue-100 dark:border-[#2d3748] flex flex-col sm:flex-row flex-wrap gap-4 items-end">
                                                <div className="flex-1 w-full sm:w-auto">
                                                    <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 block">Quiz Title</label>
                                                    <input 
                                                        value={lesson.quiz?.title || 'Lesson Quiz'}
                                                        onChange={(e) => {
                                                            if (!editingCourse.lessons) return;
                                                            const updated = [...editingCourse.lessons];
                                                            const quiz = updated[index].quiz || { id: 'q-'+Date.now(), title: '', questions: [] };
                                                            updated[index].quiz = { ...quiz, title: e.target.value };
                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                        }}
                                                        className="w-full bg-white dark:bg-[#2d3748] border border-blue-200 dark:border-[#4a5568] text-gray-900 dark:text-white rounded px-3 py-1.5 text-sm outline-none"
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full sm:w-auto">
                                                    <div className="w-1/2 sm:w-24">
                                                        <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 block">Passing %</label>
                                                        <input 
                                                            type="number"
                                                            value={lesson.quiz?.passingScore || 50}
                                                            onChange={(e) => {
                                                                if (!editingCourse.lessons) return;
                                                                const updated = [...editingCourse.lessons];
                                                                const quiz = updated[index].quiz || { id: 'q-'+Date.now(), title: '', questions: [] };
                                                                updated[index].quiz = { ...quiz, passingScore: Number(e.target.value) };
                                                                setEditingCourse(prev => ({...prev, lessons: updated}));
                                                            }}
                                                            className="w-full bg-white dark:bg-[#2d3748] border border-blue-200 dark:border-[#4a5568] text-gray-900 dark:text-white rounded px-3 py-1.5 text-sm outline-none text-center"
                                                        />
                                                    </div>
                                                    <div className="w-1/2 sm:w-24">
                                                        <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 block">Time (Min)</label>
                                                        <input 
                                                            type="number"
                                                            value={lesson.quiz?.timeLimit || 10}
                                                            onChange={(e) => {
                                                                if (!editingCourse.lessons) return;
                                                                const updated = [...editingCourse.lessons];
                                                                const quiz = updated[index].quiz || { id: 'q-'+Date.now(), title: '', questions: [] };
                                                                updated[index].quiz = { ...quiz, timeLimit: Number(e.target.value) };
                                                                setEditingCourse(prev => ({...prev, lessons: updated}));
                                                            }}
                                                            className="w-full bg-white dark:bg-[#2d3748] border border-blue-200 dark:border-[#4a5568] text-gray-900 dark:text-white rounded px-3 py-1.5 text-sm outline-none text-center"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button 
                                                        onClick={() => setShowBulkImport(!showBulkImport)}
                                                        className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-200 dark:border-purple-800 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 flex-1 sm:flex-none flex justify-center text-xs font-bold gap-2 items-center transition-colors"
                                                    >
                                                        <List size={16}/> Bulk Add
                                                    </button>
                                                    <label className="cursor-pointer p-2 bg-white dark:bg-[#2d3748] border border-blue-200 dark:border-[#4a5568] rounded hover:text-green-500 text-blue-500 flex-1 sm:flex-none flex justify-center" title="Import JSON">
                                                        <FileJson size={18}/>
                                                        <input type="file" className="hidden" accept=".json" onChange={(e) => handleFileUpload(e, index)} />
                                                    </label>
                                                    <button 
                                                        onClick={() => {
                                                            if (!editingCourse.lessons) return;
                                                            const updated = [...editingCourse.lessons];
                                                            const quiz = updated[index].quiz || { id: 'q-'+Date.now(), title: 'Quiz', questions: [] };
                                                            quiz.questions.push({
                                                                id: 'qn-'+Date.now(), text: '', options: ['', '', '', ''], correctOptionIndex: 0
                                                            });
                                                            updated[index].quiz = quiz;
                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                        }}
                                                        className="p-2 bg-brand-orange text-white rounded hover:bg-orange-600 shadow-sm flex items-center justify-center gap-2 text-xs font-bold px-4 flex-[2] sm:flex-none"
                                                    >
                                                        <Plus size={16}/> Add Question
                                                    </button>
                                                </div>
                                            </div>

                                            {showBulkImport && (
                                                <div className="bg-[#202020] dark:bg-[#111] p-5 rounded-2xl border border-gray-700 dark:border-[#333] mb-4 animate-in fade-in slide-in-from-top-2 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                                                <List size={16} className="text-purple-500"/> Bulk Import Editor
                                                            </h4>
                                                            <p className="text-[10px] text-gray-400 mt-1 font-mono">Format: Question? | Opt1 | Opt2 | Opt3 | Opt4 | AnsIdx(0-3) | PageNum(Optional)</p>
                                                        </div>
                                                        <button onClick={() => setShowBulkImport(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                                                    </div>
                                                    
                                                    <textarea
                                                        value={bulkImportText}
                                                        onChange={(e) => setBulkImportText(e.target.value)}
                                                        className="w-full h-48 p-4 text-xs font-mono rounded-xl border border-gray-600 dark:border-[#333] bg-[#2a2a2a] dark:bg-[#0a0a0a] text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none shadow-inner placeholder:text-gray-600"
                                                        placeholder={`Example:\nHow many bones in the skull? | 20 | 22 | 24 | 30 | 1 | 5\nWhat does the heart pump? | Air | Food | Blood | Thoughts | 2 | 12`}
                                                    />
                                                    
                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <button onClick={() => setBulkImportText('')} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">Clear</button>
                                                        <button onClick={() => handleBulkImport(index)} className="px-6 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 shadow-lg shadow-purple-900/20 flex items-center gap-2">
                                                            <CheckCircle2 size={14}/> Parse & Import
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Questions List */}
                                            <div className="space-y-4">
                                                {(!lesson.quiz?.questions || lesson.quiz.questions.length === 0) && (
                                                    <div className="text-center py-12 text-gray-400">
                                                        <Brain size={48} className="mx-auto mb-2 opacity-20" />
                                                        <p>No questions yet.</p>
                                                    </div>
                                                )}

                                                {(lesson.quiz?.questions || []).map((q, qIdx) => (
                                                    <div key={q.id} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-gray-100 dark:border-[#333] shadow-sm relative group hover:border-gray-300 dark:hover:border-[#444] transition-all">
                                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => {
                                                                    if (!editingCourse.lessons) return;
                                                                    const updated = [...editingCourse.lessons];
                                                                    updated[index].quiz!.questions.splice(qIdx, 1);
                                                                    setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 dark:bg-[#252525] rounded-full"
                                                            >
                                                                <Trash2 size={16}/>
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="mb-6 pr-8">
                                                            <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2 block">Question {qIdx + 1}</span>
                                                            <textarea 
                                                                value={q.text}
                                                                onChange={(e) => {
                                                                    if (!editingCourse.lessons) return;
                                                                    const updated = [...editingCourse.lessons];
                                                                    updated[index].quiz!.questions[qIdx].text = e.target.value;
                                                                    setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                }}
                                                                className="w-full bg-transparent text-lg font-bold outline-none resize-none border-b border-transparent focus:border-gray-200 dark:focus:border-[#444] text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors"
                                                                placeholder="Enter question text here..."
                                                                rows={2}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                            {q.options.map((opt, oIdx) => (
                                                                <div key={oIdx} className="relative group/opt">
                                                                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors ${
                                                                        q.correctOptionIndex === oIdx ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600 group-hover/opt:border-brand-orange'
                                                                    }`}
                                                                    onClick={() => {
                                                                        if (!editingCourse.lessons) return;
                                                                        const updated = [...editingCourse.lessons];
                                                                        updated[index].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                                        setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                    }}>
                                                                        {q.correctOptionIndex === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                                    </div>
                                                                    
                                                                    <input 
                                                                        type="text" 
                                                                        value={opt}
                                                                        onChange={(e) => {
                                                                            if (!editingCourse.lessons) return;
                                                                            const updated = [...editingCourse.lessons];
                                                                            updated[index].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                                                            setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                        }}
                                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#252525] border outline-none text-sm font-medium transition-all ${
                                                                            q.correctOptionIndex === oIdx 
                                                                            ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10 text-green-800 dark:text-green-300' 
                                                                            : 'border-transparent focus:bg-white dark:focus:bg-[#151515] focus:border-brand-orange text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                                                                        }`}
                                                                        placeholder={`Option ${oIdx+1}`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        
                                                        <div className="pt-3 border-t border-gray-100 dark:border-[#333] flex flex-col md:flex-row gap-2">
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <HelpCircle size={14} className="text-gray-400"/>
                                                                <input 
                                                                    type="text" 
                                                                    value={q.explanation || ''}
                                                                    onChange={(e) => {
                                                                        if (!editingCourse.lessons) return;
                                                                        const updated = [...editingCourse.lessons];
                                                                        updated[index].quiz!.questions[qIdx].explanation = e.target.value;
                                                                        setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                    }}
                                                                    className="flex-1 text-xs text-gray-500 dark:text-gray-400 bg-transparent outline-none italic placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                                    placeholder="Optional: Explanation for the correct answer..."
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-[#333] pl-2 md:w-32">
                                                                <BookOpen size={14} className="text-gray-400"/>
                                                                <input 
                                                                    type="number" 
                                                                    value={q.referencePage || ''}
                                                                    onChange={(e) => {
                                                                        if (!editingCourse.lessons) return;
                                                                        const updated = [...editingCourse.lessons];
                                                                        updated[index].quiz!.questions[qIdx].referencePage = parseInt(e.target.value);
                                                                        setEditingCourse(prev => ({...prev, lessons: updated}));
                                                                    }}
                                                                    className="flex-1 text-xs text-gray-500 dark:text-gray-400 bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                                    placeholder="PDF Page #"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 3: SETTINGS */}
                                    {activeLessonTab === 'settings' && (
                                        <div className="space-y-6">
                                            {/* ... (Existing Settings UI) ... */}
                                            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg border border-gray-200 dark:border-[#333]">
                                                <h5 className="font-bold text-gray-900 dark:text-white mb-4">Lesson Visibility</h5>
                                                
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lock Lesson</p>
                                                        <p className="text-xs text-gray-500">Prevent students from accessing this lesson.</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => updateLesson(index, 'isLocked', !lesson.isLocked)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lesson.isLocked ? 'bg-red-500' : 'bg-gray-300 dark:bg-[#444]'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${lesson.isLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg border border-gray-200 dark:border-[#333]">
                                                <h5 className="font-bold text-gray-900 dark:text-white mb-4">Lesson Metadata</h5>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                                                        <textarea 
                                                            value={lesson.description || ''}
                                                            onChange={(e) => updateLesson(index, 'description', e.target.value)}
                                                            className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded p-3 text-sm outline-none resize-none h-24"
                                                            placeholder="Brief overview of what this lesson covers..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Estimated Duration</label>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={16} className="text-gray-400"/>
                                                            <input 
                                                                type="text" 
                                                                value={lesson.duration || ''}
                                                                onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                                                                className="flex-1 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm outline-none"
                                                                placeholder="e.g. 45 mins"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
