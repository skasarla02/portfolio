import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, FileText, Database, Shield, Zap, AlertTriangle, Lock,
  Target, ArrowLeft, X, Copy, Check, BarChart3, Users,
  Fingerprint, TrendingUp, Gauge, ChevronRight
} from "lucide-react";

const MODES = [
  { id: "mesh", label: "The Mesh", icon: Radio, color: "text-cyan-400", testId: "bc-mode-mesh", tabTestId: "bc-tab-mesh", sectionId: "bc-section-mesh" },
  { id: "strategy", label: "The Strategy", icon: FileText, color: "text-orange-400", testId: "bc-mode-strategy", tabTestId: "bc-tab-strategy", sectionId: "bc-section-strategy" },
  { id: "spec", label: "The Spec", icon: Database, color: "text-emerald-400", testId: "bc-mode-spec", tabTestId: "bc-tab-spec", sectionId: "bc-section-spec" },
  { id: "resilience", label: "The Resilience", icon: Shield, color: "text-violet-400", testId: "bc-mode-resilience", tabTestId: "bc-tab-resilience", sectionId: "bc-section-resilience" },
];

const MESH_NODES = [
  { x: 10, y: 30 }, { x: 20, y: 60 }, { x: 15, y: 85 },
  { x: 30, y: 15 }, { x: 35, y: 45 }, { x: 40, y: 75 },
  { x: 50, y: 25 }, { x: 55, y: 55 }, { x: 48, y: 85 },
  { x: 65, y: 15 }, { x: 70, y: 45 }, { x: 68, y: 75 },
  { x: 80, y: 30 }, { x: 85, y: 60 }, { x: 90, y: 85 },
];

const MESH_EDGES: [number, number][] = [
  [0, 1], [0, 3], [0, 4], [1, 2], [1, 4], [1, 5],
  [2, 5], [3, 4], [3, 6], [4, 5], [4, 7], [5, 7],
  [5, 8], [6, 7], [6, 9], [6, 10], [7, 8], [7, 10],
  [7, 11], [8, 11], [8, 14], [9, 10], [9, 12], [10, 11],
  [10, 12], [10, 13], [11, 13], [11, 14], [12, 13], [13, 14],
];

function getNeighbors(nodeIdx: number): number[] {
  const neighbors: number[] = [];
  for (const [a, b] of MESH_EDGES) {
    if (a === nodeIdx) neighbors.push(b);
    if (b === nodeIdx) neighbors.push(a);
  }
  return neighbors;
}

