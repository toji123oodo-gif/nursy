
import React, { useState, useRef, useEffect } from 'react';
import { ContentItem, ContentType } from '../../../../types';
import { storage } from '../../../../firebase';
import { 
  FileText, Mic, Video, Upload, X, 
  Image as ImageIcon, Link as LinkIcon, HardDrive, Check,
  Music, Layout, CheckCircle2, File
} from 'lucide-react';

interface Props {
  contents: ContentItem[];
  courseId: string;
  onChange: (newContents: ContentItem[]) => void;
}

export const ContentTab: React.FC<Props> = ({ contents, courseId, onChange }) => {
  const [sourceModal, setSourceModal] = useState<{ isOpen: boolean, type: ContentType | null }>({ isOpen: false, type: null });
  const [linkInput, setLinkInput] = useState('');
  
  // Ref to access the latest contents state inside async callbacks
  const contentsRef = useRef(contents);
  useEffect(() => {
    contentsRef.current = contents;
  }, [contents]);
  
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptType = (type: ContentType | null) => {
      switch(type) {
          case 'video': return 'video/*';
          case 'image': return 'image/*';
          case 'audio': return 'audio/*';
          case 'pdf': return '.pdf';
          case 'document': return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
          default: return '*/*';
      }
  };

  const openSourceModal = (type: ContentType) => {
    setSourceModal({ isOpen: true, type });
    setLinkInput('');
  };

  const handleLocalSelect = () => {
    // Close modal and trigger file input
    setSourceModal({ isOpen: false, type: sourceModal.type });
    setTimeout(() => {
        if (hiddenFileInputRef.current) {
            hiddenFileInputRef.current.value = ''; // Reset input
            hiddenFileInputRef.current.click();
        }
    }, 100);
  };

  const handleLinkSubmit = () => {
    if (!linkInput || !sourceModal.type) return;
    
    const newItem: ContentItem = {
      id: 'r-' + Date.now(),
      type: sourceModal.type,
      title: 'New Link',
      url: linkInput,
      fileSize: 'Link'
    };
    
    onChange([...contents, newItem]);
    setSourceModal({ isOpen: false, type: null });
  };

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const type = sourceModal.type;
    
    if (!file || !type) return;

    const timestamp = Date.now();
    const tempId = 'r-' + timestamp;

    // 1. Optimistic Update: Add item immediately with empty URL
    const optimisticItem: ContentItem = {
        id: tempId,
        type: type,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        url: '', 
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    };

    const newContents = [...contentsRef.current, optimisticItem];
    onChange(newContents);
    
    // Clear type to prevent accidental re-trigger
    setSourceModal({ isOpen: false, type: null });

    // 2. Background Upload
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = storage.ref(`courses/${courseId || 'temp'}/${timestamp}_${safeName}`);
    
    // Explicitly set content type to preserve original format (e.g. application/pdf, video/mp4)
    // Fallback to application/octet-stream if type is empty to prevent text/plain or HTML interpretation
    const metadata = {
        contentType: file.type || 'application/octet-stream',
        customMetadata: {
            originalName: file.name
        }
    };
    
    storageRef.put(file, metadata)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
          // 3. Update the specific item with real URL when done
          const updated = contentsRef.current.map(item => 
              item.id === tempId ? { ...item, url: url } : item
          );
          onChange(updated);
      })
      .catch(err => {
          console.error("Upload failed:", err);
      });
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

  return (
    <div className="space-y-6">
      {/* Hidden Global Input */}
      <input 
        type="file"
        ref={hiddenFileInputRef}
        className="hidden"
        accept={getAcceptType(sourceModal.type)}
        onChange={handleQuickUpload}
      />

      {/* Quick Add Toolbar */}
      <div className="flex gap-3 flex-wrap p-4 bg-[#202020] rounded-xl border border-[#333]">
          <span className="text-xs font-bold text-gray-500 w-full mb-1">Add Content:</span>
          
          <button onClick={() => openSourceModal('video')} className="flex-1 flex items-center justify-center gap-2 bg-[#F38020]/10 hover:bg-[#F38020]/20 border border-[#F38020]/30 text-[#F38020] px-3 py-3 rounded-lg text-xs font-bold transition-colors">
             <Video size={18}/> Video
          </button>
          
          <button onClick={() => openSourceModal('document')} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-3 rounded-lg text-xs font-bold transition-colors">
             <FileText size={18}/> Document
          </button>
          
          <button onClick={() => openSourceModal('image')} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-3 rounded-lg text-xs font-bold transition-colors">
             <ImageIcon size={18}/> Image
          </button>
          
          <button onClick={() => openSourceModal('audio')} className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] border border-[#333] text-gray-300 px-3 py-3 rounded-lg text-xs font-bold transition-colors">
             <Mic size={18}/> Audio
          </button>
      </div>

      {/* Source Selection Modal */}
      {sourceModal.isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#1E1E1E] w-full max-w-sm rounded-2xl shadow-2xl border border-[#333] p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Upload size={18} className="text-[#F38020]" /> Select Source
                 </h3>
                 <button onClick={() => setSourceModal({ isOpen: false, type: null })} className="text-gray-500 hover:text-white">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="space-y-3">
                 <button 
                   onClick={handleLocalSelect}
                   className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#252525] hover:bg-[#333] border border-[#333] hover:border-[#F38020] transition-all group text-left"
                 >
                    <div className="p-3 bg-[#151515] rounded-full text-gray-400 group-hover:text-white">
                       <HardDrive size={20} />
                    </div>
                    <div>
                       <span className="block text-sm font-bold text-white">Upload File</span>
                       <span className="block text-xs text-gray-500">From your computer</span>
                    </div>
                 </button>

                 <div className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#252525] border border-[#333]">
                    <div className="p-3 bg-[#151515] rounded-full text-gray-400">
                       <LinkIcon size={20} />
                    </div>
                    <div className="flex-1">
                       <span className="block text-sm font-bold text-white mb-2">External Link</span>
                       <div className="flex gap-2">
                          <input 
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="https://..." 
                            className="flex-1 bg-[#151515] border border-[#333] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#F38020]"
                          />
                          <button 
                            onClick={handleLinkSubmit} 
                            disabled={!linkInput}
                            className="bg-[#F38020] text-white p-1.5 rounded hover:bg-orange-600 disabled:opacity-50"
                          >
                             <Check size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-3">
          {contents.length === 0 ? (
            <div className="border-2 border-dashed border-[#333] rounded-xl p-12 flex flex-col items-center justify-center text-gray-600 bg-[#151515]">
                <Upload size={32} className="mb-3 opacity-50"/>
                <span className="text-sm font-medium">No content added yet.</span>
                <span className="text-xs text-gray-500 mt-1">Select a type above to start.</span>
            </div>
          ) : (
            contents.map((content, idx) => {
                const hasUrl = content.url && content.url.length > 0;

                return (
                    <div key={content.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] flex flex-col gap-3 group transition-all hover:border-[#444]">
                      
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              content.type === 'video' ? 'bg-orange-500/10 text-orange-500' : 
                              (content.type === 'pdf' || content.type === 'document') ? 'bg-blue-500/10 text-blue-500' : 
                              content.type === 'image' ? 'bg-green-500/10 text-green-500' : 
                              'bg-gray-700 text-gray-300'
                          }`}>
                              {content.type === 'video' ? <Video size={20}/> : 
                               (content.type === 'pdf' || content.type === 'document') ? <FileText size={20}/> : 
                               content.type === 'audio' ? <Music size={20}/> : 
                               content.type === 'image' ? <ImageIcon size={20}/> : <Layout size={20}/>}
                          </div>
                          
                          <div className="flex-1">
                              <input 
                                value={content.title}
                                onChange={e => updateResource(idx, 'title', e.target.value)}
                                className="bg-transparent border-none outline-none text-white text-sm font-bold w-full placeholder:text-gray-600"
                                placeholder="Content Title"
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

                      <div className="flex gap-2">
                          <div className="flex-1 relative">
                              <input 
                                  value={content.url}
                                  onChange={e => updateResource(idx, 'url', e.target.value)}
                                  className={`w-full bg-[#151515] text-gray-300 text-xs px-3 py-2.5 rounded-lg border focus:border-[#F38020] outline-none transition-colors ${hasUrl ? 'border-green-900/30 pl-8' : 'border-[#333]'}`}
                                  placeholder="File URL"
                              />
                              {hasUrl && <CheckCircle2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500"/>}
                          </div>
                      </div>

                    </div>
                );
            })
          )}
      </div>
    </div>
  );
};
