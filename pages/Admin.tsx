
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, SubscriptionTier, Course, Lesson, ContentItem, ContentType } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Trash2, Edit, BookOpen, 
  DollarSign, UserCheck, UserPlus, 
  Plus, Save, X, 
  Layout, BarChart3, 
  Zap, Bell, BellRing, MessageSquare, CreditCard, UserCog,
  BookMarked, Clock, Layers, User as UserIcon,
  Video, FileText, Music, Image as ImageIcon, File,
  Lock, Unlock, ChevronDown, ChevronUp
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminNotification {
  id: string;
  type: 'enrollment' | 'payment' | 'support';
  message: string;
  userName: string;
  timestamp: string;
  read: boolean;
}

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // States for Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Course Form State
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    title: '',
    instructor: '',
    price: 0,
    originalPrice: 0,
    subject: 'Anatomy',
    image: '',
    lessons: []
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student' as 'admin' | 'student',
    subscriptionTier: 'free' as SubscriptionTier
  });

  // Fetch Users
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Real-time Notifications for Admin
  useEffect(() => {
    const q = query(collection(db, "admin_notifications"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes: AdminNotification[] = [];
      snapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as AdminNotification);
      });
      setAdminNotifications(notes);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = adminNotifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    const batch = writeBatch(db);
    adminNotifications.filter(n => !n.read).forEach(n => {
      batch.update(doc(db, "admin_notifications", n.id), { read: true });
    });
    await batch.commit();
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Stats Calculation
  const stats = useMemo(() => {
    const now = new Date();
    const activeSubs = allUsers.filter(u => u.subscriptionTier === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) > now);
    const totalIncome = activeSubs.length * 50;
    return {
      totalStudents: allUsers.length,
      activePro: activeSubs.length,
      income: totalIncome,
    };
  }, [allUsers]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
        await setDoc(doc(db, "users", editingUser.id), editingUser, { merge: true });
        showNotification('success', 'تم تحديث البيانات بنجاح');
        setIsUserModalOpen(false);
    } catch (err) {
        showNotification('error', 'فشل التحديث');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || (!newUser.email && !newUser.phone)) {
      showNotification('error', 'يرجى إكمال البيانات الأساسية');
      return;
    }
    try {
        const userRef = doc(collection(db, "users"));
        await setDoc(userRef, {
            ...newUser,
            id: userRef.id,
            joinedAt: new Date().toISOString(),
            completedLessons: []
        });
        showNotification('success', 'تمت إضافة الطالب بنجاح');
        setIsAddUserModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', role: 'student', subscriptionTier: 'free' });
    } catch (err) {
        showNotification('error', 'فشل إضافة الطالب');
    }
  };

  // Course CRUD Handlers
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.instructor) {
        showNotification('error', 'يرجى إدخال اسم الكورس والمحاضر');
        return;
    }

    try {
      if (editingCourseId) {
        await updateCourse({ ...courseForm, id: editingCourseId } as Course);
        showNotification('success', 'تم تحديث الكورس بنجاح');
      } else {
        const newId = `c${Date.now()}`;
        await addCourse({ ...courseForm, id: newId } as Course);
        showNotification('success', 'تمت إضافة الكورس بنجاح');
      }
      setIsCourseModalOpen(false);
      setEditingCourseId(null);
    } catch (err) {
      showNotification('error', 'فشل حفظ الكورس');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الكورس بجميع محاضراته؟')) return;
    try {
      await deleteCourse(id);
      showNotification('success', 'تم حذف الكورس بنجاح');
    } catch (err) {
      showNotification('error', 'فشل حذف الكورس');
    }
  };

  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({ ...course });
    } else {
      setEditingCourseId(null);
      setCourseForm({
        title: '',
        instructor: '',
        price: 0,
        originalPrice: 0,
        subject: 'Anatomy',
        image: '',
        lessons: []
      });
    }
    setIsCourseModalOpen(true);
  };

  const filteredUsers = allUsers.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || "").includes(searchTerm)
  );

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'audio': return <Music size={16} />;
      case 'document': return <File size={16} />;
      case 'image': return <ImageIcon size={16} />;
      default: return <File size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-gold/10 rounded-3xl border border-brand-gold/20 relative group cursor-pointer" onClick={() => { setShowNotifications(!showNotifications); if(unreadCount > 0) markAllAsRead(); }}>
                    <ShieldAlert size={32} className="text-brand-gold" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-main animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">إدارة المنصة</h1>
                    <p className="text-brand-muted text-sm">أهلاً بك يا أدمن، البيانات يتم تحديثها لحظياً</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 bg-brand-card p-2 rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto">
                <TabButton id="overview" label="الرئيسية" icon={Layout} />
                <TabButton id="users" label="الطلاب" icon={Users} />
                <TabButton id="courses" label="الكورسات" icon={BookOpen} />
                <TabButton id="analytics" label="الإحصائيات" icon={BarChart3} />
                
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-4 rounded-2xl transition-all relative ${showNotifications ? 'bg-brand-gold text-brand-main' : 'bg-brand-card text-brand-muted'}`}
                >
                  {unreadCount > 0 ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
                </button>
            </div>
        </header>

        {/* Notifications Sidebar */}
        {showNotifications && (
          <div className="fixed inset-y-0 left-0 w-80 md:w-96 bg-brand-card border-r border-white/10 z-[150] shadow-2xl animate-fade-in-right flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Bell size={20} className="text-brand-gold" /> الإشعارات
              </h3>
              <button onClick={() => setShowNotifications(false)} className="text-brand-muted hover:text-white p-2">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {adminNotifications.length === 0 ? (
                <div className="text-center py-20 text-brand-muted">
                  <Bell size={48} className="mx-auto mb-4 opacity-20" />
                  <p>لا توجد تنبيهات جديدة</p>
                </div>
              ) : (
                adminNotifications.map((note) => (
                  <div key={note.id} className={`p-4 rounded-2xl border transition-all ${note.read ? 'bg-white/5 border-white/5' : 'bg-brand-gold/5 border-brand-gold/20 shadow-glow'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        note.type === 'enrollment' ? 'bg-blue-500/10 text-blue-500' :
                        note.type === 'payment' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {note.type === 'enrollment' ? <UserPlus size={18} /> : 
                         note.type === 'payment' ? <CreditCard size={18} /> : <MessageSquare size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{note.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-brand-muted font-mono">{new Date(note.timestamp).toLocaleString('ar-EG')}</span>
                          {!note.read && <span className="w-2 h-2 bg-brand-gold rounded-full"></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {notification && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl animate-fade-in-up border backdrop-blur-md ${
                notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'
            }`}>
                <div className="flex items-center gap-3">
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-bold">{notification.text}</span>
                </div>
            </div>
        )}

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">إجمالي الطلاب</p>
                        <h3 className="text-4xl font-black text-white">{stats.totalStudents}</h3>
                    </div>
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><UserCheck size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">المشتركين PRO</p>
                        <h3 className="text-4xl font-black text-green-400">{stats.activePro}</h3>
                    </div>
                    <div className="bg-brand-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={80} /></div>
                        <p className="text-brand-muted text-sm font-bold mb-2">الدخل الشهري المتوقع</p>
                        <h3 className="text-4xl font-black text-brand-gold">{stats.income} <span className="text-sm">ج.م</span></h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-brand-card border border-white/5 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Zap className="text-brand-gold" size={24} />
                          تفعيل سريع للطلاب
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4">
                          <input 
                              type="text" 
                              placeholder="ابحث برقم الهاتف أو الإيميل..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="flex-1 bg-brand-main border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold transition-all"
                          />
                          <button 
                              onClick={() => {
                                 const target = allUsers.find(u => u.phone === searchTerm || u.email === searchTerm);
                                 if (target) {
                                    setEditingUser(target);
                                    setIsUserModalOpen(true);
                                 } else {
                                    showNotification('error', 'الطالب غير موجود');
                                 }
                              }}
                              className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-2xl hover:bg-brand-goldHover shadow-glow transition-all"
                          >
                              بحث وتفعيل
                          </button>
                      </div>
                   </div>

                   <div className="bg-brand-card border border-white/5 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold text-white mb-6">آخر النشاطات</h3>
                      <div className="space-y-4">
                        {adminNotifications.slice(0, 4).map(note => (
                          <div key={note.id} className="flex items-center gap-3 text-sm">
                            <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                            <span className="text-white font-bold">{note.userName}</span>
                            <span className="text-brand-muted">{note.message}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden animate-fade-in shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-white">قائمة الطلاب</h3>
                        <button 
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="bg-brand-gold text-brand-main px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-brand-goldHover transition-all shadow-glow"
                        >
                            <UserPlus size={16} /> إضافة طالب جديد
                        </button>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                        <input 
                            type="text" 
                            placeholder="ابحث بالاسم، الإيميل أو الهاتف..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white outline-none focus:border-brand-gold transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-brand-main/50 text-brand-muted text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-6">الطالب</th>
                                <th className="px-8 py-6">التواصل</th>
                                <th className="px-8 py-6">الرتبة</th>
                                <th className="px-8 py-6">الباقة</th>
                                <th className="px-8 py-6">الحالة</th>
                                <th className="px-8 py-6 text-left">تحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold">
                                                {u.name?.charAt(0)}
                                            </div>
                                            <span className="text-white font-bold">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-white text-xs">{u.email}</p>
                                        <p className="text-brand-muted text-xs">{u.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${u.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {u.role === 'admin' ? 'أدمن' : 'طالب'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-brand-muted'}`}>
                                            {u.subscriptionTier === 'pro' ? 'PREMIUM' : 'FREE'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.subscriptionTier === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) > new Date() ? (
                                            <CheckCircle className="text-green-500" size={18} />
                                        ) : (
                                            <XCircle className="text-brand-muted" size={18} />
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <button 
                                            onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }}
                                            className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-main rounded-lg transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
            <div className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden animate-fade-in shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-white">إدارة المحتوى الدراسي</h3>
                        <button 
                            onClick={() => openCourseModal()}
                            className="bg-brand-gold text-brand-main px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-brand-goldHover transition-all shadow-glow"
                        >
                            <Plus size={18} /> إضافة كورس جديد
                        </button>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                        <input 
                            type="text" 
                            placeholder="ابحث عن كورس..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-main border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white outline-none focus:border-brand-gold transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-brand-main/50 border border-white/5 rounded-[2.5rem] p-6 group hover:border-brand-gold/30 transition-all flex flex-col">
                            <div className="relative h-48 rounded-3xl overflow-hidden mb-6">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-brand-main/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-brand-gold border border-brand-gold/20">
                                    {course.subject}
                                </div>
                            </div>
                            <h4 className="text-xl font-black text-white mb-2 line-clamp-1">{course.title}</h4>
                            <p className="text-brand-muted text-sm mb-6 flex items-center gap-2">
                                <UserIcon size={14} className="text-brand-gold" />
                                {course.instructor}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-brand-muted font-bold uppercase">السعر</p>
                                        <p className="text-lg font-black text-white">{course.price} ج.م</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/5"></div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-brand-muted font-bold uppercase">المحاضرات</p>
                                        <p className="text-lg font-black text-white">{course.lessons?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => openCourseModal(course)}
                                        className="p-3 bg-white/5 hover:bg-brand-gold hover:text-brand-main rounded-xl transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Advanced Course Management Modal */}
        {isCourseModalOpen && (
            <div className="fixed inset-0 z-[300] bg-brand-main/90 backdrop-blur-2xl flex items-center justify-center p-4">
                <div className="bg-brand-card border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-scale-up flex flex-col">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between shrink-0">
                        <h3 className="text-3xl font-black text-white flex items-center gap-4">
                            <BookMarked className="text-brand-gold" size={32} />
                            {editingCourseId ? 'تعديل الكورس' : 'إضافة كورس جديد'}
                        </h3>
                        <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-2 rounded-xl"><X size={24}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 space-y-10">
                        {/* Course Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">عنوان الكورس</label>
                                    <input 
                                        className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all" 
                                        value={courseForm.title} 
                                        onChange={e => setCourseForm({...courseForm, title: e.target.value})} 
                                        placeholder="مثال: Anatomy - علم التشريح"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">المحاضر</label>
                                    <input 
                                        className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all" 
                                        value={courseForm.instructor} 
                                        onChange={e => setCourseForm({...courseForm, instructor: e.target.value})} 
                                        placeholder="اسم الدكتور"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">السعر الحالي</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all" 
                                            value={courseForm.price} 
                                            onChange={e => setCourseForm({...courseForm, price: Number(e.target.value)})} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">السعر الأصلي</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all" 
                                            value={courseForm.originalPrice} 
                                            onChange={e => setCourseForm({...courseForm, originalPrice: Number(e.target.value)})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">المادة العلمية</label>
                                    <select 
                                        className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all"
                                        value={courseForm.subject}
                                        onChange={e => setCourseForm({...courseForm, subject: e.target.value})}
                                    >
                                        <option value="Anatomy">Anatomy</option>
                                        <option value="Physiology">Physiology</option>
                                        <option value="Microbiology">Microbiology</option>
                                        <option value="Adult Nursing">Adult Nursing</option>
                                        <option value="Health">Health Assessment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-brand-muted font-black uppercase tracking-widest mb-3">رابط الصورة (URL)</label>
                                    <input 
                                        className="w-full bg-brand-main border border-white/5 rounded-2xl p-4 text-white focus:border-brand-gold outline-none transition-all" 
                                        value={courseForm.image} 
                                        onChange={e => setCourseForm({...courseForm, image: e.target.value})} 
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {courseForm.image && (
                                        <div className="mt-4 rounded-2xl overflow-hidden h-32 border border-white/10">
                                            <img src={courseForm.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Lessons & Content Management */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h4 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Layers className="text-brand-gold" />
                                    المحاضرات والمحتوى التفصيلي
                                </h4>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const newLesson: Lesson = {
                                            id: `l${Date.now()}`,
                                            title: 'عنوان المحاضرة الجديدة',
                                            isLocked: true,
                                            contents: [],
                                            duration: '45:00'
                                        };
                                        setCourseForm({...courseForm, lessons: [...(courseForm.lessons || []), newLesson]});
                                    }}
                                    className="bg-brand-gold text-brand-main px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-glow"
                                >
                                    <Plus size={18} /> إضافة محاضرة
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {courseForm.lessons?.map((lesson, lessonIdx) => (
                                    <div key={lesson.id} className="bg-brand-main/40 border border-white/10 rounded-[2.5rem] p-8 space-y-8 group transition-all hover:border-brand-gold/20">
                                        {/* Lesson Header Info */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-card flex items-center justify-center text-brand-gold font-black border border-white/10 shadow-inner">
                                                {lessonIdx + 1}
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] text-brand-muted font-bold mb-1 uppercase">عنوان المحاضرة</label>
                                                    <input 
                                                        className="w-full bg-transparent border-b border-white/10 text-white font-bold py-1 focus:border-brand-gold outline-none transition-all"
                                                        value={lesson.title}
                                                        onChange={e => {
                                                            const updated = [...(courseForm.lessons || [])];
                                                            updated[lessonIdx].title = e.target.value;
                                                            setCourseForm({...courseForm, lessons: updated});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-brand-muted font-bold mb-1 uppercase">المدة (دقيقة)</label>
                                                    <input 
                                                        className="w-full bg-transparent border-b border-white/10 text-white font-mono py-1 focus:border-brand-gold outline-none transition-all"
                                                        value={lesson.duration}
                                                        onChange={e => {
                                                            const updated = [...(courseForm.lessons || [])];
                                                            updated[lessonIdx].duration = e.target.value;
                                                            setCourseForm({...courseForm, lessons: updated});
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...(courseForm.lessons || [])];
                                                        updated[lessonIdx].isLocked = !updated[lessonIdx].isLocked;
                                                        setCourseForm({...courseForm, lessons: updated});
                                                    }}
                                                    className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${lesson.isLocked ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}
                                                >
                                                    {lesson.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                                                    {lesson.isLocked ? 'مغلقة' : 'متاحة'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = (courseForm.lessons || []).filter((_, i) => i !== lessonIdx);
                                                        setCourseForm({...courseForm, lessons: updated});
                                                    }}
                                                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Nested Content Manager */}
                                        <div className="bg-brand-card/50 rounded-3xl p-6 border border-white/5 space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h5 className="text-sm font-black text-white/80 flex items-center gap-2">
                                                    <FileText size={14} className="text-brand-gold" />
                                                    محتويات المحاضرة (فيديوهات، ملفات، إلخ)
                                                </h5>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const newContent: ContentItem = {
                                                            id: `c${Date.now()}`,
                                                            type: 'video',
                                                            title: 'عنوان المحتوى',
                                                            url: ''
                                                        };
                                                        const updated = [...(courseForm.lessons || [])];
                                                        updated[lessonIdx].contents = [...(updated[lessonIdx].contents || []), newContent];
                                                        setCourseForm({...courseForm, lessons: updated});
                                                    }}
                                                    className="text-[10px] font-black bg-white/5 hover:bg-brand-gold hover:text-brand-main text-brand-gold px-3 py-1.5 rounded-lg border border-brand-gold/20 transition-all flex items-center gap-1.5"
                                                >
                                                    <Plus size={12} /> إضافة رابط محتوى
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {lesson.contents?.length === 0 ? (
                                                    <p className="text-center py-4 text-xs text-brand-muted italic">لا يوجد محتوى مضاف بعد</p>
                                                ) : (
                                                    lesson.contents?.map((item, contentIdx) => (
                                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-brand-main/30 p-4 rounded-2xl border border-white/5 group/content">
                                                            <div className="md:col-span-2">
                                                                <label className="block text-[8px] text-brand-muted font-bold mb-1 uppercase">النوع</label>
                                                                <select 
                                                                    className="w-full bg-brand-card border border-white/10 rounded-xl p-2 text-[10px] text-white outline-none focus:border-brand-gold"
                                                                    value={item.type}
                                                                    onChange={e => {
                                                                        const updated = [...(courseForm.lessons || [])];
                                                                        updated[lessonIdx].contents[contentIdx].type = e.target.value as ContentType;
                                                                        setCourseForm({...courseForm, lessons: updated});
                                                                    }}
                                                                >
                                                                    <option value="video">فيديو</option>
                                                                    <option value="pdf">PDF</option>
                                                                    <option value="audio">صوت</option>
                                                                    <option value="document">مستند</option>
                                                                    <option value="image">صورة</option>
                                                                </select>
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <label className="block text-[8px] text-brand-muted font-bold mb-1 uppercase">الاسم</label>
                                                                <input 
                                                                    className="w-full bg-brand-card border border-white/10 rounded-xl p-2 text-[10px] text-white outline-none focus:border-brand-gold"
                                                                    placeholder="مثال: شرح الجهاز التنفسي"
                                                                    value={item.title}
                                                                    onChange={e => {
                                                                        const updated = [...(courseForm.lessons || [])];
                                                                        updated[lessonIdx].contents[contentIdx].title = e.target.value;
                                                                        setCourseForm({...courseForm, lessons: updated});
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="md:col-span-6">
                                                                <label className="block text-[8px] text-brand-muted font-bold mb-1 uppercase">رابط المحتوى (URL)</label>
                                                                <input 
                                                                    className="w-full bg-brand-card border border-white/10 rounded-xl p-2 text-[10px] text-white outline-none focus:border-brand-gold font-mono"
                                                                    placeholder="https://..."
                                                                    value={item.url}
                                                                    onChange={e => {
                                                                        const updated = [...(courseForm.lessons || [])];
                                                                        updated[lessonIdx].contents[contentIdx].url = e.target.value;
                                                                        setCourseForm({...courseForm, lessons: updated});
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = [...(courseForm.lessons || [])];
                                                                        updated[lessonIdx].contents = updated[lessonIdx].contents.filter((_, i) => i !== contentIdx);
                                                                        setCourseForm({...courseForm, lessons: updated});
                                                                    }}
                                                                    className="w-full p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 border-t border-white/10 shrink-0 flex items-center justify-end gap-4 bg-brand-main/40">
                        <button 
                            type="button"
                            onClick={() => setIsCourseModalOpen(false)}
                            className="px-8 py-4 rounded-2xl text-brand-muted hover:text-white font-bold transition-all"
                        >
                            إلغاء
                        </button>
                        <button 
                            onClick={handleSaveCourse}
                            className="bg-brand-gold text-brand-main font-black px-12 py-4 rounded-2xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center gap-3"
                        >
                            <Save size={20} />
                            حفظ البيانات والدروس
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* User Modals (Add & Edit) - Same as existing but ensuring smooth integration */}
        {isAddUserModalOpen && (
            <div className="fixed inset-0 z-[200] bg-brand-main/80 backdrop-blur-xl flex items-center justify-center p-4">
                <div className="bg-brand-card border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-scale-up">
                    <button onClick={() => setIsAddUserModalOpen(false)} className="absolute top-6 left-6 text-brand-muted hover:text-white"><X size={24}/></button>
                    <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                        <UserPlus className="text-brand-gold" /> إضافة طالب جديد
                    </h3>
                    
                    <form onSubmit={handleCreateUser} className="space-y-6">
                        <div>
                            <label className="block text-xs text-brand-muted font-bold mb-2">اسم الطالب</label>
                            <input 
                                className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white" 
                                placeholder="الاسم بالكامل"
                                value={newUser.name} 
                                onChange={e => setNewUser({...newUser, name: e.target.value})} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">البريد الإلكتروني</label>
                                <input 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white" 
                                    placeholder="example@mail.com"
                                    value={newUser.email} 
                                    onChange={e => setNewUser({...newUser, email: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">رقم الهاتف</label>
                                <input 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white" 
                                    placeholder="01XXXXXXXXX"
                                    value={newUser.phone} 
                                    onChange={e => setNewUser({...newUser, phone: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">الرتبة</label>
                                <select 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                    value={newUser.role}
                                    onChange={e => setNewUser({...newUser, role: e.target.value as 'admin' | 'student'})}
                                >
                                    <option value="student">طالب</option>
                                    <option value="admin">أدمن</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">الباقة</label>
                                <select 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                    value={newUser.subscriptionTier}
                                    onChange={e => setNewUser({...newUser, subscriptionTier: e.target.value as SubscriptionTier})}
                                >
                                    <option value="free">FREE</option>
                                    <option value="pro">PRO</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-3">
                             حفظ البيانات
                        </button>
                    </form>
                </div>
            </div>
        )}

        {isUserModalOpen && editingUser && (
            <div className="fixed inset-0 z-[200] bg-brand-main/80 backdrop-blur-xl flex items-center justify-center p-4">
                <div className="bg-brand-card border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-scale-up">
                    <button onClick={() => setIsUserModalOpen(false)} className="absolute top-6 left-6 text-brand-muted hover:text-white"><X size={24}/></button>
                    <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                        <UserCog className="text-brand-gold" /> تعديل بيانات الطالب
                    </h3>
                    
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div>
                            <label className="block text-xs text-brand-muted font-bold mb-2">اسم الطالب</label>
                            <input 
                                className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white" 
                                value={editingUser.name} 
                                onChange={e => setEditingUser({...editingUser, name: e.target.value})} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">الرتبة</label>
                                <select 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                    value={editingUser.role || 'student'}
                                    onChange={e => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'student'})}
                                >
                                    <option value="student">طالب</option>
                                    <option value="admin">أدمن</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-brand-muted font-bold mb-2">الباقة</label>
                                <select 
                                    className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                    value={editingUser.subscriptionTier}
                                    onChange={e => setEditingUser({...editingUser, subscriptionTier: e.target.value as SubscriptionTier})}
                                >
                                    <option value="free">FREE</option>
                                    <option value="pro">PRO</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-brand-muted font-bold mb-2">تاريخ انتهاء الاشتراك</label>
                            <input 
                                type="date"
                                className="w-full bg-brand-main border border-white/10 rounded-2xl p-4 text-white"
                                value={editingUser.subscriptionExpiry ? new Date(editingUser.subscriptionExpiry).toISOString().split('T')[0] : ''}
                                onChange={e => setEditingUser({...editingUser, subscriptionExpiry: new Date(e.target.value).toISOString()})}
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:bg-brand-goldHover transition-all flex items-center justify-center gap-3">
                            <Save size={20} /> حفظ التعديلات
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
