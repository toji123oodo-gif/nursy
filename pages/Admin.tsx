
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ActivationCode } from '../types';
import { db } from '../firebase';
import { 
  Users, Book, Ticket, Activity, Search, RefreshCw, 
  Trash2, Edit2, Plus, Check, X, Shield, Filter
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'codes'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  
  // States for Code Generation
  const [genCount, setGenCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").limit(50).onSnapshot(s => setUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User)));
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(50).onSnapshot(s => setCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode)));
    return () => { unsubUsers(); unsubCodes(); };
  }, []);

  const generateCodes = async () => {
    setIsGenerating(true);
    const batch = db.batch();
    for (let i = 0; i < genCount; i++) {
      const code = 'NR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const ref = db.collection("activation_codes").doc();
      batch.set(ref, { id: ref.id, code, isUsed: false, days: 30, createdAt: new Date().toISOString() });
    }
    await batch.commit();
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#333] pb-6">
        <div>
          <h1 className="text-xl font-bold text-main flex items-center gap-2">
            <Shield size={20} className="text-[#F38020]" />
            Platform Administration
          </h1>
          <p className="text-xs text-muted mt-1">Manage users, content access, and billing codes.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs text-muted bg-gray-100 dark:bg-[#333] px-2 py-1 rounded">v2.1.0 Stable</span>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex border-b border-[#E5E5E5] dark:border-[#333]">
         {['overview', 'users', 'codes'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
               activeTab === tab 
               ? 'border-[#F38020] text-[#F38020]' 
               : 'border-transparent text-muted hover:text-main'
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="cf-card p-6">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Total Users</h3>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold text-main">{users.length}</span>
                 <span className="text-xs text-green-600">Active</span>
              </div>
           </div>
           <div className="cf-card p-6">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Codes Generated</h3>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold text-main">{codes.length}</span>
                 <span className="text-xs text-muted">{codes.filter(c => c.isUsed).length} used</span>
              </div>
           </div>
           <div className="cf-card p-6">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">System Status</h3>
              <div className="flex items-center gap-2 text-green-600">
                 <Activity size={20} />
                 <span className="font-bold text-sm">Operational</span>
              </div>
           </div>
        </div>
      )}

      {/* Users Content */}
      {activeTab === 'users' && (
        <div className="cf-card">
           <div className="cf-header">
              <h3 className="text-sm font-bold text-main">User Directory</h3>
              <div className="relative w-64">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input type="text" placeholder="Search users..." className="cf-input pl-8" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#FAFAFA] dark:bg-[#252525] border-b border-[#E5E5E5] dark:border-[#333]">
                    <tr>
                       <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Name / ID</th>
                       <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Email</th>
                       <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Role</th>
                       <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Status</th>
                       <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#252525]">
                         <td className="px-5 py-3">
                            <p className="text-sm font-medium text-main">{u.name}</p>
                            <p className="text-[10px] text-muted font-mono">{u.id}</p>
                         </td>
                         <td className="px-5 py-3 text-sm text-main">{u.email}</td>
                         <td className="px-5 py-3 text-sm text-muted">{u.role || 'Student'}</td>
                         <td className="px-5 py-3">
                            <span className={`cf-badge ${u.subscriptionTier === 'pro' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                               {u.subscriptionTier.toUpperCase()}
                            </span>
                         </td>
                         <td className="px-5 py-3 text-right">
                            <button className="text-[#0051C3] dark:text-[#68b5fb] hover:underline text-xs">Edit</button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Codes Content */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
           <div className="cf-card p-6 flex items-end gap-4">
              <div className="flex-1 space-y-1">
                 <label className="text-xs font-semibold text-main">Quantity to Generate</label>
                 <input 
                   type="number" 
                   value={genCount} 
                   onChange={(e) => setGenCount(Number(e.target.value))} 
                   className="cf-input"
                 />
              </div>
              <button onClick={generateCodes} disabled={isGenerating} className="btn-primary">
                 {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} />}
                 Generate Codes
              </button>
           </div>

           <div className="cf-card">
              <div className="cf-header">
                 <h3 className="text-sm font-bold text-main">Activation Codes</h3>
                 <button className="text-xs text-red-600 hover:underline flex items-center gap-1">
                    <Trash2 size={12} /> Purge Used
                 </button>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                 <table className="w-full text-left">
                    <thead className="bg-[#FAFAFA] dark:bg-[#252525] border-b border-[#E5E5E5] dark:border-[#333] sticky top-0">
                       <tr>
                          <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Code</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Created At</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Status</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase">Validity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                       {codes.map(c => (
                         <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#252525]">
                            <td className="px-5 py-2 font-mono text-sm text-main">{c.code}</td>
                            <td className="px-5 py-2 text-xs text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-2">
                               {c.isUsed 
                                ? <span className="cf-badge bg-red-50 text-red-700 border-red-200">USED</span> 
                                : <span className="cf-badge bg-green-50 text-green-700 border-green-200">ACTIVE</span>
                               }
                            </td>
                            <td className="px-5 py-2 text-xs text-muted">{c.days} Days</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
