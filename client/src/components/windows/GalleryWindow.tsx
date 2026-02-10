import { Mail, Linkedin, ExternalLink, Camera, Heart, UtensilsCrossed, Music2, GraduationCap } from "lucide-react";

const photoCategories = [
  {
    title: "The Dog",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    items: [
      { label: "Morning walks", gradient: "from-amber-900/40 to-rose-900/30" },
      { label: "Park adventures", gradient: "from-green-900/40 to-emerald-900/30" },
      { label: "Nap time", gradient: "from-purple-900/40 to-indigo-900/30" },
    ],
  },
  {
    title: "Concerts & Raves",
    icon: Music2,
    color: "from-fuchsia-500 to-purple-600",
    items: [
      { label: "Knock2 live", gradient: "from-violet-900/40 to-purple-900/30" },
      { label: "Festival vibes", gradient: "from-fuchsia-900/40 to-pink-900/30" },
      { label: "Warehouse sets", gradient: "from-blue-900/40 to-indigo-900/30" },
    ],
  },
  {
    title: "Food Adventures",
    icon: UtensilsCrossed,
    color: "from-orange-500 to-amber-600",
    items: [
      { label: "Birria tacos", gradient: "from-orange-900/40 to-red-900/30" },
      { label: "Late night ramen", gradient: "from-amber-900/40 to-yellow-900/30" },
      { label: "Boba runs", gradient: "from-teal-900/40 to-cyan-900/30" },
    ],
  },
];

const highlights = [
  { title: "Published Research", desc: "\"Low-Income Students and Their Low Application Rates to Prestigious Universities\" - Curieux Academic Journal", color: "text-cyan-400" },
  { title: "SMBC", desc: "Incoming Data and Product Growth Summer Associate (Summer 2026)", color: "text-emerald-400" },
  { title: "Deeli AI", desc: "Co-intern and I helped the CEO source TSMC as a client", color: "text-violet-400" },
  { title: "Mos", desc: "Boosted user conversion rates by 26% and increased brand awareness by 30%", color: "text-amber-400" },
];

export function GalleryWindow() {
  return (
    <div className="p-5 space-y-6 overflow-auto h-full">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
          <span className="text-2xl font-display font-bold text-white">SK</span>
        </div>
        <div>
          <h2 className="text-xl font-display font-bold">Sidharth Kasarla</h2>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            Data Science & Economics @ UC Berkeley
          </p>
          <p className="text-sm font-mono text-violet-400 mt-0.5">
            Product Growth &middot; VC/Fintech &middot; Data Science
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="mailto:skasarla@berkeley.edu"
              data-testid="gallery-link-email"
              className="flex items-center gap-1.5 text-[11px] font-mono text-foreground/60 hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/sidharth-kasarla"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="gallery-link-linkedin"
              className="flex items-center gap-1.5 text-[11px] font-mono text-foreground/60 hover:text-foreground transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-display font-semibold text-violet-400 uppercase tracking-wider">Photo Wall</h3>
        </div>
        <div className="space-y-4">
          {photoCategories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-display font-semibold">{cat.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    className={`aspect-square rounded-md bg-gradient-to-br ${item.gradient} border border-white/5 flex items-center justify-center p-2 hover:border-white/15 transition-colors cursor-pointer`}
                  >
                    <span className="text-[10px] font-mono text-foreground/40 text-center leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-display font-semibold text-emerald-400 uppercase tracking-wider">Highlights</h3>
        </div>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="glass-light rounded-md p-3">
              <h4 className={`text-sm font-display font-semibold ${h.color}`}>{h.title}</h4>
              <p className="text-[11px] text-foreground/60 mt-1 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
