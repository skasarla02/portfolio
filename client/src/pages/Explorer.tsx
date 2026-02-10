import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Compass, MapPin, Briefcase, Music2, Wrench, Globe,
  Mail, Linkedin, ExternalLink, ChevronRight, ChevronDown,
  Target, TrendingUp, Zap, Shield, Code, Database,
  Figma, Swords, Trophy, GraduationCap, ArrowUpRight,
  Camera, X, ArrowLeft, Rocket, Lock, CreditCard,
  AlertTriangle, Gauge, Users, Fingerprint, BookOpen,
  FileText, Play, Check, ArrowRight, Clock, Sparkles,
  MessageSquare, Copy, User, BarChart3, ChevronUp, Radio
} from "lucide-react";
import { WORLD_MAP_PATHS, WORLD_MAP_VIEWBOX } from "@/data/world-map-paths";
import BeaconDossier from "@/components/BeaconDossier";
import berkeleyImg from "@assets/berkeley.jpg";
import switzerlandImg from "@assets/switzerland.jpg";
import newyorkImg from "@assets/newyork.jpg";
import lpTeamImg from "@assets/entireteam_1770684527043.JPG";
import lpCohortImg from "@assets/startupcohort_1770684527053.JPG";
import lpPitchImg from "@assets/pitch_1770684527054.JPG";

const WAYPOINTS = [
  { id: "basecamp", label: "Basecamp", icon: Compass },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "tour-of-duty", label: "Tour of Duty", icon: Briefcase },
  { id: "rave-archive", label: "Rave Archive", icon: Music2 },
  { id: "gear-loadout", label: "Gear Loadout", icon: Wrench },
  { id: "travel-log", label: "Travel Log", icon: Globe },
];

const EXPERIENCES = [
  {
    company: "SMBC",
    role: "Incoming Data and Product Growth Summer Associate",
    period: "June 2026 - August 2026",
    location: "New York City, NY",
    status: "UPCOMING",
    statusColor: "text-cyan-400",
    mission: "Heading to NYC this summer to work on product and growth at one of Japan's biggest banks.",
    results: [
      { label: "Status", value: "Incoming", color: "text-cyan-400" },
    ],
    gradient: "from-cyan-500/20 to-blue-500/10",
    borderColor: "border-cyan-500/20",
    accentColor: "text-cyan-400",
  },
  {
    company: "Blackskies Investments",
    role: "President of Ventures",
    period: "Aug 2024 - Present",
    location: "Berkeley, CA",
    status: "ACTIVE",
    statusColor: "text-emerald-400",
    mission: "Built a student VC club from scratch. Designed the curriculum, ran the product side, and somehow kept it all together.",
    results: [
      { label: "Retention", value: "30%+", color: "text-emerald-400" },
      { label: "NPS Score", value: "72", color: "text-teal-400" },
      { label: "Placements", value: "12/12", color: "text-cyan-400" },
    ],
    gradient: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    accentColor: "text-emerald-400",
    hasPRD: true,
  },
  {
    company: "Deeli AI",
    role: "Business Development Intern",
    period: "Jan 2025 - May 2025",
    location: "Remote",
    status: "COMPLETE",
    statusColor: "text-orange-400",
    mission: "My co-intern and I helped the CEO source TSMC as a client while hustling partnerships for an AI startup doing deal intelligence.",
    results: [
      { label: "Key Win", value: "TSMC", color: "text-orange-400" },
    ],
    gradient: "from-orange-500/20 to-amber-500/10",
    borderColor: "border-orange-500/20",
    accentColor: "text-orange-400",
  },
  {
    company: "Mos",
    role: "Growth Marketing Intern (Contract)",
    period: "May 2024 - Aug 2024",
    location: "Remote",
    status: "COMPLETE",
    statusColor: "text-violet-400",
    mission: "Contract gig helping a fintech app for college students grow its user base and get the brand out there.",
    results: [
      { label: "Conversion", value: "+26%", color: "text-violet-400" },
      { label: "Brand Reach", value: "+30%", color: "text-fuchsia-400" },
    ],
    gradient: "from-violet-500/20 to-purple-500/10",
    borderColor: "border-violet-500/20",
    accentColor: "text-violet-400",
  },
  {
    company: "TIAA",
    role: "Financial Consultant Intern",
    period: "Jun 2023 - Jul 2023",
    location: "Charlotte, NC",
    status: "COMPLETE",
    statusColor: "text-slate-400",
    mission: "First real internship. Cleaned up CRM data and workflows at a big financial services company. Learned the ropes.",
    results: [
      { label: "Data Accuracy", value: "+15%", color: "text-slate-300" },
    ],
    gradient: "from-slate-500/20 to-gray-500/10",
    borderColor: "border-slate-500/20",
    accentColor: "text-slate-400",
  },
];

const CONCERTS = [
  { artist: "Knock2", venue: "The Midway SF", vibe: "Bass house mayhem. Lost my voice and a shoe.", gradient: "from-violet-600 to-purple-800", glow: "shadow-violet-500/30" },
  { artist: "Playboi Carti", venue: "Rolling Loud", vibe: "Mosh pit survivor. WLR energy unmatched.", gradient: "from-red-600 to-rose-800", glow: "shadow-red-500/30" },
  { artist: "Fred again..", venue: "Coachella", vibe: "Emotional electronic. Cried during 'Marea.'", gradient: "from-cyan-600 to-teal-800", glow: "shadow-cyan-500/30" },
  { artist: "Skrillex", venue: "Warehouse Set", vibe: "Underground filth. Walls were shaking.", gradient: "from-fuchsia-600 to-pink-800", glow: "shadow-fuchsia-500/30" },
];

const GEAR = {
  technical: [
    { name: "Python", level: "Advanced" },
    { name: "SQL", level: "Advanced" },
    { name: "R", level: "Intermediate" },
    { name: "Figma", level: "Advanced" },
    { name: "Tableau", level: "Intermediate" },
    { name: "Excel/Sheets", level: "Advanced" },
  ],
  product: [
    { name: "User Research", level: "Advanced" },
    { name: "A/B Testing", level: "Advanced" },
    { name: "PRD Writing", level: "Advanced" },
    { name: "Roadmapping", level: "Advanced" },
    { name: "Data Analysis", level: "Advanced" },
    { name: "Go-to-Market", level: "Intermediate" },
  ],
  hidden: { name: "Lvl 16 Ebarbs Deck", level: "10500 Trophies", icon: Swords },
};

function lonLatToSvg([lon, lat]: [number, number]): [number, number] {
  const x = 2.2868 * lon + 406.1281;
  const latRad = (lat * Math.PI) / 180;
  const millerY = Math.log(Math.tan(Math.PI / 4 + 0.4 * latRad)) / 0.8;
  const y = -124.0905 * millerY + 513.6037;
  return [x, y];
}

const TRAVEL_PINS = [
  {
    city: "Berkeley",
    country: "USA",
    coordinates: [-122.27, 37.87] as [number, number],
    highlight: "Where it all started. Studying Data Science & Economics at Cal, building products between classes.",
    color: "bg-cyan-400",
    hex: "#22d3ee",
    glowColor: "shadow-cyan-400/40",
    image: berkeleyImg,
  },
  {
    city: "New York",
    country: "USA",
    coordinates: [-74.01, 40.71] as [number, number],
    highlight: "Home base. Grew up across the river in Jersey watching my parents build their careers in the city. NYC runs in my blood.",
    color: "bg-orange-400",
    hex: "#fb923c",
    glowColor: "shadow-orange-400/40",
    image: newyorkImg,
  },
  {
    city: "Lucerne",
    country: "Switzerland",
    coordinates: [8.31, 47.05] as [number, number],
    highlight: "Alps taught me that the best views require the hardest climbs. Also, Swiss chocolate is undefeated.",
    color: "bg-emerald-400",
    hex: "#34d399",
    glowColor: "shadow-emerald-400/40",
    image: switzerlandImg,
  },
];

