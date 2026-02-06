
import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  files: File[];
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemoved: (index: number) => void;
  onClear: () => void;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  files, 
  onFilesAdded, 
  onFileRemoved, 
  onClear,
  multiple = true 
}) => {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const borderColor = theme === 'dark' ? '#666' : '#999';

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-black uppercase tracking-widest opacity-60">{label}</label>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dotted transition-all cursor-pointer ${
          isDragging ? 'scale-[0.99] border-solid' : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
        style={{ 
          backgroundColor: isDragging ? `${colors.accent}10` : 'transparent',
          borderColor: isDragging ? colors.accent : borderColor
        }}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          multiple={multiple}
          accept=".pdf,.docx,.txt"
          onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
        />
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 rounded-full transition-transform group-hover:scale-110" style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}>
            <Upload size={20} />
          </div>
          <div>
            <p className="text-xs font-bold">Drop files here</p>
            <p className="text-[10px] opacity-50 uppercase tracking-tighter">PDF, DOCX, TXT</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-1.5 mt-2 max-h-32 overflow-y-auto pr-1">
          {files.map((file, idx) => (
            <div 
              key={`${file.name}-${idx}`} 
              className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-transparent transition-all hover:border-current/10"
              style={{ borderColor: theme === 'dark' ? '#333' : 'transparent' }}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText size={12} className="flex-shrink-0 opacity-40" />
                <span className="text-[11px] font-bold truncate">{file.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onFileRemoved(idx); }}
                className="p-1 rounded-md hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
