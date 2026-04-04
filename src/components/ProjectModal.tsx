'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Edit2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'

interface ProjectModalProps {
  isOpen: boolean
  type: 'rename' | 'delete'
  projectName: string
  onConfirm: (value?: string) => void
  onCancel: () => void
}

export function ProjectModal({ isOpen, type, projectName, onConfirm, onCancel }: ProjectModalProps) {
  const [inputValue, setInputValue] = useState(projectName)
  const [error, setError] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    if (isOpen && type === 'rename') {
      setInputValue(projectName)
      setError('')
    }
  }, [isOpen, projectName, type])

  const handleConfirm = () => {
    if (type === 'rename') {
      if (!inputValue.trim()) {
        setError('Project name cannot be empty')
        return
      }
      if (inputValue.trim() === projectName) {
        setError('Enter a different name')
        return
      }
      onConfirm(inputValue.trim())
    } else {
      onConfirm()
    }
    setError('')
    setInputValue(projectName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') handleCancel()
  }

  const handleCancel = () => {
    setError('')
    setInputValue(projectName)
    onCancel()
  }

  const isDark = theme === 'dark'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCancel}
            className={`fixed inset-0 z-40 ${
              isDark ? 'bg-black/40' : 'bg-black/20'
            }`}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className={`pointer-events-auto w-full max-w-md mx-4 rounded-2xl shadow-2xl border ${
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  {type === 'rename' ? (
                    <>
                      <div className={`p-2 rounded-lg ${
                        isDark ? 'bg-gray-500/20' : 'bg-gray-100'
                      }`}>
                        <Edit2 className={`w-5 h-5 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <h2 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        Rename Project
                      </h2>
                    </>
                  ) : (
                    <>
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </div>
                      <h2 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        Delete Project
                      </h2>
                    </>
                  )}
                </div>
                <button
                  onClick={handleCancel}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {type === 'rename' ? (
                  <>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      Enter a new name for your project
                    </p>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value)
                        setError('')
                      }}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? `bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20`
                          : `bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-100`
                      } ${error ? (isDark ? 'border-red-500 focus:border-red-500' : 'border-red-400') : ''}`}
                      placeholder="New project name"
                    />
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </>
                ) : (
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-red-500/10' : 'bg-red-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-red-400' : 'text-red-700'
                    }`}>
                      Are you sure you want to delete <span className="font-semibold">"{projectName}"</span>?
                    </p>
                    <p className={`text-xs mt-2 ${
                      isDark ? 'text-red-500/70' : 'text-red-600/70'
                    }`}>
                      This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-end gap-3 p-6 border-t ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    type === 'delete'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {type === 'delete' ? 'Delete' : 'Rename'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
