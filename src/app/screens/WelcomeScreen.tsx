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
      navigate("/voice");
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
            <p className="text-xs tracking-[0.12em] uppercase font-['Outfit'] font-semibold" style={{ color: '#6B6B6B' }}>
              Who are you today?
            </p>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center border font-['DM_Sans'] font-light"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#E8E5E0',
                color: '#0D0D0D'
              }}
            />
          </motion.div>

          {/* Main Prompt */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-['Playfair_Display'] text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em]"
            style={{ color: '#0D0D0D' }}
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
              className="h-14 rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                borderColor: '#0D0D0D',
                color: '#0D0D0D'
              }}
            >
              <Mic className="w-5 h-5 mr-3" strokeWidth={1.5} />
              <span>Voice</span>
            </Button>

            <Button
              onClick={() => handleStart("type")}
              variant="outline"
              className="h-14 rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                borderColor: '#0D0D0D',
                color: '#0D0D0D'
              }}
            >
              <Type className="w-5 h-5 mr-3" strokeWidth={1.5} />
              <span>Type</span>
            </Button>

            <Button
              onClick={() => handleStart("drop")}
              variant="outline"
              className="h-14 rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                borderColor: '#0D0D0D',
                color: '#0D0D0D'
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
            style={{ color: '#A8A49E' }}
          >
            Feels like opening a journal, not launching an app
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}