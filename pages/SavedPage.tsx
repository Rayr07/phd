
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../hooks/useProjectStore';
import { Project } from '../types';

const SavedPage: React.FC = () => {
  const { projects, deleteProject, bulkDelete, bulkToggleBookmark, toggleBookmark, renameProject, saveProject } = useProjectStore();
  const [search, setSearch] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const navigate = useNavigate();

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => (filterBookmarked ? p.bookmarked : true));
  }, [projects, search, filterBookmarked]);

  const handleNewProject = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newProject: Project = {
      id: newId,
      name: 'Untitled Project',
      updatedAt: Date.now(),
      bookmarked: false,
      files: [],
      domain: '',
      prompt: '',
      mode: 'contradict',
      corpus: ['uploaded']
    };
    saveProject(newProject);
    navigate(`/ops/${newId}`);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} projects?`)) {
      bulkDelete(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const handleBulkBookmark = () => {
    bulkToggleBookmark(selectedIds, true);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const startRename = (e: React.MouseEvent, p: Project) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEditName(p.name);
  };

  const submitRename = () => {
    if (editingId && editName.trim()) {
      renameProject(editingId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen bg-lbg dark:bg-dbg text-ltext dark:text-dtext">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter text-ltext dark:text-dtext">Your Projects</h1>
          <p className="opacity-60 font-bold uppercase text-[10px] tracking-[0.2em] text-lsecondary dark:text-dtext">Workspace Management</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-lsecondary dark:text-dtext opacity-40"></i>
            <input 
              type="text" 
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white/80 dark:bg-gray-800 border-2 border-lsecondary/10 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 w-64 text-ltext dark:text-dtext font-bold"
            />
          </div>
          
          <button 
            onClick={() => setFilterBookmarked(!filterBookmarked)}
            className={`p-2.5 rounded-xl border-2 transition-all ${filterBookmarked ? 'bg-lsecondary border-lsecondary text-white' : 'bg-white dark:bg-gray-800 border-lsecondary/10 dark:border-gray-700 text-lsecondary dark:text-dtext hover:border-lsecondary/40 dark:hover:border-gray-600'}`}
            title="Filter Bookmarked"
          >
            <i className="fa-solid fa-bookmark"></i>
          </button>

          <button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            className={`px-4 py-2.5 rounded-xl border-2 font-black uppercase text-xs tracking-widest transition-all ${isSelectionMode ? 'bg-lsecondary text-white border-lsecondary' : 'bg-white dark:bg-gray-800 border-lsecondary/10 dark:border-gray-700 text-lsecondary dark:text-dtext hover:border-lsecondary/40 dark:hover:border-gray-600'}`}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>

          <button 
            onClick={handleNewProject}
            className="flex items-center gap-2 px-6 py-2.5 bg-laccent text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-plus"></i>
            New Project
          </button>
        </div>
      </div>

      {isSelectionMode && selectedIds.length > 0 && (
        <div className="mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="font-black text-xs uppercase tracking-widest text-lsecondary dark:text-dtext">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-colors"
            >
              Delete Selected
            </button>
            <button 
              onClick={handleBulkBookmark}
              className="px-4 py-2 bg-lsecondary text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-colors"
            >
              Bookmark Selected
            </button>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-30">
          <i className="fa-regular fa-folder-open text-6xl mb-6 text-lsecondary dark:text-dtext"></i>
          <p className="text-xl font-black uppercase tracking-widest text-ltext dark:text-dtext">No projects found</p>
          <button onClick={handleNewProject} className="mt-4 text-lsecondary dark:text-dtext font-black uppercase text-xs hover:underline tracking-widest">Start your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              onClick={() => isSelectionMode ? handleToggleSelect(project.id) : navigate(`/ops/${project.id}`)}
              className={`group relative p-8 bg-white dark:bg-black/20 border-2 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:border-lsecondary/40 dark:hover:border-gray-700 ${isSelectionMode ? 'hover:translate-y-0' : 'hover:-translate-y-1'} ${selectedIds.includes(project.id) ? 'border-lsecondary dark:border-dtext ring-4 ring-lsecondary/10' : 'border-lsecondary/5 dark:border-gray-800'}`}
            >
              {isSelectionMode && (
                <div className="absolute top-5 right-5 z-10">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedIds.includes(project.id) ? 'bg-lsecondary border-lsecondary dark:bg-dtext dark:border-dtext' : 'bg-white dark:bg-gray-800 border-lsecondary/20 dark:border-gray-700'}`}>
                    {selectedIds.includes(project.id) && <i className="fa-solid fa-check text-white text-xs"></i>}
                  </div>
                </div>
              )}

              {!isSelectionMode && (
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(project.id); }}
                  className={`absolute top-5 right-5 z-10 p-2 rounded-lg transition-colors ${project.bookmarked ? 'text-lsecondary dark:text-dtext' : 'text-lsecondary/20 hover:text-lsecondary/40 dark:text-dtext/20 dark:hover:text-dtext/40'}`}
                >
                  <i className={`fa-${project.bookmarked ? 'solid' : 'regular'} fa-bookmark text-xl`}></i>
                </button>
              )}

              <div className="mb-6">
                {editingId === project.id ? (
                  <input 
                    autoFocus
                    value={editName}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    className="w-full text-xl font-black bg-lbg/50 dark:bg-gray-800 p-2 rounded-xl outline-none border-b-4 border-lsecondary dark:border-dtext text-ltext dark:text-dtext"
                  />
                ) : (
                  <h3 className="text-xl font-black line-clamp-1 text-ltext dark:text-dtext tracking-tight">{project.name}</h3>
                )}
                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-2 text-lsecondary dark:text-dtext">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <span className="px-3 py-1 bg-lsecondary dark:bg-gray-800 text-white dark:text-dtext rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  {project.mode}
                </span>
                <span className="text-[10px] text-lsecondary dark:text-dtext font-black opacity-30">•</span>
                <span className="text-[10px] font-black text-lsecondary dark:text-dtext uppercase tracking-widest opacity-60">{project.files.length} sources</span>
              </div>

              {!isSelectionMode && (
                <div className="flex items-center gap-3 pt-6 border-t-2 border-lsecondary/5 dark:border-gray-800">
                  <button 
                    onClick={(e) => startRename(e, project)}
                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-lsecondary dark:text-dtext hover:bg-lsecondary/5 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    RENAME
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Permanently delete project?')) deleteProject(project.id); }}
                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
