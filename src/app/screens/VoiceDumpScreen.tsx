import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";

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
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#1A1A1A' }}>
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
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </motion.div>

      <div className="w-full max-w-4xl space-y-16 text-center">
        {/* Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-['Playfair_Display'] text-6xl tracking-[-0.02em]"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        {/* Pulsing Circle */}
        <div className="relative flex items-center justify-center h-80">
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ backgroundColor: '#F5E642' }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{ backgroundColor: '#F5C4A1' }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{ backgroundColor: '#FFFFFF' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />

          {/* Waveform visualization */}
          <div className="absolute bottom-0 flex items-end justify-center gap-1 h-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                animate={{
                  height: [
                    `${Math.random() * 40 + 20}%`,
                    `${Math.random() * 60 + 30}%`,
                    `${Math.random() * 40 + 20}%`,
                  ],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Hint Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm font-['Cormorant_Garamond'] italic font-light"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          Walk around. Best ideas come when you move.
        </motion.p>

        {/* Live Transcript */}
        <div className="space-y-3 min-h-[200px] font-['DM_Sans'] font-light" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          {transcript.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}
