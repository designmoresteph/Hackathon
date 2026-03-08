import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { saveEntry } from "../lib/storage";
import type { Entry } from "../lib/types";

export function TextDumpScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const entryId = useMemo(() => crypto.randomUUID(), []);

  const handleContinue = () => {
    if (!text.trim()) return;

    const entry: Entry = {
      id: entryId,
      createdAt: new Date().toISOString(),
      durationSeconds: 0,
      transcript: [{ id: crypto.randomUUID(), text: text.trim(), timestamp: 0 }],
      fullText: text.trim(),
    };
    saveEntry(entry);
    navigate(`/cluster?entryId=${entryId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#EEF5F8' }}>
      {/* Cancel Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 right-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="transition-all hover:-translate-y-0.5"
          style={{ color: 'rgba(26,21,16,0.45)' }}
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </motion.div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl space-y-8"
        >
          <div className="text-center space-y-3">
            <h1 className="font-['Playfair_Display'] italic text-4xl tracking-[-0.01em]" style={{ color: '#1A1510' }}>
              What's on your mind?
            </h1>
            <p className="text-sm font-['DM_Sans'] font-light" style={{ color: 'rgba(26,21,16,0.45)' }}>
              Just write. Let your thoughts flow freely.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing your thoughts... talk about what's on your mind, your ideas, worries, plans, anything..."
              className="min-h-[400px] text-base leading-[1.7] resize-none rounded-[20px] border font-['DM_Sans'] font-light"
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.6)',
                color: '#1A1510',
              }}
              autoFocus
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between items-center"
          >
            <p className="text-sm font-['DM_Mono'] tracking-[0.08em] uppercase" style={{ color: 'rgba(26,21,16,0.35)' }}>
              {text.split(/\s+/).filter(Boolean).length} words
            </p>
            <Button
              onClick={handleContinue}
              disabled={!text.trim()}
              size="lg"
              className="rounded-full font-['DM_Sans'] text-[13px] font-medium tracking-[0.04em] h-12 px-7 transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{
                backgroundColor: text.trim() ? '#1A1510' : 'rgba(26,21,16,0.10)',
                color: text.trim() ? '#F0E8D8' : 'rgba(26,21,16,0.35)',
                border: 'none',
              }}
            >
              Continue →
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm font-['Cormorant_Garamond'] italic font-light text-center leading-relaxed"
            style={{ color: 'rgba(26,21,16,0.35)' }}
          >
            No pressure. No judgment. Just you and your thoughts.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
