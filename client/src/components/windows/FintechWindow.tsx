import { useProject } from "@/hooks/use-projects";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Users, BarChart3, Repeat } from "lucide-react";

export function FintechWindow() {
  const { data: project, isLoading } = useProject("fitness-app-product-space");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground font-mono text-sm">Loading case study...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full p-5">
        <div className="text-muted-foreground font-mono text-sm text-center">
          Case study coming soon...
        </div>
      </div>
    );
  }

  const keyFeatures = project.keyFeatures as any[] | null;

  return (
    <div className="p-5 space-y-5 overflow-auto h-full">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="text-lg font-display font-semibold">{project.title}</h2>
          <Badge variant="outline" className="text-[10px] font-mono">Case Study</Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono">{project.role} &middot; {project.timeline}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-light rounded-md p-3 text-center">
          <div className="text-2xl font-display font-bold text-violet-400">100+</div>
          <div className="text-[10px] font-mono text-muted-foreground mt-1">User Interviews</div>
        </div>
        <div className="glass-light rounded-md p-3 text-center">
          <div className="text-2xl font-display font-bold text-emerald-400">Product Space</div>
          <div className="text-[10px] font-mono text-muted-foreground mt-1">Organization</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="glass-light rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider">Problem</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{project.problemStatement}</p>
        </div>

        <div className="glass-light rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Solution</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{project.solution}</p>
        </div>
      </div>

      {keyFeatures && keyFeatures.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-3">Methodology</h3>
          <div className="space-y-2">
            {keyFeatures.map((feature: any, i: number) => (
              <div key={i} className="glass-light rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  {i === 0 ? <Users className="w-3.5 h-3.5 text-violet-400" /> : <Repeat className="w-3.5 h-3.5 text-violet-400" />}
                  <span className="text-xs font-semibold">{feature.title}</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-light rounded-md p-3">
        <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">Technologies Used</h3>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies?.map((tech, i) => (
            <span key={i} className="text-[10px] font-mono text-foreground/70 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
