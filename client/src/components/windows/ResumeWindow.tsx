import { useResume } from "@/hooks/use-resume";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Wrench, MapPin, Calendar } from "lucide-react";

export function ResumeWindow() {
  const { data, isLoading } = useResume();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground font-mono text-sm">Loading resume...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-5 space-y-6 overflow-auto h-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-bold">Sidharth Kasarla</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          East Brunswick, NJ &middot; skasarla@berkeley.edu &middot; 732-689-9009
        </p>
        <p className="text-xs font-mono text-violet-400 mt-0.5">
          linkedin.com/in/sidharth-kasarla
        </p>
      </div>

      {data.education?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-mono text-violet-400 uppercase tracking-widest">Education</h3>
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} className="glass-light rounded-md p-3 mb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="text-sm font-semibold">{edu.school}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{edu.degree}</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">{edu.year}</Badge>
              </div>
              {edu.details && edu.details.length > 0 && (
                <div className="mt-2 space-y-1">
                  {edu.details.map((detail, i) => (
                    <p key={i} className="text-[11px] text-foreground/60 font-mono">{detail}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-mono text-violet-400 uppercase tracking-widest">Experience</h3>
        </div>
        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-violet-500/20" />
          <div className="space-y-3">
            {data.experience?.map((exp) => (
              <div key={exp.id} className="relative pl-6">
                <div className="absolute left-0 top-3 w-[15px] h-[15px] rounded-full border-2 border-violet-500/40 bg-background flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                </div>
                <div className="glass-light rounded-md p-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h4 className="text-sm font-semibold">{exp.company}</h4>
                      <p className="text-xs text-violet-300/80">{exp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {exp.location && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                        <MapPin className="w-2.5 h-2.5" />
                        {exp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Calendar className="w-2.5 h-2.5" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.description.map((bullet, i) => (
                        <li key={i} className="text-[11px] text-foreground/60 leading-relaxed pl-2 relative before:content-[''] before:absolute before:left-0 before:top-[6px] before:w-1 before:h-1 before:rounded-full before:bg-violet-500/40">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.skills?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-mono text-violet-400 uppercase tracking-widest">Skills</h3>
          </div>
          <div className="space-y-2">
            {data.skills.map((skillGroup) => (
              <div key={skillGroup.id} className="glass-light rounded-md p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{skillGroup.category}</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillGroup.items?.map((skill, i) => (
                    <span key={i} className="text-[10px] font-mono text-foreground/70 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
