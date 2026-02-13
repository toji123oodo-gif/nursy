
import React, { useState, useRef } from 'react';
import { ContentItem } from '../../../../types';
import { storage } from '../../../../firebase';
import { 
  FileText, Mic, Video, Upload, X, 
  Image as ImageIcon, AlignLeft, Music, Layout, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';

interface Props {
  contents: ContentItem[];
  courseId: string;
  onChange: (newContents: ContentItem[]) => void;
}

export const ContentTab: React.FC<Props> = ({ contents, courseId, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const [isGlobalUploading, setIsGlobalUploading] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);
  
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptType = (type: string) => {
      switch(type) {
          case 'video': return 'video/*';
          case 'image': return 'image/*';
          case 'audio': return 'audio/*';
          case 'pdf': return '.pdf';
          default: return '*/*';
      }
  };

  const triggerQuickUpload = (type: string) => {
    setActiveUploadType(type);
    if (hiddenFileInputRef.current) {
        hiddenFileInputRef.current.value = ''; // Reset input
        hiddenFileInputRef.current.click();
    }
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadType) return;

    setIsGlobalUploading(true);
    const tempId = 'temp-' + Date.now();

    try {
        // Create storage reference
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = storage.ref(`courses/${courseId || 'temp'}/${timestamp}_${safeName}`);
        
        // Metadata for correct content handling
        const metadata = { contentType: file.type };

        // Upload
        const uploadTask = storageRef.put(file, metadata);

        // Monitor progress (optional, for global spinner if needed)
        uploadTask.on('state_changed', 
            (snapshot) => {
               // We could show a global progress bar here if desired
            },
            (error) => {
                throw error;
            }
        );

        await uploadTask;
        const url = await storageRef.getDownloadURL();

        // Create new content item
        const newContent: ContentItem = {
            id: 'r-' + timestamp,
            type: activeUploadType as any,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for title
            url: url,
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };

        onChange([...contents, newContent]);

    } catch (error: any) {
        console.error("Quick Upload Error:", error);
        alert("Upload failed: " + error.message);
    } finally {
        setIsGlobalUploading(false);
        setActiveUploadType(null);
    }
  };

  const addManualResource = (type: any) => {
    const newContent: ContentItem = {
      id: 'r-' + Date.now(),
      type,
      title: 'عنوان جديد',
      url: ''
    };
    onChange([...contents, newContent]);
  };

  const updateResource = (index: number, field: keyof ContentItem, value: any) => {
    const updated = [...contents];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeResource = (index: number) => {
    const updated = [...contents];
    updated.splice(index, 1);
    onChange(updated);
  };

  // Keep existing manual upload logic for replacing files
  const handleManualFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, contentId: string, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(prev => { const n = {...prev}; delete n[contentId]; return n; });
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = storage.ref(`courses/${courseId || 'temp'}/${timestamp}_${safeName}`);
    
    const uploadTask = storageRef.put(file, { contentType: file.type });

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [contentId]: progress }));
      }, 
      (error) => { 
          setUploadError(prev => ({ ...prev, [contentId]: error.message }));
          setUploadProgress(prev => { const n = {...prev}; delete n[contentId]; return n; });
      }, 
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        const updated = [...contents];
        updated[index].url = url;
        updated[index].fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        onChange(updated);
        setUploadProgress(prev => { const n = {...prev}; delete n[contentId]; return n; });
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden Global Input */}
      <input 
        type="file"
        ref={hiddenFileInputRef}
        className="hidden"
        accept={activeUploadType ? getAcceptType(activeUploadType) : '*/*'}
        onChange={handleQuickUpload}
      />

      {/* Quick Add Toolbar */}
      <div className="flex gap-3 flex-wrap p-4 bg-[#202020] rounded-xl border border-[#333]">
          <span className="text-xs font-bold text-gray-500 w-full mb-1">رفع محتوى جديد مباشرة:</span>
          
          <button onClick={() => triggerQuickUpload('video')} disabled={isGlobalUploading} className="flex-1 flex items-center justify-center gap-2 bg-[#F38020]/10 hover:bg-[#F38020]/20 border border-[#F38020]/30 text-[#F38020] px-3 py-2 rounded-lg text-xs font-bold transition-colors">
             {isGlobalUploading && activeUploadType === 'video' ? <Loader2 size={16} className="animate-spin"/> : <Video size={16}/>} فيديو
          </button>
          
          <button onClick={() => triggerQuickUpload('pdf')} disabled={isGlobalUploading} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
             {isGlobalUploading && activeUploadType === 'pdf' ? <Loader2 size={16} className="animate-spin"/> : <FileText size={16}/>} PDF
          </button>
          
          <button onClick={() => triggerQuickUpload('image')} disabled={isGlobalUploading} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
             {isGlobalUploading && activeUploadType === 'image' ? <Loader2 size={16} className="animate-spin"/> : <ImageIcon size={16}/>} صورة
          </button>
          
          <button onClick={() => triggerQuickUpload('audio')} disabled={isGlobalUploading} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
             {isGlobalUploading && activeUploadType === 'audio' ? <Loader2 size={16} className="animate-spin"/> : <Mic size={16}/>} صوت
          </button>
          
          <button onClick={() => addManualResource('article')} disabled={isGlobalUploading} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
             <AlignLeft size={16}/> مقال / رابط
          </button>
      </div>

      {/* Content List */}
      <div className="space-y-3">
          {contents.length === 0 ? (
            <div className="border-2 border-dashed border-[#333] rounded-xl p-12 flex flex-col items-center justify-center text-gray-600 bg-[#151515]">
                {isGlobalUploading ? (
                    <>
                        <Loader2 size={32} className="mb-3 text-[#F38020] animate-spin"/>
                        <span className="text-sm font-medium text-white">جاري رفع الملف...</span>
                    </>
                ) : (
                    <>
                        <Upload size={32} className="mb-3 opacity-50"/>
                        <span className="text-sm font-medium">لم يتم إضافة محتوى بعد.</span>
                        <span className="text-xs text-gray-500 mt-1">اضغط على الأزرار أعلاه لرفع الملفات مباشرة.</span>
                    </>
                )}
            </div>
          ) : (
            contents.map((content, idx) => {
                const isUploading = uploadProgress[content.id] !== undefined;
                const progress = uploadProgress[content.id] || 0;
                const hasUrl = content.url && content.url.length > 0;

                return (
                    <div key={content.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] flex flex-col gap-3 group transition-all hover:border-[#444]">
                      
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              content.type === 'video' ? 'bg-orange-500/10 text-orange-500' : 
                              content.type === 'pdf' ? 'bg-red-500/10 text-red-500' : 'bg-gray-700 text-gray-300'
                          }`}>
                              {content.type === 'video' ? <Video size={20}/> : content.type === 'pdf' ? <FileText size={20}/> : content.type === 'audio' ? <Music size={20}/> : content.type === 'image' ? <ImageIcon size={20}/> : <Layout size={20}/>}
                          </div>
                          
                          <div className="flex-1">
                              <input 
                                value={content.title}
                                onChange={e => updateResource(idx, 'title', e.target.value)}
                                className="bg-transparent border-none outline-none text-white text-sm font-bold w-full placeholder:text-gray-600"
                                placeholder="عنوان المحتوى"
                              />
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{content.type}</span>
                                {content.fileSize && <span className="text-[10px] text-gray-600">• {content.fileSize}</span>}
                              </div>
                          </div>

                          <button 
                              onClick={() => removeResource(idx)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                              <X size={18}/>
                          </button>
                      </div>

                      {isUploading ? (
                          <div className="w-full bg-[#252525] rounded-lg p-3 border border-[#333]">
                              <div className="flex justify-between text-xs text-gray-400 mb-2">
                                  <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin text-[#F38020]"/> جاري التحديث...</span>
                                  <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#F38020] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex gap-2">
                              <div className="flex-1 relative">
                                  <input 
                                      value={content.url}
                                      onChange={e => updateResource(idx, 'url', e.target.value)}
                                      className={`w-full bg-[#151515] text-gray-300 text-xs px-3 py-2.5 rounded-lg border focus:border-[#F38020] outline-none transition-colors ${hasUrl ? 'border-green-900/30 pl-8' : 'border-[#333]'}`}
                                      placeholder="رابط الملف"
                                  />
                                  {hasUrl && <CheckCircle2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500"/>}
                              </div>
                              
                              <label className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors bg-[#252525] hover:bg-[#333] text-gray-300 border border-[#333]`}>
                                  <Upload size={14}/> استبدال
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept={getAcceptType(content.type)}
                                    onChange={e => handleManualFileUpload(e, content.id, idx)} 
                                  />
                              </label>
                          </div>
                      )}

                      {uploadError[content.id] && (
                          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                              <AlertCircle size={12}/> {uploadError[content.id]}
                          </div>
                      )}

                    </div>
                );
            })
          )}
      </div>
    </div>
  );
};
