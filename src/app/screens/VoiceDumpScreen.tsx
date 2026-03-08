import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X, Mic } from "lucide-react";
import { Button } from "../components/ui/button";
import cloudImage from 'figma:asset/3c7af6a14225d1ee2a77d186872f69245c52483a.png';

export function VoiceDumpScreen() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(true);

  // Mock transcript generation
  useEffect(() => {
    const transcriptLines = [
      "I really need to get that blog started...",
      "Maybe I should write about my morning routine",
      "Work has been stressful lately, deadlines everywhere",
      "The side hustle idea keeps coming back to me",
      "I feel blocked creatively, need to push through",
      "Should I focus more on the blog or the day job?",
      "Morning walks really help me think clearly",
      "That creative block is frustrating",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < transcriptLines.length && isRecording) {
        setTranscript((prev) => [...prev, transcriptLines[index]]);
        index++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsRecording(false);
      setTimeout(() => navigate("/cluster"), 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: '#F7F5F0' }}>
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
          style={{ color: '#0D0D0D' }}
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-['Lora'] text-4xl tracking-[-0.01em]"
            style={{ color: '#0D0D0D' }}
          >
            Let your thoughts flow...
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E8E5E0' }}>
              <Mic className="w-5 h-5 text-red-500 animate-pulse" strokeWidth={1.5} />
              <span className="font-['Outfit'] font-semibold text-sm tracking-[0.08em] uppercase" style={{ color: '#0D0D0D' }}>
                Recording
              </span>
            </div>
            <div className="font-['Playfair_Display'] text-3xl tracking-[-0.02em]" style={{ color: '#0D0D0D' }}>
              {formatTime(timeLeft)}
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="relative h-[70vh]">
          {/* Central cloud with pulsing animation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img 
                src={cloudImage} 
                alt="" 
                className="w-96 h-60 object-contain opacity-90"
              />
              {/* Yellow tint overlay */}
              <div 
                className="absolute inset-0 mix-blend-multiply opacity-30"
                style={{ 
                  backgroundColor: '#F5E642',
                  WebkitMaskImage: `url(${cloudImage})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url(${cloudImage})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
              
              {/* Mic icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Mic className="w-12 h-12" strokeWidth={1.5} style={{ color: '#0D0D0D' }} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Floating transcript clouds */}
          {transcript.map((line, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: Math.random() < 0.5 ? -100 : window.innerWidth,
                y: Math.random() * 500,
              }}
              animate={{
                opacity: [0, 1, 0.7],
                x: Math.random() * (window.innerWidth - 400) + 100,
                y: Math.random() * 500 + 50,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
              className="absolute max-w-xs"
            >
              <div className="relative">
                <img 
                  src={cloudImage} 
                  alt="" 
                  className="w-64 h-40 object-contain opacity-80"
                />
                {/* Color tint - varies by index */}
                <div 
                  className="absolute inset-0 mix-blend-multiply opacity-25"
                  style={{ 
                    backgroundColor: ['#C8D5B0', '#F0D5D0', '#F5C4A1'][i % 3],
                    WebkitMaskImage: `url(${cloudImage})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: `url(${cloudImage})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                  }}
                />
                {/* Text on cloud */}
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <p className="text-sm font-['DM_Sans'] font-light text-center leading-relaxed" style={{ color: '#0D0D0D' }}>
                    {line}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hint Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-12"
        >
          <p className="text-sm font-['Cormorant_Garamond'] italic font-light" style={{ color: '#6B6B6B' }}>
            Walk around. Best ideas come when you move.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
