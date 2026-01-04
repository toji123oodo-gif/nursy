
import React, { useState } from 'react';
import { UploadCloud, FileText, Link as LinkIcon, Video, Send, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UploadResource: React.FC = () => {
  const { user } = useApp();
  const [type, setType] = useState<'pdf' | 'video' | 'link'>('pdf');
  const [formData, setFormData] = useState({ title: '', category: 'General', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation of API submission
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ title: '', category: 'General', description: '' });
    }, 2000);
  };

  const categories = ['Anatomy', 'Physiology', 'Microbiology', 'Nursing Foundations', 'Community Health', 'General'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4">
       
       {/* Hero / Header Section */}
       <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F38020]/20 rounded-full blur-[60px] pointer-events-none -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                   <UploadCloud size={14} /> Student Hub
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                   شاركينا ملخصاتك <br/> وساعدي زمايلك 🚀
                </h1>
                <p className="text-blue-100 text-sm md:text-base max-w-lg leading-relaxed opacity-90">
                   عندك ملخص، فيديو شرح، أو لينك مفيد؟ ارفعه هنا ليستفيد منه آلاف الطلاب في جميع أنحاء مصر. معاً نصنع مستقبلاً أفضل للتمريض.
                </p>
             </div>
             <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform">
                   <FileText size={64} className="text-white opacity-80" />
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl p-6 md:p-8 shadow-sm">
                {submitted ? (
                   <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                      <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 animate-bounce-subtle">
                         <CheckCircle2 size={40} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تم استلام طلبك بنجاح!</h3>
                         <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">سيقوم فريق المشرفين بمراجعة المحتوى ونشره خلال 24 ساعة.</p>
                      </div>
                      <button 
                        onClick={() => setSubmitted(false)} 
                        className="px-8 py-3 bg-gray-100 dark:bg-[#2C2C2C] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
                      >
                         رفع ملف آخر
                      </button>
                   </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Type Selector */}
                      <div>
                         <label className="text-sm font-bold text-gray-900 dark:text-white mb-4 block">نوع المحتوى</label>
                         <div className="grid grid-cols-3 gap-3">
                            {[
                               { id: 'pdf', icon: FileText, label: 'ملف PDF', desc: 'مذكرات، كتب' },
                               { id: 'video', icon: Video, label: 'فيديو', desc: 'شرح، يوتيوب' },
                               { id: 'link', icon: LinkIcon, label: 'رابط خارجي', desc: 'درايف، موقع' }
                            ].map(t => (
                               <button
                                 key={t.id}
                                 type="button"
                                 onClick={() => setType(t.id as any)}
                                 className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group ${
                                    type === t.id 
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                    : 'border-gray-100 dark:border-[#333] bg-white dark:bg-[#252525] hover:border-blue-200 dark:hover:border-blue-800'
                                 }`}
                               >
                                  <div className={`mb-2 p-2 rounded-full transition-colors ${type === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#333] text-gray-500 group-hover:text-blue-600'}`}>
                                     <t.icon size={20} />
                                  </div>
                                  <span className={`text-sm font-bold ${type === t.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{t.label}</span>
                                  <span className="text-[10px] text-gray-400 mt-1">{t.desc}</span>
                                  {type === t.id && (
                                     <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 size={16} fill="currentColor" className="text-white"/></div>
                                  )}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">عنوان المحتوى</label>
                            <input 
                              required
                              type="text" 
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              className="cf-input py-3 text-base"
                              placeholder="مثال: ملخص شامل لمادة الأناتومي - الترم الأول"
                           />
                         </div>

                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">القسم الدراسي</label>
                            <div className="relative">
                               <select 
                                 value={formData.category}
                                 onChange={e => setFormData({...formData, category: e.target.value})}
                                 className="cf-input py-3 appearance-none cursor-pointer"
                               >
                                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                               <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                               {type === 'link' ? 'رابط المحتوى (URL)' : 'وصف المحتوى أو رابط التحميل'}
                            </label>
                            <textarea 
                              required
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                              className="cf-input resize-none h-32 py-3 leading-relaxed"
                              placeholder={type === 'link' ? "https://..." : "اكتب وصفاً مختصراً للمحتوى، أو ضع رابط Google Drive هنا..."}
                            ></textarea>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                               <Info size={10} /> تأكد من أن الرابط متاح للجميع (Public Access).
                            </p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-[#333]">
                         <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="w-full btn-primary py-3.5 text-base rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                         >
                            {isSubmitting ? 'جاري الإرسال...' : <>إرسال للمراجعة <Send size={18} /></>}
                         </button>
                      </div>
                   </form>
                )}
             </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
             {/* Rules Card */}
             <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-[#F38020]">
                      <AlertTriangle size={20} />
                   </div>
                   <h3 className="font-bold text-orange-900 dark:text-orange-100">تعليمات النشر</h3>
                </div>
                <ul className="space-y-3">
                   {[
                      'يجب أن يكون المحتوى ذو صلة بمناهج التمريض.',
                      'يمنع رفع محتوى ينتهك حقوق الملكية الفكرية.',
                      'تأكد من جودة الملفات ووضوح الخط.',
                      'سيتم ذكر اسمك كمساهم عند نشر المحتوى.'
                   ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-orange-800/80 dark:text-orange-200/70">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F38020] shrink-0"></span>
                         <span className="leading-snug">{rule}</span>
                      </li>
                   ))}
                </ul>
             </div>

             {/* Recent Contributions */}
             <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-[#333] pb-2">
                   أحدث المساهمات
                </h3>
                <div className="space-y-3">
                   {[
                      { title: 'ملخص فسيولوجي (الدم)', user: 'سارة أحمد', type: 'pdf', date: 'منذ ساعتين' },
                      { title: 'شرح فيديو عملي الكانيولا', user: 'محمد علي', type: 'video', date: 'أمس' },
                      { title: 'بنك أسئلة باطنة وجراحة', user: 'خالد عمر', type: 'link', date: 'منذ يومين' },
                   ].map((item, idx) => (
                      <div key={idx} className="group flex items-center p-3 hover:bg-gray-50 dark:hover:bg-[#252525] rounded-xl transition-colors cursor-default">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-3 ${
                            item.type === 'pdf' ? 'bg-red-50 text-red-500' : item.type === 'video' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                         } dark:bg-[#2C2C2C]`}>
                            {item.type === 'pdf' ? <FileText size={18}/> : item.type === 'video' ? <Video size={18}/> : <LinkIcon size={18}/>}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 transition-colors">{item.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-[#333] px-1.5 rounded">{item.user}</span>
                               <span className="text-[10px] text-gray-400">• {item.date}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
