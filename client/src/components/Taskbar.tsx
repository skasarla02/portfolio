import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface TaskbarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  items: TaskbarItem[];
  onItemClick: (id: string) => void;
  clock: string;
}

export function Taskbar({ items, onItemClick, clock }: TaskbarProps) {
  return (
    <div
      data-testid="taskbar"
      className="fixed bottom-0 left-0 right-0 h-14 z-[9999] flex items-center justify-between px-4 gap-2"
      style={{
        background: "rgba(10, 12, 22, 0.85)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center gap-1.5">
        {items.filter(i => i.isOpen).map((item) => (
          <motion.button
            key={item.id}
            data-testid={`taskbar-item-${item.id}`}
            onClick={() => onItemClick(item.id)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-md text-sm font-mono transition-colors ${
              item.isMinimized
                ? "text-muted-foreground"
                : "text-foreground bg-white/8"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:inline truncate max-w-[120px]">{item.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-muted-foreground">
          {clock}
        </span>
      </div>
    </div>
  );
}
