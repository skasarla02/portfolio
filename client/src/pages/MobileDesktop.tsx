import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Briefcase, BarChart3, User, Trash2, ArrowLeft, Music, Gamepad2, Trophy, Heart, Swords, UtensilsCrossed, Zap, MapPin, GraduationCap, Mail, Linkedin, SkipForward, Music2 } from "lucide-react";
import { BlackskiesWindow } from "@/components/windows/BlackskiesWindow";
import { ResumeWindow } from "@/components/windows/ResumeWindow";
import { FintechWindow } from "@/components/windows/FintechWindow";
import { GalleryWindow } from "@/components/windows/GalleryWindow";

type AppId = "resume" | "blackskies" | "fintech" | "gallery" | "trash" | null;

const apps = [
  { id: "resume" as const, label: "Resume", subtitle: "Experience & Education", icon: FileText, gradient: "from-emerald-500 to-teal-600" },
  { id: "blackskies" as const, label: "Blackskies", subtitle: "EdTech Case Study", icon: Briefcase, gradient: "from-violet-500 to-purple-700" },
  { id: "fintech" as const, label: "Case Study", subtitle: "Product Space Fitness", icon: BarChart3, gradient: "from-amber-500 to-orange-600" },
  { id: "gallery" as const, label: "About Me", subtitle: "Photos & Life", icon: User, gradient: "from-cyan-500 to-blue-600" },
  { id: "trash" as const, label: "Bad Ideas", subtitle: "8 terrible ideas", icon: Trash2, gradient: "from-red-500 to-rose-700" },
];

const badIdeas = [
  "A social media platform exclusively for goldendoodles",
  "Uber but for carrying people piggyback",
  "An NFT marketplace for homework assignments",
  "Tinder but for matching with your Uber driver",
  "A subscription service for motivational screaming",
  "LinkedIn but every post must be a haiku",
];

const STATUS_MESSAGES = [
  "Currently craving: birria tacos",
  "Next show: Knock2 @ the Shrine",
  "Walking the dog in 2 hours",
  "Debating: In-N-Out vs Shake Shack",
  "Brewing pour-over #3 of the day",
];

const tracks = [
  { artist: "Knock2", track: "dashstar*", color: "from-violet-500 to-purple-600" },
  { artist: "Playboi Carti", track: "Magnolia", color: "from-red-500 to-rose-600" },
  { artist: "Fred again..", track: "Rumble", color: "from-cyan-500 to-blue-600" },
  { artist: "Skrillex", track: "Mumbai Power", color: "from-fuchsia-500 to-pink-600" },
];

export default function MobileDesktop() {
  const [activeApp, setActiveApp] = useState<AppId>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const track = tracks[currentTrack];

  return (
    <div className="min-h-screen desktop-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.08),transparent_50%)]" />

      <AnimatePresence mode="wait">
        {activeApp === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10 p-5 pt-10 pb-24"
          >
            <div className="glass rounded-md p-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                  <span className="text-xl font-display font-bold text-white">SK</span>
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold">Sidharth Kasarla</h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <GraduationCap className="w-3 h-3 text-violet-400" />
                    <p className="text-[11px] font-mono text-violet-400">UC Berkeley '28</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[11px] font-mono text-muted-foreground">East Brunswick, NJ</p>
                  </div>
                </div>
              </div>

              <motion.div
                key={statusIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 px-3 py-2 rounded-md bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/10"
              >
                <p className="text-[11px] font-mono text-violet-300/80 truncate">
                  {STATUS_MESSAGES[statusIndex]}
                </p>
              </motion.div>

              <div className="flex items-center gap-2 mt-3">
                <a
                  href="mailto:skasarla@berkeley.edu"
                  className="flex-1 glass-light rounded-md px-2.5 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-foreground/70"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/sidharth-kasarla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 glass-light rounded-md px-2.5 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-foreground/70"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {apps.map((app, i) => (
                <motion.button
                  key={app.id}
                  data-testid={`mobile-app-${app.id}`}
                  onClick={() => setActiveApp(app.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="w-full glass rounded-md p-4 flex items-center gap-4 text-left"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-md bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
                    <app.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-display font-semibold text-foreground/90">{app.label}</p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{app.subtitle}</p>
                  </div>
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                </motion.button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="glass rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${track.color} flex items-center justify-center`}>
                      <Music className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-display font-semibold text-foreground/80">Now Playing</span>
                  </div>
                  <button
                    onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
                    className="p-1.5 rounded-md hover:bg-white/5"
                  >
                    <SkipForward className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm font-display font-semibold">{track.track}</p>
                <p className="text-[11px] font-mono text-muted-foreground">{track.artist}</p>
                <div className="flex items-end gap-[2px] h-5 mt-3">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar w-[3px] rounded-full"
                      style={{
                        height: "100%",
                        animationDelay: `${i * 0.07}s`,
                        animationDuration: `${0.8 + Math.random() * 0.8}s`,
                        background: "linear-gradient(to top, hsl(250, 80%, 65%), hsl(310, 70%, 60%))",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="glass rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Gamepad2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-display font-semibold text-foreground/80">Side Quests</span>
                </div>

                <div className="space-y-2.5">
                  <div className="glass-light rounded-md p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-mono">Clash Royale - PEKKA/E-Barbs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-mono text-amber-400">Champion</span>
                    </div>
                  </div>

                  <div className="glass-light rounded-md p-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-[11px] font-mono font-semibold">The Dog</span>
                    </div>
                    <div className="w-full h-16 rounded-md bg-gradient-to-br from-amber-900/30 to-rose-900/20 flex items-center justify-center border border-amber-500/10">
                      <p className="text-xs font-display font-semibold text-amber-300/80">Best Boy - Status: Confirmed</p>
                    </div>
                  </div>

                  <div className="glass-light rounded-md p-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[11px] font-mono font-semibold">Food Rotation</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Birria Tacos", "Boba", "Ramen", "In-N-Out", "Pho"].map((food) => (
                        <span key={food} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300/80 border border-orange-500/10">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-light rounded-md p-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span className="text-[11px] font-mono font-semibold">Raves & Shows</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { artist: "Knock2", venue: "The Shrine LA" },
                        { artist: "Fred again..", venue: "Coachella" },
                      ].map((show) => (
                        <div key={show.artist} className="flex items-center gap-2">
                          <Music2 className="w-2.5 h-2.5 text-fuchsia-400/60" />
                          <span className="text-[11px] font-mono text-foreground/70">{show.artist}</span>
                          <span className="text-[10px] font-mono text-muted-foreground ml-auto">{show.venue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative z-10 h-screen flex flex-col"
          >
            <div className="flex items-center gap-3 px-4 py-3 glass shrink-0">
              <button
                data-testid="mobile-back"
                onClick={() => setActiveApp(null)}
                className="p-1.5"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <span className="text-sm font-display font-semibold text-foreground/80">
                {apps.find(a => a.id === activeApp)?.label || "App"}
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              {activeApp === "resume" && <ResumeWindow />}
              {activeApp === "blackskies" && <BlackskiesWindow />}
              {activeApp === "fintech" && <FintechWindow />}
              {activeApp === "gallery" && <GalleryWindow />}
              {activeApp === "trash" && (
                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-mono text-red-400/80 uppercase tracking-wider mb-3">
                    Warning: These ideas were terrible
                  </p>
                  {badIdeas.map((idea, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-foreground/60 font-mono py-1">
                      <span className="text-red-400/50 shrink-0">x</span>
                      <span className="line-through decoration-red-400/30">{idea}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
