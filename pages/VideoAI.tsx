
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, Sparkles, Loader2, Brain, FileText, 
  PlayCircle, AlertCircle, ChevronLeft, Upload, 
  CheckCircle2, Info
} from 'lucide-react';

export const VideoAI: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const analyzeVideo = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // For demonstration, we convert to base64. 
      // Note: Large videos should ideally use the File API, but for direct SDK usage:
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data,
                },
              },
              {
                text: "أنت خبير تمريض أكاديمي مصري. قم بتحليل هذا الفيديو الطبي بدقة. استخرج: 1- الخطوات التمريضية التي تمت. 2- ملاحظات الأمان (Safety Precautions). 3- نصائح إضافية للطلاب. اجعل الإجابة باللغة العربية بأسلوب تعليمي مبسط.",
              },
            ],
          },
        ],
      });

      setAnalysis(response.text || "لم نتمكن من تحليل الفيديو.");
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء تحليل الفيديو. يرجى التأكد من حجم الفيديو وصيغته.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-main py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 ns-animate--fade-in-up">
          <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20 text-brand-gold font-black uppercase tracking-widest text-[10px]">
            <Sparkles size={14} fill="currentColor" className="animate-pulse" /> ذكاء نيرسي الاصطناعي
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            مساعد الفهم <span className="text-brand-gold text-glow">المرئي</span>
          </h1>
          <p className="text-brand-muted text-lg font-medium max-w-2xl mx-auto">
            ارفع فيديو لأي عملية تمريضية أو شرح طبي، وسيقوم نظام نيرسي الذكي بتحليله وشرحه لك بالكامل.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Upload Section */}
          <div className="lg:col-span-5 space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`ns-card p-12 border-2 border-dashed flex flex-col items-center justify-center text-center gap-6 cursor-pointer transition-all ${file ? 'border-brand-gold/50 bg-brand-gold/5' : 'border-white/10 hover:border-brand-gold/30 hover:bg-white/5'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="video/*"
              />
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-glow ${file ? 'bg-brand-gold text-brand-main' : 'bg-white/5 text-brand-muted'}`}>
                <Upload size={40} />
              </div>
              <div>
                <h3 className="text-white font-black text-xl mb-2">
                  {file ? file.name : 'اختر فيديو الشرح'}
                </h3>
                <p className="text-brand-muted text-xs font-medium">أقصى حجم للفيديو: 50 ميجابايت</p>
              </div>
            </div>

            <button 
              onClick={analyzeVideo}
              disabled={!file || isAnalyzing}
              className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2.5rem] shadow-glow text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <><Loader2 className="animate-spin" size={24} /> جاري التحليل بذكاء...</>
              ) : (
                <><Brain size={24} /> ابدأ التحليل الذكي</>
              )}
            </button>

            <div className="ns-card p-6 bg-brand-gold/5 border-brand-gold/10 flex items-center gap-4">
              <Info className="text-brand-gold" size={24} />
              <p className="text-[11px] text-brand-muted font-bold leading-relaxed">
                هذه الميزة تستخدم موديل Gemini 3 Pro لتحليل المكونات البصرية والسمعية للفيديو بدقة متناهية.
              </p>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              <div className="ns-card h-full flex flex-col items-center justify-center p-20 text-center space-y-8 animate-pulse">
                <div className="relative">
                  <div className="w-32 h-32 bg-brand-gold/20 rounded-full animate-ping absolute inset-0"></div>
                  <Brain size={64} className="text-brand-gold relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-black text-2xl">جاري معالجة الفيديو...</h4>
                  <p className="text-brand-muted font-bold italic">نحن نقوم الآن "برؤية" الفيديو وفهم الخطوات الطبية بداخله.</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="ns-card p-10 md:p-14 space-y-8 ns-animate--scale-up">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4">
                    <FileText className="text-brand-gold" /> تقرير التحليل الذكي
                  </h3>
                  <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                    <CheckCircle2 size={14} /> تم التحليل
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-brand-muted text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {analysis}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ns-card h-full border-dashed flex flex-col items-center justify-center p-20 text-center opacity-30">
                <Video size={80} className="text-brand-muted mb-6" />
                <p className="text-brand-muted font-bold">ارفع فيديو لعرض التحليل هنا</p>
              </div>
            )}
            
            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 p-6 rounded-[2.5rem] flex items-center gap-4 text-red-400 font-black text-sm">
                <AlertCircle size={20} /> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
