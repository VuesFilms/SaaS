export interface Project {
  id: string;
  title: string;
  updatedAt: string;
  genre: string;
  content: string;
}

const STORAGE_KEY = "film-saas-projects";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  // Seed with sample projects on first load
  const seed: Project[] = [
    { id: "1", title: "My First Screenplay", updatedAt: "2025-01-15", genre: "Drama", content: "" },
    { id: "2", title: "Action Movie Draft", updatedAt: "2025-02-20", genre: "Action", content: "" },
    { id: "3", title: "Drama Series - Episode 1", updatedAt: "2025-03-10", genre: "Series", content: "" },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects(): Project[] {
  return loadProjects();
}

export function getProject(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function createProject(title: string, genre = "Drama"): Project {
  const projects = loadProjects();
  const project: Project = {
    id: generateId(),
    title,
    updatedAt: new Date().toISOString().split("T")[0],
    genre,
    content: "",
  };
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function renameProject(id: string, title: string): void {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === id);
  if (project) {
    project.title = title;
    project.updatedAt = new Date().toISOString().split("T")[0];
    saveProjects(projects);
  }
}

export function updateProjectContent(id: string, content: string): void {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === id);
  if (project) {
    project.content = content;
    project.updatedAt = new Date().toISOString().split("T")[0];
    saveProjects(projects);
  }
}

export function deleteProject(id: string): void {
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}
