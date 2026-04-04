'use client'

import { useState, useMemo, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectModal } from '@/components/ProjectModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Filter, SortDesc, DatabaseZap } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import localforage from 'localforage'

interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  bookmarked: boolean
  paperCount: number
}

type SortOption = 'recent' | 'date_created' | 'alphabetical'
type FilterOption = 'all' | 'bookmarked'

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'rename' | 'delete'>('rename')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedProjectName, setSelectedProjectName] = useState<string>('')

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.warn("Supabase Project fetch failed (table might not exist). Falling back to local state.", error)
        setDbError(true)
        // Fallback dummy
        setProjects([
          { id: 'mock1', name: 'Local: Quantum ML', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), bookmarked: false, paperCount: 0 }
        ])
      } else if (data) {
        setDbError(false)
        setDbError(false)
        const mappedProjects = data.map((p) => ({
            id: p.id,
            name: p.name,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            bookmarked: p.bookmarked,
            paperCount: Math.max(0, p.paper_count || 0)
        }))
        console.log("Successfully fetched projects from Supabase. Mapped State:", mappedProjects)
        setProjects(mappedProjects)
      }
    }
    setLoading(false)
  }

  // Import router at the top (already assumed within the component, but we need to add it below)
  // Actually, we need to add useRouter hook. I'll replace more lines to include it.
  
  const handleCreateProject = async () => {
    const name = 'Untitled Project'
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return alert('Not authenticated')

    let newId = ''

    if (!dbError) {
      const { data, error } = await supabase.from('projects').insert([{
        name: name,
        user_id: user.id
      }]).select().single()

      if (!error && data) {
        newId = data.id
      }
    }
    
    if (!newId) {
      // Local fallback
      newId = 'mock_' + Math.random().toString(36).substr(2, 9)
      const mockProj = {
        id: newId,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookmarked: false,
        paperCount: 0
      }
      setProjects([mockProj, ...projects])
      /* Save fallback list to localforage so it survives refresh if DB missing */
      await localforage.setItem('mock_projects', [mockProj, ...projects])
    }
    
    // Using window.location.href for immediate hard redirect so we don't have to fiddle with router imports
    window.location.href = `/p/${newId}`
  }

  const handleToggleBookmark = async (id: string, current: boolean) => {
    if (!dbError && !id.startsWith('mock')) {
      await supabase.from('projects').update({ bookmarked: !current }).eq('id', id)
    }
    setProjects(prev => {
      const next = prev.map(p => p.id === id ? { ...p, bookmarked: !current } : p)
      if (id.startsWith('mock')) localforage.setItem('mock_projects', next.filter(p => p.id.startsWith('mock')))
      return next
    })
  }

  const handleDelete = (id: string) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setSelectedProjectId(id)
      setSelectedProjectName(project.name)
      setModalType('delete')
      setModalOpen(true)
    }
  }

  const handleRename = (id: string) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setSelectedProjectId(id)
      setSelectedProjectName(project.name)
      setModalType('rename')
      setModalOpen(true)
    }
  }

  const handleModalConfirm = async (newName?: string) => {
    const id = selectedProjectId
    
    if (modalType === 'delete') {
      if (!dbError && !id.startsWith('mock')) {
        await supabase.from('projects').delete().eq('id', id)
      }
      setProjects(prev => {
        const next = prev.filter(p => p.id !== id)
        if (id.startsWith('mock')) localforage.setItem('mock_projects', next.filter(p => p.id.startsWith('mock')))
        return next
      })
    } else if (modalType === 'rename' && newName) {
      if (!dbError && !id.startsWith('mock')) {
        await supabase.from('projects').update({ name: newName.trim(), updated_at: new Date().toISOString() }).eq('id', id)
      }
      setProjects(prev => {
        const next = prev.map(p => p.id === id ? { ...p, name: newName.trim() } : p)
        if (id.startsWith('mock')) localforage.setItem('mock_projects', next.filter(p => p.id.startsWith('mock')))
        return next
      })
    }
    
    setModalOpen(false)
    setSelectedProjectId('')
    setSelectedProjectName('')
  }

  const handleModalCancel = () => {
    setModalOpen(false)
    setSelectedProjectId('')
    setSelectedProjectName('')
  }

  const displayedProjects = useMemo(() => {
    let result = [...projects]
    
    if (filterBy === 'bookmarked') result = result.filter(p => p.bookmarked)
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    
    result.sort((a, b) => {
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name)
      if (sortBy === 'date_created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    return result
  }, [projects, search, sortBy, filterBy])

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {dbError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
            <DatabaseZap className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-500">Database Table Missing</h3>
              <p className="text-xs text-red-500/80 mt-1">
                We couldn't find the `projects` table in your Supabase. You are in <b>Local Mode</b>. To persist projects, run the SQL script provided in your Supabase SQL Editor.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Workspaces</h1>
            <p className="text-foreground/60 mt-1">Manage your research projects and analyses.</p>
          </div>
          <button 
            onClick={handleCreateProject}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card/50 p-2 rounded-2xl border border-input">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input/50 border border-transparent focus:border-primary pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex items-center bg-input/50 rounded-xl px-3 border border-transparent focus-within:border-primary transition-all">
              <Filter className="w-4 h-4 text-foreground/40 mr-2" />
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="bg-transparent text-sm focus:outline-none py-2 text-foreground appearance-none pr-4 cursor-pointer"
              >
                <option value="all">All Projects</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>

            <div className="relative flex items-center bg-input/50 rounded-xl px-3 border border-transparent focus-within:border-primary transition-all">
              <SortDesc className="w-4 h-4 text-foreground/40 mr-2" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm focus:outline-none py-2 text-foreground appearance-none pr-4 cursor-pointer"
              >
                <option value="recent">Recently Changed</option>
                <option value="date_created">Date Created</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading workspaces...</div>
        ) : displayedProjects.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-input">
            <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No projects found</h3>
            <p className="text-foreground/50 text-sm mt-1">Click 'New Project' to get started.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleBookmark={handleToggleBookmark}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      
      <ProjectModal
        isOpen={modalOpen}
        type={modalType}
        projectName={selectedProjectName}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  )
}
