
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Mail, Phone, Save, Shield, 
  CreditCard, Bell, Key, History
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
     setIsSaving(true);
     await updateUserData(formData);
     setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <h1 className="text-xl font-bold text-main">Account Settings</h1>
         <p className="text-xs text-muted mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
         {/* Settings Sidebar */}
         <div className="w-full md:w-64 space-y-1">
            {[
               { id: 'general', label: 'General', icon: UserIcon },
               { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
               { id: 'security', label: 'Security', icon: Key },
               { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${
                     activeTab === tab.id 
                     ? 'bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb]' 
                     : 'text-muted hover:bg-gray-100 dark:hover:bg-[#2C2C2C] hover:text-main'
                  }`}
               >
                  <tab.icon size={16} /> {tab.label}
               </button>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="flex-1">
            {activeTab === 'general' && (
               <div className="cf-card max-w-2xl">
                  <div className="cf-header">
                     <h3 className="text-sm font-bold text-main">Profile Information</h3>
                  </div>
                  <div className="p-6 space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-xl font-bold text-muted">
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <button className="text-xs text-[#0051C3] dark:text-[#68b5fb] hover:underline font-medium">Change Avatar</button>
                           <p className="text-[10px] text-muted mt-1">JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-main">Full Name</label>
                           <input 
                              type="text" 
                              value={formData.name} 
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="cf-input" 
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-main">Phone Number</label>
                           <input 
                              type="text" 
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="cf-input" 
                           />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                           <label className="text-xs font-semibold text-main">Email Address</label>
                           <div className="cf-input bg-gray-50 dark:bg-[#252525] text-muted cursor-not-allowed flex items-center">
                              {user.email}
                              <Shield size={14} className="ml-auto text-green-600" />
                           </div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#333] flex justify-end">
                        <button 
                           onClick={handleSave} 
                           disabled={isSaving}
                           className="btn-primary"
                        >
                           {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTab === 'billing' && (
               <div className="cf-card max-w-2xl p-6 text-center text-muted">
                  <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Billing settings are managed in the Wallet section.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
