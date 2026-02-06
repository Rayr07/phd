
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisMode, AnalysisResult, ProjectFile } from "../types";

export const performAnalysis = async (
  mode: AnalysisMode,
  domain: string,
  prompt: string,
  files: ProjectFile[],
  corpus: ('uploaded' | 'external')[],
  userPaper?: ProjectFile
): Promise<AnalysisResult> => {
  // Initialize AI with API key from environment as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';

  const sourceNames = files.map(f => f.name).join(', ');
  const userPaperName = userPaper ? userPaper.name : "N/A";
  
  let systemInstruction = "";
  let responseSchema: any = {};

  if (mode === 'contradict') {
    systemInstruction = `You are a critical research analyst.
    Primary Paper to Analyze: ${userPaperName}.
    Domain: ${domain}.
    Context: ${prompt}.
    Reference Corpus: ${corpus.includes('uploaded') ? 'General sources provided' : ''} ${corpus.includes('external') ? 'External research knowledge' : ''}.
    Identify internal contradictions within "${userPaperName}" and external contradictions against the reference sources or established knowledge.`;
    
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        uploaded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Contradictions found within the user's paper itself." },
        external: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Contradictions between the user's paper and external sources/corpus." }
      },
      required: ["uploaded", "external"]
    };
  } else if (mode === 'claim') {
    systemInstruction = `You are a citation and claim validator.
    Paper to verify: ${userPaperName}.
    Sources to check against: ${sourceNames}.
    Verify if claims made in "${userPaperName}" are accurately supported by the provided sources. 
    Check citation formatting and logical consistency.`;

    responseSchema = {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, description: "'correct' or 'incorrect'" },
        issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        details: { type: Type.STRING }
      },
      required: ["status", "issues", "details"]
    };
  } else if (mode === 'hypothesis') {
    systemInstruction = `You are a research visionary for ${domain}.
    Analyze the provided literature: ${sourceNames}.
    Identify specific gaps, propose hypotheses, and suggest a novel research direction.`;

    responseSchema = {
      type: Type.OBJECT,
      properties: {
        gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
        novelIdea: { type: Type.STRING }
      },
      required: ["gaps", "hypotheses", "novelIdea"]
    };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Analysis of research in domain "${domain}". Primary paper: "${userPaperName}". Corpus: ${sourceNames}. Additional user prompt: ${prompt || 'None'}.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema
    }
  });

  // Extract text output using the .text property
  const raw = response.text || "{}";
  const parsed = JSON.parse(raw);

  if (mode === 'contradict') return { contradictions: parsed };
  if (mode === 'claim') return { claims: parsed };
  if (mode === 'hypothesis') return { hypothesis: parsed };

  return {};
};
