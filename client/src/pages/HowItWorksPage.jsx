import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const stepVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function HowItWorksPage() {
  return (
    <div 
      className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-6 pt-24 pb-32 overflow-hidden bg-[var(--color-terracotta)] relative z-0"
      style={{
        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, rgba(255,255,255,0.2) 31px, rgba(255,255,255,0.2) 32px)`,
        backgroundAttachment: 'local'
      }}
    >
      <div className="absolute top-0 left-10 bottom-0 w-[2px] bg-red-900/30 z-0"></div>

      <div className="max-w-3xl w-full relative z-10">
        <motion.div 
          className="text-center mb-24 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block relative">
            <h1 className="font-display text-[55px] md:text-[80px] tracking-tight text-[var(--color-forest-ink)] mb-4 leading-none relative z-10">
              How it Works
            </h1>
            <svg className="absolute w-[110%] h-[120%] top-[-10%] left-[-5%] text-[var(--color-highlighter-yellow)] -z-10" preserveAspectRatio="none" viewBox="0 0 200 100">
              <path d="M5,20 Q100,5 195,18 Q198,50 193,85 Q100,95 8,82 Q3,50 5,20 Z" fill="currentColor" />
            </svg>
          </div>
          <p className="text-[18px] text-[var(--color-cream-paper)] opacity-90 font-medium font-mono mt-4">
            It's practically magic, but really it's just heavy mathematics.
          </p>
        </motion.div>
        
        <motion.div 
          className="relative space-y-16 md:space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hand-drawn connecting arrows */}
          <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-full pointer-events-none hidden md:block z-0" viewBox="0 0 200 800" preserveAspectRatio="none">
            <path d="M 100 150 Q 150 250 100 350" fill="none" stroke="var(--color-forest-ink)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />
            <path d="M 100 350 L 95 340 M 100 350 L 110 345" fill="none" stroke="var(--color-forest-ink)" strokeWidth="3" strokeLinecap="round" />
            
            <path d="M 100 450 Q 50 550 100 650" fill="none" stroke="var(--color-forest-ink)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />
            <path d="M 100 650 L 90 640 M 100 650 L 105 645" fill="none" stroke="var(--color-forest-ink)" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {/* Step 1 */}
          <motion.div variants={stepVariants} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-start">
            <div className="w-full md:w-[400px] p-8 bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-[4px] shadow-[4px_4px_0px_0px_var(--color-forest-ink)] transform -rotate-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-black/10 shadow-sm mix-blend-multiply transform rotate-1"></div>
              <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-forest-ink)] text-[var(--color-cream-paper)] text-[20px] font-bold">1</span>
                Upload Media
              </h3>
              <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 font-medium">
                Drop your raw files into our bucket. No green screen required, no complex lighting setups needed.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={stepVariants} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-end">
            <div className="w-full md:w-[400px] p-8 bg-[var(--color-sticky-note-blush)] border border-[var(--color-forest-ink)] rounded-[4px] shadow-[4px_4px_0px_0px_var(--color-forest-ink)] transform rotate-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-black/10 shadow-sm mix-blend-multiply transform -rotate-1"></div>
              <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-forest-ink)] text-[var(--color-cream-paper)] text-[20px] font-bold">2</span>
                AI Processing
              </h3>
              <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 font-medium">
                Our massive GPU cluster analyzes every single frame, identifying human subjects and rotoscoping them out.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={stepVariants} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-start">
            <div className="w-full md:w-[400px] p-8 bg-[var(--color-sticky-note-teal)] border border-[var(--color-forest-ink)] rounded-[4px] shadow-[4px_4px_0px_0px_var(--color-forest-ink)] transform -rotate-1 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-black/10 shadow-sm mix-blend-multiply transform rotate-2"></div>
              <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-forest-ink)] text-[var(--color-cream-paper)] text-[20px] font-bold">3</span>
                Export
              </h3>
              <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 font-medium">
                Grab your pristine, fully transparent WebM file and drop it right into Premiere Pro, CapCut, or AfterEffects.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
