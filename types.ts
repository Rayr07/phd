
export type AnalysisMode = 'contradict' | 'claim' | 'hypothesis';

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: number;
  content?: string; // Base64 or text for analysis
}

export interface AnalysisResult {
  contradictions?: {
    uploaded: string[];
    external: string[];
  };
  claims?: {
    status: 'correct' | 'incorrect';
    issues: string[];
    details: string;
  };
  hypothesis?: {
    gaps: string[];
    hypotheses: string[];
    novelIdea: string;
  };
}

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  bookmarked: boolean;
  files: ProjectFile[]; // General corpus/sources
  userPaper?: ProjectFile; // Primary paper for claim/contradict analysis
  domain: string;
  prompt: string;
  mode: AnalysisMode;
  corpus: ('uploaded' | 'external')[];
  result?: AnalysisResult;
}

export interface User {
  email: string;
  isLoggedIn: boolean;
}
