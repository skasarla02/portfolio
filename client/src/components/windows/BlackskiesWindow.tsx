import { useState } from "react";
import { useProject } from "@/hooks/use-projects";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Target, TrendingUp, Map, Users, ChevronRight } from "lucide-react";

type SidebarTab = "goals" | "kpis" | "roadmap";

export function BlackskiesWindow() {
  const { data: project, isLoading } = useProject("blackskies-education");
  const [activeTab, setActiveTab] = useState<SidebarTab>("goals");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground font-mono text-sm">Loading project data...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground font-mono text-sm">Project not found</div>
      </div>
    );
  }

  const dashboard = project.dashboardData as any;
  const keyFeatures = project.keyFeatures as any[];

  const tabs: { id: SidebarTab; label: string; icon: typeof Target }[] = [
    { id: "goals", label: "Goals", icon: Target },
    { id: "kpis", label: "KPIs", icon: TrendingUp },
    { id: "roadmap", label: "Roadmap", icon: Map },
  ];

  return (
    <div className="flex h-full">
      <div className="w-44 shrink-0 glass-sidebar p-3 flex flex-col gap-1">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2 px-2">
          Navigation
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-testid={`blackskies-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-mono transition-colors text-left ${
              activeTab === tab.id
                ? "bg-violet-500/20 text-violet-300"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="text-[10px] font-mono text-muted-foreground px-2">
            Status: <span className="text-emerald-400">Active</span>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground px-2 mt-1">
            AUM: <span className="text-foreground">$1.3M</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-auto">
        {activeTab === "goals" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-display font-semibold">Blackskies Education Platform</h2>
                <Badge variant="outline" className="text-[10px] font-mono">PRD v2.1</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{project.role} &middot; {project.timeline}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-1.5">Problem Statement</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{project.problemStatement}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-1.5">Solution (MVP)</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {keyFeatures?.map((feature: any, i: number) => (
                  <div key={i} className="glass-light rounded-md p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ChevronRight className="w-3 h-3 text-violet-400" />
                      <span className="text-xs font-semibold">{feature.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "kpis" && dashboard && (
          <div className="space-y-5">
            <h2 className="text-lg font-display font-semibold">Product Dashboard</h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="glass-light rounded-md p-3 text-center">
                <div className="text-2xl font-display font-bold text-emerald-400">{dashboard.nps?.score}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">NPS Score</div>
              </div>
              <div className="glass-light rounded-md p-3 text-center">
                <div className="text-2xl font-display font-bold text-violet-400">95%</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">Avg Attendance</div>
              </div>
              <div className="glass-light rounded-md p-3 text-center">
                <div className="text-2xl font-display font-bold text-amber-400">{dashboard.success?.offers}/{dashboard.success?.applied}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">Placements</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-3">Engagement Over 10 Weeks</h3>
              <div className="glass-light rounded-md p-3" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard.engagement}>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} domain={[80, 105]} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(15, 18, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11, fontFamily: 'monospace' }}
                    />
                    <Line type="monotone" dataKey="attendance" stroke="hsl(250, 80%, 65%)" strokeWidth={2} dot={{ fill: 'hsl(250, 80%, 65%)', r: 3 }} name="Attendance %" />
                    <Line type="monotone" dataKey="assignments" stroke="hsl(170, 70%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(170, 70%, 50%)', r: 3 }} name="Completion %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-light rounded-md p-3">
              <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">The Pivot (Week 4)</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Assignment completion dipped in Week 3-4. Conducted feedback sessions and restructured 
                the curriculum to add more hands-on deal flow exercises. Completion rates recovered to 96%+ 
                by Week 5. This iterative approach mirrors real product development cycles.
              </p>
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-5">
            <h2 className="text-lg font-display font-semibold">Product Roadmap</h2>
            <div className="space-y-3">
              {[
                { phase: "Phase 1", title: "Foundation", weeks: "Weeks 1-3", items: ["Deal Flow Sourcing", "Market Mapping Basics", "Industry Landscape Analysis"], status: "complete" },
                { phase: "Phase 2", title: "Technical Skills", weeks: "Weeks 4-6", items: ["Financial Modeling", "Cap Table Management", "Term Sheet Analysis"], status: "complete" },
                { phase: "Phase 3", title: "Application", weeks: "Weeks 7-9", items: ["Startup Building Workshop", "Pitch Deck Creation", "VC Partner Introductions"], status: "complete" },
                { phase: "Phase 4", title: "Graduation", weeks: "Week 10", items: ["Final Pitch to VC Partners", "Portfolio Review", "Mentorship Matching"], status: "complete" },
              ].map((phase, i) => (
                <div key={i} className="glass-light rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">{phase.phase}</Badge>
                      <span className="text-sm font-semibold">{phase.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{phase.weeks}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.items.map((item, j) => (
                      <span key={j} className="text-[10px] font-mono text-foreground/60 bg-white/5 px-2 py-0.5 rounded-md">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
