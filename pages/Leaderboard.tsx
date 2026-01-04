
import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, TrendingUp, Minus, ArrowUp, ArrowDown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { user } = useApp();

  // Mock data representing a dataset
  const topStudents = [
    { rank: 1, name: 'Ahmed M. El-Qadi', xp: 12500, change: 'up' },
    { rank: 2, name: 'Sara Y. Mandour', xp: 11200, change: 'same' },
    { rank: 3, name: 'Mostafa Kamal', xp: 10800, change: 'down' },
    { rank: 4, name: 'Eman A. Radwan', xp: 9500, change: 'up' },
    { rank: 5, name: 'Mohamed Hamed', xp: 8200, change: 'same' },
    { rank: 6, name: 'Nour El-Sherif', xp: 7800, change: 'up' },
    { rank: 7, name: 'Khaled Waleed', xp: 7500, change: 'down' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <div>
            <h1 className="text-xl font-bold text-main">Performance Rankings</h1>
            <p className="text-xs text-muted mt-1">Weekly student engagement and experience points (XP) analysis.</p>
         </div>
         <div className="text-right">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Your Position</span>
            <div className="text-2xl font-bold text-[#F38020]">Top 15%</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Top Card */}
         <div className="md:col-span-2 cf-card">
            <div className="cf-header">
               <h3 className="text-sm font-bold text-main">Top Performers (This Week)</h3>
               <button className="text-xs text-[#0051C3] dark:text-[#68b5fb] hover:underline">View Full Report</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#FAFAFA] dark:bg-[#252525] border-b border-[#E5E5E5] dark:border-[#333]">
                     <tr>
                        <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider w-16">Rank</th>
                        <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider">Student Name</th>
                        <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider">Trend</th>
                        <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Total XP</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                     {topStudents.map((s) => (
                        <tr key={s.rank} className={`hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors ${user?.name.includes(s.name) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                           <td className="px-5 py-3 text-sm font-mono text-muted">
                              #{s.rank}
                           </td>
                           <td className="px-5 py-3">
                              <span className={`text-sm font-medium ${s.rank <= 3 ? 'text-main' : 'text-muted'}`}>{s.name}</span>
                           </td>
                           <td className="px-5 py-3">
                              {s.change === 'up' && <ArrowUp size={14} className="text-green-500" />}
                              {s.change === 'down' && <ArrowDown size={14} className="text-red-500" />}
                              {s.change === 'same' && <Minus size={14} className="text-gray-300" />}
                           </td>
                           <td className="px-5 py-3 text-right">
                              <span className="font-mono text-sm font-bold text-main">{s.xp.toLocaleString()}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Side Stats */}
         <div className="space-y-6">
            <div className="cf-card p-6">
               <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Your Metrics</h3>
               
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">Global Rank</span>
                        <span className="font-mono font-bold text-main">#142</span>
                     </div>
                     <div className="w-full bg-gray-100 dark:bg-[#333] h-1.5 rounded-sm overflow-hidden">
                        <div className="bg-[#0051C3] dark:bg-[#68b5fb] h-full w-[85%]"></div>
                     </div>
                  </div>

                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">Weekly Streak</span>
                        <span className="font-mono font-bold text-main">5 Days</span>
                     </div>
                     <div className="flex gap-1">
                        {[1,1,1,1,1,0,0].map((d, i) => (
                           <div key={i} className={`h-2 flex-1 rounded-[1px] ${d ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#333]'}`}></div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#FAFAFA] dark:bg-[#151515] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 text-center">
               <Trophy size={32} className="text-[#F38020] mx-auto mb-2 opacity-80" />
               <h4 className="text-sm font-bold text-main">Reach Top 100</h4>
               <p className="text-xs text-muted mt-1">
                  You need <strong>450 XP</strong> more to overtake the next rank. Complete 2 quizzes to achieve this.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
