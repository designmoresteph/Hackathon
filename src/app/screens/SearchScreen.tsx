import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mic, FileText } from "lucide-react";
import { Button } from "../components/ui/button";

interface StickyNote {
  id: string;
  content: string;
  date: string;
  fullDate: string;
  type: "voice" | "text" | "image";
  x: number;
  y: number;
  age: "old" | "recent";
  isLong?: boolean;
}

export function SearchScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"flying" | "gathering" | "timeline">("flying");
  const [notes, setNotes] = useState<StickyNote[]>([]);

  const stickyNotes: StickyNote[] = [
    {
      id: "1",
      content: "I've been thinking about starting a blog for months now. The topic keeps shifting in my mind - should it be about morning routines and productivity? Or more focused on creative thinking and problem-solving? I keep coming back to the idea that my best thoughts happen during my morning walks. There's something about the movement, the fresh air, the quiet that just unlocks something in my brain.\n\nMaybe the blog should be a mix of both - personal essays about my own creative process combined with practical insights I've learned. I could call it 'The Morning Mind' or something like that. The more I think about it, the more excited I get. I just need to actually start writing instead of just thinking about writing.",
      date: "Jan 20",
      fullDate: "January 20, 2026 - 7:15 AM",
      type: "text",
      x: 150,
      y: 100,
      age: "recent",
      isLong: true,
    },
    {
      id: "2",
      content: "Blog idea: How walking helps with creative thinking",
      date: "Jan 18",
      fullDate: "January 18, 2026 - 8:30 AM",
      type: "voice",
      x: 450,
      y: 80,
      age: "recent",
    },
    {
      id: "3",
      content: "Maybe the blog should focus on creative blocks? That's something I deal with constantly and I bet a lot of other people do too.",
      date: "Jan 15",
      fullDate: "January 15, 2026 - 2:45 PM",
      type: "text",
      x: 750,
      y: 120,
      age: "old",
    },
    {
      id: "4",
      content: "Feeling stuck again with the blog. Every time I sit down to write, I freeze up. But when I'm walking or in the shower, ideas flow so easily. There's got to be something there - maybe that's the whole premise of the blog itself. Write about how our best creative thinking happens when we're NOT trying to force it.\n\nI could interview other creative people about their processes. Where do their best ideas come from? I bet a lot of them will say similar things - during walks, doing dishes, driving. Our brains need that unfocused time to make connections. That could be really valuable content.",
      date: "Jan 12",
      fullDate: "January 12, 2026 - 4:20 PM",
      type: "text",
      x: 200,
      y: 350,
      age: "recent",
      isLong: true,
    },
    {
      id: "5",
      content: "Just write. Don't overthink the blog. Start with one post about walking.",
      date: "Jan 10",
      fullDate: "January 10, 2026 - 9:10 AM",
      type: "voice",
      x: 550,
      y: 300,
      age: "recent",
    },
    {
      id: "6",
      content: "Blog name ideas: The Morning Mind, Creative Walks, Daily Thoughts, Wandering Ideas",
      date: "Jan 8",
      fullDate: "January 8, 2026 - 6:50 AM",
      type: "text",
      x: 850,
      y: 250,
      age: "old",
    },
    {
      id: "7",
      content: "Personal essays vs how-to guides for blog? Maybe a mix of both?",
      date: "Jan 5",
      fullDate: "January 5, 2026 - 11:30 AM",
      type: "text",
      x: 100,
      y: 500,
      age: "recent",
    },
    {
      id: "8",
      content: "Need to research other blogs in this space - who's already writing about creativity and routines?",
      date: "Dec 30",
      fullDate: "December 30, 2025 - 3:15 PM",
      type: "text",
      x: 400,
      y: 480,
      age: "old",
    },
    {
      id: "9",
      content: "Set up blog this weekend - no more excuses. Just pick a platform and start.",
      date: "2 min ago",
      fullDate: "Today - 10:23 AM",
      type: "voice",
      x: 700,
      y: 520,
      age: "recent",
    },
    {
      id: "10",
      content: "Blog topics: side hustles, work-life balance, creativity, morning routines, overcoming blocks",
      date: "Dec 28",
      fullDate: "December 28, 2025 - 1:40 PM",
      type: "text",
      x: 300,
      y: 180,
      age: "old",
    },
  ];

  useEffect(() => {
    // Phase 1: Fly in stickies
    stickyNotes.forEach((note, i) => {
      setTimeout(() => {
        setNotes((prev) => [...prev, note]);
      }, i * 100);
    });

    // Phase 2: Gather to center
    setTimeout(() => {
      setPhase("gathering");
    }, stickyNotes.length * 100 + 1000);

    // Phase 3: Show timeline
    setTimeout(() => {
      setPhase("timeline");
    }, stickyNotes.length * 100 + 3000);
  }, []);

  const colors = {
    old: "#F2EFE9",
    recent: "#F5E642",
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-['Playfair_Display'] text-4xl tracking-[-0.02em] mb-2" style={{ color: '#0D0D0D' }}>
            All mentions of "blog"
          </h1>
          <p className="font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>
            {phase === "flying" && "Gathering your thoughts..."}
            {phase === "gathering" && "Bringing them together..."}
            {phase === "timeline" && "10 notes collected over 3 weeks"}
          </p>
        </motion.div>

        {/* Sticky Notes (flying and gathering phases) */}
        {(phase === "flying" || phase === "gathering") && (
          <div className="relative h-[80vh]">
            {notes.map((note) => (
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
                  delay: phase === "gathering" ? parseInt(note.id) * 0.05 : 0,
                }}
              >
                <div
                  className="w-full h-full p-4 rounded-xl border"
                  style={{
                    backgroundColor: colors[note.age],
                    borderColor: '#E8E5E0',
                  }}
                >
                  <div className="flex flex-col h-full font-['DM_Sans'] font-light">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
                        {note.date}
                      </span>
                      {note.type === "voice" ? (
                        <Mic className="w-3 h-3" strokeWidth={1.5} style={{ color: '#A8A49E' }} />
                      ) : (
                        <FileText className="w-3 h-3" strokeWidth={1.5} style={{ color: '#A8A49E' }} />
                      )}
                    </div>
                    <p className={`${note.isLong ? 'text-xs' : 'text-sm'} flex-1 overflow-hidden whitespace-pre-line`} style={{ color: '#0D0D0D' }}>
                      {note.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Timeline View */}
        <AnimatePresence>
          {phase === "timeline" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Sort by date, newest first */}
              {[...stickyNotes]
                .sort((a, b) => new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime())
                .map((note, index) => (
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
                        style={{ backgroundColor: colors[note.age] }}
                      />
                      {index < stickyNotes.length - 1 && (
                        <div className="w-0.5 h-full min-h-[80px] mt-2" style={{ backgroundColor: '#E8E5E0' }} />
                      )}
                    </div>

                    {/* Note content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-xs font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
                          {note.fullDate}
                        </p>
                        {note.type === "voice" ? (
                          <span className="flex items-center gap-1 text-xs font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
                            <Mic className="w-3 h-3" strokeWidth={1.5} />
                            Voice
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
                            <FileText className="w-3 h-3" strokeWidth={1.5} />
                            Text
                          </span>
                        )}
                      </div>
                      <div
                        className="rounded-2xl p-6 border"
                        style={{
                          backgroundColor: colors[note.age],
                          borderColor: '#E8E5E0',
                        }}
                      >
                        <p className="font-['DM_Sans'] font-light leading-[1.7] whitespace-pre-line" style={{ color: '#0D0D0D' }}>
                          {note.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {/* Synthesis button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stickyNotes.length * 0.1 + 0.3 }}
                className="flex justify-center pt-8"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/synthesis")}
                  className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase h-12 px-7 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#F5E642',
                    color: '#0D0D0D',
                    border: 'none',
                  }}
                >
                  ⭐ Synthesize Into Project
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
