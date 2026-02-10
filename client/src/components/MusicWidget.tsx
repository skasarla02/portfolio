import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ChevronDown, ChevronUp, SkipForward } from "lucide-react";

const tracks = [
  { artist: "Knock2", track: "dashstar*", color: "from-violet-500 to-purple-600" },
  { artist: "Playboi Carti", track: "Magnolia", color: "from-red-500 to-rose-600" },
  { artist: "Fred again..", track: "Rumble", color: "from-cyan-500 to-blue-600" },
  { artist: "Skrillex", track: "Mumbai Power", color: "from-fuchsia-500 to-pink-600" },
  { artist: "Travis Scott", track: "FE!N", color: "from-amber-500 to-orange-600" },
];

export function MusicWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);

  const track = tracks[currentTrack];

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  return (
    <motion.div
      data-testid="music-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="fixed bottom-16 right-4 z-[9998]"
    >
      <div className="glass rounded-md overflow-hidden" style={{ width: 260 }}>
        <button
          data-testid="music-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${track.color} flex items-center justify-center`}>
              <Music className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-display font-semibold text-foreground/80">Now Playing</span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p
                      key={track.track}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-display font-semibold truncate"
                    >
                      {track.track}
                    </motion.p>
                    <p className="text-[11px] text-muted-foreground font-mono">{track.artist}</p>
                  </div>
                  <button
                    data-testid="music-next"
                    onClick={(e) => { e.stopPropagation(); nextTrack(); }}
                    className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-end gap-[2px] h-6" data-testid="waveform">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar w-[3px] rounded-full"
                      style={{
                        height: "100%",
                        animationDelay: `${i * 0.07}s`,
                        animationDuration: `${0.8 + Math.random() * 0.8}s`,
                        background: `linear-gradient(to top, hsl(250, 80%, 65%), hsl(310, 70%, 60%))`,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${track.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                      key={currentTrack}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">2:14</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
