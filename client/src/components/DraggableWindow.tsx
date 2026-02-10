import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import { Minus, Square, X } from "lucide-react";

interface DraggableWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export function DraggableWindow({
  id,
  title,
  children,
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  defaultPosition = { x: 100, y: 60 },
  defaultSize = { width: 700, height: 500 },
}: DraggableWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [preMaxPos, setPreMaxPos] = useState(defaultPosition);
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    constraintsRef.current = document.getElementById("desktop-area") as HTMLDivElement;
  }, []);

  const handleMaximize = useCallback(() => {
    if (!isMaximized) {
      setPreMaxPos(position);
    }
    setIsMaximized(!isMaximized);
  }, [isMaximized, position]);

  if (!isOpen) return null;

  const windowStyle = isMaximized
    ? { x: 0, y: 0, width: "100%", height: "calc(100vh - 48px)" }
    : { width: defaultSize.width, height: defaultSize.height };

  return (
    <motion.div
      data-testid={`window-${id}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isMinimized
          ? { opacity: 0, scale: 0.5, y: 100 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag={!isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onMouseDown={onFocus}
      className="absolute rounded-md overflow-hidden flex flex-col"
      style={{
        zIndex,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        ...windowStyle,
        maxWidth: isMaximized ? "100%" : "calc(100vw - 32px)",
        maxHeight: isMaximized ? undefined : "calc(100vh - 96px)",
        pointerEvents: isMinimized ? "none" : "auto",
        visibility: isMinimized ? "hidden" : "visible",
      }}
      onDragEnd={(_: any, info: PanInfo) => {
        setPosition((prev) => {
          const newX = Math.max(-200, Math.min(window.innerWidth - 100, prev.x + info.offset.x));
          const newY = Math.max(0, Math.min(window.innerHeight - 100, prev.y + info.offset.y));
          return { x: newX, y: newY };
        });
      }}
    >
      <div className="glass rounded-md flex flex-col h-full overflow-hidden">
        <div
          className="flex items-center gap-2 px-4 py-2.5 cursor-grab active:cursor-grabbing select-none shrink-0"
          onPointerDown={(e) => {
            onFocus();
            dragControls.start(e);
          }}
        >
          <div
            className="flex items-center gap-1.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              data-testid={`window-close-${id}`}
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:brightness-110 transition-all"
            />
            <button
              data-testid={`window-minimize-${id}`}
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:brightness-110 transition-all"
            />
            <button
              data-testid={`window-maximize-${id}`}
              onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
              className="w-3.5 h-3.5 rounded-full bg-green-500 hover:brightness-110 transition-all"
            />
          </div>
          <span className="flex-1 text-center text-xs font-mono text-muted-foreground tracking-wide truncate">
            {title}
          </span>
          <div className="w-[52px]" />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
