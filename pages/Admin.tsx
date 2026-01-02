
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, Course, Lesson, ContentItem, ActivationCode, Quiz, Question } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Trash2, Edit, BookOpen, 
  DollarSign, UserCheck, PlusCircle, Trash,
  Layers, Video, FileDown, Copy, Check,
  AlertCircle, Download, Clock, ArrowUpRight, Activity,
  MessageCircle, Globe, Ticket, Calendar, 
  HelpCircle, Sparkles, User as UserIcon, Layout, Plus, X, Brain, Save, 
  ChevronRight, BarChart3, GraduationCap, Laptop, History, Award, FileText, Upload, Info
} from 'lucide-react';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes' | 'exams'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  
  // Bulk Import State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [targetLessonIdx, setTargetLessonIdx] = useState<number | null>(null);
  
  const [codeCount, setCodeCount] = useState(10);
  const [codeDays, setCodeDays] = useState(30);

  const stats = useMemo(() => {
    const activePro = allUsers.filter(u => u.subscriptionTier === 'pro').length;
    const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
    const totalQuizzes = courses.reduce((acc, c) => acc + c.lessons.filter(l => l.quiz).length, 0);
    return {
      totalStudents: allUsers.length,
      activePro,
      totalIncome: activePro * 50,
      totalCourses: courses.length,
      totalLessons,
      totalQuizzes
    };
  }, [allUsers, courses]);

  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").orderBy("lastSeen", "desc").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    const unsubActivity = db.collection("admin_notifications").orderBy("timestamp", "desc").limit(10).onSnapshot(s => {
      setRecentActivities(s.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => { unsubUsers(); unsubCodes(); unsubActivity(); };
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف الطالب نهائياً؟')) return;
    try { await db.collection("users").doc(id).delete(); showNotification('success', 'تم حذف حساب الطالب'); }
    catch (e) { showNotification('error', 'فشل حذف الطالب'); }
  };

  const toggleUserTier = async (u: User) => {
    const newTier = u.subscriptionTier === 'pro' ? 'free' : 'pro';
    try {
      await db.collection("users").doc(u.id).update({ subscriptionTier: newTier });
      showNotification('success', `تم التحديث لـ ${newTier}`);
    } catch (e) { showNotification('error', 'فشل التحديث'); }
  };

  const generateCodes = async () => {
    if (!db) return;
    try {
      const batch = db.batch();
      for (let i = 0; i < codeCount; i++) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const ref = db.collection("activation_codes").doc();
        batch.set(ref, { id: ref.id, code, isUsed: false, days: codeDays, createdAt: new Date().toISOString() });
      }
      await batch.commit();
      showNotification('success', 'تم توليد الأكواد بنجاح');
    } catch (e) { showNotification('error', 'فشل توليد الأكواد'); }
  };

  const handleSaveCourse = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) { await updateCourse(editingCourse as Course); } 
      else { await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course); }
      setIsCourseModalOpen(false);
      showNotification('success', 'تم حفظ التغييرات بنجاح');
    } catch (e) { showNotification('error', 'فشل الحفظ'); }
  };

  // Bulk Import Logic
  const handleBulkImport = () => {
    if (targetLessonIdx === null || !bulkText.trim()) return;
    
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const newQuestions: Question[] = [];
    
    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        newQuestions.push({
          id: 'qn' + Math.random().toString(36).substring(2, 9),
          text: parts[0],
          options: [parts[1], parts[2], parts[3], parts[4]],
          correctOptionIndex: parseInt(parts[5]) || 0
        });
      }
    });

    if (newQuestions.length > 0) {
      const newLessons = [...(editingCourse?.lessons || [])];
      if (!newLessons[targetLessonIdx].quiz) {
        newLessons[targetLessonIdx].quiz = { id: 'q' + Date.now(), title: 'اختبار المحاضرة', questions: [] };
      }
      newLessons[targetLessonIdx].quiz!.questions = [...newLessons[targetLessonIdx].quiz!.questions, ...newQuestions];
      setEditingCourse({ ...editingCourse, lessons: newLessons });
      showNotification('success', `تم استيراد ${newQuestions.length} سؤال بنجاح`);
    } else {
      showNotification('error', 'التنسيق غير صحيح. يرجى التأكد من استخدام | للفصل بين الأجزاء');
    }
    
    setIsBulkModalOpen(false);
    setBulkText('');
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow scale-[1.02]' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="text-sm">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="mr-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-main flex">
      {/* 1. Side Navigation */}
      <aside className="w-72 bg-brand-card/30 border-l border-white/5 p-6 flex flex-col hidden lg:flex">
        <div className="mb-12 px-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Nursy <span className="text-brand-gold">Admin</span>
          </h2>
          <p className="text-[10px] text-brand-muted font-bold tracking-[0.2em] mt-1">MANAGEMENT SYSTEM</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="overview" label="نظرة عامة" icon={Layout} />
          <SidebarItem id="users" label="إدارة الطلاب" icon={Users} />
          <SidebarItem id="courses" label="إدارة المحتوى" icon={BookOpen} />
          <SidebarItem id="exams" label="نتائج الاختبارات" icon={Brain} />
          <SidebarItem id="codes" label="أكواد التفعيل" icon={Ticket} />
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto max-h-screen no-scrollbar">
        
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                    {activeTab === 'overview' && 'لوحة المعلومات'}
                    {activeTab === 'users' && 'قاعدة بيانات الطلاب'}
                    {activeTab === 'courses' && 'بناء المناهج'}
                    {activeTab === 'exams' && 'نتائج الاختبارات'}
                    {activeTab === 'codes' && 'إدارة الاشتراكات'}
                </h1>
                <p className="text-brand-muted text-sm font-bold mt-1">نظام إدارة نيرسي المتطور</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative group hidden sm:block">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث سريع..." 
                    className="bg-brand-card border border-white/5 rounded-2xl pr-12 pl-6 py-3 text-white outline-none focus:border-brand-gold/50 transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي الطلاب', val: stats.totalStudents, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                { label: 'المشتركون النشطون', val: stats.activePro, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: 'الاختبارات المنشورة', val: stats.totalQuizzes, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'الأرباح المقدرة', val: stats.totalIncome, icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
              ].map((s, i) => (
                <div key={i} className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl group hover:border-brand-gold/20 transition-all">
                  <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <s.icon size={28} />
                  </div>
                  <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <h3 className="text-4xl font-black text-white tracking-tighter">{s.val}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
               <div className="xl:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10">
                  <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3"><Activity className="text-brand-gold" /> آخر النشاطات</h3>
                  <div className="space-y-6">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-brand-main/50 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 bg-brand-gold/5 text-brand-gold rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/10"><Activity size={20} /></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-bold leading-relaxed">{act.message}</p>
                          <p className="text-[10px] text-brand-muted font-bold mt-1 uppercase tracking-widest">{new Date(act.timestamp).toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8">إجراءات سريعة</h3>
                    <div className="space-y-4">
                       <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="w-full bg-brand-gold text-brand-main font-black p-5 rounded-2xl flex items-center justify-between shadow-glow">
                          <span>إضافة كورس</span> <PlusCircle size={22} />
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* USERS CONTENT */}
        {activeTab === 'users' && (
          <div className="bg-brand-card rounded-[3rem] border border-white/5 p-8 md:p-10 space-y-10 animate-fade-in shadow-2xl">
             <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="relative w-full lg:w-1/2 group">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                  <input type="text" placeholder="ابحث عن طالب..." className="w-full bg-brand-main border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-brand-gold transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5">
                    {['all', 'pro', 'free'].map(f => (
                      <button key={f} onClick={() => setUserFilter(f as any)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${userFilter === f ? 'bg-brand-gold text-brand-main shadow-lg' : 'text-brand-muted'}`}>
                        {f === 'all' ? 'الكل' : f.toUpperCase()}
                      </button>
                    ))}
                </div>
             </div>
             
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-right text-white">
                  <thead className="text-brand-muted text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="p-6">الطالب</th>
                      <th className="p-6">الجهاز</th>
                      <th className="p-6 text-left">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-all group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black">{u.name.charAt(0)}</div>
                                <div>
                                    <p className="font-black text-white">{u.name}</p>
                                    <p className="text-[10px] text-brand-muted font-mono">{u.phone}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 text-xs text-brand-muted">{u.lastDevice || 'Desktop'}</td>
                        <td className="p-6 text-left">
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => toggleUserTier(u)} className="p-3 bg-white/5 text-brand-gold rounded-xl"><Sparkles size={18}/></button>
                                <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={18}/></button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* COURSES CONTENT */}
        {activeTab === 'courses' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">إدارة المناهج</h2>
                <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-glow">
                  <PlusCircle size={24} /> كورس جديد
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-brand-gold/40 transition-all shadow-2xl flex flex-col h-full">
                  <div className="h-60 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl"><Edit size={22}/></button>
                            <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl"><Trash size={22}/></button>
                        </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1">
                    <h4 className="text-white font-black text-2xl mb-6">{course.title}</h4>
                    <div className="flex items-center gap-3 text-brand-muted text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-brand-main/50 px-5 py-3 rounded-2xl"><Layers size={14} className="text-brand-gold" /> {course.lessons?.length || 0} درس</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXAMS CONTENT */}
        {activeTab === 'exams' && (
          <div className="space-y-10 animate-fade-in">
             <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><Brain size={32} className="text-brand-gold" /> نتائج اختبارات الطلاب</h3>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-right text-white">
                      <thead className="text-brand-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                        <tr>
                          <th className="p-6">الطالب</th>
                          <th className="p-6">المحاضرة</th>
                          <th className="p-6">الدرجة</th>
                          <th className="p-6 text-left">التوقيت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allUsers.filter(u => u.quizGrades).map(u => (
                          Object.entries(u.quizGrades!).map(([lessonId, score]) => (
                            <tr key={`${u.id}-${lessonId}`} className="hover:bg-white/5 transition-all">
                              <td className="p-6 font-bold">{u.name}</td>
                              <td className="p-6 text-brand-muted text-xs font-bold">{lessonId}</td>
                              <td className="p-6 font-black text-lg text-brand-gold">{score}%</td>
                              <td className="p-6 text-left text-brand-muted text-[10px] font-mono">{u.lastSeen || 'غير متوفر'}</td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {/* CODES CONTENT */}
        {activeTab === 'codes' && (
          <div className="space-y-10 animate-fade-in">
            <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><Ticket size={28} className="text-brand-gold" /> توليد أكواد تفعيل</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                   <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">العدد</label>
                        <input type="number" value={codeCount} onChange={e => setCodeCount(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                   </div>
                   <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">الأيام</label>
                        <input type="number" value={codeDays} onChange={e => setCodeDays(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                   </div>
                   <div className="flex items-end">
                      <button onClick={generateCodes} className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-2xl shadow-glow">توليد الأكواد</button>
                   </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {activationCodes.slice(0, 40).map(c => (
                <div key={c.id} className={`p-6 rounded-[1.8rem] border flex items-center justify-between group transition-all ${c.isUsed ? 'bg-red-500/5 border-red-500/10 opacity-40' : 'bg-brand-main border-white/5 hover:border-brand-gold/30'}`}>
                  <div>
                    <p className={`font-mono font-black text-xl tracking-wider ${c.isUsed ? 'text-red-400' : 'text-white'}`}>{c.code}</p>
                    <p className="text-[9px] text-brand-muted font-bold mt-1 uppercase tracking-widest">{c.days} يوم</p>
                  </div>
                  {!c.isUsed && (
                    <button onClick={() => {navigator.clipboard.writeText(c.code); showNotification('success', 'تم نسخ الكود');}} className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold rounded-xl transition-all opacity-0 group-hover:opacity-100"><Copy size={16}/></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Modal for Course / Quiz Builder */}
        {isCourseModalOpen && editingCourse && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-xl" onClick={() => setIsCourseModalOpen(false)}></div>
            <div className="relative w-full max-w-6xl bg-brand-card border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up h-[92vh] flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-3xl font-black text-white">محرر المنهج الدراسي</h3>
                 <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-4 rounded-2xl transition-all hover:bg-red-500/10 hover:text-red-500"><X size={32} /></button>
              </div>
              
              <div className="p-10 overflow-y-auto flex-1 space-y-12 no-scrollbar">
                 {/* Basic Info */}
                 <section className="bg-brand-main/30 p-10 rounded-[2.5rem] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">اسم الكورس</label>
                        <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">التخصص</label>
                        <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">السعر</label>
                        <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                    </div>
                 </section>

                 {/* Lessons & Quizzes Builder */}
                 <section className="space-y-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <h4 className="text-2xl font-black text-white flex items-center gap-4"><Layers size={24} className="text-brand-gold"/> هيكلة المحاضرات والاختبارات</h4>
                      <button onClick={() => {
                        const newLesson: Lesson = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
                        setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newLesson] }));
                      }} className="bg-brand-gold text-brand-main px-10 py-4 rounded-2xl text-sm font-black shadow-glow flex items-center gap-3">
                        <Plus size={20} /> إضافة محاضرة
                      </button>
                    </div>
                    
                    <div className="space-y-10">
                      {editingCourse.lessons?.map((lesson, lIdx) => (
                        <div key={lesson.id} className="bg-brand-main/50 p-8 md:p-12 rounded-[3.5rem] border border-white/5 space-y-10 group transition-all hover:border-brand-gold/20 shadow-2xl relative">
                          <div className="flex justify-between items-center gap-6">
                            <input type="text" value={lesson.title} onChange={(e) => {
                                const newLessons = [...(editingCourse.lessons || [])];
                                newLessons[lIdx].title = e.target.value;
                                setEditingCourse({...editingCourse, lessons: newLessons});
                            }} className="bg-transparent text-white font-black text-3xl outline-none focus:border-brand-gold border-b-2 border-white/5 pb-4 w-full" />
                            <button onClick={() => {
                              const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                              setEditingCourse({...editingCourse, lessons: newLessons});
                            }} className="p-4 bg-red-500/10 text-red-500 rounded-2xl"><Trash2 size={24}/></button>
                          </div>

                          {/* Content Types */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-brand-card/50 p-8 rounded-[2rem] border border-white/5 space-y-6">
                                <h5 className="text-white font-black text-sm flex items-center gap-3"><Video size={18} className="text-brand-gold" /> رابط فيديو المحاضرة (YouTube)</h5>
                                <input 
                                  type="text" 
                                  placeholder="https://youtube.com/embed/..." 
                                  value={lesson.contents?.find(c => c.type === 'video')?.url || ''} 
                                  onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    const videoIdx = newLessons[lIdx].contents.findIndex(c => c.type === 'video');
                                    if (videoIdx >= 0) {
                                      newLessons[lIdx].contents[videoIdx].url = e.target.value;
                                    } else {
                                      newLessons[lIdx].contents.push({ id: 'v' + Date.now(), type: 'video', title: 'فيديو المحاضرة', url: e.target.value });
                                    }
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }}
                                  className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-brand-gold"
                                />
                             </div>
                             <div className="bg-brand-card/50 p-8 rounded-[2rem] border border-white/5 space-y-6">
                                <h5 className="text-white font-black text-sm flex items-center gap-3"><FileDown size={18} className="text-brand-gold" /> رابط ملف الشرح (PDF)</h5>
                                <input 
                                  type="text" 
                                  placeholder="رابط ملف الـ PDF..." 
                                  value={lesson.contents?.find(c => c.type === 'pdf')?.url || ''} 
                                  onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    const pdfIdx = newLessons[lIdx].contents.findIndex(c => c.type === 'pdf');
                                    if (pdfIdx >= 0) {
                                      newLessons[lIdx].contents[pdfIdx].url = e.target.value;
                                    } else {
                                      newLessons[lIdx].contents.push({ id: 'pdf' + Date.now(), type: 'pdf', title: 'ملف الشرح', url: e.target.value });
                                    }
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }}
                                  className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-brand-gold"
                                />
                             </div>
                          </div>

                          {/* Quiz Builder Sub-Section */}
                          <div className="bg-brand-card p-10 rounded-[2.5rem] border border-brand-gold/10 space-y-8 relative overflow-hidden group/quiz">
                              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <h5 className="text-white font-black text-xl flex items-center gap-4"><Brain size={24} className="text-brand-gold" /> بنك أسئلة المحاضرة</h5>
                                <div className="flex gap-4">
                                  {!lesson.quiz ? (
                                    <button onClick={() => {
                                      const newQuiz: Quiz = { id: 'q' + Date.now(), title: 'اختبار المحاضرة', questions: [] };
                                      const newLessons = [...(editingCourse.lessons || [])];
                                      newLessons[lIdx].quiz = newQuiz;
                                      setEditingCourse({ ...editingCourse, lessons: newLessons });
                                    }} className="bg-brand-gold/10 text-brand-gold px-8 py-3 rounded-xl text-[11px] font-black border border-brand-gold/30">تفعيل الاختبار</button>
                                  ) : (
                                    <>
                                      <button onClick={() => { setTargetLessonIdx(lIdx); setIsBulkModalOpen(true); }} className="bg-brand-main text-white px-8 py-3 rounded-xl text-[11px] font-black border border-white/10 flex items-center gap-2 hover:bg-white/5 transition-all">
                                        <FileText size={16} /> استيراد من Notepad
                                      </button>
                                      <button onClick={() => {
                                        const newQuestion: Question = { id: 'qn' + Date.now(), text: 'أدخل السؤال هنا؟', options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'], correctOptionIndex: 0 };
                                        const newLessons = [...(editingCourse.lessons || [])];
                                        newLessons[lIdx].quiz!.questions.push(newQuestion);
                                        setEditingCourse({ ...editingCourse, lessons: newLessons });
                                      }} className="bg-brand-gold text-brand-main px-8 py-3 rounded-xl text-[11px] font-black shadow-glow flex items-center gap-2"><Plus size={16} /> سؤال يدوي</button>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {lesson.quiz && (
                                <div className="space-y-8">
                                  {lesson.quiz.questions.map((q, qIdx) => (
                                    <div key={q.id} className="bg-brand-main/40 p-8 rounded-[2rem] border border-white/5 space-y-6 relative group/question">
                                      <div className="flex gap-4">
                                        <textarea 
                                          value={q.text} 
                                          onChange={(e) => {
                                            const newLessons = [...(editingCourse.lessons || [])];
                                            newLessons[lIdx].quiz!.questions[qIdx].text = e.target.value;
                                            setEditingCourse({ ...editingCourse, lessons: newLessons });
                                          }}
                                          className="flex-1 bg-transparent text-white font-black text-lg outline-none border-b border-white/5 focus:border-brand-gold pb-2 no-scrollbar resize-none"
                                          placeholder="نص السؤال..."
                                          rows={1}
                                        />
                                        <button onClick={() => {
                                          const newLessons = [...(editingCourse.lessons || [])];
                                          newLessons[lIdx].quiz!.questions = newLessons[lIdx].quiz!.questions.filter((_, i) => i !== qIdx);
                                          setEditingCourse({ ...editingCourse, lessons: newLessons });
                                        }} className="text-red-400 p-2"><X size={20}/></button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {q.options.map((opt, oIdx) => (
                                          <div key={oIdx} className="flex items-center gap-4 group/opt">
                                            <button 
                                                onClick={() => {
                                                  const newLessons = [...(editingCourse.lessons || [])];
                                                  newLessons[lIdx].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                  setEditingCourse({ ...editingCourse, lessons: newLessons });
                                                }}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${q.correctOptionIndex === oIdx ? 'bg-brand-gold border-brand-gold text-brand-main' : 'border-white/10 group-hover/opt:border-brand-gold/50'}`}
                                            >
                                                {q.correctOptionIndex === oIdx && <Check size={14} strokeWidth={4} />}
                                            </button>
                                            <input 
                                              type="text" 
                                              value={opt} 
                                              onChange={(e) => {
                                                const newLessons = [...(editingCourse.lessons || [])];
                                                newLessons[lIdx].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                                setEditingCourse({ ...editingCourse, lessons: newLessons });
                                              }} 
                                              className={`flex-1 bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none transition-all ${q.correctOptionIndex === oIdx ? 'border-brand-gold/30 bg-brand-gold/5' : 'focus:border-brand-gold/20'}`} 
                                              placeholder={`الخيار ${oIdx + 1}`} 
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                 </section>
              </div>

              {/* Footer Save Area */}
              <div className="p-8 md:p-12 border-t border-white/5 bg-brand-main/50 backdrop-blur-3xl flex justify-end items-center">
                <button onClick={handleSaveCourse} className="w-full md:w-auto bg-brand-gold text-brand-main font-black px-20 py-6 rounded-[2rem] shadow-glow text-xl flex items-center justify-center gap-4 hover:scale-105 transition-all">
                  <Save size={24} /> حفظ المنهج والاختبارات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Import Sub-Modal */}
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-lg" onClick={() => setIsBulkModalOpen(false)}></div>
            <div className="relative w-full max-w-4xl bg-brand-card border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-scale-up space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black text-white flex items-center gap-4"><Upload size={32} className="text-brand-gold"/> استيراد جماعي للأسئلة</h3>
                    <button onClick={() => setIsBulkModalOpen(false)} className="text-brand-muted hover:text-white p-2 bg-white/5 rounded-xl"><X size={24}/></button>
                </div>
                
                <div className="bg-brand-gold/5 border border-brand-gold/20 p-6 rounded-2xl space-y-3">
                    <p className="text-brand-gold text-xs font-black uppercase tracking-widest flex items-center gap-2"><Info size={14}/> طريقة الاستخدام (تنسيق Notepad):</p>
                    <p className="text-brand-muted text-sm leading-relaxed font-bold">
                        اكتب كل سؤال في سطر جديد كالتالي:<br/>
                        <code className="text-white bg-white/5 p-1 rounded font-mono">نص السؤال؟ | خيار 1 | خيار 2 | خيار 3 | خيار 4 | رقم الإجابة (0-3)</code><br/>
                        <span className="text-xs mt-2 block text-brand-gold/70 italic">* لاحظ استخدام الرمز | للفصل بين السؤال والخيارات والإجابة.</span>
                    </p>
                </div>

                <textarea 
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="w-full h-80 bg-brand-main border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-brand-gold shadow-inner resize-none scrollbar-hide no-scrollbar"
                    placeholder="الصق الأسئلة هنا من Notepad..."
                />

                <div className="flex gap-4">
                    <button onClick={handleBulkImport} className="flex-1 bg-brand-gold text-brand-main font-black py-5 rounded-[1.5rem] shadow-glow hover:scale-[1.02] transition-all text-xl">بدء الاستيراد الآن</button>
                    <button onClick={() => setIsBulkModalOpen(false)} className="px-10 bg-white/5 text-white font-black py-5 rounded-[1.5rem] border border-white/10">إلغاء</button>
                </div>
            </div>
          </div>
        )}

      </main>

      {/* Modern Notification Toasts */}
      {notification && (
        <div className={`fixed bottom-10 left-10 z-[700] px-10 py-6 rounded-[2rem] animate-fade-in-up border backdrop-blur-3xl shadow-2xl flex items-center gap-5 font-black text-lg ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          {notification.type === 'success' ? <CheckCircle size={28} className="animate-bounce" /> : <AlertCircle size={28} />}
          {notification.text}
        </div>
      )}
    </div>
  );
};
