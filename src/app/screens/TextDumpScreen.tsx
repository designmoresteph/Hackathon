import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export function TextDumpScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const handleContinue = () => {
    if (text.trim()) {
      navigate("/cluster");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F7F5F0' }}>
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
          style={{ color: '#6B6B6B' }}
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
            <h1 className="font-['Lora'] text-4xl tracking-[-0.01em]" style={{ color: '#0D0D0D' }}>
              What's on your mind?
            </h1>
            <p className="text-sm font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>
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
              className="min-h-[400px] text-base leading-[1.7] resize-none rounded-2xl border font-['DM_Sans'] font-light"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8E5E0',
                color: '#0D0D0D',
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
            <p className="text-sm font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
              {text.split(/\s+/).filter(Boolean).length} words
            </p>
            <Button
              onClick={handleContinue}
              disabled={!text.trim()}
              size="lg"
              className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase h-12 px-7 transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{
                backgroundColor: text.trim() ? '#F5E642' : '#E8E5E0',
                color: '#0D0D0D',
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
            style={{ color: '#A8A49E' }}
          >
            No pressure. No judgment. Just you and your thoughts.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
