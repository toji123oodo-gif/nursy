
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ActivationCode } from '../types';
import { db } from '../firebase';
import { 
  Shield, Activity, CreditCard, Users, 
  BarChart3, Layout, Ticket
} from 'lucide-react';
import { UsersTab } from '../components/admin/UsersTab';
import { CodesTab } from '../components/admin/CodesTab';
import { CoursesTab } from '../components/admin/CoursesTab';
import { OverviewTab } from '../components/admin/OverviewTab';

export const Admin: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'codes' | 'courses'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Real-time Listeners
  useEffect(() => {
    if (!db) return;
    
    // Users Listener
    const unsubUsers = db.collection("users").limit(100).onSnapshot(s => 
      setUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User))
    );
    
    // Codes Listener
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(s => 
      setCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode))
    );

    // Mock Activities (or real if you have a collection)
    setActivities([
       { message: 'New user registered: Sara Ahmed', timestamp: new Date().toISOString() },
       { message: 'Code NR-8821 activated by Mohamed Ali', timestamp: new Date(Date.now() - 3600000).toISOString() },
       { message: 'System Backup completed', timestamp: new Date(Date.now() - 7200000).toISOString() },
    ]);

    return () => { unsubUsers(); unsubCodes(); };
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Students & Users', icon: Users },
    { id: 'courses', label: 'Curriculum & Content', icon: Layout },
    { id: 'codes', label: 'Access Codes', icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] pb-20">
      {/* Professional Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-[#333] sticky top-0 z-30 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center shadow-lg">
                <Shield size={20} strokeWidth={2.5} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Console</h1>
                <p className="text-xs text-gray-500 font-medium">System Control & Management v2.4</p>
             </div>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-[#2C2C2C] p-1 rounded-lg border border-gray-200 dark:border-[#333] overflow-x-auto">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                   activeTab === tab.id 
                   ? 'bg-white dark:bg-[#1E1E1E] text-[#F38020] shadow-sm' 
                   : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#333]'
                 }`}
               >
                 <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
         {activeTab === 'overview' && <OverviewTab users={users} courses={courses} activities={activities} />}
         {activeTab === 'users' && <UsersTab users={users} searchTerm="" />}
         {activeTab === 'codes' && <CodesTab initialCodes={codes} />}
         {activeTab === 'courses' && <CoursesTab />}
      </div>
    </div>
  );
};
