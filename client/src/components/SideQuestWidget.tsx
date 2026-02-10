import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ChevronDown, ChevronUp, Heart, Trophy, Swords, UtensilsCrossed, Music2, Zap } from "lucide-react";

export function SideQuestWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      data-testid="sidequest-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="fixed bottom-16 left-4 z-[9998]"
    >
      <div className="glass rounded-md overflow-hidden" style={{ width: 260 }}>
        <button
          data-testid="sidequest-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-display font-semibold text-foreground/80">Side Quests</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="glass-light rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-display font-semibold">Clash Royale</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">Deck: PEKKA / E-Barbs</span>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-mono text-amber-400">Champion</span>
                    </div>
                  </div>
                </div>

                <div className="glass-light rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs font-display font-semibold">The Dog</span>
                  </div>
                  <div className="w-full h-20 rounded-md bg-gradient-to-br from-amber-900/30 to-rose-900/20 flex items-center justify-center border border-amber-500/10">
                    <div className="text-center">
                      <p className="text-xs font-display font-semibold text-amber-300/80">Best Boy</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Status: Confirmed</p>
                    </div>
                  </div>
                </div>

                <div className="glass-light rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-display font-semibold">Food Rotation</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Birria Tacos", "Boba", "Ramen", "In-N-Out", "Pho"].map((food) => (
                      <span key={food} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300/80 border border-orange-500/10">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-light rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span className="text-xs font-display font-semibold">Raves & Shows</span>
                  </div>
                  <div className="space-y-1.5">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
