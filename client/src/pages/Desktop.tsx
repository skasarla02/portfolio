import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Briefcase, BarChart3, User, Linkedin, Mail, Github, MapPin, GraduationCap } from "lucide-react";
import { DraggableWindow } from "@/components/DraggableWindow";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Taskbar, type TaskbarItem } from "@/components/Taskbar";
import { MusicWidget } from "@/components/MusicWidget";
import { SideQuestWidget } from "@/components/SideQuestWidget";
import { TrashCan, TrashWindow } from "@/components/TrashCan";
import { BlackskiesWindow } from "@/components/windows/BlackskiesWindow";
import { ResumeWindow } from "@/components/windows/ResumeWindow";
import { FintechWindow } from "@/components/windows/FintechWindow";
import { GalleryWindow } from "@/components/windows/GalleryWindow";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

type WindowId = "resume" | "blackskies" | "fintech" | "gallery";

const WINDOW_CONFIGS: Record<WindowId, { title: string; icon: typeof FileText; defaultPos: { x: number; y: number }; defaultSize: { width: number; height: number } }> = {
  resume: { title: "Resume.exe", icon: FileText, defaultPos: { x: 60, y: 30 }, defaultSize: { width: 720, height: 580 } },
  blackskies: { title: "Blackskies_Ventures", icon: Briefcase, defaultPos: { x: 120, y: 40 }, defaultSize: { width: 880, height: 600 } },
  fintech: { title: "Fintech_Case_Study", icon: BarChart3, defaultPos: { x: 180, y: 50 }, defaultSize: { width: 720, height: 560 } },
  gallery: { title: "Personal_Gallery", icon: User, defaultPos: { x: 240, y: 35 }, defaultSize: { width: 680, height: 580 } },
};

const STATUS_MESSAGES = [
  "Currently craving: birria tacos",
  "Next show: Knock2 @ the Shrine",
  "Walking the dog in 2 hours",
  "Listening to Playboi Carti on repeat",
  "Debating: In-N-Out vs Shake Shack",
  "Next rave: undisclosed warehouse location",
  "Teaching my dog to fetch stock prices",
  "Brewing pour-over #3 of the day",
];

