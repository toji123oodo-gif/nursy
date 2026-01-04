
import React, { useState } from 'react';
import { UploadCloud, FileText, Link as LinkIcon, Video, Send, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
       
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-gray-200 dark:border-[#333] pb-6">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="text-[#F38020]" /> مركز المساهمات
             </h1>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
                شارك الملخصات، المذكرات، أو الفيديوهات المفيدة مع زملائك. جميع الملفات يتم مراجعتها من قبل المشرفين قبل النشر لضمان الجودة.
             </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/10 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-300 max-w-xs">
             <strong>ملاحظة:</strong> يمكنك رفع روابط Google Drive أو YouTube مباشرة.
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Side */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
             {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تم إرسال الطلب!</h3>
                   <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">شكراً لمساهمتك. سيتم مراجعة المحتوى وإضافته قريباً.</p>
                   <button onClick={() => setSubmitted(false)} className="text-[#F38020] hover:underline text-sm font-bold">
                      رفع ملف آخر
                   </button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">عنوان المحتوى</label>
                      <input 
                        required
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="cf-input"
                        placeholder="مثال: ملخص المحاضرة الأولى أناتومي"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">القسم</label>
                         <select 
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                           className="cf-input"
                         >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">النوع</label>
                         <div className="flex bg-gray-100 dark:bg-[#2C2C2C] p-1 rounded-lg">
                            {[
                               { id: 'pdf', icon: FileText, label: 'PDF' },
                               { id: 'video', icon: Video, label: 'Video' },
                               { id: 'link', icon: LinkIcon, label: 'Link' }
                            ].map(t => (
                               <button
                                 key={t.id}
                                 type="button"
                                 onClick={() => setType(t.id as any)}
                                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${type === t.id ? 'bg-white dark:bg-[#333] text-[#F38020] shadow-sm' : 'text-gray-500'}`}
                               >
                                  <t.icon size={12} /> {t.label}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                         {type === 'link' ? 'رابط المحتوى' : 'وصف / رابط التحميل'}
                      </label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="cf-input resize-none h-32"
                        placeholder={type === 'link' ? "https://..." : "أضف وصفاً مختصراً أو رابط Google Drive للملف..."}
                      ></textarea>
                   </div>

                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                   >
                      {isSubmitting ? 'جاري الإرسال...' : <>إرسال للمراجعة <Send size={16} /></>}
                   </button>
                </form>
             )}
          </div>

          {/* Guidelines Side */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/30">
                <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-3">شروط القبول</h3>
                <ul className="space-y-2 text-sm text-orange-900/80 dark:text-orange-200/80 list-disc list-inside">
                   <li>الملفات يجب أن تكون واضحة وبجودة جيدة.</li>
                   <li>يمنع رفع أي محتوى يخالف حقوق الملكية الفكرية.</li>
                   <li>تأكد من أن الرابط يعمل ومتاح للجميع (Public).</li>
                   <li>اكتب وصفاً دقيقاً ليسهل على الطلاب البحث عنه.</li>
                </ul>
             </div>

             <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">أحدث المساهمات</h3>
                <div className="space-y-3">
                   {[
                      { title: 'ملخص فسيولوجي الكلية', user: 'سارة أحمد', type: 'pdf' },
                      { title: 'شرح فيديو العملي', user: 'محمد علي', type: 'video' },
                      { title: 'أسئلة سنوات سابقة', user: 'خالد عمر', type: 'link' },
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#333] rounded-xl">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2C2C2C] flex items-center justify-center text-gray-500">
                               {item.type === 'pdf' ? <FileText size={14}/> : item.type === 'video' ? <Video size={14}/> : <LinkIcon size={14}/>}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.title}</p>
                               <p className="text-[10px] text-gray-500">بواسطة {item.user}</p>
                            </div>
                         </div>
                         <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded">تم النشر</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
