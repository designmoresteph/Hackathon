import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mic, FileText, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { getAllEntries } from "../lib/storage";
import type { Entry } from "../lib/types";

interface StickyNote {
  id: string;
  content: string;
  date: string;
  fullDate: string;
  type: "voice" | "text";
  x: number;
  y: number;
  isLong: boolean;
}

function buildStickyNotes(entries: Entry[], query: string): StickyNote[] {
  const q = query.toLowerCase();
  const matching = entries.filter((e) => e.fullText.toLowerCase().includes(q));

  const positions = [
    { x: 150, y: 100 }, { x: 450, y: 80 }, { x: 750, y: 120 },
    { x: 200, y: 350 }, { x: 550, y: 300 }, { x: 850, y: 250 },
    { x: 100, y: 500 }, { x: 400, y: 480 }, { x: 700, y: 520 },
    { x: 300, y: 180 },
  ];

  return matching.map((entry, i) => {
    const isLong = entry.fullText.length > 200;
    const content = isLong ? entry.fullText.slice(0, 400) : entry.fullText;
    const pos = positions[i % positions.length];
    return {
      id: entry.id,
      content,
      date: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      type: entry.durationSeconds > 0 ? "voice" as const : "text" as const,
      x: pos.x,
      y: pos.y,
      isLong,
    };
  });
}

