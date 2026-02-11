
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
  Zap, FileSpreadsheet, Loader2, Sparkles, Play, User as UserIcon
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
  const [activeLessonTab, setActiveLessonTab] = useState<'content' | 'quiz' | 'flashcards'>('content');
  
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];
  const isOwner = user && OWNERS.includes(user.email);

  const openNewCourseModal = () => {
    if (!isOwner) return;
    setEditingCourse({
      id: '',
      title: '',
      instructor: '',
      subject: '',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
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
            image: editingCourse.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
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
      title: 'محاضرة جديدة',
      contents: [],
      isLocked: false,
      flashcards: []
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
      title: type === 'video' ? 'المحاضرة المرئية' : `ملف ${type === 'pdf' ? 'PDF' : 'جديد'}`,
      url: ''
    };
    updatedLessons[lessonIndex].contents = [...(updatedLessons[lessonIndex].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const addFlashcard = (lessonIndex: number) => {
    if (!editingCourse.lessons) return;
    const updatedLessons = [...editingCourse.lessons];
    const newCard: Flashcard = {
      id: 'f-' + Date.now(),
      front: 'المصطلح',
      back: 'التعريف'
    };
    updatedLessons[lessonIndex].flashcards = [...(updatedLessons[lessonIndex].flashcards || []), newCard];
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Layout size={20} className="text-brand-orange"/> Course Designer</h2>
            <p className="text-sm text-gray-500">قم بإدارة المحتوى العلمي والاختبارات من هنا.</p>
         </div>
         {isOwner && (
           <button onClick={openNewCourseModal} className="btn-primary flex items-center gap-2 px-6 py-2.5">
             <Plus size={18}/> إنشاء كورس جديد
           </button>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-44 relative overflow-hidden">
               <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                  <button onClick={() => handleEditClick(course)} className="p-3 bg-white rounded-xl text-blue-600 shadow-xl hover:scale-110 transition-transform"><Edit2 size={20}/></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-3 bg-white rounded-xl text-red-600 shadow-xl hover:scale-110 transition-transform"><Trash2 size={20}/></button>
               </div>
            </div>
            <div className="p-5">
               <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">{course.title}</h4>
               <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><UserIcon size={12}/> {course.instructor}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/90 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-[#333]">
             
             <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-white dark:bg-[#1E1E1E]">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                 <Edit2 size={18} className="text-brand-orange"/> محرر الكورسات: {editingCourse.title || 'كورس جديد'}
               </h3>
               <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-red-500 font-bold">إلغاء</button>
                  <button onClick={() => setShowConfirmSave(true)} disabled={isSaving} className="btn-primary px-8">
                     {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} حفظ التغييرات
                  </button>
               </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Settings */}
                <div className="w-80 border-l border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#151515] p-6 space-y-6 overflow-y-auto">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> إعدادات عامة</h4>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500">عنوان الكورس</label>
                        <input type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="cf-input" placeholder="مثال: أساسيات التمريض" />
                        
                        <label className="text-xs font-bold text-gray-500">المحاضر</label>
                        <input type="text" value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="cf-input" placeholder="اسم الدكتور" />
                        
                        <label className="text-xs font-bold text-gray-500">المادة / القسم</label>
                        <input type="text" value={editingCourse.subject} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="cf-input" placeholder="مثال: Anatomy" />
                        
                        <label className="text-xs font-bold text-gray-500">رابط صورة الغلاف</label>
                        <input type="text" value={editingCourse.image} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="cf-input" placeholder="https://..." />
                      </div>
                   </div>
                </div>

                {/* Main Editor: Lessons */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-[#0a0a0a]">
                   <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">إدارة الدروس والمحتوى</h4>
                        <p className="text-sm text-gray-500 mt-1">أضف المحاضرات، الاختبارات، والبطاقات التعليمية لكل درس.</p>
                      </div>
                      <button onClick={addLesson} className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                        <Plus size={18}/> إضافة محاضرة جديدة
                      </button>
                   </div>

                   <div className="space-y-6">
                      {(editingCourse.lessons || []).map((lesson, idx) => (
                        <div key={lesson.id} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                           <div 
                              className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${expandedLesson === lesson.id ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#252525]'}`}
                              onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                           >
                              <div className="flex items-center gap-5 flex-1">
                                 <span className="w-10 h-10 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-sm shadow-lg">{idx + 1}</span>
                                 <input 
                                    value={lesson.title} 
                                    onClick={e => e.stopPropagation()} 
                                    onChange={e => {
                                       const updated = [...editingCourse.lessons!];
                                       updated[idx].title = e.target.value;
                                       setEditingCourse({...editingCourse, lessons: updated});
                                    }}
                                    className="bg-transparent border-none outline-none font-bold text-lg text-gray-900 dark:text-white w-full focus:text-brand-orange transition-colors"
                                 />
                              </div>
                              <div className="flex items-center gap-4">
                                 <button onClick={(e) => { e.stopPropagation(); if(confirm('حذف الدرس؟')) { const u = [...editingCourse.lessons!]; u.splice(idx,1); setEditingCourse({...editingCourse, lessons: u}); } }} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                                 <ChevronDown size={24} className={`text-gray-400 transition-transform duration-300 ${expandedLesson === lesson.id ? 'rotate-180 text-brand-orange' : ''}`} />
                              </div>
                           </div>

                           {expandedLesson === lesson.id && (
                              <div className="p-8 border-t border-gray-100 dark:border-[#333] bg-gray-50/30 dark:bg-[#1A1A1A] space-y-8 animate-in slide-in-from-top-2 duration-300">
                                 
                                 {/* Lesson Tabs */}
                                 <div className="flex gap-4 border-b border-gray-200 dark:border-[#333] pb-1">
                                    {[
                                      { id: 'content', label: 'المحتوى والملفات', icon: FileText },
                                      { id: 'quiz', label: 'الاختبار (Quiz)', icon: Brain },
                                      { id: 'flashcards', label: 'البطاقات (Flashcards)', icon: Zap },
                                    ].map(tab => (
                                      <button
                                        key={tab.id}
                                        onClick={() => setActiveLessonTab(tab.id as any)}
                                        className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeLessonTab === tab.id ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                                      >
                                        <tab.icon size={16}/> {tab.label}
                                      </button>
                                    ))}
                                 </div>

                                 {/* TAB: CONTENT */}
                                 {activeLessonTab === 'content' && (
                                    <div className="space-y-6">
                                       <div className="flex gap-3">
                                          <button onClick={() => addResource(idx, 'video')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"><Video size={18}/> إضافة فيديو رئيسي</button>
                                          <button onClick={() => addResource(idx, 'pdf')} className="px-5 py-2.5 bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#444] text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors"><FileText size={18}/> إضافة ملف PDF</button>
                                       </div>

                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {(lesson.contents || []).map((content, cIdx) => (
                                             <div key={content.id} className="bg-white dark:bg-[#222] p-5 rounded-2xl border border-gray-100 dark:border-[#333] shadow-sm group/card relative">
                                                <div className="flex items-center justify-between mb-4">
                                                   <div className="flex items-center gap-3">
                                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${content.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                         {content.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                                                      </div>
                                                      <input 
                                                         value={content.title} 
                                                         onChange={e => {
                                                            const updated = [...editingCourse.lessons!];
                                                            updated[idx].contents[cIdx].title = e.target.value;
                                                            setEditingCourse({...editingCourse, lessons: updated});
                                                         }}
                                                         className="text-sm font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                                                      />
                                                   </div>
                                                   <button onClick={() => {
                                                      const updated = [...editingCourse.lessons!];
                                                      updated[idx].contents.splice(cIdx, 1);
                                                      setEditingCourse({...editingCourse, lessons: updated});
                                                   }} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                   <input 
                                                      value={content.url} 
                                                      onChange={e => {
                                                         const updated = [...editingCourse.lessons!];
                                                         updated[idx].contents[cIdx].url = e.target.value;
                                                         setEditingCourse({...editingCourse, lessons: updated});
                                                      }}
                                                      className="flex-1 cf-input text-xs font-mono py-2" 
                                                      placeholder="رابط المحتوى (URL)" 
                                                   />
                                                   <label className="p-2 bg-gray-100 dark:bg-[#333] rounded-xl cursor-pointer hover:bg-brand-orange hover:text-white transition-all">
                                                      {uploadProgress[content.id] ? <span className="text-[10px] font-bold">{Math.round(uploadProgress[content.id])}%</span> : <Upload size={18}/>}
                                                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, idx, cIdx)} />
                                                   </label>
                                                </div>

                                                {content.type === 'video' && content.url && (
                                                   <div className="mt-4 rounded-xl overflow-hidden bg-black aspect-video border border-white/5">
                                                      <video src={content.url} className="w-full h-full" controls />
                                                   </div>
                                                )}
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 )}

                                 {/* TAB: QUIZ */}
                                 {activeLessonTab === 'quiz' && (
                                    <div className="space-y-6">
                                       <div className="bg-white dark:bg-[#222] p-6 rounded-2xl border border-dashed border-gray-300 dark:border-[#444] text-center">
                                          <Brain size={48} className="mx-auto text-gray-300 mb-3" />
                                          <h5 className="font-bold text-gray-700 dark:text-gray-300">إدارة اختبار الدرس</h5>
                                          <p className="text-xs text-gray-500 mt-1 mb-6">قم بإضافة أسئلة اختيار من متعدد لهذا الدرس.</p>
                                          <button className="btn-secondary px-8 py-2.5">فتح محرر الأسئلة</button>
                                       </div>
                                    </div>
                                 )}

                                 {/* TAB: FLASHCARDS */}
                                 {activeLessonTab === 'flashcards' && (
                                    <div className="space-y-6">
                                       <div className="flex justify-between items-center">
                                          <h5 className="text-sm font-bold text-gray-900 dark:text-white">البطاقات المضافة ({lesson.flashcards?.length || 0})</h5>
                                          <button onClick={() => addFlashcard(idx)} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14}/> إضافة بطاقة</button>
                                       </div>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {(lesson.flashcards || []).map((card, fIdx) => (
                                             <div key={card.id} className="bg-white dark:bg-[#222] p-4 rounded-xl border border-gray-100 dark:border-[#333]">
                                                <div className="space-y-3">
                                                   <input 
                                                      value={card.front} 
                                                      placeholder="الوجه (المصطلح)" 
                                                      onChange={e => {
                                                         const updated = [...editingCourse.lessons!];
                                                         updated[idx].flashcards![fIdx].front = e.target.value;
                                                         setEditingCourse({...editingCourse, lessons: updated});
                                                      }}
                                                      className="w-full bg-gray-50 dark:bg-[#2c2c2c] border-none rounded-lg p-2 text-sm font-bold"
                                                   />
                                                   <textarea 
                                                      value={card.back} 
                                                      placeholder="الظهر (التعريف)" 
                                                      onChange={e => {
                                                         const updated = [...editingCourse.lessons!];
                                                         updated[idx].flashcards![fIdx].back = e.target.value;
                                                         setEditingCourse({...editingCourse, lessons: updated});
                                                      }}
                                                      className="w-full bg-gray-50 dark:bg-[#2c2c2c] border-none rounded-lg p-2 text-xs h-20 resize-none"
                                                   />
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 )}

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
