
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../hooks/useProjectStore';
import { Project, ProjectFile, AnalysisMode } from '../types';
import { performAnalysis } from '../services/geminiService';

const OpsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject, saveProject } = useProjectStore();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilesToDelete, setSelectedFilesToDelete] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingUserPaper, setIsDraggingUserPaper] = useState(false);
  
  const sidebarFileInputRef = useRef<HTMLInputElement>(null);
  const userPaperInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectId) {
      const p = getProject(projectId);
      if (p) {
        setProject(p);
        setTitleValue(p.name);
      } else {
        navigate('/saved');
      }
    }
  }, [projectId, getProject, navigate]);

  if (!project) return null;

  const updateProject = (updates: Partial<Project>) => {
    const updated = { ...project, ...updates };
    setProject(updated);
    saveProject(updated);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      updateProject({ name: titleValue.trim() });
    }
  };

  const processSidebarFiles = (files: FileList) => {
    const newFiles: ProjectFile[] = Array.from(files).map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: Date.now()
    }));
    updateProject({ files: [...project.files, ...newFiles] });
  };

  const processUserPaper = (files: FileList) => {
    if (files.length === 0) return;
    const f = files[0];
    const userPaper: ProjectFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: Date.now()
    };
    updateProject({ userPaper });
  };

  const handleSidebarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processSidebarFiles(e.target.files);
  };

  const handleUserPaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processUserPaper(e.target.files);
  };

  const deleteSelectedFiles = () => {
    updateProject({ files: project.files.filter(f => !selectedFilesToDelete.includes(f.id)) });
    setSelectedFilesToDelete([]);
    setIsSelectionMode(false);
  };

  const clearAllFiles = () => {
    if (window.confirm('Clear all uploaded files from this project?')) {
      updateProject({ files: [] });
    }
  };

  const handleAnalyze = async () => {
    // 1. Check if source documents are present (Constraint: none of the functions run if no source doc are there)
    if (project.files.length === 0) {
      alert("Please upload at least one source document to the project corpus.");
      return;
    }

    // 2. Mode specific validations
    if ((project.mode === 'contradict' || project.mode === 'hypothesis') && !project.domain) {
      alert("Research domain is required.");
      return;
    }
    if ((project.mode === 'contradict' || project.mode === 'claim') && !project.userPaper) {
      alert("Please upload YOUR paper for analysis in this mode.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await performAnalysis(project.mode, project.domain, project.prompt, project.files, project.corpus, project.userPaper);
      updateProject({ result: res });
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your network and configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-ltext dark:text-dtext">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12 group">
        <div className="flex-1">
          {isEditingTitle ? (
            <input 
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              className="text-4xl font-black bg-white dark:bg-gray-800 px-3 py-2 rounded-2xl w-full outline-none ring-4 ring-lsecondary/20 border-2 border-lsecondary text-ltext dark:text-dtext"
            />
          ) : (
            <h1 
              onClick={() => setIsEditingTitle(true)}
              className="text-4xl font-black cursor-text group-hover:text-lsecondary dark:group-hover:text-dtext transition-colors flex items-center gap-4 tracking-tighter"
            >
              {project.name}
              <i className="fa-solid fa-pen-to-square text-sm opacity-0 group-hover:opacity-30"></i>
            </h1>
          )}
        </div>
        <button 
          onClick={() => navigate('/saved')}
          className="px-6 py-3 text-xs font-black text-lsecondary dark:text-dtext border-2 border-lsecondary/10 hover:border-lsecondary/40 dark:border-gray-700 rounded-xl transition-all flex items-center gap-2 uppercase tracking-[0.2em]"
        >
          <i className="fa-solid fa-folder-open"></i>
          Project Manager
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - Sidebar (General Sources) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-black/20 p-8 rounded-3xl border-2 border-lsecondary/5 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70">Source Documents</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsSelectionMode(!isSelectionMode)}
                  className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg transition-colors tracking-widest ${isSelectionMode ? 'bg-lsecondary text-white' : 'text-lsecondary hover:bg-lsecondary/10 dark:text-dtext'}`}
                >
                  {isSelectionMode ? 'Done' : 'Select'}
                </button>
                <button 
                  onClick={clearAllFiles}
                  className="text-[9px] font-black uppercase px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors tracking-widest"
                >
                  Clear
                </button>
              </div>
            </div>

            <div 
              onClick={() => sidebarFileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingSidebar(true); }}
              onDragLeave={() => setIsDraggingSidebar(false)}
              onDrop={(e) => { e.preventDefault(); setIsDraggingSidebar(false); if (e.dataTransfer.files) processSidebarFiles(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${isDraggingSidebar ? 'border-lsecondary bg-lsecondary/5' : 'border-lsecondary/10 dark:border-gray-700 bg-lbg/20 dark:bg-gray-900/20 hover:border-lsecondary/40'}`}
            >
              <i className={`fa-solid fa-cloud-arrow-up text-4xl mb-4 transition-colors ${isDraggingSidebar ? 'text-lsecondary' : 'text-lsecondary/30 dark:text-dtext/30'}`}></i>
              <p className="text-[9px] font-black text-lsecondary dark:text-dtext uppercase tracking-[0.2em]">Upload Corpus</p>
              <input type="file" multiple className="hidden" ref={sidebarFileInputRef} onChange={handleSidebarFileUpload} />
            </div>

            <div className="mt-8 space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2 text-ltext dark:text-dtext">
              {project.files.map(file => (
                <div 
                  key={file.id} 
                  className={`flex items-center justify-between p-4 rounded-xl text-[10px] font-bold border-2 transition-colors ${selectedFilesToDelete.includes(file.id) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-lbg/40 dark:bg-gray-900 border-lsecondary/5 dark:border-transparent'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {isSelectionMode && (
                      <input 
                        type="checkbox" 
                        checked={selectedFilesToDelete.includes(file.id)}
                        onChange={() => setSelectedFilesToDelete(prev => prev.includes(file.id) ? prev.filter(i => i !== file.id) : [...prev, file.id])}
                        className="accent-lsecondary w-4 h-4 rounded-md"
                      />
                    )}
                    <i className="fa-regular fa-file-pdf text-lsecondary dark:text-dtext text-sm flex-shrink-0"></i>
                    <span className="truncate">{file.name}</span>
                  </div>
                </div>
              ))}
              {project.files.length === 0 && (
                <div className="text-center py-10 opacity-20 font-black uppercase text-[9px] tracking-[0.3em]">No Sources</div>
              )}
            </div>

            {isSelectionMode && selectedFilesToDelete.length > 0 && (
              <button 
                onClick={deleteSelectedFiles}
                className="w-full mt-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black hover:brightness-110 transition-colors uppercase tracking-[0.2em]"
              >
                Delete Selected
              </button>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-black px-4 text-[10px] uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70">Analysis Mode</h3>
            <div className="space-y-3">
              {(['contradict', 'claim', 'hypothesis'] as AnalysisMode[]).map(mode => (
                <button 
                  key={mode}
                  onClick={() => updateProject({ mode })}
                  className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all flex items-center justify-between ${project.mode === mode ? 'border-lsecondary bg-white dark:bg-black/20 font-black shadow-lg scale-[1.03] text-lsecondary dark:text-dtext' : 'border-lsecondary/5 bg-white/50 dark:bg-black/10 text-ltext dark:text-dtext opacity-60 hover:opacity-100 hover:border-lsecondary/20 dark:hover:border-gray-700'}`}
                >
                  <span className="capitalize tracking-[0.1em] text-xs uppercase">{mode}</span>
                  {project.mode === mode && <i className="fa-solid fa-circle-check text-lsecondary dark:text-dtext"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Inputs & Subject Paper */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-black/20 p-10 rounded-[2.5rem] border-2 border-lsecondary/5 dark:border-gray-800 shadow-xl space-y-12">
            <div className="space-y-10">
              {/* Domain Input */}
              {(project.mode === 'contradict' || project.mode === 'hypothesis') && (
                <div className="group">
                  <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70 group-focus-within:text-laccent transition-colors">
                    Research Domain <span className="text-laccent font-black">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={project.domain}
                    onChange={(e) => updateProject({ domain: e.target.value })}
                    placeholder="e.g. Quantum Computing, Cancer Research..."
                    className="w-full px-6 py-5 bg-lbg/20 dark:bg-gray-900 border-2 border-lsecondary/10 dark:border-gray-800 rounded-2xl outline-none focus:ring-4 focus:ring-lsecondary/10 focus:border-lsecondary dark:focus:border-gray-600 text-lg font-black tracking-tight text-ltext dark:text-dtext"
                  />
                </div>
              )}

              {/* User Paper Section (Required for Claim and Contradict) */}
              {(project.mode === 'claim' || project.mode === 'contradict') && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70">
                      Your Primary Paper <span className="text-laccent font-black">*</span>
                    </label>
                    <span className="text-[9px] font-black text-laccent uppercase tracking-widest opacity-60">Required for Analysis</span>
                  </div>
                  
                  {project.userPaper ? (
                    <div className="flex items-center justify-between p-8 bg-lsecondary/5 dark:bg-gray-900/40 rounded-3xl border-2 border-lsecondary/10 dark:border-gray-800 shadow-inner group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md border-2 border-lsecondary/10 dark:border-gray-700 group-hover:scale-105 transition-transform">
                          <i className="fa-solid fa-file-contract text-4xl text-lsecondary dark:text-dtext"></i>
                        </div>
                        <div>
                          <p className="font-black text-lg text-lsecondary dark:text-dtext truncate max-w-sm tracking-tight">{project.userPaper.name}</p>
                          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mt-1 dark:text-dtext">{(project.userPaper.size / 1024).toFixed(1)} KB • UPLOADED SOURCE</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateProject({ userPaper: undefined })}
                        className="p-4 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-2xl transition-all hover:rotate-12"
                        title="Remove Paper"
                      >
                        <i className="fa-solid fa-trash-can text-xl"></i>
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => userPaperInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingUserPaper(true); }}
                      onDragLeave={() => setIsDraggingUserPaper(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDraggingUserPaper(false); if (e.dataTransfer.files) processUserPaper(e.dataTransfer.files); }}
                      className={`border-4 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${isDraggingUserPaper ? 'border-lsecondary bg-lsecondary/5 scale-[0.98]' : 'border-lsecondary/10 dark:border-gray-800 bg-lbg/10 dark:bg-gray-900/10 hover:border-lsecondary/40 hover:bg-lsecondary/5'}`}
                    >
                      <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                        <i className={`fa-solid fa-cloud-arrow-up text-5xl transition-colors ${isDraggingUserPaper ? 'text-lsecondary' : 'text-lsecondary/20 dark:text-dtext/20'}`}></i>
                      </div>
                      <h4 className="font-black text-lsecondary dark:text-dtext uppercase tracking-[0.3em] text-sm mb-4">Upload Your Specific Paper</h4>
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] text-center max-w-xs leading-relaxed dark:text-dtext">Select the document you want the AI to analyze for errors or consistency</p>
                      <input type="file" className="hidden" ref={userPaperInputRef} onChange={handleUserPaperUpload} />
                    </div>
                  )}
                </div>
              )}

              {/* Contradict Specific Prompt and Corpus */}
              {project.mode === 'contradict' && (
                <>
                  <div className="group">
                    <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70 group-focus-within:text-lsecondary transition-colors">
                      Focus Context (Optional)
                    </label>
                    <textarea 
                      rows={3}
                      value={project.prompt}
                      onChange={(e) => updateProject({ prompt: e.target.value })}
                      placeholder="e.g. Focus on conflicts regarding the dataset validation or methodology logic."
                      className="w-full px-6 py-5 bg-lbg/20 dark:bg-gray-900 border-2 border-lsecondary/10 dark:border-gray-800 rounded-2xl outline-none focus:ring-4 focus:ring-lsecondary/10 focus:border-lsecondary dark:focus:border-gray-600 resize-none font-black tracking-tight text-ltext dark:text-dtext"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black mb-5 uppercase tracking-[0.3em] text-lsecondary dark:text-dtext opacity-70">
                      Comparison Universe
                    </label>
                    <div className="flex flex-wrap gap-5">
                      {['uploaded', 'external'].map(c => (
                        <button 
                          key={c}
                          onClick={() => {
                            const newCorpus = project.corpus.includes(c as any) 
                              ? project.corpus.filter(x => x !== c)
                              : [...project.corpus, c as any];
                            if (newCorpus.length > 0) updateProject({ corpus: newCorpus });
                          }}
                          className={`flex items-center gap-4 px-8 py-5 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm ${project.corpus.includes(c as any) ? 'border-lsecondary bg-lsecondary text-white shadow-lsecondary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-dtext' : 'border-lsecondary/10 dark:border-gray-800 bg-white/50 dark:bg-black/20 opacity-60 hover:opacity-100 hover:border-lsecondary/40 dark:text-dtext'}`}
                        >
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${project.corpus.includes(c as any) ? 'bg-white text-lsecondary border-white dark:bg-gray-900 dark:text-dtext dark:border-gray-600' : 'border-lsecondary/20 dark:border-gray-700'}`}>
                            {project.corpus.includes(c as any) && <i className="fa-solid fa-check text-[10px]"></i>}
                          </div>
                          {c === 'uploaded' ? 'My Local Corpus' : 'Global Research (External)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {project.mode === 'claim' && (
                <div className="p-10 text-center border-2 border-lsecondary/10 dark:border-gray-800 rounded-[2rem] bg-lbg/20 dark:bg-gray-900/10 shadow-inner">
                  <div className="w-12 h-1 bg-lsecondary/20 mx-auto mb-6 rounded-full"></div>
                  <h4 className="text-xs font-black text-lsecondary dark:text-dtext uppercase tracking-[0.4em] mb-4">Advanced Verification Engine</h4>
                  <p className="text-[11px] font-bold opacity-60 max-w-sm mx-auto text-ltext dark:text-dtext leading-relaxed">Our AI will systematically verify every claim in your paper against the cross-referenced literature in your workspace.</p>
                </div>
              )}
            </div>

            <div className="pt-12 border-t-4 border-lsecondary/5 dark:border-gray-800">
              <button 
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-6 py-3 text-xs font-black text-lsecondary dark:text-dtext border-2 border-lsecondary/10 hover:border-lsecondary/40 dark:border-gray-700 rounded-xl transition-all flex items-center gap-2 uppercase tracking-[0.2em]"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-sync fa-spin text-2xl"></i>
                    Processing Intelligence...
                  </>
                ) : (
                  `Execute ${project.mode} analysis`
                )}
              </button>
            </div>
          </div>

          {project.result && (
            <div className="mt-12 p-10 bg-white dark:bg-black/40 border-2 border-lsecondary/10 dark:border-gray-800 rounded-[2.5rem] animate-in zoom-in-95 duration-500 shadow-xl">
               <h2 className="text-xl font-black mb-10 flex items-center gap-4 text-lsecondary dark:text-dtext uppercase tracking-[0.3em]">
                <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
                Synthesis Results
              </h2>

              {project.mode === 'contradict' && project.result.contradictions && (
                <div className="space-y-10">
                  <div className="group">
                    <h3 className="font-black text-[11px] uppercase opacity-40 mb-5 tracking-[0.4em] text-lsecondary dark:text-dtext group-hover:opacity-100 transition-opacity">Module 01: Internal Divergence</h3>
                    <div className="space-y-3">
                      {project.result.contradictions.uploaded.map((c, i) => (
                        <div key={i} className="flex gap-5 text-sm font-bold p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border-l-8 border-red-600 shadow-sm text-ltext dark:text-dtext">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mt-1 text-lg"></i>
                          <p className="leading-relaxed">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="group">
                    <h3 className="font-black text-[11px] uppercase opacity-40 mb-5 tracking-[0.4em] text-lsecondary dark:text-dtext group-hover:opacity-100 transition-opacity">Module 02: External Conflict</h3>
                    <div className="space-y-3">
                      {project.result.contradictions.external.map((c, i) => (
                        <div key={i} className="flex gap-5 text-sm font-bold p-5 bg-lsecondary/5 dark:bg-gray-900/60 rounded-2xl border-l-8 border-lsecondary dark:border-gray-700 shadow-sm text-ltext dark:text-dtext">
                          <i className="fa-solid fa-link-slash text-lsecondary dark:text-dtext mt-1 text-lg"></i>
                          <p className="leading-relaxed">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {project.mode === 'claim' && project.result.claims && (
                <div className="space-y-6">
                  <div className={`flex items-center gap-5 p-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-lg ${project.result.claims.status === 'correct' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    <i className={`fa-solid ${project.result.claims.status === 'correct' ? 'fa-circle-check' : 'fa-circle-xmark'} text-2xl`}></i>
                    STATUS: {project.result.claims.status}
                  </div>
                  <div className="p-8 bg-lbg/30 dark:bg-gray-900 rounded-3xl border-2 border-lsecondary/5 dark:border-gray-800 shadow-inner">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-5 text-lsecondary dark:text-dtext">Diagnostic Evidence</p>
                    <ul className="space-y-4">
                      {project.result.claims.issues.map((iss, i) => (
                        <li key={i} className="text-sm font-bold flex gap-4 text-ltext dark:text-dtext opacity-90 leading-relaxed">
                          <span className="text-lsecondary dark:text-dtext font-black">#0{i+1}</span>
                          {iss}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-base opacity-90 leading-relaxed font-black italic border-t-2 border-lsecondary/5 dark:border-gray-800 pt-8 text-lsecondary dark:text-dtext pl-4">
                    "{project.result.claims.details}"
                  </div>
                </div>
              )}

              {project.mode === 'hypothesis' && project.result.hypothesis && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2rem] border-2 border-lsecondary/5 dark:border-gray-800 shadow-sm">
                      <h4 className="font-black text-lsecondary dark:text-dtext mb-6 uppercase text-[11px] tracking-[0.3em] flex items-center gap-3">
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                        Critical Gaps
                      </h4>
                      <ul className="space-y-4">
                        {project.result.hypothesis.gaps.map((gap, i) => (
                          <li key={i} className="text-sm font-bold flex gap-3 leading-relaxed text-ltext dark:text-dtext">
                            <span className="w-1.5 h-1.5 rounded-full bg-lsecondary dark:bg-dtext mt-1.5 shrink-0"></span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2rem] border-2 border-laccent/10 dark:border-gray-800 shadow-sm">
                      <h4 className="font-black text-laccent mb-6 uppercase text-[11px] tracking-[0.3em] flex items-center gap-3">
                        <i className="fa-solid fa-lightbulb"></i>
                        New Hypotheses
                      </h4>
                      <ul className="space-y-4">
                        {project.result.hypothesis.hypotheses.map((hyp, i) => (
                          <li key={i} className="text-sm font-bold flex gap-3 leading-relaxed text-ltext dark:text-dtext">
                            <span className="w-1.5 h-1.5 rounded-full bg-laccent mt-1.5 shrink-0"></span>
                            {hyp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-10 bg-gradient-to-br from-lsecondary to-blue-900 dark:from-gray-800 dark:to-dbg text-white dark:text-dtext rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                       <i className="fa-solid fa-star text-8xl"></i>
                    </div>
                    <h4 className="font-black uppercase text-[11px] mb-4 opacity-70 tracking-[0.4em]">Proprietary Research Path</h4>
                    <p className="text-2xl font-black italic tracking-tight leading-tight">"{project.result.hypothesis.novelIdea}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpsPage;
