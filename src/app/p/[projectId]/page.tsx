'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, UploadCloud, Edit3, Loader2, Sparkles, FileSearch, Scale } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type OperationType = 'contradiction' | 'validation' | 'hypothesis'

interface StorageFile {
  name: string
  metadata?: any
}

export default function ProjectOperationsPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const supabase = createClient()

  const [projectName, setProjectName] = useState('Untitled Project')
  const [isEditingName, setIsEditingName] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [activeTab, setActiveTab] = useState<OperationType>('contradiction')
  
  const [uploadedFiles, setUploadedFiles] = useState<StorageFile[]>([])
  const [userPaperFile, setUserPaperFile] = useState<StorageFile | null>(null)
  
  const [domain, setDomain] = useState('')
  const [contextInput, setContextInput] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      if (!projectId.startsWith('mock')) {
        // Fetch project metadata
        const { data: projData } = await supabase.from('projects').select('name, domain, ai_output').eq('id', projectId).single()
        if (projData) {
          setProjectName(projData.name)
          if (projData.domain) setDomain(projData.domain)
          if (projData.ai_output) setResult(projData.ai_output)
        }

        // Fetch files from Storage
        const { data: repoData } = await supabase.storage.from('project_files').list(`${user.id}/${projectId}/repo`)
        if (repoData) {
          // Filter out the empty folder placeholder if any
          setUploadedFiles(repoData.filter(f => f.name !== '.emptyFolderPlaceholder'))
        }

        const { data: userData } = await supabase.storage.from('project_files').list(`${user.id}/${projectId}/user`)
        if (userData && userData.length > 0) {
          const actualFiles = userData.filter(f => f.name !== '.emptyFolderPlaceholder')
          if (actualFiles.length > 0) setUserPaperFile(actualFiles[0])
        }
      }
    }
    init()
  }, [projectId])

  const handleDomainChange = async (val: string) => {
    setDomain(val)
    if (!projectId.startsWith('mock')) {
      await supabase.from('projects').update({ domain: val }).eq('id', projectId)
    }
  }

  const syncPaperCount = async (count: number) => {
    if (!projectId.startsWith('mock')) {
      await supabase.from('projects').update({ paper_count: count }).eq('id', projectId)
    }
  }

  const handleRepoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && userId && !projectId.startsWith('mock')) {
      setLoading(true)
      const newStorageFiles: StorageFile[] = [...uploadedFiles]
      
      for (const file of Array.from(e.target.files)) {
        const path = `${userId}/${projectId}/repo/${file.name}`
        const { data, error } = await supabase.storage.from('project_files').upload(path, file, { upsert: true })
        
        if (!error) {
          const { data: fileStat } = await supabase.storage.from('project_files').list(`${userId}/${projectId}/repo`, { search: file.name })
          if (fileStat && fileStat.length > 0) {
            newStorageFiles.push(fileStat[0] as StorageFile)
          }
        } else {
            console.error("Storage upload failed: ", error)
        }
      }
      setUploadedFiles(newStorageFiles)
      syncPaperCount(newStorageFiles.length)
      setLoading(false)
    }
  }

  const handleUserPaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && userId && !projectId.startsWith('mock')) {
      setLoading(true)
      const file = e.target.files[0]
      const path = `${userId}/${projectId}/user/${file.name}`
      
      // Delete existing user file to cleanly replace it
      if (userPaperFile) {
         await supabase.storage.from('project_files').remove([`${userId}/${projectId}/user/${userPaperFile.name}`])
      }

      await supabase.storage.from('project_files').upload(path, file, { upsert: true })
      
      const { data: fileStat } = await supabase.storage.from('project_files').list(`${userId}/${projectId}/user`, { search: file.name })
      if (fileStat && fileStat.length > 0) {
        setUserPaperFile(fileStat[0] as StorageFile)
      }
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (projectName.trim()) {
      setIsEditingName(false)
      if (!projectId.startsWith('mock')) {
        await supabase.from('projects').update({ name: projectName.trim() }).eq('id', projectId)
      }
    }
  }

  const handleRemoveRepoFile = async (fileName: string) => {
    if (!userId || projectId.startsWith('mock')) return
    
    // Remove from storage
    const path = `${userId}/${projectId}/repo/${fileName}`
    await supabase.storage.from('project_files').remove([path])
    
    // Update local state
    const newFiles = uploadedFiles.filter((f) => f.name !== fileName)
    setUploadedFiles(newFiles)
    syncPaperCount(newFiles.length)
  }

  const runOperation = async () => {
    if (activeTab === 'contradiction' && (!domain || !userPaperFile)) return alert('Domain and your User Paper PDF are required.')
    if (activeTab === 'validation' && !userPaperFile) return alert('Your User Paper PDF is required for validation.')
    if (activeTab === 'hypothesis' && !domain) return alert('Domain is required to generate hypotheses.')

    setLoading(true)
    setResult(null)
    try {
      const payload = {
        operation: activeTab,
        domain: domain,
        context: contextInput,
        userId: userId,
        projectId: projectId,
        repoFiles: uploadedFiles.map(f => f.name),
        userFile: userPaperFile ? userPaperFile.name : null
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (res.ok) {
        setResult(data.result)
        if (!projectId.startsWith('mock')) {
             await supabase.from('projects').update({ ai_output: data.result }).eq('id', projectId)
        }
      } else {
        setResult('Error: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      setResult('Failed to connect to AI engine. Make sure your API key is in .env.local and Dev Server was restarted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="p-2 bg-card hover:bg-input rounded-xl border border-input transition-colors text-foreground/70 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            {isEditingName ? (
              <input 
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none text-foreground py-1 px-2"
              />
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl font-bold text-foreground">{projectName}</h1>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-input rounded-lg transition-all text-foreground/50 hover:text-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Panel: Uploads */}
          <div className="lg:w-1/3 flex flex-col bg-card border border-input rounded-3xl p-6 shadow-sm overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <UploadCloud className="w-5 h-5 text-primary" /> Repository
            </h2>
            <p className="text-sm text-foreground/60 mb-6">Upload literature and reference PDFs for RAG context. Auto-saved globally to Supabase.</p>

            <label className="border-2 border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer mb-6 text-center disabled:opacity-50">
              <UploadCloud className="w-10 h-10 text-primary/50 mb-4" />
              <span className="text-sm font-medium text-foreground">Click to upload Repository PDFs</span>
              <span className="text-xs text-foreground/50 mt-1">Files saved entirely in the cloud.</span>
              <input type="file" multiple accept=".pdf" className="hidden" onChange={handleRepoUpload} disabled={loading} />
            </label>

            <div className="flex-1">
              <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Uploaded References ({uploadedFiles.length})</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {uploadedFiles.map((file, i) => (
                    <motion.div 
                      key={file.name + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-input/50 rounded-xl flex items-center justify-between group border border-transparent hover:border-primary/20 transition-all text-sm"
                    >
                      <span className="truncate pr-4 text-foreground/80 font-medium">{file.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-foreground/40">{((file.metadata?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
                        <button 
                          onClick={() => handleRemoveRepoFile(file.name)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-foreground/40 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {uploadedFiles.length === 0 && (
                    <div className="text-sm text-foreground/40 text-center py-4">No reference PDFs uploaded yet.</div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel: Operations */}
          <div className="lg:w-2/3 flex flex-col bg-card border border-input rounded-3xl p-6 shadow-sm overflow-hidden flex-1">
            
            {/* Tabs */}
            <div className="flex p-1 bg-input/50 rounded-xl mb-6 shrink-0 shadow-inner">
              <button onClick={() => { setActiveTab('contradiction'); setResult(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'contradiction' ? 'bg-card text-primary shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>
                <Scale className="w-4 h-4" /> Contradiction
              </button>
              <button onClick={() => { setActiveTab('validation'); setResult(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'validation' ? 'bg-card text-primary shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>
                <FileSearch className="w-4 h-4" /> Claim Check
              </button>
              <button onClick={() => { setActiveTab('hypothesis'); setResult(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'hypothesis' ? 'bg-card text-accent shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>
                <Sparkles className="w-4 h-4" /> Hypothesis
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2"
                >
                  
                  {(activeTab === 'contradiction' || activeTab === 'hypothesis') && (
                     <div className="space-y-1.5 shrink-0">
                       <label className="text-sm font-medium text-foreground/80">Research Domain <span className="text-red-500">*</span></label>
                       <input 
                         value={domain} onChange={e => handleDomainChange(e.target.value)}
                         placeholder="e.g., Quantum Computing, Oncology..."
                         className="w-full bg-input/40 border border-input focus:border-primary px-4 py-2.5 rounded-xl outline-none text-foreground text-sm transition-all"
                       />
                     </div>
                   )}

                  {(activeTab === 'contradiction' || activeTab === 'validation') && (
                    <div className="space-y-3 flex-1 flex flex-col shrink-0 min-h-[150px]">
                      <label className="text-sm font-medium text-foreground/80">Your Paper Output (Upload PDF) <span className="text-red-500">*</span></label>
                      <label className="w-full block bg-input/40 border border-input focus:border-primary px-4 py-8 rounded-xl outline-none text-foreground text-sm resize-none transition-all cursor-pointer text-center hover:bg-input/60">
                        {userPaperFile ? (
                           <span className="font-semibold text-primary block">Ready: {userPaperFile.name} (Click to change)</span>
                        ) : (
                           <span className="text-foreground/50">Click to upload your research paper PDF</span>
                        )}
                        <input type="file" accept=".pdf" className="hidden" onChange={handleUserPaperUpload} disabled={loading} />
                      </label>
                    </div>
                  )}

                  {activeTab === 'contradiction' && (
                    <div className="space-y-1.5 shrink-0">
                      <label className="text-sm font-medium text-foreground/80">Focus Context (Optional)</label>
                      <input 
                        value={contextInput} onChange={e => setContextInput(e.target.value)}
                        placeholder="Specific methodology or nuance..."
                        className="w-full bg-input/40 border border-input focus:border-primary px-4 py-2.5 rounded-xl outline-none text-foreground text-sm transition-all"
                      />
                    </div>
                  )}

                  {activeTab === 'hypothesis' && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl shrink-0 mt-4">
                      <p className="text-sm text-primary/80 flex items-start gap-2">
                        <Sparkles className="w-5 h-5 shrink-0" />
                        Our AI will synthesize uploaded repository literature across the provided domain to locate gaps and recommend truly novel research directions.
                      </p>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Run Button & Result */}
            <div className="mt-6 pt-6 border-t border-input shrink-0">
              <button 
                onClick={runOperation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Supercompute'}
              </button>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    className="p-5 bg-input/40 border border-card rounded-xl"
                  >
                    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI Output
                    </h4>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {result}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