export default function Desktop() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    resume: { isOpen: false, isMinimized: false, zIndex: 1 },
    blackskies: { isOpen: false, isMinimized: false, zIndex: 1 },
    fintech: { isOpen: false, isMinimized: false, zIndex: 1 },
    gallery: { isOpen: false, isMinimized: false, zIndex: 1 },
  });

  const [topZ, setTopZ] = useState(10);
  const [trashOpen, setTrashOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { isOpen: true, isMinimized: false, zIndex: newZ },
    }));
  }, [topZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: newZ, isMinimized: false },
    }));
  }, [topZ]);

  const handleTaskbarClick = useCallback((id: string) => {
    const wid = id as WindowId;
    const win = windows[wid];
    if (win?.isMinimized) {
      focusWindow(wid);
    } else {
      minimizeWindow(wid);
    }
  }, [windows, focusWindow, minimizeWindow]);

  const taskbarItems: TaskbarItem[] = (Object.keys(WINDOW_CONFIGS) as WindowId[]).map((id) => ({
    id,
    label: WINDOW_CONFIGS[id].title,
    icon: WINDOW_CONFIGS[id].icon,
    isOpen: windows[id].isOpen,
    isMinimized: windows[id].isMinimized,
  }));

  const desktopIcons: { id: WindowId; label: string; subtitle: string; icon: typeof FileText; gradient: string; glowColor: string }[] = [
    { id: "resume", label: "Resume.exe", subtitle: "Experience & Education", icon: FileText, gradient: "from-emerald-500 to-teal-600", glowColor: "rgba(16, 185, 129, 0.3)" },
    { id: "blackskies", label: "Blackskies_Ventures", subtitle: "EdTech Case Study", icon: Briefcase, gradient: "from-violet-500 to-purple-700", glowColor: "rgba(139, 92, 246, 0.3)" },
    { id: "fintech", label: "Fintech_Case_Study", subtitle: "Product Space Fitness App", icon: BarChart3, gradient: "from-amber-500 to-orange-600", glowColor: "rgba(245, 158, 11, 0.3)" },
    { id: "gallery", label: "Personal_Gallery", subtitle: "Photos & Life", icon: User, gradient: "from-cyan-500 to-blue-600", glowColor: "rgba(6, 182, 212, 0.3)" },
  ];

  const windowContent: Record<WindowId, React.ReactNode> = {
    resume: <ResumeWindow />,
    blackskies: <BlackskiesWindow />,
    fintech: <FintechWindow />,
    gallery: <GalleryWindow />,
  };

  return (
    <div className="h-screen w-screen desktop-bg overflow-hidden relative" id="desktop-area">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.08),transparent_50%),radial-gradient(ellipse_at_center,rgba(245,158,11,0.04),transparent_60%)]" />

      <FloatingShapes />

      <div className="absolute inset-0 z-10 flex">
        <div className="w-[320px] shrink-0 p-4 flex flex-col gap-3 overflow-y-auto pb-16 scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="glass rounded-md p-5 mb-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                <span className="text-xl font-display font-bold text-white">SK</span>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
                  Sidharth Kasarla
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <GraduationCap className="w-3 h-3 text-violet-400" />
                  <p className="text-[11px] font-mono text-violet-400">
                    UC Berkeley '28
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[11px] font-mono text-muted-foreground">
                    East Brunswick, NJ
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 px-3 py-2 rounded-md bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/10"
            >
              <p className="text-[11px] font-mono text-violet-300/80 truncate" data-testid="status-message">
                {STATUS_MESSAGES[statusIndex]}
              </p>
            </motion.div>

            <div className="flex items-center gap-2 mt-3">
              <a
                href="mailto:skasarla@berkeley.edu"
                data-testid="link-email"
                className="flex-1 glass-light rounded-md px-2.5 py-2 flex items-center justify-center gap-1.5 text-[11px] font-mono text-foreground/70 transition-colors hover:text-foreground"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/sidharth-kasarla"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-linkedin"
                className="flex-1 glass-light rounded-md px-2.5 py-2 flex items-center justify-center gap-1.5 text-[11px] font-mono text-foreground/70 transition-colors hover:text-foreground"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                LinkedIn
              </a>
            </div>
          </motion.div>

          {desktopIcons.map((icon, i) => (
            <DesktopIcon
              key={icon.id}
              label={icon.label}
              subtitle={icon.subtitle}
              icon={icon.icon}
              gradient={icon.gradient}
              glowColor={icon.glowColor}
              onClick={() => openWindow(icon.id)}
              testId={`icon-${icon.id}`}
              delay={i}
            />
          ))}

          <TrashCan onOpen={() => setTrashOpen(true)} />
        </div>

        <div className="flex-1 relative">
          {(Object.keys(WINDOW_CONFIGS) as WindowId[]).map((id) => (
            <DraggableWindow
              key={id}
              id={id}
              title={WINDOW_CONFIGS[id].title}
              isOpen={windows[id].isOpen}
              isMinimized={windows[id].isMinimized}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onFocus={() => focusWindow(id)}
              zIndex={windows[id].zIndex}
              defaultPosition={WINDOW_CONFIGS[id].defaultPos}
              defaultSize={WINDOW_CONFIGS[id].defaultSize}
            >
              {windowContent[id]}
            </DraggableWindow>
          ))}
        </div>
      </div>

      <TrashWindow isOpen={trashOpen} onClose={() => setTrashOpen(false)} />
      <MusicWidget />
      <SideQuestWidget />
      <Taskbar items={taskbarItems} onItemClick={handleTaskbarClick} clock={clock} />
    </div>
  );
}

function FloatingShapes() {
  const shapes = [
    { x: "10%", y: "20%", size: 300, color: "rgba(139, 92, 246, 0.06)", delay: 0 },
    { x: "70%", y: "15%", size: 250, color: "rgba(6, 182, 212, 0.05)", delay: 2 },
    { x: "80%", y: "60%", size: 200, color: "rgba(245, 158, 11, 0.04)", delay: 4 },
    { x: "30%", y: "70%", size: 350, color: "rgba(236, 72, 153, 0.04)", delay: 1 },
    { x: "50%", y: "30%", size: 180, color: "rgba(16, 185, 129, 0.05)", delay: 3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            background: shape.color,
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