const PAYLOAD_BLOCKS = [
  { start: 0, end: 1, label: "Header", bytes: 2, color: "bg-slate-500/30 border-slate-500/40 text-slate-300" },
  { start: 2, end: 5, label: "Device ID", bytes: 4, color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" },
  { start: 6, end: 9, label: "Lat Offset", bytes: 4, color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
  { start: 10, end: 13, label: "Lon Offset", bytes: 4, color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
  { start: 14, end: 15, label: "TTL + Flags", bytes: 2, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { start: 16, end: 23, label: "Auth Signature", bytes: 8, color: "bg-violet-500/20 border-violet-500/30 text-violet-400" },
  { start: 24, end: 30, label: "Payload Data", bytes: 7, color: "bg-teal-500/20 border-teal-500/30 text-teal-400" },
];

const COMPACT_PAYLOAD = `{
  "id": "0xA3F1",
  "lat": 2847,
  "lon": -1293,
  "ttl": 4,
  "flg": "0b1010",
  "sig": "7f3c...a91b",
  "msg": "RV@STG3"
}`;

const SCENARIOS = [
  {
    id: "battery",
    title: "Battery Critical",
    subtitle: "Node drops below 20%",
    icon: Zap,
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    testId: "bc-scenario-battery",
    steps: [
      { label: "Detect", desc: "Battery monitor triggers LOW_POWER event at 20%", status: "alert" },
      { label: "Mode Switch", desc: "Node transitions from RELAY to LISTEN_ONLY mode", status: "warning" },
      { label: "Preserve", desc: "Stops broadcasting, continues receiving squad messages", status: "info" },
      { label: "Recovery", desc: "Resumes relay when battery exceeds 30% threshold", status: "success" },
    ],
  },
  {
    id: "collision",
    title: "Packet Collision",
    subtitle: "High-density signal interference",
    icon: AlertTriangle,
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    testId: "bc-scenario-collision",
    steps: [
      { label: "Detect", desc: "Multiple nodes broadcast simultaneously in dense zone", status: "alert" },
      { label: "Backoff", desc: "Exponential Backoff timer: wait random(50-200ms)", status: "warning" },
      { label: "Retry", desc: "Re-broadcast with collision counter incremented", status: "info" },
      { label: "Resolve", desc: "Successful delivery confirmed via ACK packet", status: "success" },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Shield",
    subtitle: "Stranger intercepts relay packet",
    icon: Lock,
    color: "text-violet-400",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    testId: "bc-scenario-privacy",
    steps: [
      { label: "Intercept", desc: "Unknown node receives encrypted relay packet", status: "alert" },
      { label: "Decrypt Attempt", desc: "AES-128 decryption fails, no squad key", status: "warning" },
      { label: "Forward", desc: "Packet relayed onward, contents remain encrypted", status: "info" },
      { label: "Deliver", desc: "Intended recipient decrypts with OOB-exchanged key", status: "success" },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  alert: "text-red-400 bg-red-500/10 border-red-500/20",
  warning: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  info: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function GradientDivider({ label, color }: { label: string; color: string }) {
  const viaColor = color === "text-orange-400" ? "via-orange-500/20"
    : color === "text-emerald-400" ? "via-emerald-500/20"
    : color === "text-violet-400" ? "via-violet-500/20"
    : "via-cyan-500/20";
  const textColor = color === "text-orange-400" ? "text-orange-400/40"
    : color === "text-emerald-400" ? "text-emerald-400/40"
    : color === "text-violet-400" ? "text-violet-400/40"
    : "text-cyan-400/40";

  return (
    <div className="relative py-16">
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full h-px bg-gradient-to-r from-transparent ${viaColor} to-transparent`} />
      </div>
      <div className="relative flex justify-center">
        <span className={`bg-background px-4 text-[10px] font-mono ${textColor} uppercase tracking-[0.3em]`}>
          {label}
        </span>
      </div>
    </div>
  );
}

interface FloodState {
  sourceId: number;
  activeNodes: Set<number>;
  ttlMap: Map<number, number>;
  step: number;
  done: boolean;
  nodesReached: number;
}

export default function BeaconDossier({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState("mesh");
  const [floodState, setFloodState] = useState<FloodState | null>(null);
  const [showFloodStats, setShowFloodStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const floodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      const viewportHeight = container.clientHeight;
      let closest = "mesh";
      let closestDistance = Infinity;
      for (const mode of MODES) {
        const el = sectionRefs.current[mode.sectionId];
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          const distance = Math.abs(relativeTop - viewportHeight * 0.3);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = mode.id;
          }
        }
      }
      setActiveMode(closest);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const sectionId = `bc-section-${id}`;
    const el = sectionRefs.current[sectionId];
    if (el && contentRef.current) {
      const containerRect = contentRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollTop = contentRef.current.scrollTop + elRect.top - containerRect.top - 40;
      contentRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  useEffect(() => {
    return () => {
      if (floodTimerRef.current) clearTimeout(floodTimerRef.current);
    };
  }, []);

  const startFlood = useCallback((nodeIdx: number) => {
    if (floodTimerRef.current) clearTimeout(floodTimerRef.current);
    setShowFloodStats(false);

    const initialActive = new Set([nodeIdx]);
    const initialTtl = new Map<number, number>([[nodeIdx, 4]]);
    setFloodState({ sourceId: nodeIdx, activeNodes: initialActive, ttlMap: initialTtl, step: 0, done: false, nodesReached: 1 });

    let currentActive = new Set([nodeIdx]);
    let currentTtl = new Map<number, number>([[nodeIdx, 4]]);
    let step = 0;

    const propagate = () => {
      const nextActive = new Set(currentActive);
      const nextTtl = new Map(currentTtl);
      let newNodes = false;

      for (const activeNode of Array.from(currentActive)) {
        const ttl = currentTtl.get(activeNode) ?? 0;
        if (ttl <= 1) continue;
        const neighbors = getNeighbors(activeNode);
        for (const neighbor of neighbors) {
          if (!nextTtl.has(neighbor)) {
            nextActive.add(neighbor);
            nextTtl.set(neighbor, ttl - 1);
            newNodes = true;
          }
        }
      }

      step++;
      currentActive = nextActive;
      currentTtl = nextTtl;

      setFloodState({
        sourceId: nodeIdx,
        activeNodes: new Set(nextActive),
        ttlMap: new Map(nextTtl),
        step,
        done: !newNodes,
        nodesReached: nextActive.size,
      });

      if (newNodes) {
        floodTimerRef.current = setTimeout(propagate, 300);
      } else {
        setShowFloodStats(true);
        floodTimerRef.current = setTimeout(() => {
          setFloodState(null);
          setShowFloodStats(false);
        }, 3000);
      }
    };

    floodTimerRef.current = setTimeout(propagate, 300);
  }, []);

  useEffect(() => {
    if (activeScenario) {
      setVisibleSteps(0);
      const scenario = SCENARIOS.find(s => s.id === activeScenario);
      if (!scenario) return;
      const timers: ReturnType<typeof setTimeout>[] = [];
      scenario.steps.forEach((_, i) => {
        timers.push(setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 400));
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [activeScenario]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(COMPACT_PAYLOAD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <motion.div
      data-testid="beacon-dossier"
      className="fixed inset-0 z-[100] bg-background flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <Radio className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Beacon</h2>
              <p className="text-[11px] font-mono text-muted-foreground">BLE Mesh Protocol</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {MODES.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                data-testid={mode.testId}
                onClick={() => scrollToSection(mode.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-left relative ${
                  isActive ? `${mode.color}` : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bc-mode-indicator"
                    className="absolute inset-0 rounded-md bg-white/5 border border-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <mode.icon className="w-4 h-4 relative z-10 shrink-0" />
                <span className="text-sm font-mono relative z-10">{mode.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="glass-light rounded-md p-3">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">Concept / Research</p>
          </div>
          <button
            data-testid="bc-close-sidebar"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-sm font-mono text-muted-foreground transition-colors hover-elevate active-elevate-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-display font-bold">Beacon</span>
            </div>
            <button
              data-testid="bc-close-mobile"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-1 px-3 pb-2 overflow-x-auto scrollbar-hide">
            {MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  data-testid={mode.tabTestId}
                  onClick={() => scrollToSection(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? `${mode.color} bg-white/5 border border-white/10`
                      : "text-muted-foreground"
                  }`}
                >
                  <mode.icon className="w-3 h-3" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
          <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">

            <section ref={setRef("bc-section-mesh")} id="bc-section-mesh" data-testid="bc-section-mesh">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em]">Mode 01 // The Mesh</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                BEACON: Decentralized BLE Mesh for Off-Grid Communication
              </h2>
              <p className="text-sm font-mono text-muted-foreground mb-6">Lead Product Engineer // Systems Architecture</p>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-8 border border-cyan-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Origin Story</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  At massive festivals like Coachella, Beyond Wonderland, and Tomorrowland, cellular networks collapse under high density.
                  You lose your squad, and safety becomes a real issue. "Find My" doesn't update, texts don't send,
                  and suddenly you're alone in a crowd of 50,000 people.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  I noticed that at raves and festivals, safety often breaks down simply because communication fails.
                  I designed Beacon as a technical side quest to explore whether BLE mesh networking could solve this.
                  balancing the reality of Bluetooth throughput limits against the need for real-time location sharing.
                </p>
              </div>

              <div className="card-tactical rounded-md p-4 md:p-6 mb-6">
                <svg viewBox="0 0 800 500" className="w-full h-auto">
                  <defs>
                    <filter id="bc-glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="bc-glow-active">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {MESH_EDGES.map(([a, b], i) => {
                    const na = MESH_NODES[a];
                    const nb = MESH_NODES[b];
                    const bothActive = floodState?.activeNodes.has(a) && floodState?.activeNodes.has(b);
                    return (
                      <line
                        key={`edge-${i}`}
                        x1={na.x * 8}
                        y1={na.y * 5}
                        x2={nb.x * 8}
                        y2={nb.y * 5}
                        stroke={bothActive ? "rgba(34,211,238,0.4)" : "rgba(34,211,238,0.1)"}
                        strokeWidth={bothActive ? 2 : 1}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {MESH_NODES.map((node, i) => {
                    const isActive = floodState?.activeNodes.has(i);
                    const isSource = floodState?.sourceId === i;
                    const ttl = floodState?.ttlMap.get(i);
                    const cx = node.x * 8;
                    const cy = node.y * 5;
                    return (
                      <g key={`node-${i}`} data-testid={`bc-node-${i}`}>
                        {isSource && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={30}
                            fill="none"
                            stroke="rgba(34,211,238,0.3)"
                            strokeWidth={1.5}
                            className="animate-ping"
                          />
                        )}
                        {isActive && !isSource && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={20}
                            fill="none"
                            stroke="rgba(34,211,238,0.2)"
                            strokeWidth={1}
                            className="animate-pulse"
                          />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={12}
                          fill={isActive ? "rgba(34,211,238,0.6)" : "rgba(34,211,238,0.15)"}
                          stroke={isActive ? "rgba(34,211,238,0.8)" : "rgba(34,211,238,0.3)"}
                          strokeWidth={isActive ? 2 : 1}
                          filter={isActive ? "url(#bc-glow-active)" : "url(#bc-glow)"}
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => startFlood(i)}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill={isActive ? "rgba(34,211,238,1)" : "rgba(34,211,238,0.5)"}
                        />
                        {isActive && ttl !== undefined && (
                          <>
                            <rect
                              x={cx + 14}
                              y={cy - 18}
                              width={24}
                              height={18}
                              rx={4}
                              fill="rgba(0,0,0,0.7)"
                              stroke="rgba(34,211,238,0.4)"
                              strokeWidth={1}
                            />
                            <text
                              x={cx + 26}
                              y={cy - 6}
                              textAnchor="middle"
                              fill="#22d3ee"
                              fontSize={10}
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {ttl}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
                <p className="text-center text-xs font-mono text-muted-foreground mt-3">
                  Click any node to simulate a Managed Flood
                </p>
              </div>

              <AnimatePresence>
                {showFloodStats && floodState && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-3 gap-3 mb-8"
                  >
                    {[
                      { label: "Nodes Reached", value: `${floodState.nodesReached}/${MESH_NODES.length}`, icon: Users, color: "text-cyan-400" },
                      { label: "Avg Latency", value: `${floodState.step * 300}ms`, icon: Gauge, color: "text-orange-400" },
                      { label: "TTL Hops", value: `${floodState.step}`, icon: TrendingUp, color: "text-emerald-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="glass-light rounded-md p-3 text-center">
                        <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                        <p className={`text-lg font-display font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <GradientDivider label="Mode 02 // The Strategy" color="text-orange-400" />

            <section ref={setRef("bc-section-strategy")} id="bc-section-strategy" data-testid="bc-section-strategy">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-400 pulse-dot" />
                <span className="text-xs font-mono text-orange-400 uppercase tracking-[0.2em]">Mode 02 // The Strategy</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Product Strategy</h2>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-lg font-display font-bold text-red-400">Cellular Black Holes</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  At festivals with 50k+ people, cellular networks experience 100% packet loss. Standard 5G/LTE towers
                  simply cannot handle the density of simultaneous connections in a concentrated area.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Network Degradation</span>
                    <span className="text-red-400">100% Packet Loss</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "100%",
                        background: "linear-gradient(to right, #22c55e 0%, #eab308 30%, #f97316 60%, #ef4444 85%, #dc2626 100%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>0 users</span>
                    <span>10k</span>
                    <span>25k</span>
                    <span>50k+</span>
                  </div>
                </div>
              </div>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-lg font-display font-bold text-cyan-400">Solution: BLE Mesh</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  Peer-to-peer mesh using BLE Advertising Bearer to bypass cell towers entirely.
                  Each phone becomes a relay node, creating a decentralized communication network
                  that scales with user density instead of degrading.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Radio, label: "BLE 5.0", desc: "Advertising Bearer", color: "text-cyan-400" },
                    { icon: Users, label: "Mesh Relay", desc: "Peer-to-Peer", color: "text-teal-400" },
                    { icon: Fingerprint, label: "AES-128", desc: "End-to-End Encrypted", color: "text-violet-400" },
                  ].map((item) => (
                    <div key={item.label} className="glass-light rounded-md p-3 text-center">
                      <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1.5`} />
                      <p className="text-xs font-display font-semibold">{item.label}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-orange-400" />
                  <h3 className="text-lg font-display font-bold text-orange-400">Target Persona: The Lost Explorer</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  Needs squad coordination when the internet is dead. The festival-goer who has been
                  separated from their group, phone at 30% battery, zero cell signal.
                </p>
                <div className="space-y-2">
                  {[
                    "Can't text or call friends in a 50k+ crowd",
                    "No data connection for location sharing apps",
                    "Battery draining fast from constant signal searching",
                    "No way to set a rendezvous point with the squad",
                  ].map((pain) => (
                    <div key={pain} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-orange-400 mt-1 shrink-0" />
                      <p className="text-xs font-mono text-muted-foreground">{pain}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-lg font-display font-bold">Success Metrics</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "PDR", value: "95%", desc: "Packet Delivery Ratio in 10-node radius", color: "text-cyan-400" },
                    { label: "Latency", value: "<500ms", desc: "Per hop transmission time", color: "text-orange-400" },
                    { label: "Mesh Stability", value: "99.2%", desc: "Predicted uptime during peak density", color: "text-emerald-400" },
                  ].map((metric) => (
                    <div key={metric.label} className="card-tactical rounded-md p-4 text-center">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                      <p className={`text-2xl font-display font-bold ${metric.color}`}>{metric.value}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">{metric.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-tactical rounded-md p-5 md:p-6 border border-orange-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-orange-400" />
                  <h3 className="text-lg font-display font-bold">Why This Approach?</h3>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      q: "Why BLE Mesh instead of satellite phones or walkie talkies?",
                      a: "It requires zero infrastructure. No towers, no satellite clear-sky requirements. And it scales better as the crowd gets denser; the more people running the app, the stronger the mesh becomes. Walkie talkies don't scale, and satellite phones need line-of-sight to the sky.",
                      color: "text-cyan-400",
                      border: "border-cyan-500/20",
                    },
                    {
                      q: "What about privacy? Can strangers see my location?",
                      a: "No. We use Out-of-Band (OOB) provisioning. Before the show, you swap a QR code with your friends at the Basecamp. That QR contains the encryption key. Strangers can relay the encrypted packet, but they can't see what's inside.",
                      color: "text-violet-400",
                      border: "border-violet-500/20",
                    },
                    {
                      q: "How do you actually measure success here?",
                      a: "Our North Star is PDR (Packet Delivery Ratio). In a 100m\u00B2 area with 10 active nodes, we target a 95% delivery rate within 500ms. If your ping reaches your squad 19 out of 20 times in under half a second, the system works.",
                      color: "text-emerald-400",
                      border: "border-emerald-500/20",
                    },
                  ].map((item) => (
                    <div key={item.q} className={`glass-light rounded-md p-4 border-l-2 ${item.border}`}>
                      <p className={`text-xs font-mono ${item.color} uppercase tracking-wider mb-2`}>{item.q}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <GradientDivider label="Mode 03 // The Spec" color="text-emerald-400" />

            <section ref={setRef("bc-section-spec")} id="bc-section-spec" data-testid="bc-section-spec">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-[0.2em]">Mode 03 // The Spec</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">31-Byte Data Specification</h2>
              <p className="text-sm text-muted-foreground mb-8">BLE Advertisement Packet Structure</p>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <h3 className="text-sm font-display font-semibold mb-4">Payload Memory Layout</h3>
                <div className="flex flex-wrap gap-1.5">
                  {PAYLOAD_BLOCKS.map((block) => (
                    <div
                      key={block.label}
                      className={`rounded-md border px-3 py-2 ${block.color}`}
                      style={{ flex: `${block.bytes} 0 0` }}
                    >
                      <p className="text-[10px] font-mono opacity-60">{block.start}-{block.end}</p>
                      <p className="text-xs font-mono font-semibold">{block.label}</p>
                      <p className="text-[10px] font-mono opacity-60">{block.bytes}B</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end mt-3">
                  <span className="text-[10px] font-mono text-muted-foreground">Total: 31 bytes</span>
                </div>
              </div>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-display font-semibold">Compressed JSON Payload</h3>
                  <button
                    data-testid="bc-copy-payload"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground transition-colors hover-elevate"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="bg-black/30 rounded-md p-4 overflow-x-auto">
                  <code className="text-xs font-mono">
                    <span className="text-muted-foreground">{"{"}</span>{"\n"}
                    {"  "}<span className="text-cyan-400">"id"</span>: <span className="text-orange-400">"0xA3F1"</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"lat"</span>: <span className="text-emerald-400">2847</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"lon"</span>: <span className="text-emerald-400">-1293</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"ttl"</span>: <span className="text-emerald-400">4</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"flg"</span>: <span className="text-orange-400">"0b1010"</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"sig"</span>: <span className="text-violet-400">"7f3c...a91b"</span>,{"\n"}
                    {"  "}<span className="text-cyan-400">"msg"</span>: <span className="text-teal-400">"RV@STG3"</span>{"\n"}
                    <span className="text-muted-foreground">{"}"}</span>
                  </code>
                </pre>
              </div>

              <div className="card-tactical rounded-md p-5 md:p-6 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-display font-semibold">Technical Note: Bit-Packing</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Optimized for standard BLE Advertisement packets (31-byte limit). Uses Bit-Packing and
                  Coordinate Offsetting: instead of sending 37.8715, we send the distance from a
                  "Basecamp" coordinate. This fits ID, Lat/Lon, and Auth-Sig into a single packet.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-display font-semibold mb-4">Key Design Decisions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      title: "Managed Flooding vs Routing",
                      desc: "In a moving crowd, routing tables break every 5 seconds. Flooding is resilient.",
                      color: "text-cyan-400",
                    },
                    {
                      title: "Integer Enums",
                      desc: "Standard JSON is too verbose. Integer enums compress message types to single bytes.",
                      color: "text-orange-400",
                    },
                    {
                      title: "Coordinate Offsets",
                      desc: "Relative positioning from a Basecamp coordinate reduces GPS data from 8 bytes to 4.",
                      color: "text-emerald-400",
                    },
                  ].map((decision) => (
                    <div key={decision.title} className="card-tactical rounded-md p-4">
                      <h4 className={`text-xs font-display font-semibold ${decision.color} mb-2`}>{decision.title}</h4>
                      <p className="text-xs font-mono text-muted-foreground leading-relaxed">{decision.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <GradientDivider label="Mode 04 // The Resilience" color="text-violet-400" />

            <section ref={setRef("bc-section-resilience")} id="bc-section-resilience" data-testid="bc-section-resilience">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-violet-400 pulse-dot" />
                <span className="text-xs font-mono text-violet-400 uppercase tracking-[0.2em]">Mode 04 // The Resilience</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Edge Case Simulator</h2>
              <p className="text-sm text-muted-foreground mb-8">Click a scenario to see the system's response</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {SCENARIOS.map((scenario) => {
                  const isActive = activeScenario === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      data-testid={scenario.testId}
                      onClick={() => setActiveScenario(isActive ? null : scenario.id)}
                      className={`card-tactical rounded-md p-4 text-left transition-all duration-200 ${
                        isActive ? `${scenario.borderColor} border ${scenario.bgColor}` : ""
                      }`}
                    >
                      <scenario.icon className={`w-5 h-5 ${scenario.color} mb-2`} />
                      <h4 className="text-sm font-display font-semibold mb-1">{scenario.title}</h4>
                      <p className="text-[11px] font-mono text-muted-foreground">{scenario.subtitle}</p>
                    </button>
                  );
                })}
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
                    <div className="card-tactical rounded-md p-5 md:p-6 space-y-3">
                      {SCENARIOS.find(s => s.id === activeScenario)?.steps.map((step, i) => (
                        <motion.div
                          key={`${activeScenario}-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={i < visibleSteps ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-start gap-3 p-3 rounded-md border ${STATUS_COLORS[step.status]}`}
                        >
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-xs font-mono font-semibold">{step.label}</span>
                          </div>
                          <p className="text-xs font-mono opacity-80">{step.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <div className="relative py-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>

            <div className="card-tactical rounded-md p-5 md:p-6 border border-cyan-500/10 mb-4" data-testid="bc-reflection">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Reflection</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                Beacon started as a side quest born from too many nights losing my squad at festivals.
                But it taught me something I didn't expect: how to manage hardware constraints as a product thinker.
                When your entire protocol has to fit in 31 bytes, every design decision is a tradeoff, and
                that kind of constraint-driven thinking is exactly what I want to bring to a technical PM role.
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                This project forced me to sit at the intersection of systems architecture, user empathy, and
                real-world physics. It's the kind of problem where you can't just ship fast and iterate.
                you have to get the fundamentals right first.
              </p>
            </div>

            <div className="py-10 flex justify-center">
              <button
                data-testid="bc-close-bottom"
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-white/5 border border-white/10 text-sm font-mono text-muted-foreground transition-colors hover-elevate active-elevate-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
