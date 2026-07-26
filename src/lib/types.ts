

export type ExperienceLevel = "pemula" | "menengah" | "lanjutan";
export type ProjectStatus = "draft" | "active" | "archived";
export type MessageRole = "user" | "assistant";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string; 
}

export interface Genome {
  id: string;
  user_id: string;
  fields_of_interest: string[];
  skills: string[];
  experience_level: ExperienceLevel;
  data_access: string[];
  constraints: string;
  research_style_notes: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Canvas {
  id: string;
  project_id: string;
  problem: string;
  research_question: string;
  candidate_variables: string;
  research_gap_notes: string;
  candidate_methods: string;
  notes: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  role: MessageRole;
  content: string;
  is_critic?: boolean;
  is_literature_agent?: boolean;
  created_at: string;

  references?: EvidenceReference[];
  dataset_references?: DatasetReference[];
}

export interface DatasetReference {
  id: string;
  project_id: string;
  dataset_title: string;
  dataset_subtitle?: string;
  creator?: string;
  source_url: string;
  source_provider: string;
  format?: string;
  coverage_period?: string;
  license?: string;
  retrieved_at: string;
  relevance_note?: string;
}

export interface EvidenceReference {
  id: string;
  project_id: string;
  source_title: string;
  source_authors?: string;
  publication_year?: number;
  abstract_snippet?: string;
  source_url: string;
  source_provider: string;
  retrieved_at: string;
  relevance_note: string;
}

export interface InterviewFormData {
  fields_of_interest: string[];
  skills: string[];
  experience_description: string;
  data_access: string[];
  constraints: string;
  open_ended: string;
}
