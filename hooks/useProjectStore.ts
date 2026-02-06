
import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectFile } from '../types';

const STORAGE_KEY = 'phd_projects';

export const useProjectStore = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const saveProject = useCallback((project: Project) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = { ...project, updatedAt: Date.now() };
      } else {
        updated.push({ ...project, updatedAt: Date.now() });
      }
      return updated.sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    setProjects(prev => prev.filter(p => !ids.includes(p.id)));
  }, []);

  const bulkToggleBookmark = useCallback((ids: string[], forceState?: boolean) => {
    setProjects(prev => prev.map(p => {
      if (ids.includes(p.id)) {
        return { ...p, bookmarked: forceState !== undefined ? forceState : !p.bookmarked };
      }
      return p;
    }));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  }, []);

  const renameProject = useCallback((id: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName, updatedAt: Date.now() } : p));
  }, []);

  const getProject = (id: string) => projects.find(p => p.id === id);

  return {
    projects,
    saveProject,
    deleteProject,
    bulkDelete,
    bulkToggleBookmark,
    toggleBookmark,
    renameProject,
    getProject
  };
};
