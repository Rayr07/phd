
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';
import FileUpload from './FileUpload.tsx';
import Input from './Input.tsx';
import { Search, Scale, FileCheck, Lightbulb, Send, Info, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Lock } from 'lucide-react';

type OpsMode = 'contradict' | 'claim' | 'hypothesis';

interface AnalysisResult {
  mode: OpsMode;
  data: any;
}

const OpsPage: React.FC = () => {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  
  const [mode, setMode] = useState<OpsMode>('contradict');
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  
  // Specific state for modes
  const [contradictData, setContradictData] = useState({
    domain: '',
    prompt: '',
    paper: [] as File[],
    corpus: { uploaded: true, external: false }
  });

  const [claimPaper, setClaimPaper] = useState<File[]>([]);
  const [hypothesisDomain, setHypothesisDomain] = useState('');

  const handleUploadSources = async () => {
    if (sourceFiles.length === 0) return;
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    alert(`${sourceFiles.length} files successfully indexed into the research corpus.`);
  };

  // Validation Logic
  const canRunAnalysis = () => {
    // Global constraint: Source papers must be uploaded in source input
    if (sourceFiles.length === 0) return false;

    if (mode === 'contradict') {
      return (
        contradictData.domain.trim() !== '' && 
        contradictData.paper.length > 0 && 
        (contradictData.corpus.uploaded || contradictData.corpus.external)
      );
    }
    
    if (mode === 'claim') {
      return claimPaper.length === 1;
    }
    
    if (mode === 'hypothesis') {
      return hypothesisDomain.trim() !== '';
    }

    return false;
  };

  const getValidationError = () => {
    if (sourceFiles.length === 0) return "Global Requirement: Please upload source documents to the corpus first.";
    
    if (mode === 'contradict') {
      if (!contradictData.domain.trim()) return "Requirement: Research domain is mandatory.";
      if (contradictData.paper.length === 0) return "Requirement: Current analysis paper is mandatory.";
      if (!contradictData.corpus.uploaded && !contradictData.corpus.external) return "Requirement: Select at least one corpus selector option.";
    }
    
    if (mode === 'claim' && claimPaper.length === 0) {
      return "Requirement: One paper for citation check is mandatory.";
    }
    
    if (mode === 'hypothesis' && !hypothesisDomain.trim()) {
      return "Requirement: Domain area is mandatory.";
    }
    
    return null;
  };

  const handleRunAnalysis = async () => {
    if (!canRunAnalysis()) return;

    setIsAnalyzing(true);
    setResults(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (mode === 'contradict') {
      setResults({
        mode: 'contradict',
        data: {
          part1: ["Statement on page 4 regarding thermal dynamics contradicts source 'Alpha_2023.pdf'", "Conflict found in methodology section vs standard corpus practices."],
          part2: ["External paper 'Study_Z' suggests alternative variable mapping not used in current submission.", "3 papers in the external corpus report higher variance than your results."]
        }
      });
    } else if (mode === 'claim') {
      setResults({
        mode: 'claim',
        data: {
          citations: [
            { text: "Johnson et al. (2021) - Correct", valid: true },
            { text: "Smith (2019) - Date mismatch (Source says 2018)", valid: false },
            { text: "DOE Protocol v4 - Page number incorrect (74 instead of 47)", valid: false }
          ]
        }
      });
    } else {
      setResults({
        mode: 'hypothesis',
        data: {
          gaps: ["Gap in temporal resolution across all 3 uploaded papers.", "Limited data on sub-zero environments in current corpus."],
          hypotheses: ["Increasing sampling frequency to 10ms may reveal the hidden oscillation patterns.", "Applying the Tesla principle to molecular bonding might bridge the current theoretical gap."],
          novel: "Hybridizing the Bayesian approach with the uploaded 'Paper_X' results to create a Predictive Research Framework."
        }
      });
    }
    setIsAnalyzing(false);
  };

  const ModeButton = ({ id, label, icon: Icon }: { id: OpsMode, label: string, icon: any }) => {
    const active = mode === id;
    const activeBg = active ? colors.primary : 'transparent';
    const activeColor = active ? colors.background : colors.text;

    return (
      <button
        onClick={() => { setMode(id); setResults(null); }}
        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${active ? 'shadow-lg scale-[1.02]' : 'opacity-40 hover:opacity-100'}`}
        style={{ 
          backgroundColor: activeBg,
          color: activeColor,
          border: `1px solid ${active ? 'transparent' : (theme === 'dark' ? '#333' : `${colors.primary}20`)}`
        }}
      >
        <Icon size={16} />
        {label}
      </button>
    );
  };

  const error = getValidationError();
  const cardBorder = theme === 'dark' ? '1px solid #333' : '1px solid rgba(0,0,0,0.05)';
  const brandColor = colors.primary;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter" style={{ color: brandColor }}>Operations Hub</h1>
        <p className="opacity-60 font-medium">Research Orchestration & Document Verification</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Sources Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[2.5rem] shadow-xl flex flex-col gap-6" style={{ backgroundColor: colors.card, border: cardBorder }}>
            <div className="space-y-1">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Search size={20} style={{ color: colors.accent }} />
                Source Input
              </h2>
              <p className="text-sm opacity-60">Upload documents to build your knowledge base</p>
            </div>
            
            <FileUpload 
              label="Source Documents"
              files={sourceFiles}
              onFilesAdded={(newFiles) => setSourceFiles([...sourceFiles, ...newFiles])}
              onFileRemoved={(idx) => setSourceFiles(sourceFiles.filter((_, i) => i !== idx))}
              onClear={() => setSourceFiles([])}
            />

            <div className="flex gap-2">
              <button
                onClick={handleUploadSources}
                disabled={sourceFiles.length === 0 || isUploading}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
                style={{ backgroundColor: brandColor, color: colors.background }}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
              <button
                onClick={() => setSourceFiles([])}
                className="px-4 py-3 rounded-xl font-bold text-sm border transition-all hover:bg-red-500 hover:text-white"
                style={{ borderColor: theme === 'dark' ? '#333' : `${colors.primary}20` }}
              >
                Clear All
              </button>
            </div>

            <div className="p-4 rounded-2xl flex gap-3 text-[11px] leading-relaxed" style={{ backgroundColor: `${brandColor}05`, color: brandColor, border: theme === 'dark' ? '1px solid #333' : 'none' }}>
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <p><b>Strict Constraint:</b> All operations are locked until source documents are uploaded to the corpus.</p>
            </div>
          </div>
        </section>

        {/* Right: Options & Results Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="p-8 rounded-[2.5rem] shadow-xl space-y-8" style={{ backgroundColor: colors.card, border: cardBorder }}>
            
            {/* Mode Switcher */}
            <div className="flex gap-3 p-1 rounded-3xl bg-black/5 dark:bg-white/5" style={{ border: theme === 'dark' ? '1px solid #333' : 'none' }}>
              <ModeButton id="contradict" label="Contradict" icon={Scale} />
              <ModeButton id="claim" label="Claim Check" icon={FileCheck} />
              <ModeButton id="hypothesis" label="Hypothesis" icon={Lightbulb} />
            </div>

            {/* Mode Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                {mode === 'contradict' && (
                  <>
                    <Input 
                      label="Research Domain (Mandatory)"
                      placeholder="e.g. Theoretical Physics"
                      value={contradictData.domain}
                      onChange={(e) => setContradictData({...contradictData, domain: e.target.value})}
                      required
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-60">Optional Prompt</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 text-sm h-24"
                        style={{ backgroundColor: colors.input, borderColor: theme === 'dark' ? '#333' : `${brandColor}10`, color: colors.text }}
                        placeholder="Additional context for contradiction focus..."
                        value={contradictData.prompt}
                        onChange={(e) => setContradictData({...contradictData, prompt: e.target.value})}
                      />
                    </div>
                  </>
                )}
                {mode === 'claim' && (
                  <div className="bg-orange-500/5 p-5 rounded-2xl flex gap-3 text-xs italic border border-orange-500/10 h-full">
                    <FileCheck size={18} className="text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="font-black uppercase tracking-widest mb-1" style={{ color: colors.accent }}>Citation Verification</p>
                      <p>Upload your paper on the right to verify citations against the corpus.</p>
                    </div>
                  </div>
                )}
                {mode === 'hypothesis' && (
                  <Input 
                    label="Domain Area (Mandatory)"
                    placeholder="Identify target area for gaps..."
                    value={hypothesisDomain}
                    onChange={(e) => setHypothesisDomain(e.target.value)}
                    icon={<Lightbulb size={16} />}
                    required
                  />
                )}
              </div>

              <div className="space-y-6">
                {(mode === 'contradict' || mode === 'claim') && (
                  <FileUpload 
                    label={mode === 'contradict' ? "Current Paper to Analyze (Mandatory)" : "Research Paper for Verification (Mandatory)"}
                    multiple={false}
                    files={mode === 'contradict' ? contradictData.paper : claimPaper}
                    onFilesAdded={(newFiles) => mode === 'contradict' ? setContradictData({...contradictData, paper: newFiles}) : setClaimPaper(newFiles)}
                    onFileRemoved={() => mode === 'contradict' ? setContradictData({...contradictData, paper: []}) : setClaimPaper([])}
                    onClear={() => mode === 'contradict' ? setContradictData({...contradictData, paper: []}) : setClaimPaper([])}
                  />
                )}
                
                {mode === 'contradict' && (
                   <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Corpus Selector (Select At Least One)</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: theme === 'dark' ? '#333' : `${brandColor}10` }}>
                        <input 
                          type="checkbox" 
                          checked={contradictData.corpus.uploaded}
                          onChange={() => setContradictData({...contradictData, corpus: {...contradictData.corpus, uploaded: !contradictData.corpus.uploaded}})}
                          className="w-4 h-4 rounded accent-current" 
                          style={{ color: brandColor }}
                        />
                        <span className="text-sm font-bold">Uploaded Paper</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: theme === 'dark' ? '#333' : `${brandColor}10` }}>
                        <input 
                          type="checkbox" 
                          checked={contradictData.corpus.external}
                          onChange={() => setContradictData({...contradictData, corpus: {...contradictData.corpus, external: !contradictData.corpus.external}})}
                          className="w-4 h-4 rounded accent-current" 
                          style={{ color: brandColor }}
                        />
                        <span className="text-sm font-bold">External Database</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {mode === 'hypothesis' && (
                  <div className="bg-orange-500/5 p-5 rounded-2xl flex gap-3 text-xs italic border border-orange-500/10 h-full">
                    <Sparkles size={18} className="text-orange-500 flex-shrink-0" />
                    <p>PHD Engine identifies thematic gaps across your source corpus and synthesizes a novel hypothesis in the {hypothesisDomain || 'specified domain'}.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t" style={{ borderColor: theme === 'dark' ? '#333' : 'rgba(0,0,0,0.05)' }}>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold animate-pulse" style={{ border: theme === 'dark' ? '1px solid #333' : 'none' }}>
                  <Lock size={14} />
                  {error}
                </div>
              )}
              
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !canRunAnalysis()}
                className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed"
                style={{ backgroundColor: brandColor, color: colors.background }}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing Research...
                  </>
                ) : (
                  <>
                    Execute Operation
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Results Output Section */}
            {results && (
              <div className="mt-8 p-8 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-500 space-y-6" style={{ backgroundColor: `${colors.background}80`, border: theme === 'dark' ? '1px solid #333' : `1px solid ${brandColor}10` }}>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" />
                  Engine Results
                </h3>

                {results.mode === 'contradict' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Part 1: Internal Contradictions</h4>
                      <div className="space-y-2">
                        {results.data.part1.map((item: string, i: number) => (
                          <div key={i} className="flex gap-2 text-sm p-3 rounded-xl bg-white/50 dark:bg-black/50 border" style={{ borderColor: theme === 'dark' ? '#333' : 'rgba(239, 68, 68, 0.2)' }}>
                            <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Part 2: External Contradictions</h4>
                      <div className="space-y-2">
                        {results.data.part2.map((item: string, i: number) => (
                          <div key={i} className="flex gap-2 text-sm p-3 rounded-xl bg-white/50 dark:bg-black/50 border" style={{ borderColor: theme === 'dark' ? '#333' : 'rgba(249, 115, 22, 0.2)' }}>
                            <BookOpen size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {results.mode === 'claim' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Citation Verification Report</h4>
                    <div className="grid gap-3">
                      {results.data.citations.map((cite: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 ${cite.valid ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`} style={{ border: theme === 'dark' ? '2px solid #333' : undefined }}>
                          <div className="flex items-center gap-3">
                            {cite.valid ? <CheckCircle2 size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-500" />}
                            <span className={`text-sm font-bold ${!cite.valid ? 'underline decoration-red-500 decoration-wavy' : ''}`}>{cite.text}</span>
                          </div>
                          {!cite.valid && <span className="text-[10px] font-black uppercase text-red-500">Citation Error</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.mode === 'hypothesis' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Identified Gaps (Per Paper)</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.data.gaps.map((gap: string, i: number) => (
                          <div key={i} className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-xs font-bold border" style={{ borderColor: theme === 'dark' ? '#333' : 'rgba(0,0,0,0.1)' }}>
                            {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Generated Hypotheses</h4>
                      <div className="grid gap-3">
                         {results.data.hypotheses.map((hypo: string, i: number) => (
                           <div key={i} className="p-4 rounded-xl bg-white/50 dark:bg-black/50 border-l-4 border-orange-400 text-sm italic" style={{ borderTop: theme === 'dark' ? '1px solid #333' : 'none', borderRight: theme === 'dark' ? '1px solid #333' : 'none', borderBottom: theme === 'dark' ? '1px solid #333' : 'none' }}>
                             "{hypo}"
                           </div>
                         ))}
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-400/10 to-accent/10 border" style={{ borderColor: theme === 'dark' ? '#333' : 'rgba(249, 115, 22, 0.2)' }}>
                      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Synthesis: Novel Research Idea</h4>
                      <p className="text-sm font-black italic">"{results.data.novel}"</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OpsPage;
