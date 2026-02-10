import { useProject } from "@/hooks/use-projects";
import { useRoute } from "wouter";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ArrowLeft, CheckCircle2, Target, Lightbulb, Layout } from "lucide-react";
import { Link } from "wouter";

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const { data: project, isLoading } = useProject(params?.slug || "");

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!project) return <div className="flex h-screen items-center justify-center">Project not found</div>;

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="bg-muted/30 border-b border-border/50 py-20">
        <div className="container px-4 md:px-8 max-w-screen-xl">
          <Link href="/projects" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
          
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          
          <div className="grid gap-8 border-t border-border/50 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</div>
              <div className="font-medium">{project.role}</div>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</div>
              <div className="font-medium">{project.timeline}</div>
            </div>
            <div className="col-span-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technologies</div>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 md:px-8 max-w-screen-xl py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
          <div className="space-y-16">
            
            {/* Problem Section */}
            <section>
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Target className="h-6 w-6" />
                <h2 className="font-display text-2xl font-bold">The Problem</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>{project.problemStatement}</p>
              </div>
            </section>

            {/* Solution Section */}
            <section>
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Lightbulb className="h-6 w-6" />
                <h2 className="font-display text-2xl font-bold">The Solution (MVP)</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>{project.solution}</p>
              </div>
            </section>

            {/* Dashboard Section (Conditional) */}
            {project.dashboardData && (
              <section className="scroll-mt-24 rounded-2xl bg-secondary/20 p-8 border border-border/50">
                <div className="mb-6 flex items-center gap-2 text-primary">
                  <Layout className="h-6 w-6" />
                  <h2 className="font-display text-2xl font-bold">Live Metrics Dashboard</h2>
                </div>
                <p className="mb-8 text-muted-foreground">
                  Measuring the success of the educational platform through engagement and placement outcomes.
                </p>
                <DashboardCharts data={project.dashboardData} />
              </section>
            )}

            {/* Key Features */}
            {project.keyFeatures && (
              <section>
                <h2 className="mb-8 font-display text-2xl font-bold">Key Features</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {(project.keyFeatures as any[]).map((feature, i) => (
                    <div key={i} className="rounded-xl border border-border p-6 bg-card/50">
                      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 font-bold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            <section>
               <h2 className="mb-6 font-display text-2xl font-bold">Detailed Overview</h2>
               <div className="prose prose-gray max-w-none text-muted-foreground dark:prose-invert">
                 {project.fullDescription.split('\n').map((paragraph, i) => (
                   <p key={i}>{paragraph}</p>
                 ))}
               </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-bold">Table of Contents</h3>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground hover:underline decoration-primary underline-offset-4">Introduction</a>
                <a href="#" className="hover:text-foreground hover:underline decoration-primary underline-offset-4">Problem Statement</a>
                <a href="#" className="hover:text-foreground hover:underline decoration-primary underline-offset-4">The Solution</a>
                {project.dashboardData && (
                   <a href="#" className="hover:text-foreground hover:underline decoration-primary underline-offset-4 text-primary font-medium">Metrics Dashboard</a>
                )}
                <a href="#" className="hover:text-foreground hover:underline decoration-primary underline-offset-4">Key Features</a>
              </nav>
            </div>
            
            <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-lg">
              <h3 className="mb-2 font-display text-lg font-bold">Want to see more?</h3>
              <p className="mb-4 text-sm text-primary-foreground/80">
                Check out my other case studies or get in touch to discuss this project.
              </p>
              <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-lg bg-background text-primary py-2.5 text-sm font-semibold transition-transform active:scale-95">
                Contact Me
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
