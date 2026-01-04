
import React, { useMemo } from 'react';
import { Users, UserCheck, DollarSign, Activity, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { User, Course } from '../../types';

interface Props {
  users: User[];
  courses: Course[];
  activities: any[];
}

export const OverviewTab: React.FC<Props> = ({ users, courses, activities }) => {
  const stats = useMemo(() => {
    const activePro = users.filter(u => u.subscriptionTier === 'pro').length;
    const totalIncome = activePro * 50;
    
    return [
      { label: 'إجمالي الطلاب', val: users.length, icon: Users, trend: '+12%' },
      { label: 'مشتركي PRO', val: activePro, icon: UserCheck, trend: '+5%' },
      { label: 'الإيرادات المقدرة', val: `${totalIncome} ج.م`, icon: DollarSign, trend: '0%' },
      { label: 'نسبة التفاعل', val: '85%', icon: Activity, trend: '+8%' },
    ];
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1E1E1E] p-5 rounded-lg border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#252525] p-2 rounded-md">
                 <s.icon size={20} />
               </div>
               <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                 <ArrowUpRight size={10} /> {s.trend}
               </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{s.val}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-sm p-6 transition-colors">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">تحليل المشاهدات</h3>
              <select className="bg-gray-50 dark:bg-[#252525] text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-[#333] rounded-md px-3 py-1.5 outline-none focus:border-brand-blue">
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
              </select>
           </div>
           <div className="flex items-end justify-between h-48 gap-2 px-2">
              {[40, 70, 55, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-t-sm relative overflow-hidden transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40" style={{ height: `${h}%` }}></div>
                   <span className="text-xs text-gray-400 font-medium">{['S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-sm p-6 transition-colors">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">سجل النشاط</h3>
           <div className="space-y-4">
             {activities.length > 0 ? activities.map((act, i) => (
               <div key={i} className="flex items-start gap-3">
                 <div className="mt-1 text-gray-400"><Clock size={14} /></div>
                 <div>
                   <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{act.message}</p>
                   <p className="text-xs text-gray-400 mt-1">{new Date(act.timestamp).toLocaleTimeString('ar-EG')}</p>
                 </div>
               </div>
             )) : (
               <div className="text-center py-8 text-gray-400 text-sm">لا توجد نشاطات حديثة</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
