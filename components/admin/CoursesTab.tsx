
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, Question, Quiz } from '../../types';
import { PlusCircle, Edit, Trash, Layers, Mic2, FileDown, Plus, X, FileText, Upload, Info, Save, ChevronDown, ChevronUp, GripVertical, BookOpen, Brain, CheckCircle2 } from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);

  const handleSave = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) {
        await updateCourse(editingCourse as Course);
      } else {
        await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course);
      }
      setIsModalOpen(false);
      alert('تم الحفظ بنجاح');
    } catch (e) {
      alert('خطأ في الحفظ');
    }
  };

  const addManualQuestion = (idx: number) => {
    const newL = [...(editingCourse?.lessons || [])];
    if (!newL[idx].quiz) newL[idx].quiz = { id: 'q'+Date.now(), title: 'اختبار', questions: [] };
    newL[idx].quiz!.questions.push({
      id: 'qn'+Date.now(), text: 'سؤال جديد؟', options: ['1','2','3','4'], correctOptionIndex: 0
    });
    setEditingCourse({...editingCourse, lessons: newL});
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-white">إدارة المحتوى (بودكاست وملفات)</h2>
         <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: ''}); setIsModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-glow transition-all hover:scale-105"><PlusCircle size={20}/> كورس جديد</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-brand-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-xl">
            <div className="h-48 relative overflow-hidden">
              <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={() => {setEditingCourse(course); setIsModalOpen(true);}} className="p-3 bg-brand-gold text-brand-main rounded-xl"><Edit size={18}/></button>
                <button onClick={() => deleteCourse(course.id)} className="p-3 bg-red-500 text-white rounded-xl"><Trash size={18}/></button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-white font-black text-lg mb-2">{course.title}</h4>
              <div className="flex justify-between text-[10px] font-black uppercase text-brand-muted">
                 <span>{course.lessons.length} محاضرة</span>
                 <span className="text-brand-gold">{course.price} ج.م</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/98 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-5xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl h-[90vh] flex flex-col overflow-hidden animate-scale-up">
             
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-2xl font-black text-white">محرر المحاضرات الصوتية والمذكرات</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-white"><X size={24}/></button>
             </div>

             <div className="p-8 overflow-y-auto flex-1 space-y-10 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">اسم الكورس</label>
                      <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">التخصص</label>
                      <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted font-black uppercase px-2">السعر</label>
                      <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-gold outline-none" />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-white flex items-center gap-2"><Mic2 className="text-brand-gold" size={20} /> المحاضرات الصوتية والملفات</h4>
                      <button onClick={() => setEditingCourse({...editingCourse, lessons: [...(editingCourse.lessons || []), {id: 'l'+Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: []}]})} className="bg-white/5 text-white px-4 py-2 rounded-xl text-[10px] font-black border border-white/10 flex items-center gap-2"><Plus size={14}/> إضافة محاضرة</button>
                   </div>

                   <div className="space-y-4">
                      {editingCourse.lessons?.map((lesson, lIdx) => (
                        <div key={lesson.id} className="bg-brand-main/50 rounded-3xl border border-white/5 overflow-hidden">
                           <div className="p-6 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedLesson(expandedLesson === lIdx ? null : lIdx)}>
                              <GripVertical className="text-brand-muted" size={18} />
                              <input type="text" value={lesson.title} onChange={e => {const newL = [...editingCourse.lessons!]; newL[lIdx].title = e.target.value; setEditingCourse({...editingCourse, lessons: newL})}} className="bg-transparent text-white font-black text-lg outline-none flex-1" onClick={e => e.stopPropagation()} />
                              {expandedLesson === lIdx ? <ChevronUp /> : <ChevronDown />}
                           </div>
                           
                           {expandedLesson === lIdx && (
                             <div className="p-8 pt-0 border-t border-white/5 space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] text-brand-gold font-black uppercase">رابط الملف الصوتي (MP3)</label>
                                      <input type="text" placeholder="https://..." value={lesson.contents.find(c => c.type === 'audio')?.url || ''} onChange={e => {
                                         const newL = [...editingCourse.lessons!];
                                         const newC = [...newL[lIdx].contents];
                                         const idx = newC.findIndex(x => x.type === 'audio');
                                         if (idx >= 0) newC[idx].url = e.target.value;
                                         else newC.push({id: 'a'+Date.now(), type: 'audio', title: 'الشرح الصوتي', url: e.target.value});
                                         newL[lIdx].contents = newC;
                                         setEditingCourse({...editingCourse, lessons: newL});
                                      }} className="w-full bg-brand-main border border-white/10 rounded-xl p-3 text-xs text-white" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] text-brand-gold font-black uppercase">رابط المذكرة (PDF)</label>
                                      <input type="text" placeholder="https://..." value={lesson.contents.find(c => c.type === 'pdf')?.url || ''} onChange={e => {
                                         const newL = [...editingCourse.lessons!];
                                         const newC = [...newL[lIdx].contents];
                                         const idx = newC.findIndex(x => x.type === 'pdf');
                                         if (idx >= 0) newC[idx].url = e.target.value;
                                         else newC.push({id: 'p'+Date.now(), type: 'pdf', title: 'مذكرة الشرح', url: e.target.value});
                                         newL[lIdx].contents = newC;
                                         setEditingCourse({...editingCourse, lessons: newL});
                                      }} className="w-full bg-brand-main border border-white/10 rounded-xl p-3 text-xs text-white" />
                                   </div>
                                </div>

                                <div className="bg-brand-main/40 p-6 rounded-2xl border border-brand-gold/10">
                                   <div className="flex justify-between items-center mb-4">
                                      <h5 className="text-white font-black text-sm flex items-center gap-2"><Brain size={16} /> الاختبار</h5>
                                      <button onClick={() => addManualQuestion(lIdx)} className="text-[9px] font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-lg">إضافة سؤال</button>
                                   </div>
                                   <div className="space-y-3">
                                      {lesson.quiz?.questions.map((q, qIdx) => (
                                        <div key={q.id} className="text-xs flex items-center gap-3">
                                          <span className="text-brand-muted">{qIdx + 1}.</span>
                                          <input type="text" value={q.text} onChange={e => {
                                            const newL = [...editingCourse.lessons!];
                                            newL[lIdx].quiz!.questions[qIdx].text = e.target.value;
                                            setEditingCourse({...editingCourse, lessons: newL});
                                          }} className="bg-transparent border-b border-white/5 flex-1 outline-none text-white pb-1" />
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

             <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                <button onClick={handleSave} className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-xl shadow-glow flex items-center gap-2"><Save size={20}/> حفظ التعديلات</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
