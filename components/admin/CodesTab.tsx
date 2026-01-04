
import React, { useState, useMemo } from 'react';
import { ActivationCode } from '../../types';
import { db } from '../../firebase';
import { 
  Copy, Ticket, Trash2, Search, RefreshCw, 
  CheckCircle2, Clock, Calendar, Check
} from 'lucide-react';

interface Props {
  initialCodes: ActivationCode[];
}

export const CodesTab: React.FC<Props> = ({ initialCodes }) => {
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generate = async () => {
    if (count <= 0) return;
    setIsGenerating(true);
    const batch = db.batch();
    for (let i = 0; i < count; i++) {
      const code = 'NR-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const ref = db.collection("activation_codes").doc();
      batch.set(ref, { 
        id: ref.id, 
        code, 
        isUsed: false, 
        days, 
        createdAt: new Date().toISOString() 
      });
    }
    await batch.commit();
    setIsGenerating(false);
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteUsedCodes = async () => {
    if (!window.confirm('Are you sure you want to delete ALL used codes? This keeps the database clean.')) return;
    const used = initialCodes.filter(c => c.isUsed);
    const batch = db.batch();
    used.forEach(c => batch.delete(db.collection("activation_codes").doc(c.id)));
    await batch.commit();
  };

  const filteredCodes = useMemo(() => {
    return initialCodes.filter(c => {
      const matchesSearch = c.code.includes(codeSearch.toUpperCase());
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'used' ? c.isUsed : !c.isUsed);
      return matchesSearch && matchesStatus;
    });
  }, [initialCodes, codeSearch, statusFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {/* 1. Generator Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-sm transition-colors">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-lg">
                <Ticket size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Code Generator</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Create bulk access keys.</p>
              </div>
           </div>

           <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 block">Quantity</label>
                <input 
                  type="number" 
                  value={count} 
                  onChange={e => setCount(Number(e.target.value))} 
                  className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 block">Validity Period (Days)</label>
                <input 
                  type="number" 
                  value={days} 
                  onChange={e => setDays(Number(e.target.value))} 
                  className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all" 
                />
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={generate} 
                  disabled={isGenerating} 
                  className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={18}/> : <Ticket size={18}/>}
                  {isGenerating ? 'Generating...' : 'Generate Codes'}
                </button>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
           <h4 className="text-sm font-bold opacity-90 mb-4">Quick Actions</h4>
           <div className="flex justify-between items-center mb-6">
              <div>
                 <p className="text-3xl font-bold">{initialCodes.filter(c => !c.isUsed).length}</p>
                 <p className="text-xs opacity-60 uppercase tracking-wider font-medium">Available Codes</p>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div>
                 <p className="text-3xl font-bold">{initialCodes.filter(c => c.isUsed).length}</p>
                 <p className="text-xs opacity-60 uppercase tracking-wider font-medium">Used Codes</p>
              </div>
           </div>
           <button 
             onClick={deleteUsedCodes} 
             className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
           >
             <Trash2 size={16} /> Purge Used Codes
           </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col overflow-hidden h-[600px] transition-colors">
         <div className="p-4 border-b border-gray-200 dark:border-[#333] flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1E1E1E] sticky top-0 z-10">
            <div className="relative w-full sm:w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search code..." 
                 value={codeSearch} 
                 onChange={(e) => setCodeSearch(e.target.value)} 
                 className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900 transition-all" 
               />
            </div>
            <div className="flex bg-gray-100 dark:bg-[#252525] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
               {['all', 'unused', 'used'].map(f => (
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

         <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 dark:bg-[#252525] backdrop-blur-sm border-b border-gray-200 dark:border-[#333] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activation Code</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                {filteredCodes.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-3.5 font-mono text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">{c.code}</td>
                    <td className="px-6 py-3.5">
                       {c.isUsed ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                           <CheckCircle2 size={12}/> Used
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
                           <Ticket size={12}/> Available
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                       <Clock size={14} className="text-gray-400" /> {c.days} Days
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                       <span className="flex items-center gap-1"><Calendar size={14} className="text-gray-400"/> {new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {!c.isUsed && (
                        <button 
                          onClick={() => copyToClipboard(c.code, c.id)} 
                          className={`p-2 rounded-lg transition-all ${
                             copiedId === c.id 
                             ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' 
                             : 'text-gray-400 hover:bg-white dark:hover:bg-[#333] hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-[#444]'
                          }`}
                          title="Copy Code"
                        >
                          {copiedId === c.id ? <Check size={16}/> : <Copy size={16}/>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
