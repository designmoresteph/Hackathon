import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function SynthesisScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"gathering" | "collapsing" | "flash" | "document">("gathering");

  const notes = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    x: (i % 3) * 300 + 100,
    y: Math.floor(i / 3) * 200 + 100,
  }));

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Notes drift
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPhase("collapsing");

      // Phase 2: Collapse
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPhase("flash");

      // Phase 3: Flash
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPhase("document");

      // Navigate to project
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/project");
    };

    sequence();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Gathering/Collapsing Phase */}
      {(phase === "gathering" || phase === "collapsing") &&
        notes.map((note) => (
          <motion.div
            key={note.id}
            className="absolute w-32 h-32 rounded-xl"
            style={{ backgroundColor: '#F5E642', border: '1px solid #E8E5E0' }}
            initial={{ x: note.x, y: note.y, opacity: 1 }}
            animate={
              phase === "collapsing"
                ? {
                    x: window.innerWidth / 2 - 64,
                    y: window.innerHeight / 2 - 64,
                    scale: 0.1,
                    opacity: 0.8,
                  }
                : {}
            }
            transition={{
              duration: 2,
              ease: "easeIn",
            }}
          />
        ))}

      {/* Flash Phase */}
      {phase === "flash" && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: '#FFFFFF' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Document Phase */}
      {phase === "document" && (
        <motion.div
          className="w-full max-w-2xl rounded-2xl p-12"
          style={{ backgroundColor: '#FFFFFF' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h1 className="font-['Playfair_Display'] text-4xl tracking-[-0.02em] mb-6" style={{ color: '#0D0D0D' }}>
              Blog Project: The Morning Mind
            </h1>
            
            <div className="space-y-4 font-['DM_Sans'] font-light" style={{ color: '#1A1A1A' }}>
              <h2 className="font-['Lora'] text-2xl tracking-[-0.01em] mt-8" style={{ color: '#0D0D0D' }}>Core Theme</h2>
              <p className="leading-[1.7]">
                A blog exploring the intersection of morning routines, creative thinking, 
                and productivity through the lens of personal experience.
              </p>

              <h2 className="font-['Lora'] text-2xl tracking-[-0.01em] mt-8" style={{ color: '#0D0D0D' }}>Key Topics</h2>
              <ul className="list-disc list-inside space-y-2 leading-[1.7]">
                <li>Morning walks and creative breakthroughs</li>
                <li>Overcoming creative blocks</li>
                <li>Work-life balance and side hustles</li>
                <li>Personal essays vs practical guides</li>
              </ul>

              <h2 className="font-['Lora'] text-2xl tracking-[-0.01em] mt-8" style={{ color: '#0D0D0D' }}>Next Steps</h2>
              <ul className="list-disc list-inside space-y-2 leading-[1.7]">
                <li>Choose blog platform and set up site</li>
                <li>Write first draft about walking and thinking</li>
                <li>Research similar blogs for positioning</li>
              </ul>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm font-['Cormorant_Garamond'] italic font-light text-center mt-12"
              style={{ color: '#A8A49E' }}
            >
              Synthesized from 9 notes collected over 3 weeks
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* Center text during collapse */}
      {phase === "collapsing" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-['Lora'] text-3xl tracking-[-0.01em]" style={{ color: '#FFFFFF' }}>Synthesizing...</p>
        </motion.div>
      )}
    </div>
  );
}
