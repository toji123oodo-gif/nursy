
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../firebase';
import { Course, Lesson, ContentItem, Flashcard } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Save, FileText, Mic, 
  Video, Upload, ChevronDown, Image as ImageIcon, 
  Layout, Brain, Zap, Settings, AlignLeft,
  Loader2, DollarSign, Music, Check, ArrowLeft
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  
  // Active Tab per lesson to maintain state individually
  const [lessonTabs, setLessonTabs] = useState<Record<string, 'content' | 'quiz' | 'flashcards' | 'settings'>>({});

  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];
  const isOwner = user && OWNERS.includes(user.email);

  const openNewCourseModal = () => {
    if (!isOwner) return;
    const newId = 'c-' + Date.now();
    setEditingCourse({
      id: '',
      title: '',
      instructor: '',
      subject: '',
      image: '',
      price: 0,
      lessons: []
    });
    setIsModalOpen(true);
    setExpandedLesson(null);
  };

  const handleEditClick = (course: Course) => {
    if (!isOwner) return;
    setEditingCourse(JSON.parse(JSON.stringify(course)));
    setIsModalOpen(true);
    // Expand first lesson by default if exists
    if(course.lessons.length > 0) {
        setExpandedLesson(course.lessons[0].id);
        setLessonTabs(prev => ({...prev, [course.lessons[0].id]: 'content'}));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, lessonIndex: number, contentIndex: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse.lessons) return;

    const resourceId = editingCourse.lessons[lessonIndex].contents[contentIndex].id;
    const storageRef = storage.ref(`courses/${editingCourse.id || 'temp'}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [resourceId]: progress }));
      }, 
      (error) => { alert("Upload failed: " + error.message); }, 
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        const updatedLessons = [...editingCourse.lessons!];
        updatedLessons[lessonIndex].contents[contentIndex].url = url;
        updatedLessons[lessonIndex].contents[contentIndex].title = file.name;
        updatedLessons[lessonIndex].contents[contentIndex].fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
        setUploadProgress(prev => {
            const next = {...prev};
            delete next[resourceId];
            return next;
        });
      }
    );
  };

  const executeSave = async () => {
    if (!editingCourse?.title || !isOwner) return;
    setIsSaving(true);
    
    try {
        const isNewCourse = !editingCourse.id || editingCourse.id === '';
        const courseId = isNewCourse ? 'c-' + Date.now() : editingCourse.id!;

        const courseData: Course = {
            id: courseId,
            title: editingCourse.title || 'New Course',
            instructor: editingCourse.instructor || 'Instructor',
            subject: editingCourse.subject || 'General',
            image: editingCourse.image || 'https://placehold.co/600x400',
            price: Number(editingCourse.price) || 0,
            lessons: editingCourse.lessons || []
        };

        if (isNewCourse) await addCourse(courseData);
        else await updateCourse(courseData);
        
        setIsModalOpen(false);
    } catch (error) {
        alert(`Error saving: ${error}`);
    } finally {
        setIsSaving(false);
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: 'l-' + Date.now(),
      title: 'New Lesson',
      contents: [],
      isLocked: false,
      flashcards: []
    };
    setEditingCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setExpandedLesson(newLesson.id);
    setLessonTabs(prev => ({...prev, [newLesson.id]: 'content'}));
  };

  const deleteLesson = (index: number) => {
      if(!confirm("Delete this lesson?")) return;
      const updatedLessons = [...(editingCourse.lessons || [])];
      updatedLessons.splice(index, 1);
      setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const addResource = (lessonIndex: number, type: any) => {
    if (!editingCourse.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    const newContent: ContentItem = {
      id: 'r-' + Date.now(),
      type,
      title: type === 'video' ? 'Video Title' : `New ${type}`,
      url: ''
    };
    updatedLessons[lessonIndex].contents = [...(updatedLessons[lessonIndex].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const setLessonTab = (lessonId: string, tab: 'content' | 'quiz' | 'flashcards' | 'settings') => {
      setLessonTabs(prev => ({...prev, [lessonId]: tab}));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Layout size={20} className="text-brand-orange"/> Course Manager</h2>
            <p className="text-sm text-gray-500">Design your curriculum and manage content.</p>
         </div>
         {isOwner && (
           <button onClick={openNewCourseModal} className="btn-primary flex items-center gap-2 px-6 py-2.5">
             <Plus size={18}/> New Course
           </button>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-44 relative overflow-hidden">
               <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                  <button onClick={() => handleEditClick(course)} className="p-3 bg-white rounded-xl text-blue-600 shadow-xl hover:scale-110 transition-transform"><Edit2 size={20}/></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-3 bg-white rounded-xl text-red-600 shadow-xl hover:scale-110 transition-transform"><Trash2 size={20}/></button>
               </div>
            </div>
            <div className="p-5">
               <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">{course.title}</h4>
               <p className="text-xs text-gray-500 mt-1">{course.lessons?.length || 0} Lessons • {course.subject}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#121212] flex flex-col overflow-hidden text-gray-200">
             
             {/* 1. Header Bar */}
             <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#1a1a1a]">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={executeSave} 
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2"
                  >
                     {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-sm font-bold">
                     Discard
                  </button>
               </div>
               
               <div className="text-center">
                  <h2 className="text-white font-bold">{editingCourse.title || 'New Course'}</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{editingCourse.lessons?.length || 0} Lessons</p>
               </div>

               <div className="w-24"></div> {/* Spacer for alignment */}
             </div>

             {/* 2. Main Editor Body */}
             <div className="flex-1 flex overflow-hidden">
                
                {/* Left: Curriculum (Main Content) */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
                   <div className="max-w-4xl mx-auto space-y-6">
                      <div className="flex justify-between items-end mb-4">
                         <h3 className="text-xl font-bold text-white">Curriculum</h3>
                         <button onClick={addLesson} className="text-sm bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <Plus size={16}/> Add Lesson
                         </button>
                      </div>

                      {(!editingCourse.lessons || editingCourse.lessons.length === 0) && (
                         <div className="border-2 border-dashed border-[#333] rounded-2xl p-12 text-center text-gray-500">
                            <p>No lessons added yet. Click "Add Lesson" to start.</p>
                         </div>
                      )}

                      {editingCourse.lessons?.map((lesson, idx) => {
                         const activeTab = lessonTabs[lesson.id] || 'content';
                         const isExpanded = expandedLesson === lesson.id;

                         return (
                           <div key={lesson.id} className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden transition-all">
                              {/* Lesson Header */}
                              <div 
                                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#252525]"
                                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                              >
                                 <button onClick={(e) => { e.stopPropagation(); deleteLesson(idx); }} className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={16}/>
                                 </button>
                                 
                                 <div className="flex-1 flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Lesson {idx + 1}</span>
                                    <input 
                                       value={lesson.title}
                                       onClick={e => e.stopPropagation()}
                                       onChange={e => {
                                          const updated = [...editingCourse.lessons!];
                                          updated[idx].title = e.target.value;
                                          setEditingCourse({...editingCourse, lessons: updated});
                                       }}
                                       className="bg-transparent border-none outline-none text-white font-bold text-sm w-full"
                                       placeholder="Lesson Title"
                                    />
                                 </div>

                                 <ChevronDown size={18} className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                              </div>

                              {/* Expanded Content */}
                              {isExpanded && (
                                 <div className="border-t border-[#333] p-6 bg-[#151515]">
                                    
                                    {/* Tabs */}
                                    <div className="flex items-center gap-6 border-b border-[#333] mb-6 text-sm font-medium text-gray-500">
                                       <button onClick={() => setLessonTab(lesson.id, 'settings')} className={`pb-2 hover:text-white ${activeTab === 'settings' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Settings</button>
                                       <button onClick={() => setLessonTab(lesson.id, 'flashcards')} className={`pb-2 hover:text-white ${activeTab === 'flashcards' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Flashcards</button>
                                       <button onClick={() => setLessonTab(lesson.id, 'quiz')} className={`pb-2 hover:text-white ${activeTab === 'quiz' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Quiz</button>
                                       <button onClick={() => setLessonTab(lesson.id, 'content')} className={`pb-2 hover:text-white flex items-center gap-2 ${activeTab === 'content' ? 'text-[#F38020] border-b-2 border-[#F38020]' : ''}`}>Content <Layout size={14}/></button>
                                    </div>

                                    {/* Content Tab */}
                                    {activeTab === 'content' && (
                                       <div className="space-y-6">
                                          {/* Quick Add Toolbar */}
                                          <div className="flex gap-2">
                                             <button onClick={() => addResource(idx, 'image')} className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded text-xs font-bold transition-colors"><ImageIcon size={14}/> Img</button>
                                             <button onClick={() => addResource(idx, 'article')} className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded text-xs font-bold transition-colors"><AlignLeft size={14}/> Txt</button>
                                             <button onClick={() => addResource(idx, 'pdf')} className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded text-xs font-bold transition-colors"><FileText size={14}/> PDF</button>
                                             <button onClick={() => addResource(idx, 'audio')} className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded text-xs font-bold transition-colors"><Mic size={14}/> Aud</button>
                                             <button onClick={() => addResource(idx, 'video')} className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded text-xs font-bold transition-colors"><Video size={14}/> Vid</button>
                                          </div>

                                          {/* Content List / Dropzone */}
                                          <div className="space-y-3">
                                             {(lesson.contents || []).length === 0 ? (
                                                <div className="border border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-gray-600">
                                                   <Upload size={24} className="mb-2 opacity-50"/>
                                                   <span className="text-xs">No content added yet</span>
                                                </div>
                                             ) : (
                                                lesson.contents.map((content, cIdx) => (
                                                   <div key={content.id} className="bg-[#222] p-3 rounded-lg border border-[#333] flex items-center gap-3 group">
                                                      <div className="p-2 bg-[#333] rounded text-gray-400">
                                                         {content.type === 'video' ? <Video size={16}/> : content.type === 'pdf' ? <FileText size={16}/> : content.type === 'audio' ? <Music size={16}/> : <Layout size={16}/>}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                         <input 
                                                            value={content.title}
                                                            onChange={e => {
                                                               const updated = [...editingCourse.lessons!];
                                                               updated[idx].contents[cIdx].title = e.target.value;
                                                               setEditingCourse({...editingCourse, lessons: updated});
                                                            }}
                                                            className="bg-transparent border-none outline-none text-white text-sm font-medium w-full mb-1"
                                                            placeholder="Content Title"
                                                         />
                                                         <div className="flex items-center gap-2">
                                                            <input 
                                                               value={content.url}
                                                               onChange={e => {
                                                                  const updated = [...editingCourse.lessons!];
                                                                  updated[idx].contents[cIdx].url = e.target.value;
                                                                  setEditingCourse({...editingCourse, lessons: updated});
                                                               }}
                                                               className="bg-[#1a1a1a] text-gray-400 text-xs px-2 py-1 rounded w-full border border-[#333] focus:border-[#555] outline-none"
                                                               placeholder="Paste URL or upload..."
                                                            />
                                                            <label className="cursor-pointer text-gray-500 hover:text-white">
                                                               {uploadProgress[content.id] ? <span className="text-[10px]">{Math.round(uploadProgress[content.id])}%</span> : <Upload size={14}/>}
                                                               <input type="file" className="hidden" onChange={e => handleFileUpload(e, idx, cIdx)} />
                                                            </label>
                                                         </div>
                                                      </div>
                                                      <button 
                                                         onClick={() => {
                                                            const updated = [...editingCourse.lessons!];
                                                            updated[idx].contents.splice(cIdx, 1);
                                                            setEditingCourse({...editingCourse, lessons: updated});
                                                         }}
                                                         className="text-gray-600 hover:text-red-500 px-2"
                                                      >
                                                         <X size={16}/>
                                                      </button>
                                                   </div>
                                                ))
                                             )}
                                          </div>
                                       </div>
                                    )}

                                    {/* Other Tabs (Placeholder for functionality) */}
                                    {activeTab === 'quiz' && (
                                       <div className="text-center py-8 text-gray-500 border border-dashed border-[#333] rounded-xl">
                                          <Brain size={32} className="mx-auto mb-2 opacity-50"/>
                                          <p className="text-sm">Quiz Manager</p>
                                          <button className="mt-4 btn-secondary text-xs">Add Question</button>
                                       </div>
                                    )}
                                    {activeTab === 'flashcards' && (
                                       <div className="text-center py-8 text-gray-500 border border-dashed border-[#333] rounded-xl">
                                          <Zap size={32} className="mx-auto mb-2 opacity-50"/>
                                          <p className="text-sm">Flashcards Deck</p>
                                          <button className="mt-4 btn-secondary text-xs">Add Card</button>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                         );
                      })}
                   </div>
                </div>

                {/* Right: Sidebar Settings */}
                <div className="w-80 bg-[#151515] border-l border-[#333] flex flex-col overflow-y-auto">
                   <div className="p-6 space-y-6">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Course Settings</div>
                      
                      <div className="space-y-4">
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1.5">Title</label>
                            <input 
                               value={editingCourse.title}
                               onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                               className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                               placeholder="e.g. Advanced Anatomy"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1.5">Instructor</label>
                            <input 
                               value={editingCourse.instructor}
                               onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                               className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                               placeholder="Dr. Name"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1.5">Subject</label>
                            <input 
                               value={editingCourse.subject}
                               onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})}
                               className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                               placeholder="e.g. Anatomy"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1.5">Cover Image</label>
                            <div className="w-full aspect-video bg-[#222] rounded-lg border border-[#333] flex items-center justify-center overflow-hidden mb-2 relative group">
                               {editingCourse.image ? (
                                  <img src={editingCourse.image} className="w-full h-full object-cover" />
                               ) : (
                                  <span className="text-gray-600 text-lg font-bold">600 × 400</span>
                               )}
                               <input 
                                  value={editingCourse.image}
                                  onChange={e => setEditingCourse({...editingCourse, image: e.target.value})}
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
                                  value={editingCourse.price}
                                  onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})}
                                  className="w-full bg-[#222] border border-[#333] rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:border-[#F38020] outline-none"
                               />
                            </div>
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
