

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
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

interface AppState {
  user: User | null;

  genome: Genome | null;
  setGenome: (g: Genome) => void;

  projects: Project[];
  addProject: (title: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;

  getCanvas: (projectId: string) => Canvas | null;
  updateCanvas: (projectId: string, updates: Partial<Canvas>) => void;

  getMessages: (projectId: string) => Message[];
  addMessage: (projectId: string, message: Message) => void;

  saveInterview: (data: InterviewFormData) => Promise<Genome>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [genome, setGenomeRaw] = useState<Genome | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [canvasMap, setCanvasMap] = useState<Record<string, Canvas>>({});
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUserData = async (authUser: any) => {
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || "User",
          created_at: authUser.created_at,
        });

        fetch("/api/genome")
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setGenomeRaw(data.data);
            } else {
              setGenomeRaw(null);
            }
          })
          .catch((err) => console.error("Error fetching genome:", err));

        fetch("/api/projects")
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setProjects(data.data);
            } else {
              setProjects([]);
            }
          })
          .catch((err) => console.error("Error fetching projects:", err));
      } else {
        setUser(null);
        setGenomeRaw(null);
        setProjects([]);
        setCanvasMap({});
        setMessagesMap({});
      }
    };

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      fetchUserData(authUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUserData(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setGenome = useCallback((g: Genome) => {
    setGenomeRaw(g);
  }, []);

  const addProject = useCallback(
    async (title: string): Promise<Project> => {
      if (!user) throw new Error("Not authenticated");
      
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      const newProject = json.data;
      
      setProjects((prev) => [newProject, ...prev]);

      if (newProject.canvas) {
        setCanvasMap((prev) => ({ ...prev, [newProject.id]: newProject.canvas }));
      }
      setMessagesMap((prev) => ({ ...prev, [newProject.id]: [] }));

      return newProject;
    },
    [user]
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>): Promise<Project> => {
      if (!user) throw new Error("Not authenticated");
      
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      const updatedProject = json.data;
      
      setProjects((prev) => 
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );

      return updatedProject;
    },
    [user]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error("Not authenticated");
      
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      setProjects((prev) => prev.filter((p) => p.id !== id));

      setCanvasMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
      setMessagesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    },
    [user]
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
        const existing = prev[projectId] || ({} as Canvas);
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
    async (data: InterviewFormData): Promise<Genome> => {
      if (!user) throw new Error("Not authenticated");
      
      const res = await fetch("/api/genome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      const newGenome = json.data;
      setGenomeRaw(newGenome);
      return newGenome;
    },
    [user]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        genome,
        setGenome,
        projects,
        addProject,
        updateProject,
        deleteProject,
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
