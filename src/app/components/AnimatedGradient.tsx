import { motion } from "motion/react";

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layer — sky palette */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #EEF5F8 0%, #C8DCE8 30%, #D8DEC8 60%, #C8DCE8 80%, #EEF5F8 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Blob 1 — deep teal */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.35]"
        style={{
          background: 'radial-gradient(circle, rgba(42,95,118,0.58) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
        animate={{
          x: ['-5%', '60%', '-5%'],
          y: ['15%', '65%', '15%'],
          scale: [0.92, 1.08, 0.92],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 — mid teal */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.30]"
        style={{
          background: 'radial-gradient(circle, rgba(60,125,150,0.45) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
        animate={{
          x: ['70%', '10%', '70%'],
          y: ['50%', '10%', '50%'],
          scale: [1.0, 0.92, 1.0],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 3 — meadow glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.20]"
        style={{
          background: 'radial-gradient(circle, rgba(190,205,165,0.30) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
        animate={{
          x: ['40%', '20%', '40%'],
          y: ['-10%', '80%', '-10%'],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 4 — warm earth accent */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(196,149,122,0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
        animate={{
          x: ['65%', '25%', '65%'],
          y: ['60%', '30%', '60%'],
          scale: [1.0, 0.94, 1.0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(238,245,248,0.3) 100%)',
        }}
      />
    </div>
  );
}
