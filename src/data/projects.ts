export type ProjectStatus = "Tamamlandı" | "Devam ediyor" | "Planlama aşamasında";

export type Project = {
  slug: string;
  name: string;
  type: string;
  location: string;
  year: string;
  status: ProjectStatus;
  role: string;
  description: string;
  details: string[];
  images: { src: string; alt: string }[];
  demo: boolean;
};

/**
 * Proje portföyü.
 *
 * ► Gerçek projelerinizi eklemek için aşağıdaki diziyi doldurun. Örnek kayıtlar
 *   kullanıcı talebiyle kaldırılmıştır. Diziye en az bir proje eklendiğinde
 *   projeler sayfası ve ana sayfadaki portföy bölümü otomatik olarak listelenir.
 */
export const projects: Project[] = [];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectTypes() {
  return ["Tümü", ...Array.from(new Set(projects.map((p) => p.type)))];
}
