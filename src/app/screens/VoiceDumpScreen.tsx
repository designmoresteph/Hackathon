import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { X, Mic } from "lucide-react";
import { Button } from "../components/ui/button";
import { useVoiceCapture } from "../hooks/useVoiceCapture";
import { saveEntry } from "../lib/storage";
import type { TranscriptSegment, Entry } from "../lib/types";
import { toast, Toaster } from "sonner";
import cloudImage from '../../assets/3c7af6a14225d1ee2a77d186872f69245c52483a.png';

const DURATION_PRESETS = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
];

export function VoiceDumpScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userName = searchParams.get("name") ?? undefined;
  const initialDuration = searchParams.get("duration")
    ? Number(searchParams.get("duration"))
    : 600;

  const entryId = useMemo(() => crypto.randomUUID(), []);

  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [durationSeconds, setDurationSeconds] = useState(initialDuration);
  const [customMinutes, setCustomMinutes] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const hasSavedRef = useRef(false);

  const onSegment = useCallback((segment: TranscriptSegment) => {
    setSegments((prev) => [...prev, segment]);
  }, []);

  const onError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  const { isRecording, startRecording, stopRecording } = useVoiceCapture({
    onSegment,
    onError,
  });

  // Save entry and navigate to clustering
  const saveAndNavigate = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    // Use the ref-based approach to get the latest segments
    setSegments((currentSegments) => {
      const entry: Entry = {
        id: entryId,
        createdAt: new Date().toISOString(),
        durationSeconds,
        transcript: currentSegments,
        fullText: currentSegments.map((s) => s.text).join(" "),
        userName,
      };
      saveEntry(entry);
      return currentSegments;
    });

    stopRecording();
    setTimeout(() => navigate(`/cluster?entryId=${entryId}`), 1000);
  }, [entryId, durationSeconds, userName, stopRecording, navigate]);

  // Timer countdown (only runs when recording)
  useEffect(() => {
    if (isConfiguring || !isRecording) return;

    if (timeLeft <= 0) {
      saveAndNavigate();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isConfiguring, isRecording, saveAndNavigate]);

  const handleStartRecording = async () => {
    setIsConfiguring(false);
    setTimeLeft(durationSeconds);
    await startRecording();
  };

  const handleSelectPreset = (seconds: number) => {
    setDurationSeconds(seconds);
    setCustomMinutes("");
  };

  const handleCustomMinutesChange = (value: string) => {
    setCustomMinutes(value);
    const num = Number(value);
    if (num > 0) {
      setDurationSeconds(num * 60);
    }
  };

  const handleDone = () => {
    saveAndNavigate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Pre-recording configuration screen
  if (isConfiguring) {
    return (
      <div className="min-h-screen p-8 relative overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: '#F7F5F0' }}>
        <Toaster position="top-center" />

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-10 text-center"
        >
          <h2
            className="font-['Lora'] text-4xl tracking-[-0.01em]"
            style={{ color: '#0D0D0D' }}
          >
            How long do you want to talk?
          </h2>

          {/* Duration presets */}
          <div className="flex flex-wrap gap-3 justify-center">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => handleSelectPreset(preset.seconds)}
                className="px-6 py-3 rounded-full font-['Outfit'] font-semibold text-sm tracking-[0.06em] uppercase transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: durationSeconds === preset.seconds && customMinutes === "" ? '#F5E642' : 'transparent',
                  border: '1.5px solid',
                  borderColor: durationSeconds === preset.seconds && customMinutes === "" ? '#F5E642' : '#E8E5E0',
                  color: '#0D0D0D',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom minutes input */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-['DM_Sans'] text-sm" style={{ color: '#6B6B6B' }}>
              or
            </span>
            <input
              type="number"
              min="1"
              max="60"
              placeholder="Custom"
              value={customMinutes}
              onChange={(e) => handleCustomMinutesChange(e.target.value)}
              className="w-24 px-4 py-2 rounded-full text-center font-['DM_Sans'] text-sm border outline-none focus:ring-2 focus:ring-[#F5E642]"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8E5E0',
                color: '#0D0D0D',
              }}
            />
            <span className="font-['DM_Sans'] text-sm" style={{ color: '#6B6B6B' }}>
              min
            </span>
          </div>

          {/* Start Recording button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleStartRecording}
              className="w-full h-14 rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: '#F5E642',
                color: '#0D0D0D',
                border: 'none',
              }}
            >
              Start Recording
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm font-['Cormorant_Garamond'] italic font-light"
            style={{ color: '#6B6B6B' }}
          >
            Walk around. Best ideas come when you move.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Recording screen
  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: '#F7F5F0' }}>
      <Toaster position="top-center" />

      {/* Cancel Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 right-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            stopRecording();
            navigate("/");
          }}
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
            {/* Done button */}
            <button
              onClick={handleDone}
              className="px-6 py-3 rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: '#0D0D0D',
                color: '#FFFFFF',
              }}
            >
              Done
            </button>
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
          {segments.map((segment, i) => (
            <motion.div
              key={segment.id}
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
                    {segment.text}
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
