'use client'

import { motion } from 'framer-motion'
import { Bookmark, MoreVertical, Trash2, Edit2, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  bookmarked: boolean
  paperCount: number
}

interface ProjectCardProps {
  project: Project
  onToggleBookmark: (id: string, current: boolean) => void
  onDelete: (id: string) => void
  onRename: (id: string) => void
}

export function ProjectCard({ project, onToggleBookmark, onDelete, onRename }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4 truncate">
          <Link href={`/p/${project.id}`} className="group-hover:text-primary transition-colors cursor-pointer block">
            <h3 className="font-semibold text-lg text-foreground truncate">{project.name}</h3>
          </Link>
          <p className="text-xs text-foreground/50 mt-1">Edited {project.updatedAt}</p>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onToggleBookmark(project.id, project.bookmarked)}
            className={`p-1.5 rounded-full transition-colors ${project.bookmarked ? 'text-accent bg-accent/10' : 'text-foreground/40 hover:bg-input hover:text-foreground'}`}
            title={project.bookmarked ? "Remove bookmark" : "Bookmark project"}
          >
            <Bookmark className="w-4 h-4" fill={project.bookmarked ? "currentColor" : "none"} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
              className="p-1.5 rounded-full text-foreground/40 hover:bg-input hover:text-foreground transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-input rounded-xl shadow-lg overflow-hidden z-10 py-1">
                <button 
                  onClick={() => { setMenuOpen(false); onRename(project.id) }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Rename
                </button>
                <button 
                  onClick={() => { setMenuOpen(false); onDelete(project.id) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-input flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-foreground/60 bg-input/50 px-2.5 py-1 rounded-md">
          <FileText className="w-4 h-4 text-primary" />
          <span>{project.paperCount} papers</span>
        </div>
        
        <Link 
          href={`/p/${project.id}`}
          className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-0.5 group/link"
        >
          Open Workspace
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
