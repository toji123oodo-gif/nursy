
import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, Link as LinkIcon, Video, Send, 
  CheckCircle2, Info, AlertTriangle, Image as ImageIcon, X, 
  Paperclip, FolderOpen 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UploadResource: React.FC = () => {
  const { user } = useApp();
  const [type, setType] = useState<'pdf' | 'video' | 'link'>('pdf');
  const [formData, setFormData] = useState({ title: '', category: 'General', description: '', url: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission with delay
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ title: '', category: 'General', description: '', url: '' });
        setSelectedFile(null);
    }, 2500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const categories = ['Anatomy', 'Physiology', 'Microbiology', 'Nursing Foundations', 'Community Health', 'General'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4">
       
       {/* Modern Hero Header */}
       <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] dark:from-black dark:to-[#1a1a1a] rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F38020] rounded-full blur-[120px] opacity-20 pointer-events-none -mr-20 -mt-20 animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-orange-400">
                   <UploadCloud size={14} /> مركز المساهمات
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                   شارك المعرفة <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">اصنع الأثر 🚀</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
                   مساهمتك بملخص أو فيديو قد تكون السبب في نجاح زميل لك. ارفع ملفاتك الآن وكن جزءاً من مجتمع نيرسي التعليمي.
                </p>
             </div>
             {/* Decorative 3D-like Icon */}
             <div className="hidden md:flex relative group">
                <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="w-32 h-32 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
                   <FolderOpen size={56} className="text-orange-500 drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white dark:bg-[#222] rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500">
                   <FileText size={24} className="text-blue-500" />
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
             <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#333] rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>

                {submitted ? (
                   <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in duration-300">
                      <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                         <CheckCircle2 size={48} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تم الإرسال بنجاح!</h3>
                         <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">شكراً لمساهمتك القيمة. سيقوم فريقنا بمراجعة المحتوى ونشره قريباً.</p>
                      </div>
                      <button 
                        onClick={() => setSubmitted(false)} 
                        className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                         رفع مساهمة أخرى
                      </button>
                   </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* 1. Type Selection Cards */}
                      <div>
                         <label className="text-sm font-bold text-gray-900 dark:text-white mb-4 block flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> نوع المحتوى
                         </label>
                         <div className="grid grid-cols-3 gap-4">
                            {[
                               { id: 'pdf', icon: FileText, label: 'ملف PDF', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
                               { id: 'video', icon: Video, label: 'فيديو', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                               { id: 'link', icon: LinkIcon, label: 'رابط خارجي', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' }
                            ].map(t => (
                               <button
                                 key={t.id}
                                 type="button"
                                 onClick={() => { setType(t.id as any); setSelectedFile(null); }}
                                 className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${
                                    type === t.id 
                                    ? `border-${t.color.split('-')[1]}-500 bg-white dark:bg-[#252525] shadow-md` 
                                    : 'border-transparent bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                                 }`}
                               >
                                  <div className={`mb-3 p-3 rounded-full ${t.bg} ${t.color} transition-transform group-hover:scale-110 duration-300`}>
                                     <t.icon size={24} />
                                  </div>
                                  <span className={`text-sm font-bold ${type === t.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{t.label}</span>
                                  
                                  {type === t.id && (
                                     <div className="absolute top-2 right-2 text-green-500">
                                        <CheckCircle2 size={18} fill="currentColor" className="text-white dark:text-[#1E1E1E]" />
                                     </div>
                                  )}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* 2. File Upload Zone (Conditional) */}
                      {type !== 'link' && (
                         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-bold text-gray-900 dark:text-white mb-4 block flex items-center gap-2">
                               <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span> رفع الملف
                            </label>
                            
                            {!selectedFile ? (
                               <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="border-2 border-dashed border-gray-300 dark:border-[#444] hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                               >
                                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept={type === 'video' ? 'video/*' : '.pdf,.doc,.docx'} />
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-[#2C2C2C] rounded-full flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300 mb-4 shadow-inner">
                                     <UploadCloud size={32} />
                                  </div>
                                  <p className="text-base font-bold text-gray-700 dark:text-gray-200">اضغط لرفع الملف أو اسحبه هنا</p>
                                  <p className="text-xs text-gray-400 mt-2">
                                     {type === 'video' ? 'MP4, WebM (Max 100MB)' : 'PDF, DOCX (Max 25MB)'}
                                  </p>
                               </div>
                            ) : (
                               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white dark:bg-[#1E1E1E] rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                                        {type === 'video' ? <Video size={24}/> : <FileText size={24}/>}
                                     </div>
                                     <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                     </div>
                                  </div>
                                  <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-white dark:hover:bg-[#1E1E1E] rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                     <X size={20} />
                                  </button>
                               </div>
                            )}
                         </div>
                      )}

                      {/* 3. Link Input (Conditional) */}
                      {type === 'link' && (
                         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">رابط المحتوى</label>
                            <div className="relative group">
                               <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                               <input 
                                 type="url"
                                 required
                                 value={formData.url}
                                 onChange={e => setFormData({...formData, url: e.target.value})}
                                 className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-xl py-3.5 pl-11 pr-4 outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                                 placeholder="https://drive.google.com/..."
                               />
                            </div>
                         </div>
                      )}

                      {/* 4. Details Form */}
                      <div className="space-y-5">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">عنوان المحتوى</label>
                               <div className="relative group">
                                  <input 
                                    required
                                    type="text" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-xl py-3.5 px-4 outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                                    placeholder="مثال: ملخص شامل أناتومي"
                                 />
                               </div>
                            </div>
                            <div>
                               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">القسم</label>
                               <div className="relative group">
                                  <select 
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-xl py-3.5 px-4 outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 appearance-none cursor-pointer"
                                  >
                                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">وصف إضافي</label>
                            <textarea 
                              required
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                              className="w-full h-32 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-xl py-3.5 px-4 outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 resize-none leading-relaxed"
                              placeholder="اكتب وصفاً مختصراً للمحتوى يساعد الطلاب في البحث..."
                            ></textarea>
                         </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4 border-t border-gray-100 dark:border-[#333]">
                         <button 
                           type="submit" 
                           disabled={isSubmitting || (type !== 'link' && !selectedFile)}
                           className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                              isSubmitting || (type !== 'link' && !selectedFile)
                              ? 'bg-gray-300 dark:bg-[#333] text-gray-500 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99]'
                           }`}
                         >
                            {isSubmitting ? (
                               <>
                                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                  جاري الرفع...
                               </>
                            ) : (
                               <>
                                  إرسال للمراجعة <Send size={20} />
                               </>
                            )}
                         </button>
                         {(type !== 'link' && !selectedFile) && (
                            <p className="text-center text-xs text-red-500 mt-3 animate-pulse">يرجى اختيار ملف أولاً</p>
                         )}
                      </div>
                   </form>
                )}
             </div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-6">
             {/* Rules Card */}
             <div className="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-[#F38020]">
                      <AlertTriangle size={24} />
                   </div>
                   <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">تعليمات النشر</h3>
                </div>
                <div className="space-y-4">
                   {[
                      { title: 'جودة المحتوى', desc: 'تأكد من وضوح الصور وجودة الصوت في الفيديوهات.' },
                      { title: 'حقوق الملكية', desc: 'يمنع رفع كتب محمية بحقوق نشر بدون إذن.' },
                      { title: 'الروابط العامة', desc: 'تأكد أن روابط Google Drive متاحة للجميع (Public Access).' }
                   ].map((rule, i) => (
                      <div key={i} className="flex gap-3 items-start">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F38020] shrink-0 shadow-sm shadow-orange-500"></div>
                         <div>
                            <span className="block text-sm font-bold text-gray-900 dark:text-gray-200">{rule.title}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{rule.desc}</span>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-orange-200 dark:border-orange-800/30">
                   <div className="flex items-center gap-2 text-xs text-orange-800 dark:text-orange-300 bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                      <Info size={14} className="shrink-0" />
                      سيتم مراجعة المحتوى خلال 24 ساعة.
                   </div>
                </div>
             </div>

             {/* Stats Preview */}
             <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">نشاطك المساهم</h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 text-center">
                      <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">3</span>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">مقبول</span>
                   </div>
                   <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 text-center">
                      <span className="block text-2xl font-black text-yellow-600 dark:text-yellow-400">1</span>
                      <span className="text-[10px] font-bold text-yellow-400 uppercase">قيد المراجعة</span>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
