
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ActivationCode } from '../types';
import { db } from '../firebase';
import { 
  Shield, Activity, CreditCard, Users, 
  BarChart3, Layout, Ticket, GraduationCap, Globe, AlertTriangle
} from 'lucide-react';
import { UsersTab } from '../components/admin/UsersTab';
import { CodesTab } from '../components/admin/CodesTab';
import { CoursesTab } from '../components/admin/CoursesTab';
import { OverviewTab } from '../components/admin/OverviewTab';
import { ExamsTab } from '../components/admin/ExamsTab';
import { CommunitiesTab } from '../components/admin/CommunitiesTab';

export const Admin: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'codes' | 'courses' | 'exams' | 'communities'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [permissionError, setPermissionError] = useState(false);

  // Real-time Listeners
  useEffect(() => {
    if (!db) return;
    
    // Users Listener
    const unsubUsers = db.collection("users").limit(100).onSnapshot(
      s => setUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User)),
      err => {
        console.error("Users Listener Error:", err);
        if (err.code === 'permission-denied') setPermissionError(true);
      }
    );
    
    // Codes Listener
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(
      s => setCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode)),
      err => console.error("Codes Listener Error:", err)
    );

    setActivities([
       { message: 'System initialized', timestamp: new Date().toISOString() },
    ]);

    return () => { unsubUsers(); unsubCodes(); };
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Students & Users', icon: Users },
    { id: 'exams', label: 'Exam Results', icon: GraduationCap },
    { id: 'courses', label: 'Curriculum', icon: Layout },
    { id: 'codes', label: 'Access Codes', icon: Ticket },
    { id: 'communities', label: 'Communities', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] pb-20 transition-colors duration-200">
      {/* Professional Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-[#333] sticky top-0 z-30 px-6 py-4 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center shadow-lg transition-colors">
                <Shield size={20} strokeWidth={2.5} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Console</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">System Control & Management v2.4</p>
             </div>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-[#2C2C2C] p-1 rounded-lg border border-gray-200 dark:border-[#333] overflow-x-auto transition-colors">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                   activeTab === tab.id 
                   ? 'bg-white dark:bg-[#1E1E1E] text-[#F38020] shadow-sm' 
                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#333]'
                 }`}
               >
                 <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
         {permissionError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-2">
               <AlertTriangle size={24} className="shrink-0" />
               <div>
                  <p className="font-bold">خطأ في الأذونات (Permission Denied)</p>
                  <p className="text-sm">لم يتم تفعيل قواعد حماية Firestore بشكل صحيح أو أنك لا تملك صلاحية Admin. يرجى مراجعة ملف firebase.ts للتعليمات.</p>
               </div>
            </div>
         )}

         {activeTab === 'overview' && <OverviewTab users={users} courses={courses} activities={activities} />}
         {activeTab === 'users' && <UsersTab users={users} searchTerm="" />}
         {activeTab === 'exams' && <ExamsTab users={users} />}
         {activeTab === 'codes' && <CodesTab initialCodes={codes} />}
         {activeTab === 'courses' && <CoursesTab />}
         {activeTab === 'communities' && <CommunitiesTab />}
      </div>
    </div>
  );
};
