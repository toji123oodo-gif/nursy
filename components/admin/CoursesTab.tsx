
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../firebase';
import { Course, Lesson, ContentItem, Question, Flashcard } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Save, FileText, Mic, 
  Video, Upload, Check, ChevronDown, ChevronRight,
  MoreVertical, FileJson, Brain, Layout, DollarSign, 
  Image as ImageIcon, Lock, Clock, AlertCircle, Settings, 
  AlignLeft, List, HelpCircle, CheckCircle2, BookOpen, FolderOpen,
  Zap, FileSpreadsheet, Loader2, Sparkles, Play
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  
  // Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<'content' | 'quiz' | 'flashcards' | 'settings'>('content');
  const [showMobileSettings, setShowMobileSettings] = useState(false); 
  
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
  };

  const handleEditClick = (course: Course) => {
    if (!isOwner) return;
    setEditingCourse(JSON.parse(JSON.stringify(course)));
    setIsModalOpen(true);
    setExpandedLesson(null);
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

  const triggerSaveRequest = () => {
    if (!editingCourse?.title) {
        alert("يرجى إدخال عنوان الكورس أولاً");
        return;
    }
    setShowConfirmSave(true);
  };

  const executeSave = async () => {
    if (!editingCourse?.title || !isOwner) return;
    setIsSaving(true);
    setShowConfirmSave(false);
    
    try {
        const isNewCourse = !editingCourse.id || editingCourse.id === '';
        const courseId = isNewCourse ? 'c-' + Date.now() : editingCourse.id!;

        const courseData: Course = {
            id: courseId,
            title: editingCourse.title || 'Untitled Course',
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
        alert(`خطأ أثناء الحفظ: ${error}`);
    } finally {
        setIsSaving(false);
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: 'l-' + Date.now(),
      title: 'New Lesson',
      contents: [],
      isLocked: false
    };
    setEditingCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setExpandedLesson(newLesson.id);
  };

  const addResource = (lessonIndex: number, type: any) => {
    if (!editingCourse.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    const newContent: ContentItem = {
      id: 'r-' + Date.now(),
      type,
      title: type === 'video' ? 'المحاضرة المرئية' : `New ${type}`,
      url: ''
    };
    updatedLessons[lessonIndex].contents = [...(updatedLessons[lessonIndex].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {showConfirmSave && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
           <div className="relative w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">حفظ التغييرات</h3>
              <p className="text-sm text-gray-500 mb-8">هل أنت متأكد من حفظ تعديلات الكورس؟ سيتم تحديث المحتوى لجميع الطلاب.</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowConfirmSave(false)} className="btn-secondary py-3">إلغاء</button>
                 <button onClick={executeSave} className="btn-primary py-3">حفظ الآن <Check size={18} /></button>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Curriculum Designer</h2>
            <p className="text-sm text-gray-500">قم برفع الفيديوهات والملازم الدراسية هنا.</p>
         </div>
         {isOwner && (
           <button onClick={openNewCourseModal} className="btn-primary flex items-center gap-2 px-6">
             <Plus size={18}/> New Course
           </button>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-40 relative group">
               <img src={course.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                  <button onClick={() => handleEditClick(course)} className="p-2 bg-white rounded-full text-blue-600"><Edit2 size={18}/></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-2 bg-white rounded-full text-red-600"><Trash2 size={18}/></button>
               </div>
            </div>
            <div className="p-4">
               <h4 className="font-bold text-gray-900 dark:text-white truncate">{course.title}</h4>
               <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/90 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-[#333]">
             
             <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-white dark:bg-[#1E1E1E]">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white">Editor: {editingCourse.title || 'New Course'}</h3>
               <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">إغلاق</button>
                  <button onClick={triggerSaveRequest} disabled={isSaving} className="btn-primary px-8">
                     {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} حفظ
                  </button>
               </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                <div className="w-72 border-l border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#151515] p-6 space-y-4 overflow-y-auto">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">إعدادات الكورس</h4>
                   <input type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="cf-input" placeholder="عنوان الكورس" />
                   <input type="text" value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="cf-input" placeholder="اسم المحاضر" />
                   <input type="text" value={editingCourse.subject} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="cf-input" placeholder="المادة" />
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-[#0a0a0a]">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">المحاضرات (Lessons)</h4>
                      <button onClick={addLesson} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                        <Plus size={16}/> إضافة محاضرة
                      </button>
                   </div>

                   <div className="space-y-4">
                      {(editingCourse.lessons || []).map((lesson, idx) => (
                        <div key={lesson.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm">
                           <div 
                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525]"
                              onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                           >
                              <div className="flex items-center gap-4">
                                 <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                                 <input 
                                    value={lesson.title} 
                                    onClick={e => e.stopPropagation()} 
                                    onChange={e => {
                                       const updated = [...editingCourse.lessons!];
                                       updated[idx].title = e.target.value;
                                       setEditingCourse({...editingCourse, lessons: updated});
                                    }}
                                    className="bg-transparent border-none outline-none font-bold text-sm"
                                 />
                              </div>
                              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedLesson === lesson.id ? 'rotate-180' : ''}`} />
                           </div>

                           {expandedLesson === lesson.id && (
                              <div className="p-6 border-t border-gray-100 dark:border-[#333] bg-gray-50/30 dark:bg-[#1A1A1A] space-y-6">
                                 <div>
                                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                       <Play size={14}/> المحتوى التعليمي
                                    </h5>
                                    <div className="flex gap-2 mb-4">
                                       <button onClick={() => addResource(idx, 'video')} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-2"><Video size={14}/> إضافة فيديو رئيسي</button>
                                       <button onClick={() => addResource(idx, 'pdf')} className="px-3 py-1.5 bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#444] text-xs font-bold rounded-lg flex items-center gap-2"><FileText size={14}/> إضافة ملف PDF</button>
                                    </div>

                                    <div className="space-y-3">
                                       {(lesson.contents || []).map((content, cIdx) => (
                                          <div key={content.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm">
                                             <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                   {content.type === 'video' ? <Video size={18} className="text-blue-500" /> : <FileText size={18} className="text-red-500" />}
                                                   <input 
                                                      value={content.title} 
                                                      onChange={e => {
                                                         const updated = [...editingCourse.lessons!];
                                                         updated[idx].contents[cIdx].title = e.target.value;
                                                         setEditingCourse({...editingCourse, lessons: updated});
                                                      }}
                                                      className="text-sm font-bold bg-transparent outline-none"
                                                   />
                                                </div>
                                                <button onClick={() => {
                                                   const updated = [...editingCourse.lessons!];
                                                   updated[idx].contents.splice(cIdx, 1);
                                                   setEditingCourse({...editingCourse, lessons: updated});
                                                }} className="text-red-400"><Trash2 size={16}/></button>
                                             </div>
                                             
                                             <div className="flex gap-2">
                                                <input 
                                                   value={content.url} 
                                                   onChange={e => {
                                                      const updated = [...editingCourse.lessons!];
                                                      updated[idx].contents[cIdx].url = e.target.value;
                                                      setEditingCourse({...editingCourse, lessons: updated});
                                                   }}
                                                   className="flex-1 cf-input text-xs font-mono" 
                                                   placeholder="رابط المحتوى (URL) أو ارفع ملف..." 
                                                />
                                                <label className="p-2 bg-gray-100 dark:bg-[#333] rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                                                   {uploadProgress[content.id] ? <span className="text-[10px] font-bold">{Math.round(uploadProgress[content.id])}%</span> : <Upload size={16}/>}
                                                   <input type="file" className="hidden" onChange={e => handleFileUpload(e, idx, cIdx)} />
                                                </label>
                                             </div>

                                             {/* Real-time Video Preview for Admin */}
                                             {content.type === 'video' && content.url && (
                                                <div className="mt-4 border-t pt-4">
                                                   <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Video Preview</p>
                                                   <video src={content.url} className="w-full max-h-40 bg-black rounded-lg" controls />
                                                </div>
                                             )}
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
