import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  onClick: () => void;
  testId: string;
  delay?: number;
}

export function DesktopIcon({ label, subtitle, icon: Icon, gradient, glowColor, onClick, testId, delay = 0 }: DesktopIconProps) {
  return (
    <motion.button
      data-testid={testId}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-md cursor-pointer select-none text-left w-full"
    >
      <div
        className="absolute -inset-1 rounded-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
        style={{ background: glowColor }}
      />
      <div className="relative glass rounded-md p-4 flex items-center gap-4 overflow-hidden">
        <div className={`shrink-0 w-12 h-12 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-display font-semibold text-foreground/90 truncate">{label}</p>
          {subtitle && (
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      </div>
    </motion.button>
  );
}
