import { Project } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <div className="h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.heroImage ? (
            <img 
              src={project.heroImage} 
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <span className="font-display text-4xl font-bold text-primary/20">
                {project.title.substring(0, 2)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="flex h-full flex-col p-6">
          <div className="mb-2 flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map((tech) => (
              <span key={tech} className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {tech}
              </span>
            ))}
          </div>
          
          <h3 className="mb-2 font-display text-xl font-bold tracking-tight text-foreground">
            {project.title}
          </h3>
          
          <p className="mb-6 flex-grow text-sm text-muted-foreground line-clamp-3">
            {project.shortDescription}
          </p>
          
          <div className="mt-auto flex items-center text-sm font-medium text-primary">
            View Case Study <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
