export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CaseStudyContent {
  summary: string;
  overview: {
    what: string;
    why: string;
  };
  problem: string;
  solution: string;
  techStack: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
    tools: string[];
  };
  highlights: {
    performance?: string;
    scalability?: string;
    security?: string;
    ux?: string;
  };
  outcome: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  category: string;
  projectType?: "concept" | "internal" | "client-nda";
  caseStudy?: CaseStudyContent;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
}






