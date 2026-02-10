import { useProjects } from "@/hooks/use-projects";
import { ArrowRight, BarChart3, Rocket, Users } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const { data: projects, isLoading } = useProjects();
  
  // Find the featured project (Blackskies)
  const featuredProject = projects?.find(p => p.slug === 'blackskies-education') || projects?.[0];
  const recentProjects = projects?.filter(p => p.id !== featuredProject?.id).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container px-4 md:px-8 max-w-screen-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Product Growth & <br/>
              <span className="text-muted-foreground">Technical Strategy.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              I bridge the gap between technical execution and product vision. 
              Currently leading education at Blackskies Investments, building platforms that transform students into founders.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                View My Work
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute right-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-tr from-primary/5 to-secondary/20 blur-3xl" />
      </section>

      {/* Featured Project Highlight */}
      {featuredProject && (
        <section className="border-y border-border/40 bg-muted/30 py-20">
          <div className="container px-4 md:px-8 max-w-screen-xl">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Featured Case Study</h2>
              <Link href={`/projects/${featuredProject.slug}`} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                View Full Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  <Rocket className="mr-2 h-4 w-4" /> Product Management
                </div>
                <h3 className="font-display text-3xl font-bold">{featuredProject.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {featuredProject.shortDescription}
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-foreground">Data-Driven Curriculum</strong>
                      <span className="text-sm text-muted-foreground">Used student feedback loops to iterate on 10 weeks of content.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-foreground">Measurable Impact</strong>
                      <span className="text-sm text-muted-foreground">Tracked engagement and placement metrics to prove ROI.</span>
                    </div>
                  </li>
                </ul>
                <div className="pt-6">
                  <Link href={`/projects/${featuredProject.slug}`} className="inline-flex items-center text-primary font-semibold hover:underline">
                    See the Dashboard Metrics <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <Link href={`/projects/${featuredProject.slug}`} className="block overflow-hidden rounded-2xl border border-border bg-background shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Dashboard Preview Mockup */}
                  <div className="aspect-[4/3] relative bg-slate-900 p-6 flex flex-col">
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 animate-pulse"></div>
                      <div className="bg-slate-800/50 rounded-lg p-4 animate-pulse delay-75"></div>
                      <div className="col-span-2 bg-slate-800/50 rounded-lg p-4 animate-pulse delay-150"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity">
                      <span className="rounded-full bg-white px-6 py-3 font-semibold text-black shadow-lg">
                        View Live Dashboard
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Work */}
      <section className="py-24">
        <div className="container px-4 md:px-8 max-w-screen-xl">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Recent Projects</h2>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
