import { motion } from "motion/react";

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #E8F4F8 0%, #F7F5F0 25%, #E3F2FD 50%, #F7F5F0 75%, #E8F4F8 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating gradient blob 1 */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(circle, #D6E9F5 0%, transparent 70%)',
        }}
        animate={{
          x: ['-10%', '110%'],
          y: ['20%', '80%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
        }}
      />

      {/* Floating gradient blob 2 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, #E3F2FD 0%, transparent 70%)',
        }}
        animate={{
          x: ['100%', '-10%'],
          y: ['60%', '10%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
        }}
      />

      {/* Floating gradient blob 3 */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, #F0F8FF 0%, transparent 70%)',
        }}
        animate={{
          x: ['50%', '30%'],
          y: ['-20%', '100%'],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
        }}
      />

      {/* Floating gradient blob 4 - subtle cream */}
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #FFF9F0 0%, transparent 70%)',
        }}
        animate={{
          x: ['80%', '20%'],
          y: ['70%', '30%'],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
        }}
      />

      {/* Very subtle overlay for depth */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(247, 245, 240, 0.3) 100%)',
        }}
      />
    </div>
  );
}
