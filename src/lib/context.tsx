

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  User,
  Genome,
  Project,
  Canvas,
  Message,
  InterviewFormData,
} from "@/lib/types";
import {
  MOCK_USER_NEW,
  MOCK_USER_RETURNING,
  MOCK_GENOME,
  MOCK_PROJECTS,
  MOCK_CANVAS,
  MOCK_MESSAGES,
} from "@/data/mock";

type Scenario = "new" | "returning";

interface AppState {

  scenario: Scenario;
  setScenario: (s: Scenario) => void;

  user: User;

  genome: Genome | null;
  setGenome: (g: Genome) => void;

  projects: Project[];
  addProject: (title: string) => Project;

  getCanvas: (projectId: string) => Canvas | null;
  updateCanvas: (projectId: string, updates: Partial<Canvas>) => void;

  getMessages: (projectId: string) => Message[];
  addMessage: (projectId: string, message: Message) => void;

  saveInterview: (data: InterviewFormData) => Genome;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioRaw] = useState<Scenario>("new");
  const [genome, setGenomeRaw] = useState<Genome | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [canvasMap, setCanvasMap] = useState<Record<string, Canvas>>({});
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  const setScenario = useCallback((s: Scenario) => {
    setScenarioRaw(s);
    if (s === "returning") {
      setGenomeRaw(MOCK_GENOME);
      setProjects(MOCK_PROJECTS);
      setCanvasMap({ "prj-001": MOCK_CANVAS });
      setMessagesMap({ "prj-001": MOCK_MESSAGES });
    } else {
      setGenomeRaw(null);
      setProjects([]);
      setCanvasMap({});
      setMessagesMap({});
    }
  }, []);

  const user = scenario === "returning" ? MOCK_USER_RETURNING : MOCK_USER_NEW;

  const setGenome = useCallback((g: Genome) => {
    setGenomeRaw(g);
  }, []);

  const addProject = useCallback(
    (title: string): Project => {
      const newProject: Project = {
        id: `prj-${Date.now()}`,
        user_id: user.id,
        title,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProject]);

      const newCanvas: Canvas = {
        id: `cvs-${Date.now()}`,
        project_id: newProject.id,
        problem: "",
        research_question: "",
        candidate_variables: "",
        research_gap_notes: "",
        candidate_methods: "",
        notes: "",
        updated_at: new Date().toISOString(),
      };
      setCanvasMap((prev) => ({ ...prev, [newProject.id]: newCanvas }));
      setMessagesMap((prev) => ({ ...prev, [newProject.id]: [] }));

      return newProject;
    },
    [user.id]
  );

  const getCanvas = useCallback(
    (projectId: string): Canvas | null => {
      return canvasMap[projectId] ?? null;
    },
    [canvasMap]
  );

  const updateCanvas = useCallback(
    (projectId: string, updates: Partial<Canvas>) => {
      setCanvasMap((prev) => {
        const existing = prev[projectId];
        if (!existing) return prev;
        return {
          ...prev,
          [projectId]: {
            ...existing,
            ...updates,
            updated_at: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const getMessages = useCallback(
    (projectId: string): Message[] => {
      return messagesMap[projectId] ?? [];
    },
    [messagesMap]
  );

  const addMessage = useCallback(
    (projectId: string, message: Message) => {
      setMessagesMap((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] ?? []), message],
      }));
    },
    []
  );

  const saveInterview = useCallback(
    (data: InterviewFormData): Genome => {
      const newGenome: Genome = {
        id: `gen-${Date.now()}`,
        user_id: user.id,
        fields_of_interest: data.fields_of_interest,
        skills: data.skills,
        experience_level: "pemula", 
        data_access: data.data_access,
        constraints: data.constraints,
        research_style_notes: data.open_ended,
        updated_at: new Date().toISOString(),
      };
      setGenomeRaw(newGenome);
      return newGenome;
    },
    [user.id]
  );

  return (
    <AppContext.Provider
      value={{
        scenario,
        setScenario,
        user,
        genome,
        setGenome,
        projects,
        addProject,
        getCanvas,
        updateCanvas,
        getMessages,
        addMessage,
        saveInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp harus digunakan di dalam AppProvider");
  }
  return ctx;
}
