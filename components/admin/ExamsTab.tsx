
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { Brain, Search, GraduationCap, BarChart3, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';

interface Props {
  users: User[];
}

export const ExamsTab: React.FC<Props> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');

  const examResults = useMemo(() => {
    const results: any[] = [];
    users.forEach(u => {
      if (u.quizGrades) {
        Object.entries(u.quizGrades).forEach(([lessonId, score]) => {
          const scoreValue = score as number;
          results.push({
            userId: u.id,
            userName: u.name,
            phone: u.phone,
            lessonId,
            score: scoreValue,
            status: scoreValue >= 50 ? 'pass' : 'fail',
            date: new Date().toLocaleDateString('ar-EG') // Mock date or add to DB later
          });
        });
      }
    });
    return results;
  }, [users]);

  const stats = useMemo(() => {
    if (examResults.length === 0) return { avg: 0, passRate: 0 };
    const totalScore = examResults.reduce((acc, r) => acc + r.score, 0);
    const passCount = examResults.filter(r => r.score >= 50).length;
    return {
      avg: Math.round(totalScore / examResults.length),
      passRate: Math.round((passCount / examResults.length) * 100)
    };
  }, [examResults]);

  const filteredResults = useMemo(() => {
    return examResults.filter(r => {
      const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [examResults, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-lg">
               <BarChart3 size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Average Score</p>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.avg}%</h3>
            </div>
         </div>
         <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
               <UserCheck size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Pass Rate</p>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.passRate}%</h3>
            </div>
         </div>
         <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
               <Brain size={24} />
            </div>
            <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Attempts</p>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">{examResults.length}</h3>
            </div>
         </div>
      </div>

      {/* 2. Results Table */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden transition-colors">
         <div className="p-4 border-b border-gray-200 dark:border-[#333] flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1E1E1E] sticky top-0 z-10">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={20} className="text-gray-400" /> Student Performance
            </h3>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search student or phone..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#1E1E1E] transition-colors" 
                  />
               </div>
               <div className="flex bg-gray-100 dark:bg-[#252525] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
                  {['all', 'pass', 'fail'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setStatusFilter(f as any)} 
                      className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${statusFilter === f ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 dark:bg-[#252525] backdrop-blur-sm border-b border-gray-200 dark:border-[#333]">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exam / Lesson</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                {filteredResults.map((result, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{result.userName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{result.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#333] px-2 py-1 rounded border border-gray-200 dark:border-[#444]">
                        {result.lessonId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className={`text-sm font-black ${result.score >= 85 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{result.score}%</span>
                         {result.score >= 90 && <TrendingUp size={14} className="text-green-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${result.status === 'pass' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'}`}>
                        {result.status === 'pass' ? <UserCheck size={10} /> : <AlertCircle size={10} />}
                        {result.status === 'pass' ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-medium">{result.date}</td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                       <AlertCircle size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                       <p className="font-medium">No exam results found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
