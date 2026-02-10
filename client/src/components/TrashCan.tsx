import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

const badIdeas = [
  "A social media platform exclusively for goldendoodles",
  "Uber but for carrying people piggyback",
  "An NFT marketplace for homework assignments",
  "Tinder but for matching with your Uber driver",
  "A subscription service for motivational screaming",
  "LinkedIn but every post must be a haiku",
  "A VC fund that only invests in lemonade stands",
  "Slack but every message is auto-translated to Yoda-speak",
];

export function TrashCan({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      data-testid="trash-can-icon"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-md cursor-pointer select-none text-left w-full"
    >
      <div
        className="absolute -inset-1 rounded-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
        style={{ background: "rgba(239, 68, 68, 0.3)" }}
      />
      <div className="relative glass rounded-md p-4 flex items-center gap-4 overflow-hidden">
        <div className="shrink-0 w-12 h-12 rounded-md bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-lg">
          <Trash2 className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-display font-semibold text-foreground/90 truncate">Bad_Ideas.trash</p>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">8 terrible ideas</p>
        </div>
        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400/80" />
      </div>
    </motion.button>
  );
}

export function TrashWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="trash-window"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass rounded-md w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-display font-semibold">Bad_Ideas.trash</span>
              </div>
              <button data-testid="trash-close" onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-auto">
              <p className="text-[11px] font-mono text-red-400/80 mb-3 uppercase tracking-wider">
                Warning: These ideas were terrible
              </p>
              {badIdeas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm text-foreground/60 font-mono py-1"
                >
                  <span className="text-red-400/50 shrink-0">x</span>
                  <span className="line-through decoration-red-400/30">{idea}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