export function SearchScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [entries] = useState(() => getAllEntries());
  const [phase, setPhase] = useState<"flying" | "gathering" | "timeline">("flying");
  const [visibleNotes, setVisibleNotes] = useState<StickyNote[]>([]);

  const stickyNotes = useMemo(() => {
    if (!query.trim()) return [];
    return buildStickyNotes(entries, query);
  }, [entries, query]);

  // Reset and replay animation when stickyNotes change
  useEffect(() => {
    if (stickyNotes.length === 0) {
      setVisibleNotes([]);
      setPhase("flying");
      return;
    }

    setPhase("flying");
    setVisibleNotes([]);

    // Phase 1: Fly in stickies one by one
    stickyNotes.forEach((note, i) => {
      setTimeout(() => {
        setVisibleNotes((prev) => [...prev, note]);
      }, i * 100);
    });

    // Phase 2: Gather to center
    const gatherTime = stickyNotes.length * 100 + 1000;
    const gatherTimer = setTimeout(() => setPhase("gathering"), gatherTime);

    // Phase 3: Show timeline
    const timelineTimer = setTimeout(() => setPhase("timeline"), gatherTime + 2000);

    return () => {
      clearTimeout(gatherTimer);
      clearTimeout(timelineTimer);
    };
  }, [stickyNotes]);

  const noteColors = {
    recent: "rgba(255,255,255,0.55)",
    old: "rgba(200,220,232,0.45)",
  };

  const isRecent = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 14 * 24 * 60 * 60 * 1000; // 2 weeks
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: "#EEF5F8" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 font-['DM_Sans'] text-sm"
            style={{ color: "rgba(26,21,16,0.45)" }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to dashboard
          </button>

          <div className="flex items-center gap-6">
            <h1
              className="font-['Playfair_Display'] italic text-4xl tracking-[-0.02em] shrink-0"
              style={{ color: "#1A1510" }}
            >
              {query.trim()
                ? `All mentions of "${query}"`
                : "Search your thoughts"}
            </h1>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="rounded-full font-['DM_Sans'] font-light text-base h-10 max-w-xs"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.6)",
                backdropFilter: "blur(16px)",
                color: "#1A1510",
              }}
              autoFocus
            />
          </div>

          <p className="font-['DM_Sans'] font-light" style={{ color: "rgba(26,21,16,0.45)" }}>
            {phase === "flying" && stickyNotes.length > 0 && "Gathering your thoughts..."}
            {phase === "gathering" && "Bringing them together..."}
            {phase === "timeline" && `${stickyNotes.length} notes collected`}
            {!query.trim() && entries.length > 0 && `${entries.length} entries to search through`}
            {!query.trim() && entries.length === 0 && "No entries yet. Record some thoughts first."}
            {query.trim() && stickyNotes.length === 0 && `No entries match "${query}"`}
          </p>
        </motion.div>

        {/* Sticky Notes — flying and gathering phases */}
        {stickyNotes.length > 0 && (phase === "flying" || phase === "gathering") && (
          <div className="relative h-[75vh]">
            {visibleNotes.map((note) => {
              const bg = isRecent(note.fullDate) ? noteColors.recent : noteColors.old;
              return (
                <motion.div
                  key={note.id}
                  className="absolute"
                  style={{
                    width: note.isLong ? "400px" : "192px",
                    height: note.isLong ? "320px" : "192px",
                  }}
                  initial={{ x: -200, y: 0, rotate: 0, opacity: 0 }}
                  animate={
                    phase === "flying"
                      ? {
                          x: note.x,
                          y: note.y,
                          rotate: Math.random() * 10 - 5,
                          opacity: 1,
                        }
                      : {
                          x: window.innerWidth / 2 - (note.isLong ? 200 : 96),
                          y: window.innerHeight / 2 - (note.isLong ? 160 : 96),
                          rotate: 0,
                          scale: 0.3,
                          opacity: 0.8,
                        }
                  }
                  transition={{
                    duration: phase === "flying" ? 0.8 : 1.5,
                    type: "spring",
                    delay: phase === "gathering" ? 0.05 : 0,
                  }}
                >
                  <div
                    className="w-full h-full p-4 rounded-[20px]"
                    style={{
                      backgroundColor: bg,
                      backdropFilter: "blur(16px) saturate(1.2)",
                      border: "1px solid rgba(255,255,255,0.6)",
                    }}
                  >
                    <div className="flex flex-col h-full font-['DM_Sans'] font-light">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-['DM_Mono'] text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(26,21,16,0.45)" }}>
                          {note.date}
                        </span>
                        {note.type === "voice" ? (
                          <Mic className="w-3 h-3" strokeWidth={1.5} style={{ color: "rgba(26,21,16,0.45)" }} />
                        ) : (
                          <FileText className="w-3 h-3" strokeWidth={1.5} style={{ color: "rgba(26,21,16,0.45)" }} />
                        )}
                      </div>
                      <p
                        className={`${note.isLong ? "text-xs" : "text-sm"} flex-1 overflow-hidden whitespace-pre-line`}
                        style={{ color: "#1A1510" }}
                      >
                        {note.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Timeline View */}
        <AnimatePresence>
          {phase === "timeline" && stickyNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 max-w-3xl mx-auto"
            >
              {stickyNotes.map((note, index) => {
                const bg = isRecent(note.fullDate) ? noteColors.recent : noteColors.old;
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full mt-2"
                        style={{ backgroundColor: isRecent(note.fullDate) ? "#4A8FA8" : "rgba(26,21,16,0.15)" }}
                      />
                      {index < stickyNotes.length - 1 && (
                        <div className="w-0.5 h-full min-h-[80px] mt-2" style={{ backgroundColor: "rgba(26,21,16,0.10)" }} />
                      )}
                    </div>

                    {/* Note content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-['DM_Mono'] text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(26,21,16,0.45)" }}>
                          {note.fullDate}
                        </span>
                        <span className="flex items-center gap-1 font-['DM_Mono'] text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(26,21,16,0.45)" }}>
                          {note.type === "voice" ? (
                            <><Mic className="w-3 h-3" strokeWidth={1.5} /> Voice</>
                          ) : (
                            <><FileText className="w-3 h-3" strokeWidth={1.5} /> Text</>
                          )}
                        </span>
                      </div>
                      <div
                        className="rounded-[20px] p-6"
                        style={{
                          backgroundColor: bg,
                          backdropFilter: "blur(16px) saturate(1.2)",
                          border: "1px solid rgba(255,255,255,0.6)",
                        }}
                      >
                        <p
                          className="font-['DM_Sans'] font-light leading-[1.7] whitespace-pre-line"
                          style={{ color: "#1A1510" }}
                          dangerouslySetInnerHTML={{
                            __html: note.content.replace(
                              new RegExp(
                                `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                                "gi"
                              ),
                              '<mark style="background:rgba(74,143,168,0.2);border-radius:2px;padding:0 2px">$1</mark>'
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
