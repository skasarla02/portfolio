import { useResume } from "@/hooks/use-resume";
import { Download, Briefcase, GraduationCap, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Resume() {
  const { data: resume, isLoading } = useResume();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="py-20 bg-muted/20 min-h-screen">
      <div className="container px-4 md:px-8 max-w-screen-lg">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">Resume</h1>
            <p className="text-muted-foreground mt-2">Product Manager & Developer</p>
          </div>
          <button 
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        {/* Paper Document Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background shadow-lg shadow-black/5 rounded-none md:rounded-lg border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary/5 p-8 md:p-12 border-b border-border">
             <h2 className="font-display text-3xl font-bold tracking-tight text-primary">Sidharth Kasarla</h2>
             <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
               <span>Berkeley, CA</span>
               <span>sidharth@example.com</span>
               <span>linkedin.com/in/sidharth</span>
               <span>github.com/sidharth</span>
             </div>
          </div>

          <div className="p-8 md:p-12 grid gap-12">
            
            {/* Experience */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide">Experience</h3>
              </div>
              
              <div className="space-y-8">
                {resume?.experience.sort((a, b) => a.order - b.order).map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                      <h4 className="text-lg font-bold text-foreground">{exp.company}</h4>
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="mb-3 text-primary font-medium">{exp.role} <span className="text-muted-foreground font-normal">• {exp.location}</span></div>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-muted-foreground text-sm leading-relaxed marker:text-primary/50">
                      {exp.description?.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
               <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide">Education</h3>
              </div>
              
              <div className="space-y-6">
                {resume?.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold">{edu.school}</h4>
                      <span className="text-sm font-medium text-muted-foreground">{edu.year}</span>
                    </div>
                    <div className="text-primary font-medium mb-2">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">
                      {edu.details?.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide">Skills</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {resume?.skills.map((skillGroup) => (
                  <div key={skillGroup.id}>
                    <h4 className="font-bold mb-3 text-foreground">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