export default function Explorer() {
  const [activeWaypoint, setActiveWaypoint] = useState("basecamp");
  const [activePin, setActivePin] = useState<string | null>(null);
  const [showPRD, setShowPRD] = useState(false);
  const [showSquadVault, setShowSquadVault] = useState(false);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [showBeacon, setShowBeacon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;

      let closest = "basecamp";
      let closestDistance = Infinity;

      for (const wp of WAYPOINTS) {
        const el = sectionRefs.current[wp.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          const distance = Math.abs(relativeTop - viewportHeight * 0.3);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = wp.id;
          }
        }
      }

      setActiveWaypoint(closest);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollTop = containerRef.current.scrollTop + elRect.top - containerRect.top - 40;
      containerRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex">
      <nav className="hidden md:flex w-16 lg:w-52 shrink-0 flex-col items-center lg:items-start py-8 px-2 lg:px-5 z-50 border-r border-white/5 bg-background/80 backdrop-blur-xl" data-testid="waypoint-nav">
        <div className="flex items-center gap-2 mb-8 lg:mb-10">
          <Compass className="w-5 h-5 text-teal-400" />
          <span className="hidden lg:block text-sm font-display font-bold text-teal-400 tracking-wide uppercase">Field Guide</span>
        </div>

        <div className="flex flex-col gap-1 w-full relative">
          <div className="absolute left-[19px] lg:left-[11px] top-2 bottom-2 w-px waypoint-line hidden lg:block" />
          {WAYPOINTS.map((wp) => {
            const isActive = activeWaypoint === wp.id;
            return (
              <button
                key={wp.id}
                data-testid={`waypoint-${wp.id}`}
                onClick={() => scrollToSection(wp.id)}
                className={`flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-md transition-all duration-300 group relative ${
                  isActive ? "text-teal-400" : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-teal-500/20 ring-2 ring-teal-400/50"
                    : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <wp.icon className="w-3.5 h-3.5" />
                </div>
                <span className={`hidden lg:block text-xs font-mono transition-all duration-300 ${
                  isActive ? "font-semibold" : ""
                }`}>
                  {wp.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="waypoint-indicator"
                    className="absolute inset-0 rounded-md bg-teal-500/8 border border-teal-500/15"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto hidden lg:block">
          <div className="glass-light rounded-md p-3 text-center">
            <p className="text-[10px] font-mono text-muted-foreground">Coordinates</p>
            <p className="text-xs font-mono text-teal-400 mt-0.5">37.8716 N, 122.2727 W</p>
          </div>
        </div>
      </nav>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide relative"
      >
        <motion.div
          className="absolute inset-0 topo-bg topo-pattern pointer-events-none"
          style={{ y: bgY }}
        />

        <div className="relative z-10">
          <section ref={setRef("basecamp")} id="basecamp" className="min-h-screen flex items-center py-20 px-6 md:px-12 lg:px-20" data-testid="section-basecamp">
            <div className="max-w-5xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-teal-400 pulse-dot" />
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-[0.2em]">Waypoint 01 / Basecamp</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight mb-4">
                  Sidharth <br />
                  <span className="text-teal-400">Kasarla</span>
                </h1>

                <p className="text-xs font-mono text-teal-400/70 uppercase tracking-[0.25em] mb-2">Product Portfolio</p>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
                  Building, iterating, scrapping, rebuilding.
                  Somewhere between
                  <span className="text-orange-400"> product</span>,
                  <span className="text-cyan-400"> data science</span>, and
                  <span className="text-emerald-400"> venture capital</span>...
                  usually all three at once.
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-12">
                  <a
                    href="mailto:skasarla@berkeley.edu"
                    data-testid="link-email"
                    className="card-tactical rounded-md px-4 py-2.5 flex items-center gap-2 text-sm font-mono text-foreground/80 transition-colors hover-elevate"
                  >
                    <Mail className="w-4 h-4 text-teal-400" />
                    skasarla@berkeley.edu
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sidharth-kasarla"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-linkedin"
                    className="card-tactical rounded-md px-4 py-2.5 flex items-center gap-2 text-sm font-mono text-foreground/80 transition-colors hover-elevate"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.15em]">Photo Dump</span>
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-lg">
                  {[
                    { label: "Berkeley, CA", sub: "The Academic Grind", gradient: "from-cyan-900/50 to-teal-900/30" },
                    { label: "Switzerland", sub: "The Adventure", gradient: "from-emerald-900/50 to-green-900/30" },
                    { label: "Concert Night", sub: "The Candid", gradient: "from-violet-900/50 to-purple-900/30" },
                  ].map((photo) => (
                    <div
                      key={photo.label}
                      data-testid={`photo-${photo.label.toLowerCase().replace(/[,\s]+/g, '-')}`}
                      className={`aspect-[4/5] rounded-md bg-gradient-to-br ${photo.gradient} border border-white/5 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 cursor-pointer group`}
                    >
                      <p className="text-xs font-display font-semibold text-foreground/50 group-hover:text-foreground/70 transition-colors">{photo.label}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">{photo.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-teal-400" />
                  <div>
                    <p className="text-sm font-display font-semibold">University of California, Berkeley</p>
                    <p className="text-xs font-mono text-muted-foreground">B.A. Data Science, B.A. Economics &middot; GPA: 3.85 &middot; Expected May 2028</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section ref={setRef("projects")} id="projects" className="py-20 px-6 md:px-12 lg:px-20" data-testid="section-projects">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em]">Waypoint 02 / Projects</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Case Studies</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Things I've built from scratch. Click into a project for the full dossier.
                </p>
              </motion.div>

              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  data-testid="project-squadvault"
                  className="card-tactical rounded-md overflow-hidden transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-cyan-500/40 to-orange-500/20" />
                  <div className="p-5 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold">SquadVault</h3>
                            <p className="text-xs font-mono text-muted-foreground">FinTech / Group Travel Payments</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/10">
                        CASE STUDY
                      </span>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-2xl">
                      Designed a proactive group funding platform that eliminates the "I'll Venmo you later" problem.
                      Secure escrow vaults, auto-refund logic, and virtual card issuance, built for Gen-Z travel groups
                      who are tired of fronting costs and chasing payments.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      {[
                        { label: "Role", value: "Lead PM", color: "text-cyan-400" },
                        { label: "Status", value: "Deployed", color: "text-emerald-400" },
                        { label: "Stack", value: "Plaid / Stripe / React", color: "text-orange-400" },
                      ].map((r) => (
                        <div key={r.label} className="glass-light rounded-md px-3 py-1.5 flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground">{r.label}:</span>
                          <span className={`text-sm font-display font-bold ${r.color}`}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      data-testid="btn-open-squadvault"
                      onClick={() => setShowSquadVault(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono transition-all duration-300 glow-teal hover-elevate active-elevate-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Open Full Dossier
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  data-testid="project-launchpad"
                  className="card-tactical rounded-md overflow-hidden transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-orange-500/40 to-amber-500/20" />
                  <div className="p-5 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold">Blackskies Launchpad</h3>
                            <p className="text-xs font-mono text-muted-foreground">Startup Incubator / Education Design</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/10">
                        CASE STUDY
                      </span>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-2xl">
                      Designed and launched a 10-week startup incubator curriculum for Blackskies Ventures,
                      turning new VC club members into founders. Demo Day pitches to real industry partners.
                      one member got into Y Combinator.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      {[
                        { label: "Role", value: "Head of Education", color: "text-orange-400" },
                        { label: "Cohorts", value: "2 Semesters", color: "text-amber-400" },
                        { label: "Outcome", value: "YC Acceptance", color: "text-emerald-400" },
                      ].map((r) => (
                        <div key={r.label} className="glass-light rounded-md px-3 py-1.5 flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground">{r.label}:</span>
                          <span className={`text-sm font-display font-bold ${r.color}`}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      data-testid="btn-open-launchpad"
                      onClick={() => setShowLaunchpad(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-mono transition-all duration-300 hover-elevate active-elevate-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Open Full Dossier
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  data-testid="project-beacon"
                  className="card-tactical rounded-md overflow-hidden transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-cyan-500/40 to-violet-500/20" />
                  <div className="p-5 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                            <Radio className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold">Beacon</h3>
                            <p className="text-xs font-mono text-muted-foreground">BLE Mesh Protocol / Systems Architecture</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/10">
                        CASE STUDY
                      </span>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-2xl">
                      Designed a decentralized BLE mesh network for off-grid communication at festivals.
                      Peer-to-peer protocol that bypasses dead cell towers, fits location data into 31-byte
                      packets, and keeps your squad connected when 50k people kill the network.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      {[
                        { label: "Role", value: "Lead PM & Architect", color: "text-cyan-400" },
                        { label: "Protocol", value: "BLE 5.0 Mesh", color: "text-violet-400" },
                        { label: "Constraint", value: "31-Byte Packets", color: "text-orange-400" },
                      ].map((r) => (
                        <div key={r.label} className="glass-light rounded-md px-3 py-1.5 flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground">{r.label}:</span>
                          <span className={`text-sm font-display font-bold ${r.color}`}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      data-testid="btn-open-beacon"
                      onClick={() => setShowBeacon(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono transition-all duration-300 hover-elevate active-elevate-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Open Full Dossier
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section ref={setRef("tour-of-duty")} id="tour-of-duty" className="py-20 px-6 md:px-12 lg:px-20" data-testid="section-tour-of-duty">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 pulse-dot" />
                  <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.2em]">Waypoint 03 / Tour of Duty</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Work Experience</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Places I've worked. Each one taught me something different, and all of them required Red Bulls.
                </p>
              </motion.div>

              <div className="space-y-5">
                {EXPERIENCES.map((exp, i) => (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    data-testid={`dossier-${exp.company.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`card-tactical rounded-md overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-1 bg-gradient-to-r ${exp.gradient}`} />
                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-display font-bold">{exp.company}</h3>
                            <span className={`text-[10px] font-mono ${exp.statusColor} px-2 py-0.5 rounded-full bg-current/10 border border-current/20`} style={{ color: undefined }}>
                              <span className={exp.statusColor}>{exp.status}</span>
                            </span>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground">{exp.role}</p>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">{exp.location} &middot; {exp.period}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className={`w-3.5 h-3.5 ${exp.accentColor}`} />
                          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Mission Objective</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{exp.mission}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                          <TrendingUp className={`w-3.5 h-3.5 ${exp.accentColor}`} />
                          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Field Results</span>
                        </div>
                        {exp.results.map((r) => (
                          <div key={r.label} className="glass-light rounded-md px-3 py-1.5 flex items-center gap-2">
                            <span className="text-[11px] font-mono text-muted-foreground">{r.label}:</span>
                            <span className={`text-sm font-display font-bold ${r.color}`}>{r.value}</span>
                          </div>
                        ))}
                        {exp.hasPRD && (
                          <button
                            data-testid="btn-view-prd"
                            onClick={() => setShowPRD(true)}
                            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-mono transition-all duration-300 glow-teal hover-elevate active-elevate-2"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Data Link: View PRD
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section ref={setRef("rave-archive")} id="rave-archive" className="py-20 px-6 md:px-12 lg:px-20" data-testid="section-rave-archive">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 pulse-dot" />
                  <span className="text-xs font-mono text-violet-400 uppercase tracking-[0.2em]">Waypoint 04 / Rave Archive</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Concert Highlights</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Side quests that recharge the creative energy. Every show is field research in human behavior.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONCERTS.map((concert, i) => (
                  <motion.div
                    key={concert.artist}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    data-testid={`concert-${concert.artist.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`group relative rounded-md cursor-pointer bg-gradient-to-br ${concert.gradient} border border-white/10 transition-all duration-500`}
                  >
                    <div className="p-6 md:p-8 relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Music2 className="w-4 h-4 text-white/60" />
                        <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">{concert.venue}</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-2">{concert.artist}</h3>
                      <p className="text-sm text-white/40 leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                        {concert.vibe}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-end gap-[2px] h-8 max-w-xs">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar w-[4px] rounded-full"
                    style={{
                      height: "100%",
                      animationDelay: `${i * 0.06}s`,
                      animationDuration: `${0.8 + Math.random() * 0.8}s`,
                      background: `linear-gradient(to top, rgba(139, 92, 246, 0.6), rgba(20, 184, 166, 0.4))`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section ref={setRef("gear-loadout")} id="gear-loadout" className="py-20 px-6 md:px-12 lg:px-20" data-testid="section-gear-loadout">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em]">Waypoint 05 / Gear Loadout</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Technical Gear</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Every explorer needs the right tools. Here's what's in the pack.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card-tactical rounded-md p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-display font-semibold text-cyan-400 uppercase tracking-wider">Technical Skills</span>
                  </div>
                  <div className="space-y-3">
                    {GEAR.technical.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm font-mono text-foreground/80">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                              style={{ width: skill.level === "Advanced" ? "90%" : "65%" }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-20 text-right">{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card-tactical rounded-md p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-display font-semibold text-orange-400 uppercase tracking-wider">Product Skills</span>
                  </div>
                  <div className="space-y-3">
                    {GEAR.product.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm font-mono text-foreground/80">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                              style={{ width: skill.level === "Advanced" ? "90%" : "65%" }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-20 text-right">{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-5 card-tactical rounded-md p-4 max-w-sm glow-orange"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <GEAR.hidden.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold flex items-center gap-2">
                      {GEAR.hidden.name}
                      <span className="text-[10px] font-mono text-orange-400 px-1.5 py-0.5 rounded bg-orange-500/10">HIDDEN SKILL</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-mono text-amber-400">{GEAR.hidden.level}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section ref={setRef("travel-log")} id="travel-log" className="py-20 px-6 md:px-12 lg:px-20 pb-32" data-testid="section-travel-log">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-[0.2em]">Waypoint 06 / Travel Log</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Expedition Map</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Click a pin to see what I discovered at each location.
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {activePin ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="card-tactical rounded-md overflow-hidden relative"
                    data-testid="expanded-view"
                  >
                    {(() => {
                      const pin = TRAVEL_PINS.find(p => p.city === activePin);
                      if (!pin) return null;
                      return (
                        <>
                          <div className="flex items-center justify-between gap-4 p-4 md:px-6 md:py-4 border-b border-white/5">
                            <button
                              data-testid="button-back-to-map"
                              onClick={() => setActivePin(null)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-md glass-light text-sm font-mono text-foreground/80 hover-elevate active-elevate-2"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Back to Map
                            </button>
                            <div className="flex items-center gap-2">
                              {TRAVEL_PINS.filter(p => p.city !== activePin).map(otherPin => (
                                <button
                                  key={otherPin.city}
                                  data-testid={`jump-to-${otherPin.city.toLowerCase().replace(/\s/g, "-")}`}
                                  onClick={() => setActivePin(otherPin.city)}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-md glass-light text-xs font-mono text-foreground/60 hover-elevate active-elevate-2"
                                >
                                  <div className={`w-2 h-2 rounded-full ${otherPin.color}`} />
                                  {otherPin.city}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                            <img
                              src={pin.image}
                              alt={`${pin.city}, ${pin.country}`}
                              className="w-full h-full object-cover"
                              data-testid={`expanded-photo-${pin.city.toLowerCase().replace(/\s/g, "-")}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                            <div className="absolute bottom-6 left-6 md:left-8">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${pin.color}`} />
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">{pin.country}</span>
                              </div>
                              <h3 data-testid="expanded-city-name" className="text-3xl md:text-4xl font-display font-bold text-white">{pin.city}</h3>
                            </div>
                          </div>
                          <div className="p-6 md:p-8">
                            <div className="flex items-start gap-3">
                              <MapPin className={`w-4 h-4 mt-0.5 ${pin.color.replace("bg-", "text-")}`} />
                              <p data-testid="expanded-city-description" className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-xl">
                                {pin.highlight}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="card-tactical rounded-md p-4 md:p-6 relative"
                  >
                    <div className="relative w-full rounded-md overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d1117] border border-white/5 p-3">
                      <svg viewBox="50 290 700 300" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                        {[350, 400, 450, 500].map(y => (
                          <line key={`grid-h-${y}`} x1="50" y1={y} x2="750" y2={y} stroke="rgba(20,184,166,0.06)" strokeWidth={0.3} />
                        ))}
                        {[150, 250, 350, 450, 550, 650].map(x => (
                          <line key={`grid-v-${x}`} x1={x} y1="290" x2={x} y2="590" stroke="rgba(20,184,166,0.06)" strokeWidth={0.3} />
                        ))}

                        {Object.entries(WORLD_MAP_PATHS).map(([continent, paths]) => (
                          <g key={continent}>
                            {paths.map((d, i) => (
                              <path
                                key={`${continent}-${i}`}
                                d={d}
                                fill="rgba(20,184,166,0.08)"
                                stroke="rgba(20,184,166,0.3)"
                                strokeWidth={0.4}
                                strokeLinejoin="round"
                              />
                            ))}
                          </g>
                        ))}

                        {TRAVEL_PINS.map((pin, i) => {
                          if (i === 0) return null;
                          const prev = TRAVEL_PINS[i - 1];
                          const [x1, y1] = lonLatToSvg(prev.coordinates);
                          const [x2, y2] = lonLatToSvg(pin.coordinates);
                          return (
                            <line
                              key={`line-${i}`}
                              x1={x1} y1={y1} x2={x2} y2={y2}
                              stroke="rgba(20,184,166,0.4)"
                              strokeWidth={1}
                              strokeDasharray="4 3"
                              strokeLinecap="round"
                            />
                          );
                        })}

                        {TRAVEL_PINS.map((pin) => {
                          const [cx, cy] = lonLatToSvg(pin.coordinates);
                          return (
                            <g
                              key={pin.city}
                              data-testid={`pin-${pin.city.toLowerCase().replace(/\s/g, "-")}`}
                              onClick={() => setActivePin(pin.city)}
                              style={{ cursor: "pointer" }}
                            >
                              <circle cx={cx} cy={cy} r={6} fill={pin.hex} opacity={0.15}>
                                <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.25" to="0" dur="2s" repeatCount="indefinite" />
                              </circle>
                              <circle cx={cx} cy={cy} r={4} fill={pin.hex} stroke="#0d1117" strokeWidth={1.5} />
                              <text
                                x={cx} y={cy - 10}
                                textAnchor="middle"
                                style={{
                                  fontFamily: "JetBrains Mono, monospace",
                                  fontSize: "7px",
                                  fill: "rgba(255,255,255,0.85)",
                                  paintOrder: "stroke",
                                  stroke: "rgba(0,0,0,0.8)",
                                  strokeWidth: 2.5,
                                  strokeLinejoin: "round",
                                }}
                              >
                                {pin.city}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {TRAVEL_PINS.map((pin, i) => (
                        <motion.div
                          key={pin.city}
                          data-testid={`travel-card-${pin.city.toLowerCase().replace(/\s/g, "-")}`}
                          onClick={() => setActivePin(pin.city)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                          className="glass-light rounded-md overflow-hidden cursor-pointer hover-elevate"
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={pin.image}
                              alt={`${pin.city}, ${pin.country}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-2 left-3 flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${pin.color}`} />
                              <span className="text-sm font-display font-semibold text-white">{pin.city}</span>
                              <span className="text-[10px] font-mono text-white/50">{pin.country}</span>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">
                              {pin.highlight}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-16 text-center">
                <p className="text-sm font-mono text-muted-foreground">
                  Built by Sidharth Kasarla &middot; <span className="text-teal-400/60">Digital Field Guide v1.0</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showPRD && <PRDModal onClose={() => setShowPRD(false)} />}
      {showSquadVault && <SquadVaultDossier onClose={() => setShowSquadVault(false)} />}
      {showLaunchpad && <LaunchpadDossier onClose={() => setShowLaunchpad(false)} />}
      {showBeacon && <BeaconDossier onClose={() => setShowBeacon(false)} />}

      <MobileNav activeWaypoint={activeWaypoint} onNavigate={scrollToSection} />
    </div>
  );
}

function MobileNav({ activeWaypoint, onNavigate }: { activeWaypoint: string; onNavigate: (id: string) => void }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5" data-testid="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {WAYPOINTS.map((wp) => {
          const isActive = activeWaypoint === wp.id;
          return (
            <button
              key={wp.id}
              data-testid={`mobile-waypoint-${wp.id}`}
              onClick={() => onNavigate(wp.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-colors ${
                isActive ? "text-teal-400" : "text-muted-foreground"
              }`}
            >
              <wp.icon className="w-4 h-4" />
              <span className="text-[9px] font-mono">{wp.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SquadVaultDossier({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState<"strategy" | "logic" | "build" | "data">("strategy");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [payments, setPayments] = useState<Record<string, boolean>>({});
  const [cardIssued, setCardIssued] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: "strategy" as const, label: "The Strategy", shortLabel: "Strategy", icon: FileText, color: "text-cyan-400", desc: "PRD Mode" },
    { id: "logic" as const, label: "The Logic", shortLabel: "Logic", icon: Zap, color: "text-orange-400", desc: "Edge Case Simulator" },
    { id: "build" as const, label: "The Build", shortLabel: "Build", icon: Play, color: "text-emerald-400", desc: "Interactive Mockup" },
    { id: "data" as const, label: "The Data", shortLabel: "Data", icon: Code, color: "text-violet-400", desc: "Technical Spec" },
  ];

  const scrollToMode = (id: string) => {
    const el = document.getElementById(`sv-section-${id}`);
    if (el && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const headerHeight = 120;
      const elTop = el.offsetTop - container.offsetTop - headerHeight;
      container.scrollTo({ top: elTop, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const headerOffset = 200;
      for (const m of [...modes].reverse()) {
        const el = document.getElementById(`sv-section-${m.id}`);
        if (el) {
          const top = el.offsetTop - container.offsetTop - headerOffset;
          if (container.scrollTop >= top) {
            setActiveMode(m.id);
            break;
          }
        }
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const allPaid = ["sid", "rave2", "rave3", "rave4"].every(id => payments[id]);

  useEffect(() => {
    if (allPaid && !cardIssued) {
      const timer = setTimeout(() => setCardIssued(true), 800);
      return () => clearTimeout(timer);
    }
  }, [allPaid, cardIssued]);

  const simulatePayment = (memberId: string) => {
    setPayments(prev => ({ ...prev, [memberId]: true }));
  };

  const resetSimulation = () => {
    setPayments({});
    setCardIssued(false);
  };

  const paidCount = Object.values(payments).filter(Boolean).length;
  const progressPercent = (paidCount / 4) * 100;

  const vaultJSON = `{
  "vault_id": "vlt_77_berkeley_rave",
  "status": "FUNDING_COMPLETED",
  "config": {
    "target_amount": 1200.00,
    "currency": "USD",
    "buffer_percentage": 0.05,
    "deadline": "2026-03-01T23:59:59Z",
    "merchant_category_lock": "TRAVEL_LODGING"
  },
  "squad_lead": {
    "user_id": "user_sid_001",
    "kyc_status": "VERIFIED"
  },
  "members": [
    {
      "user_id": "user_sid_001",
      "pledge_amount": 300.00,
      "status": "PAID",
      "payment_method": "PLAID_CHECKING_99"
    },
    {
      "user_id": "user_rave_002",
      "pledge_amount": 300.00,
      "status": "PAID",
      "payment_method": "APPLE_PAY"
    },
    {
      "user_id": "user_rave_003",
      "pledge_amount": 300.00,
      "status": "PAID",
      "payment_method": "DEBIT_CARD"
    },
    {
      "user_id": "user_rave_004",
      "pledge_amount": 300.00,
      "status": "PAID",
      "payment_method": "PLAID_CHECKING_01"
    }
  ],
  "virtual_card": {
    "status": "READY_FOR_ISSUANCE",
    "provider": "STRIPE_ISSUING",
    "spending_limit": 1260.00,
    "notes": "Includes 5% buffer for price fluctuations"
  }
}`;

  const copyJSON = () => {
    navigator.clipboard.writeText(vaultJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex"
      onClick={onClose}
      data-testid="squadvault-dossier"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="hidden md:flex flex-col gap-1 w-60 p-4 relative z-10 border-r border-white/5 bg-background/50 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-foreground">SquadVault</p>
            <p className="text-[9px] font-mono text-muted-foreground">Interactive Case Study</p>
          </div>
        </div>

        <div className="space-y-1">
          {modes.map((m) => {
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                data-testid={`sv-mode-${m.id}`}
                onClick={() => scrollToMode(m.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-all duration-200 ${
                  isActive
                    ? `bg-white/5 ${m.color}`
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                <m.icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold block">{m.label}</span>
                  <span className="text-[9px] font-mono opacity-60">{m.desc}</span>
                </div>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="px-3 mb-3">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Project Status</p>
            <p className="text-xs font-mono text-cyan-400">Strategy Deployed</p>
          </div>
          <button
            data-testid="sv-close-sidebar"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono text-muted-foreground transition-colors hover-elevate w-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 border-b border-white/5 bg-background/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-display font-bold">SquadVault</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Viewing:</span>
              <span className={`text-sm font-mono font-bold ${modes.find(m => m.id === activeMode)?.color}`}>
                {modes.find(m => m.id === activeMode)?.label}
              </span>
            </div>
            <button onClick={onClose} data-testid="sv-close-mobile" className="text-muted-foreground text-sm font-mono hover-elevate px-2 py-1 rounded-md">ESC</button>
          </div>

          <div className="md:hidden flex border-t border-white/5">
            {modes.map((m) => {
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  data-testid={`sv-tab-${m.id}`}
                  onClick={() => scrollToMode(m.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-center transition-all ${
                    isActive ? m.color : "text-muted-foreground"
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  <span className="text-[9px] font-mono">{m.shortLabel}</span>
                  {isActive && <div className="w-6 h-0.5 rounded-full bg-current" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 md:px-10 py-8 space-y-0">

          <section id="sv-section-strategy" data-testid="sv-mode-strategy-content">
            <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em]">Product Requirements Document</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-1">
                    SquadVault: Eliminating <span className="text-cyan-400">"Debt Lag"</span> in Social FinTech
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono">
                    Lead Product Manager // Escrow-as-a-Service Platform
                  </p>
                </div>

                <div className="grid md:grid-cols-[1fr_200px] gap-6">
                  <div className="space-y-6">
                    <div className="card-tactical rounded-md p-5">
                      <p className="text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-3">The Problem: Debt Lag</p>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                        Traditional splitting apps (Venmo, Splitwise) are <span className="text-orange-400 font-bold">reactive</span>, forcing one user to take 100% financial risk upfront. Group travel leads front costs and spend weeks chasing reimbursements.
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        <span className="text-orange-400 font-bold">22%</span> of Gen-Z travelers report social tension caused by delayed payments. The friction isn't the cost, it's the <span className="italic">awkwardness of the chase</span>.
                      </p>
                    </div>

                    <div className="card-tactical rounded-md p-5">
                      <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-3">The Solution</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        A smart-escrow platform that issues a one-time-use virtual card <span className="text-cyan-400 font-bold">only when 100% of the group has contributed</span>. Move the payment to the <span className="italic">start</span> of the user journey, not the end. Productize "Group Accountability."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="card-tactical rounded-md p-4 border border-cyan-500/10">
                      <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mb-2">Strategic Note</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "Chose Virtual Card over direct transfer. Gives Squad Lead control while protecting the group with Merchant Category Locks."
                      </p>
                    </div>
                    <div className="card-tactical rounded-md p-4 border border-orange-500/10">
                      <p className="text-[9px] font-mono text-orange-400 uppercase tracking-wider mb-2">Business Case</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "North Star = Total Group Volume. But real product challenge = Funding Velocity. If we can't fund in 72h, the booking is lost."
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-4">User Personas</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="card-tactical rounded-md p-5 border border-cyan-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-md bg-cyan-500/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-display font-bold">The Squad Lead</p>
                          <p className="text-[10px] font-mono text-cyan-400">Primary Persona</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        The organizer who books accommodations, buys group tickets, and fronts thousands in costs. Tired of being the group's bank.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Risk Bearer", "Price Negotiator", "Group Coordinator"].map(tag => (
                          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-tactical rounded-md p-5 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-display font-bold">The Squad Member</p>
                          <p className="text-[10px] font-mono text-emerald-400">Secondary Persona</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Wants to participate but waiting on paycheck/financial aid. Feels guilty for being "the late one." Needs a deadline to budget against.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Budget Constrained", "Deadline Motivated", "Social Pressure"].map(tag => (
                          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-4">Success Metrics</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Time-to-Fund (TTF)", value: "< 72h", sublabel: "Primary KPI", detail: "Avg velocity from vault creation to 100% funded", color: "text-cyan-400" },
                      { label: "Conversion Rate", value: "85%", sublabel: "Secondary KPI", detail: "Vaults reaching 100% funding before deadline", color: "text-emerald-400" },
                      { label: "Social Multiplier", value: "1.5x", sublabel: "North Star", detail: "New user growth per active Vault lead", color: "text-orange-400" },
                    ].map((metric) => (
                      <div key={metric.label} className="card-tactical rounded-md p-5 text-center">
                        <p className={`text-[10px] font-mono ${metric.color} uppercase tracking-wider mb-2`}>{metric.sublabel}</p>
                        <p className={`text-3xl font-display font-bold ${metric.color} mb-1`}>{metric.value}</p>
                        <p className="text-xs font-display font-semibold mb-0.5">{metric.label}</p>
                        <p className="text-[10px] text-muted-foreground">{metric.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <p className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">User Discovery: The "Debt Lag" Study</p>
                    <span className="text-[9px] font-mono text-muted-foreground ml-2">8 UC Berkeley Students</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        persona: "The Planner",
                        type: "Target Persona",
                        quote: "I stopped organizing house trips because I'm tired of being the group's bank. Last time, I fronted $2,400 for a Coachella Airbnb and it took three months to get the last $300 back. It makes me resent my friends.",
                        attribution: "Junior, EECS @ UC Berkeley",
                        color: "border-cyan-500/20",
                        accentColor: "text-cyan-400",
                      },
                      {
                        persona: "The Participant",
                        type: "Secondary Persona",
                        quote: "It's not that I don't want to pay, it's just that I'm waiting for my financial aid or paycheck. By the time I have the money, the 'Planner' has already paid, and I feel guilty for being the 'late one.' SquadVault's deadline-funding would actually help me budget better.",
                        attribution: "Senior, Economics @ UC Berkeley",
                        color: "border-emerald-500/20",
                        accentColor: "text-emerald-400",
                      },
                      {
                        persona: "The Risk-Averse User",
                        type: "Security Focused",
                        quote: "The scariest part of Venmo is that there's no protection. If the 'Planner' gets scammed by a fake host, we all lose our money. Knowing SquadVault uses a secure escrow and a virtual card makes the whole thing feel way safer.",
                        attribution: "Sophomore, Data Science @ UC Berkeley",
                        color: "border-orange-500/20",
                        accentColor: "text-orange-400",
                      },
                    ].map((q) => (
                      <div key={q.persona} className={`card-tactical rounded-md p-5 border ${q.color}`} data-testid={`sv-quote-${q.persona.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className={`w-3.5 h-3.5 ${q.accentColor}`} />
                          <span className={`text-[10px] font-mono ${q.accentColor} font-bold`}>{q.persona}</span>
                          <span className="text-[9px] font-mono text-muted-foreground">// {q.type}</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed italic mb-3">"{q.quote}"</p>
                        <p className="text-[10px] font-mono text-muted-foreground">- {q.attribution}</p>
                      </div>
                    ))}
                  </div>

                  <div className="card-tactical rounded-md p-5 mt-4 border border-teal-500/10">
                    <p className="text-[10px] font-mono text-teal-400 uppercase tracking-wider mb-3">PM Synthesis</p>
                    <div className="space-y-2">
                      {[
                        { insight: "The problem is social, not financial. The friction is the awkwardness of the \"chase\"" },
                        { insight: "The \"All-or-Nothing\" funding trigger was the most requested feature. Removes burden of fronting" },
                        { insight: "Merchant Category Locking on virtual card emerged as a massive trust-builder from user feedback" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 text-teal-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-foreground/70 leading-relaxed">{item.insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-tactical rounded-md p-5 border border-violet-500/10">
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-2">V2.0 Reflection</p>
                  <p className="text-sm text-foreground/70 leading-relaxed italic">
                    "Adding a secondary market for reselling 'Vault Pledges' if a member drops out, turning the dropout edge case into a feature, not a bug."
                  </p>
                </div>
            </div>
          </section>

          <div className="py-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5">
              <Zap className="w-3 h-3 text-orange-400" />
              <span className="text-[9px] font-mono text-orange-400 uppercase tracking-wider">Mode 02</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          </div>

          <section id="sv-section-logic" data-testid="sv-mode-logic-content">
            <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.2em]">Edge Case Simulator</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                    How does SquadVault handle <span className="text-orange-400">conflict</span>?
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    Click a scenario to see the system's logic flow in real-time.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "price-jump",
                      title: "The Price Jump",
                      subtitle: "Airbnb price increases +10%",
                      icon: TrendingUp,
                      color: "text-orange-400",
                      borderColor: "border-orange-500/30",
                      bgColor: "bg-orange-500/5",
                      steps: [
                        { label: "Detect", detail: "System polls merchant price before deadline", icon: Target, status: "alert" as const },
                        { label: "Compare", detail: "New price ($1,320) vs. Buffer ceiling ($1,260)", icon: BarChart3, status: "warning" as const },
                        { label: "Exceeds Buffer", detail: "Price jump > 5% buffer threshold", icon: AlertTriangle, status: "alert" as const },
                        { label: "Pause Vault", detail: "Vault status → PAUSED. No auto-refund yet.", icon: Shield, status: "info" as const },
                        { label: "Notify Squad", detail: "Push notification: 'Price changed. Top-up $15/person needed.'", icon: MessageSquare, status: "info" as const },
                        { label: "Resolve", detail: "Members approve top-up → Vault resumes. Or reject → Auto-refund all.", icon: Check, status: "success" as const },
                      ],
                    },
                    {
                      id: "dropout",
                      title: "Last-Minute Dropout",
                      subtitle: "Member leaves 24h before deadline",
                      icon: Users,
                      color: "text-cyan-400",
                      borderColor: "border-cyan-500/30",
                      bgColor: "bg-cyan-500/5",
                      steps: [
                        { label: "Member Exits", detail: "user_rave_003 triggers 'Leave Vault'", icon: User, status: "alert" as const },
                        { label: "Auto-Refund", detail: "$300 returned to dropout's payment method", icon: CreditCard, status: "info" as const },
                        { label: "Recalculate", detail: "Total $1,200 ÷ 3 remaining = $400/person", icon: BarChart3, status: "warning" as const },
                        { label: "Notify", detail: "Remaining members see updated share: $300 → $400", icon: MessageSquare, status: "info" as const },
                        { label: "Consent", detail: "Each member must approve new amount within 24h", icon: Shield, status: "info" as const },
                        { label: "Resolve", detail: "All approve → Vault continues. Any reject → Full refund.", icon: Check, status: "success" as const },
                      ],
                    },
                    {
                      id: "merchant-reject",
                      title: "Merchant Rejection",
                      subtitle: "Vendor rejects virtual card",
                      icon: CreditCard,
                      color: "text-emerald-400",
                      borderColor: "border-emerald-500/30",
                      bgColor: "bg-emerald-500/5",
                      steps: [
                        { label: "Card Declined", detail: "Merchant POS returns: CARD_NOT_ACCEPTED", icon: AlertTriangle, status: "alert" as const },
                        { label: "Log Event", detail: "System captures merchant_id, error_code, timestamp", icon: Database, status: "info" as const },
                        { label: "Fallback Mode", detail: "Generate 'Proof of Funds' certificate (PDF)", icon: FileText, status: "info" as const },
                        { label: "Notify Lead", detail: "Squad Lead receives certificate + instructions", icon: MessageSquare, status: "info" as const },
                        { label: "Manual Auth", detail: "Lead uses personal card. Certificate proves group backing.", icon: Shield, status: "warning" as const },
                        { label: "Resolve", detail: "Vault releases funds to Lead's account as reimbursement.", icon: Check, status: "success" as const },
                      ],
                    },
                  ].map((scenario) => (
                    <button
                      key={scenario.id}
                      data-testid={`sv-scenario-${scenario.id}`}
                      onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
                      className={`card-tactical rounded-md p-5 border ${scenario.borderColor} text-left transition-all duration-300 w-full ${
                        activeScenario === scenario.id ? `${scenario.bgColor} border-opacity-60` : "hover:border-opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                        {activeScenario === scenario.id ? (
                          <span className={`text-[9px] font-mono ${scenario.color} uppercase`}>Active</span>
                        ) : (
                          <span className="text-[9px] font-mono text-muted-foreground uppercase">Click to simulate</span>
                        )}
                      </div>
                      <h3 className="text-sm font-display font-bold mb-1">{scenario.title}</h3>
                      <p className="text-[11px] text-muted-foreground">{scenario.subtitle}</p>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeScenario && (
                    <motion.div
                      key={activeScenario}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {(() => {
                        const scenario = [
                          {
                            id: "price-jump", color: "text-orange-400", borderColor: "border-orange-500/20", lineColor: "bg-orange-500/30",
                            steps: [
                              { label: "Detect", detail: "System polls merchant price before deadline", icon: Target, status: "alert" as const },
                              { label: "Compare", detail: "New price ($1,320) vs. Buffer ceiling ($1,260)", icon: BarChart3, status: "warning" as const },
                              { label: "Exceeds Buffer", detail: "Price jump > 5% buffer threshold", icon: AlertTriangle, status: "alert" as const },
                              { label: "Pause Vault", detail: "Vault status → PAUSED. No auto-refund yet.", icon: Shield, status: "info" as const },
                              { label: "Notify Squad", detail: "Push notification: 'Price changed. Top-up $15/person needed.'", icon: MessageSquare, status: "info" as const },
                              { label: "Resolve", detail: "Members approve top-up → Vault resumes. Or reject → Auto-refund all.", icon: Check, status: "success" as const },
                            ],
                          },
                          {
                            id: "dropout", color: "text-cyan-400", borderColor: "border-cyan-500/20", lineColor: "bg-cyan-500/30",
                            steps: [
                              { label: "Member Exits", detail: "user_rave_003 triggers 'Leave Vault'", icon: User, status: "alert" as const },
                              { label: "Auto-Refund", detail: "$300 returned to dropout's payment method", icon: CreditCard, status: "info" as const },
                              { label: "Recalculate", detail: "Total $1,200 ÷ 3 remaining = $400/person", icon: BarChart3, status: "warning" as const },
                              { label: "Notify", detail: "Remaining members see updated share: $300 → $400", icon: MessageSquare, status: "info" as const },
                              { label: "Consent", detail: "Each member must approve new amount within 24h", icon: Shield, status: "info" as const },
                              { label: "Resolve", detail: "All approve → Vault continues. Any reject → Full refund.", icon: Check, status: "success" as const },
                            ],
                          },
                          {
                            id: "merchant-reject", color: "text-emerald-400", borderColor: "border-emerald-500/20", lineColor: "bg-emerald-500/30",
                            steps: [
                              { label: "Card Declined", detail: "Merchant POS returns: CARD_NOT_ACCEPTED", icon: AlertTriangle, status: "alert" as const },
                              { label: "Log Event", detail: "System captures merchant_id, error_code, timestamp", icon: Database, status: "info" as const },
                              { label: "Fallback Mode", detail: "Generate 'Proof of Funds' certificate (PDF)", icon: FileText, status: "info" as const },
                              { label: "Notify Lead", detail: "Squad Lead receives certificate + instructions", icon: MessageSquare, status: "info" as const },
                              { label: "Manual Auth", detail: "Lead uses personal card. Certificate proves group backing.", icon: Shield, status: "warning" as const },
                              { label: "Resolve", detail: "Vault releases funds to Lead's account as reimbursement.", icon: Check, status: "success" as const },
                            ],
                          },
                        ].find(s => s.id === activeScenario);

                        if (!scenario) return null;

                        const statusColors: Record<string, string> = {
                          alert: "bg-red-500/20 text-red-400 border-red-500/30",
                          warning: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                          info: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                          success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                        };

                        return (
                          <div className="card-tactical rounded-md p-6 mt-2" data-testid={`sv-flow-${activeScenario}`}>
                            <p className={`text-[10px] font-mono ${scenario.color} uppercase tracking-wider mb-5`}>Logic Flow // Step-by-Step Resolution</p>
                            <div className="relative">
                              <div className={`absolute left-[15px] top-4 bottom-4 w-px ${scenario.lineColor}`} />
                              <div className="space-y-4">
                                {scenario.steps.map((step, i) => (
                                  <motion.div
                                    key={step.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.3 }}
                                    className="flex items-start gap-4 relative"
                                  >
                                    <div className={`w-[30px] h-[30px] rounded-md flex items-center justify-center flex-shrink-0 border ${statusColors[step.status]} z-10`}>
                                      <step.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="pt-1">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-mono text-muted-foreground">STEP {String(i + 1).padStart(2, '0')}</span>
                                        <span className={`text-xs font-mono font-bold ${scenario.color}`}>{step.label}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </section>

          <div className="py-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <Play className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Mode 03</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          </div>

          <section id="sv-section-build" data-testid="sv-mode-build-content">
            <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">Interactive Prototype</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                    Try the <span className="text-emerald-400">Vault</span> yourself
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    Simulate payments from each squad member to see how SquadVault works.
                  </p>
                </div>

                <div className="card-tactical rounded-md p-6 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-display font-bold">Berkeley Rave House 2026</span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">Vault ID: vlt_77_berkeley_rave // Coachella Airbnb</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display font-bold text-cyan-400">${(paidCount * 300).toFixed(2)}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">of $1,200.00 target</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">Vault Progress</span>
                      <span className="text-[10px] font-mono text-cyan-400">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Deadline: Mar 1, 2026
                      </span>
                      <span className={`text-[10px] font-mono ${allPaid ? "text-emerald-400" : "text-orange-400"}`}>
                        {allPaid ? "FUNDING COMPLETE" : `${paidCount}/4 Members Paid`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: "sid", name: "Sidharth K.", handle: "user_sid_001", amount: 300, role: "Squad Lead", method: "Plaid Checking" },
                      { id: "rave2", name: "Alex M.", handle: "user_rave_002", amount: 300, role: "Member", method: "Apple Pay" },
                      { id: "rave3", name: "Jordan L.", handle: "user_rave_003", amount: 300, role: "Member", method: "Debit Card" },
                      { id: "rave4", name: "Riley T.", handle: "user_rave_004", amount: 300, role: "Member", method: "Plaid Checking" },
                    ].map((member) => {
                      const isPaid = payments[member.id];
                      return (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-md transition-all duration-300 ${
                            isPaid ? "glass-light border border-emerald-500/20" : "glass-light"
                          }`}
                          data-testid={`sv-member-${member.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              isPaid ? "bg-emerald-500/20" : "bg-white/5"
                            }`}>
                              {isPaid ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-display font-bold">{member.name}</p>
                                {member.role === "Squad Lead" && (
                                  <span className="text-[8px] font-mono text-cyan-400 px-1.5 py-0.5 rounded-full border border-cyan-500/20">LEAD</span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-muted-foreground">
                                {isPaid ? `Paid via ${member.method}` : member.handle}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-mono font-bold ${isPaid ? "text-emerald-400" : "text-foreground/70"}`}>
                              ${member.amount}
                            </span>
                            {!isPaid && !cardIssued && (
                              <button
                                data-testid={`sv-pay-${member.id}`}
                                onClick={() => simulatePayment(member.id)}
                                className="text-[10px] font-mono px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 transition-all hover-elevate active-elevate-2"
                              >
                                Simulate Pay
                              </button>
                            )}
                            {isPaid && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-[9px] font-mono text-emerald-400 uppercase"
                              >
                                Paid
                              </motion.span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!allPaid && !cardIssued && (
                    <div className="card-tactical rounded-md p-4 border border-white/5 text-center">
                      <p className="text-xs text-muted-foreground font-mono">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Virtual card locked until all members pay
                      </p>
                    </div>
                  )}

                  <AnimatePresence>
                    {cardIssued && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="relative"
                        data-testid="sv-virtual-card"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-md blur-xl" />
                        <div className="relative rounded-md p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Virtual Card Issued</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                              ACTIVE
                            </span>
                          </div>

                          <div className="mb-6">
                            <p className="text-[10px] font-mono text-muted-foreground mb-1">Card Number</p>
                            <p className="text-xl font-mono text-foreground tracking-[0.15em]">4242 **** **** 7831</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-[9px] font-mono text-muted-foreground mb-0.5">Spending Limit</p>
                              <p className="text-sm font-mono text-cyan-400 font-bold">$1,260.00</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-muted-foreground mb-0.5">Category Lock</p>
                              <p className="text-sm font-mono text-emerald-400 font-bold">TRAVEL</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-muted-foreground mb-0.5">Provider</p>
                              <p className="text-sm font-mono text-violet-400 font-bold">Stripe</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-muted-foreground">Includes 5% buffer for price fluctuations</span>
                            <span className="text-[9px] font-mono text-muted-foreground">One-Time Use</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {cardIssued && (
                    <div className="mt-4 text-center">
                      <button
                        data-testid="sv-reset-sim"
                        onClick={resetSimulation}
                        className="text-[10px] font-mono px-4 py-2 rounded-md text-muted-foreground transition-all hover-elevate active-elevate-2"
                      >
                        Reset Simulation
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "Smart Vault", desc: "Escrow-backed holding until fully funded", icon: Lock, color: "text-cyan-400", borderColor: "border-cyan-500/20" },
                    { label: "Go/No-Go", desc: "100% = unlock. <100% = auto-refund all.", icon: Zap, color: "text-emerald-400", borderColor: "border-emerald-500/20" },
                    { label: "Virtual Card", desc: "One-time VISA with merchant category lock", icon: CreditCard, color: "text-orange-400", borderColor: "border-orange-500/20" },
                  ].map((f) => (
                    <div key={f.label} className={`card-tactical rounded-md p-4 border ${f.borderColor}`}>
                      <f.icon className={`w-4 h-4 ${f.color} mb-2`} />
                      <p className="text-xs font-display font-bold mb-1">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
            </div>
          </section>

          <div className="py-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5">
              <Code className="w-3 h-3 text-violet-400" />
              <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider">Mode 04</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          </div>

          <section id="sv-section-data" data-testid="sv-mode-data-content">
            <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] font-mono text-violet-400 uppercase tracking-[0.2em]">Technical Specification</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                    Under the <span className="text-violet-400">Hood</span>
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    API integrations, data structures, and the Vault Object payload.
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-4">API Architecture</p>
                  <div className="card-tactical rounded-md p-5 space-y-4">
                    {[
                      {
                        icon: Fingerprint,
                        label: "Plaid // Identity Layer",
                        color: "text-cyan-400",
                        detail: "Instant bank verification via Plaid Link. Users connect checking accounts for ACH debit. Persona integration handles lightweight KYC compliance for group escrow settings.",
                        endpoint: "POST /api/v1/identity/verify",
                      },
                      {
                        icon: Database,
                        label: "Ledger // Triple-Entry System",
                        color: "text-emerald-400",
                        detail: "Triple-entry accounting ensures 'Vault Balance' always equals sum of 'Member Pledges' in real-time. Every transaction logs: debit (member), credit (vault), and audit (system).",
                        endpoint: "GET /api/v1/vault/{id}/ledger",
                      },
                      {
                        icon: CreditCard,
                        label: "Stripe Issuing // Virtual Cards",
                        color: "text-orange-400",
                        detail: "Just-In-Time (JIT) funding via Stripe Issuing API. Virtual cards are generated dynamically with spending limits matching vault balance + buffer. Merchant Category Code (MCC) locks restrict usage to specified categories.",
                        endpoint: "POST /api/v1/vault/{id}/issue-card",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4 p-4 rounded-md glass-light">
                        <div className="mt-0.5 w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-white/5">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-mono font-bold ${item.color} mb-1`}>{item.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.detail}</p>
                          <code className="text-[10px] font-mono text-foreground/50 bg-white/5 px-2 py-1 rounded">{item.endpoint}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-1">Vault Object Payload</p>
                      <p className="text-[10px] font-mono text-muted-foreground">State just before virtual card issuance</p>
                    </div>
                    <button
                      data-testid="sv-copy-json"
                      onClick={copyJSON}
                      className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-md border border-violet-500/30 text-violet-400 transition-all hover-elevate active-elevate-2"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy JSON"}
                    </button>
                  </div>
                  <div className="card-tactical rounded-md p-5 overflow-x-auto border border-violet-500/10">
                    <pre className="text-[11px] font-mono text-foreground/80 leading-relaxed whitespace-pre">
                      <code>{vaultJSON.split('\n').map((line, i) => {
                        const keyMatch = line.match(/"(\w+)":/);
                        const stringMatch = line.match(/: "(.*?)"/);
                        const numberMatch = line.match(/: (\d+\.?\d*)/);

                        if (keyMatch) {
                          let colored = line.replace(`"${keyMatch[1]}"`, `<span class="text-cyan-400">"${keyMatch[1]}"</span>`);
                          if (stringMatch) {
                            colored = colored.replace(`"${stringMatch[1]}"`, `<span class="text-emerald-400">"${stringMatch[1]}"</span>`);
                          }
                          if (numberMatch) {
                            colored = colored.replace(numberMatch[1], `<span class="text-orange-400">${numberMatch[1]}</span>`);
                          }
                          return <span key={i} dangerouslySetInnerHTML={{ __html: colored + '\n' }} />;
                        }
                        return <span key={i}>{line}{'\n'}</span>;
                      })}</code>
                    </pre>
                  </div>
                </div>

                <div className="card-tactical rounded-md p-5 border border-violet-500/10">
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-3">How to Read This Payload</p>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    The system uses a <span className="text-violet-400 font-bold">Status-Based Trigger</span>. The virtual_card status stays in PENDING until every single member in the members array has their status set to PAID. Only then does the vault status flip to FUNDING_COMPLETED, which triggers the Stripe API to generate the one-time card. This "All-or-Nothing" logic is the core of the escrow security model.
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-4">Key PM Artifact</p>
                  <div className="card-tactical rounded-md p-5">
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      <span className="text-violet-400 font-bold">SquadVault</span>: Eliminating "Debt Lag" in Social FinTech. A smart-escrow platform featuring a functional logic simulator and Stripe Issuing API architecture. Managed end-to-end lifecycle from defining "Go/No-Go" funding logic to architecting edge-case handling for price fluctuations and member dropouts.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Stripe Issuing", "Plaid", "KYC/AML", "Triple-Entry Ledger", "Escrow", "Virtual Cards", "MCC Locking", "JIT Funding"].map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-violet-500/20 text-violet-400/80">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </section>

          <div className="pt-8 pb-10">
            <button
              data-testid="sv-close-bottom"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono transition-all duration-300 hover-elevate active-elevate-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LaunchpadDossier({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState<"thesis" | "curriculum" | "results">("thesis");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: "thesis" as const, label: "The Thesis", shortLabel: "Thesis", icon: Target, color: "text-orange-400", desc: "Philosophy & Vision" },
    { id: "curriculum" as const, label: "The Curriculum", shortLabel: "Curriculum", icon: BookOpen, color: "text-amber-400", desc: "10-Week Roadmap" },
    { id: "results" as const, label: "The Results", shortLabel: "Results", icon: Trophy, color: "text-emerald-400", desc: "Impact & Outcomes" },
  ];

  const scrollToMode = (id: string) => {
    const el = document.getElementById(`lp-section-${id}`);
    if (el && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const headerHeight = 120;
      const elTop = el.offsetTop - container.offsetTop - headerHeight;
      container.scrollTo({ top: elTop, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const headerOffset = 200;
      for (const m of [...modes].reverse()) {
        const el = document.getElementById(`lp-section-${m.id}`);
        if (el) {
          const top = el.offsetTop - container.offsetTop - headerOffset;
          if (container.scrollTop >= top) {
            setActiveMode(m.id);
            break;
          }
        }
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const curriculum = [
    { week: 1, title: "Problem Discovery", desc: "Identify real-world problems worth solving. Techniques for spotting inefficiencies, unmet needs, and market gaps.", icon: Compass, color: "text-orange-400", border: "border-orange-500/20" },
    { week: 2, title: "User Research & Target Segments", desc: "Define who has this problem. Map user personas, demographics, and behavioral patterns. Conduct initial user interviews.", icon: Users, color: "text-orange-400", border: "border-orange-500/20" },
    { week: 3, title: "Pain Points & Value Proposition", desc: "Deep-dive into user pain points. Craft a compelling value proposition that clearly articulates why your solution matters.", icon: Target, color: "text-amber-400", border: "border-amber-500/20" },
    { week: 4, title: "Solution Ideation & Validation", desc: "Brainstorm solution approaches. Validate assumptions through lightweight experiments, surveys, and landing page tests.", icon: Sparkles, color: "text-amber-400", border: "border-amber-500/20" },
    { week: 5, title: "MVP Tooling & Prototyping", desc: "Hands-on with modern build tools: Claude for AI-assisted development, Figma for design, Cursor for rapid coding.", icon: Wrench, color: "text-amber-400", border: "border-amber-500/20" },
    { week: 6, title: "Market Sizing (TAM/SAM/SOM)", desc: "Calculate Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market for your startup.", icon: BarChart3, color: "text-teal-400", border: "border-teal-500/20" },
    { week: 7, title: "Competitive Analysis & Positioning", desc: "Map the competitive landscape. Identify direct and indirect competitors. Define your unique differentiator and moat.", icon: Shield, color: "text-teal-400", border: "border-teal-500/20" },
    { week: 8, title: "Business Model & Go-to-Market", desc: "Design revenue models, pricing strategy, and distribution channels. Build a go-to-market plan that scales.", icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-500/20" },
    { week: 9, title: "Pitch Deck Construction", desc: "Build a compelling narrative. Structure your deck: problem, solution, market, traction, team, ask. Storytelling for investors.", icon: FileText, color: "text-emerald-400", border: "border-emerald-500/20" },
    { week: 10, title: "Demo Day Rehearsal & Final Pitch", desc: "Polish delivery, handle Q&A pressure, and present to real industry VC partners. Simulate an actual accelerator demo day.", icon: Rocket, color: "text-emerald-400", border: "border-emerald-500/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
      data-testid="launchpad-dossier"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 L60 30 M30 0 L30 60' stroke='%23fff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="h-full flex relative">
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-background/80 backdrop-blur-xl p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold">Blackskies Launchpad</h2>
              <p className="text-[10px] font-mono text-muted-foreground">Incubator Program</p>
            </div>
          </div>

          <div className="space-y-1">
            {modes.map((m) => {
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  data-testid={`lp-mode-${m.id}`}
                  onClick={() => scrollToMode(m.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-all duration-200 ${
                    isActive
                      ? `bg-white/5 ${m.color}`
                      : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  <m.icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-mono font-bold block">{m.label}</span>
                    <span className="text-[9px] font-mono opacity-60">{m.desc}</span>
                  </div>
                  {isActive && (
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="px-3 mb-3">
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Program Status</p>
              <p className="text-xs font-mono text-orange-400">Active // Cohort 2</p>
            </div>
            <button
              data-testid="lp-close-sidebar"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono text-muted-foreground transition-colors hover-elevate w-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portfolio
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-20 border-b border-white/5 bg-background/90 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 md:px-8 py-3">
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-display font-bold">Launchpad</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Viewing:</span>
                <span className={`text-sm font-mono font-bold ${modes.find(m => m.id === activeMode)?.color}`}>
                  {modes.find(m => m.id === activeMode)?.label}
                </span>
              </div>
              <button onClick={onClose} data-testid="lp-close-mobile" className="text-muted-foreground text-sm font-mono hover-elevate px-2 py-1 rounded-md">ESC</button>
            </div>

            <div className="md:hidden flex border-t border-white/5">
              {modes.map((m) => {
                const isActive = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    data-testid={`lp-tab-${m.id}`}
                    onClick={() => scrollToMode(m.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-center transition-all ${
                      isActive ? m.color : "text-muted-foreground"
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    <span className="text-[9px] font-mono">{m.shortLabel}</span>
                    {isActive && <div className="w-6 h-0.5 rounded-full bg-current" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-5 md:px-10 py-8 space-y-0">

            <section id="lp-section-thesis" data-testid="lp-mode-thesis-content">
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 pulse-dot" />
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.2em]">Program Philosophy</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-1">
                    Blackskies Launchpad: <span className="text-orange-400">Building Founders</span> to Build Better VCs
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono">
                    Head of Education // Blackskies Ventures at UC Berkeley
                  </p>
                </div>

                <div className="grid md:grid-cols-[1fr_200px] gap-6">
                  <div className="space-y-6">
                    <div className="card-tactical rounded-md p-5">
                      <h3 className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" />
                        The Core Insight
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        Startups and venture capital are inherently intertwined. To be truly good at one,
                        you need real experience in the other. Most VC clubs teach members how to <em>evaluate</em> startups,
                        but never how to <em>build</em> one. That gap produces analysts who can score pitch decks
                        but can't feel the pain of a founder pivoting at 2am.
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        When I became Head of Education, I saw an opportunity to fix this. Instead of
                        traditional case study reviews, I designed a program where every new member builds
                        their own startup from scratch, from problem discovery to a live Demo Day pitch
                        in front of real industry VCs.
                      </p>
                    </div>

                    <div className="card-tactical rounded-md p-5">
                      <h3 className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        The Problem
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Traditional VC education is passive: reading, analyzing, critiquing from the sidelines.
                        Members leave with strong analytical frameworks but zero founder empathy.
                        They can spot a TAM calculation error but can't explain what it feels like to talk to
                        50 users and realize your initial hypothesis was wrong.
                      </p>
                    </div>

                    <div className="card-tactical rounded-md p-5">
                      <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        The Solution
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        A 10-week startup incubator that takes new Ventures team recruits from
                        "I have no idea" to pitching a real startup with an MVP, market analysis,
                        and competitive positioning. It all leads to a Demo Day where they present
                        to actual VC partners from the industry.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Learn by Building", "Founder Empathy", "Real Stakes", "Industry Access"].map(tag => (
                          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-400/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="card-tactical rounded-md p-3">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Role</p>
                      <p className="text-sm font-mono text-orange-400 font-bold">Head of Education</p>
                    </div>
                    <div className="card-tactical rounded-md p-3">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-sm font-mono text-amber-400 font-bold">10 Weeks / Semester</p>
                    </div>
                    <div className="card-tactical rounded-md p-3">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Cohorts Run</p>
                      <p className="text-sm font-mono text-emerald-400 font-bold">2 Semesters</p>
                    </div>
                    <div className="card-tactical rounded-md p-3">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Founders per Cohort</p>
                      <p className="text-sm font-mono text-teal-400 font-bold">5-7 Members</p>
                    </div>
                    <div className="card-tactical rounded-md p-3 border border-orange-500/10">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Key Belief</p>
                      <p className="text-[11px] text-foreground/70 italic leading-relaxed">
                        "The best VCs have founder DNA. You can't evaluate what you've never lived."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="py-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">Mode 02</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            <section id="lp-section-curriculum" data-testid="lp-mode-curriculum-content">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em]">10-Week Roadmap</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                    The Curriculum
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    A structured path from "I have no idea" to pitching a funded startup.
                    Each week builds on the last, with hands-on deliverables due every session.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-[19px] top-8 bottom-4 w-px bg-gradient-to-b from-orange-500/40 via-amber-500/30 to-emerald-500/40 hidden md:block" />

                  <div className="space-y-4">
                    {curriculum.map((week, i) => (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="hidden md:flex flex-col items-center flex-shrink-0">
                          <div className={`w-10 h-10 rounded-md border ${week.border} bg-white/[0.02] flex items-center justify-center z-10 relative`}>
                            <week.icon className={`w-4 h-4 ${week.color}`} />
                          </div>
                        </div>

                        <div className="card-tactical rounded-md p-4 flex-1 group">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-[10px] font-mono ${week.color} uppercase tracking-wider font-bold`}>
                              Week {String(week.week).padStart(2, "0")}
                            </span>
                            <span className="text-foreground/90 text-sm font-display font-bold">{week.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{week.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="card-tactical rounded-md p-5 border border-amber-500/10">
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5" />
                    Build Stack
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                    Members use modern tools to prototype fast. No prior engineering experience required.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Claude AI", "Cursor IDE", "Figma", "React", "Vercel", "Notion"].map(tool => (
                      <span key={tool} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-400/90 bg-amber-500/5">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="py-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Mode 03</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            </div>

            <section id="lp-section-results" data-testid="lp-mode-results-content">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">Impact & Outcomes</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                    The Results
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    What happens when you give ambitious students real stakes and a real stage.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Founders Trained", value: "12+", sub: "Across 2 cohorts", color: "text-orange-400" },
                    { label: "Startups Pitched", value: "12+", sub: "At Demo Day", color: "text-amber-400" },
                    { label: "VC Partners", value: "5", sub: "Industry judges", color: "text-teal-400" },
                    { label: "YC Acceptances", value: "1", sub: "And counting", color: "text-emerald-400" },
                  ].map(stat => (
                    <div key={stat.label} className="card-tactical rounded-md p-4 text-center">
                      <p className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</p>
                      <p className="text-xs font-mono text-foreground/80">{stat.label}</p>
                      <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5" />
                    Standout Outcomes
                  </h3>
                  <div className="space-y-4">
                    <div className="card-tactical rounded-md p-5 border border-emerald-500/10">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-display font-bold">Luel // Y Combinator</h4>
                            <p className="text-[11px] font-mono text-muted-foreground">Inigo Lenderking / Data Warehousing</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex-shrink-0">
                          YC ACCEPTED
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Went through the Launchpad curriculum and developed Luel, a data warehousing startup.
                        Applied to Y Combinator, got accepted, and dropped out of school to pursue it full-time.
                        The ultimate validation of the program's "learn by building" thesis.
                      </p>
                    </div>

                    <div className="card-tactical rounded-md p-5 border border-amber-500/10">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-display font-bold">PartyPulse</h4>
                            <p className="text-[11px] font-mono text-muted-foreground">Nightlife & Events Optimization</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 flex-shrink-0">
                          VC INTEREST
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Built an app that optimizes the fraternity, clubbing, and bar scene, essentially a better DoorList
                        with features that benefit both customers and venue owners. Impressed the VC partners at Demo Day
                        so much that multiple partners approached him afterward. Currently exploring funding and further expansion.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    Demo Day
                  </h3>
                  <div className="space-y-4" data-testid="lp-demo-day-photos">
                    {[
                      { src: lpCohortImg, caption: "Cohort 1 founders: ready for Demo Day", alt: "Startup cohort founders" },
                      { src: lpTeamImg, caption: "The full Blackskies Ventures team: founders and instructors", alt: "Entire Blackskies team" },
                      { src: lpPitchImg, caption: "A founder pitching Planova to industry VC partners at Demo Day", alt: "Founder pitching at Demo Day" },
                    ].map((photo, i) => (
                      <div key={i} className="card-tactical rounded-md overflow-hidden border border-white/5" data-testid={`lp-photo-${i}`}>
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-48 md:h-72 object-cover"
                        />
                        <p className="px-4 py-3 text-xs text-muted-foreground font-mono leading-relaxed">{photo.caption}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    At the end of each semester, all 5-7 Ventures team recruits pitch their startups to a panel
                    of industry VC partners. The format simulates a real accelerator demo day: timed pitches,
                    live Q&A, and post-pitch networking with the partners.
                  </p>
                </div>

                <div className="card-tactical rounded-md p-5 border border-emerald-500/10">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Why This Matters
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    This program isn't just about teaching entrepreneurship, it's about building a new kind of VC.
                    Members who go through Launchpad come out with founder empathy, product instinct, and the confidence
                    to back early-stage teams because they've been in the trenches themselves. They don't just evaluate
                    pitch decks anymore; they feel the weight of every pivot, every failed user interview, every late-night
                    iteration. That's the edge.
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-8 pb-10">
              <button
                data-testid="lp-close-bottom"
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-mono transition-all duration-300 hover-elevate active-elevate-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PRDModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="prd-modal"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="card-tactical rounded-md w-full max-w-3xl max-h-[80vh] overflow-auto relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold">Blackskies Education Platform</h3>
              <p className="text-[10px] font-mono text-muted-foreground">Product Requirements Document</p>
            </div>
          </div>
          <button
            data-testid="prd-close"
            onClick={onClose}
            className="text-muted-foreground p-1.5 rounded-md transition-colors text-sm font-mono hover-elevate"
          >
            ESC
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Problem Statement</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              UC Berkeley students interested in venture capital lack structured, hands-on educational pathways.
              Existing programs are theoretical and don't prepare students for real-world VC operations.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Solution</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              A 10-week hands-on learning program combining structured curriculum with live deal flow analysis,
              ending in real investment committee presentations and sourcing partnerships.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-teal-400 uppercase tracking-wider mb-3">Key Metrics</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "NPS Score", value: "72", color: "text-emerald-400" },
                { label: "Avg Attendance", value: "95%", color: "text-teal-400" },
                { label: "Placements", value: "12/12", color: "text-cyan-400" },
              ].map((m) => (
                <div key={m.label} className="glass-light rounded-md p-3 text-center">
                  <p className={`text-2xl font-display font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-2">The Pivot (Week 4)</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Assignment completion dipped in Week 3-4. Conducted feedback sessions and restructured the curriculum
              to add more hands-on deal flow exercises. Completion rates recovered to 96%+ by Week 5.
              Same process you'd use building any real product.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">Product Roadmap</h4>
            <div className="space-y-2">
              {[
                { phase: "Phase 1", title: "MVP Launch", status: "Complete", color: "text-emerald-400" },
                { phase: "Phase 2", title: "Scale & Iterate", status: "Active", color: "text-teal-400" },
                { phase: "Phase 3", title: "Cross-Campus", status: "Planned", color: "text-cyan-400/50" },
              ].map((phase) => (
                <div key={phase.phase} className="glass-light rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground">{phase.phase}</span>
                    <span className="text-sm font-display font-semibold">{phase.title}</span>
                  </div>
                  <span className={`text-[11px] font-mono ${phase.color}`}>{phase.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
