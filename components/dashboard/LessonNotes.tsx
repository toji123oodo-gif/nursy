
import React, { useState, useEffect } from 'react';
// Added Edit3 to the imports from lucide-react
import { Save, Sparkles, CheckCircle, Trash2, Edit3 } from 'lucide-react';

interface Props {
  lessonId: string;
}

export const LessonNotes: React.FC<Props> = ({ lessonId }) => {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem(`note_${lessonId}`);
    if (savedNote) setNote(savedNote);
  }, [lessonId]);

  const handleSave = () => {
    localStorage.setItem(`note_${lessonId}`, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="ns-card p-10 md:p-14 space-y-8 ns-animate--fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-2xl font-black text-white flex items-center gap-3">
            <Edit3 className="text-brand-gold" /> تدوين الملاحظات
          </h4>
          <p className="text-brand-muted text-xs font-medium mt-1">يتم حفظ هذه الملاحظات في جهازك فقط للخصوصية.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <CheckCircle size={14} /> تم الحفظ تلقائياً
          </div>
        )}
      </div>

      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          if (isSaved) setIsSaved(false);
        }}
        placeholder="اكتب ملاحظاتك، أسئلتك، أو النقاط الهامة هنا..."
        className="w-full h-80 bg-brand-main/50 border border-white/5 rounded-[2rem] p-8 text-white text-lg font-medium outline-none focus:border-brand-gold/30 transition-all resize-none shadow-inner placeholder:text-brand-muted/20"
      ></textarea>

      <div className="flex gap-4">
        <button 
          onClick={handleSave}
          className="flex-1 bg-brand-gold text-brand-main font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-glow hover:scale-[1.02] transition-all"
        >
          <Save size={20} /> حفظ الملاحظة
        </button>
        <button 
          onClick={() => { if(window.confirm('مسح الملاحظة؟')) { setNote(''); localStorage.removeItem(`note_${lessonId}`); }}}
          className="p-5 bg-white/5 text-brand-muted border border-white/10 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
};
