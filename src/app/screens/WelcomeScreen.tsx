import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mic, Type, ImageIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AnimatedGradient } from "../components/AnimatedGradient";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleStart = (mode: string) => {
    if (mode === "voice") {
      const params = name ? `?name=${encodeURIComponent(name)}` : "";
      navigate(`/voice${params}`);
    } else if (mode === "type") {
      navigate("/text");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedGradient />
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-12 text-center"
        >
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <p className="text-[9px] tracking-[0.22em] uppercase font-['DM_Mono']" style={{ color: 'rgba(26,21,16,0.45)' }}>
              Who are you today?
            </p>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center border font-['DM_Sans'] font-light"
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(26,21,16,0.10)',
                color: '#1A1510'
              }}
            />
          </motion.div>

          {/* Main Prompt */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-['Playfair_Display'] italic text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em]"
            style={{ color: '#1A1510' }}
          >
            {getGreeting()}. What's on your mind?
          </motion.h1>

          {/* Input Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-4 pt-12"
          >
            <Button
              onClick={() => handleStart("voice")}
              variant="outline"
              className="h-14 font-['DM_Sans'] text-[13px] font-normal tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(26,21,16,0.08)',
                border: '1.5px solid rgba(26,21,16,0.20)',
                borderRadius: '100px',
                color: '#1A1510'
              }}
            >
              <Mic className="w-5 h-5 mr-3" strokeWidth={1.5} />
              <span>Voice</span>
            </Button>

            <Button
              onClick={() => handleStart("type")}
              variant="outline"
              className="h-14 font-['DM_Sans'] text-[13px] font-normal tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(26,21,16,0.08)',
                border: '1.5px solid rgba(26,21,16,0.20)',
                borderRadius: '100px',
                color: '#1A1510'
              }}
            >
              <Type className="w-5 h-5 mr-3" strokeWidth={1.5} />
              <span>Type</span>
            </Button>

            <Button
              onClick={() => handleStart("drop")}
              variant="outline"
              className="h-14 font-['DM_Sans'] text-[13px] font-normal tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(26,21,16,0.08)',
                border: '1.5px solid rgba(26,21,16,0.20)',
                borderRadius: '100px',
                color: '#1A1510'
              }}
            >
              <ImageIcon className="w-5 h-5 mr-3" strokeWidth={1.5} />
              <span>Drop</span>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm font-['Cormorant_Garamond'] italic font-light leading-relaxed"
            style={{ color: 'rgba(26,21,16,0.35)' }}
          >
            Feels like opening a journal, not launching an app
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}