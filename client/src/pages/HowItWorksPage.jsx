import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const stepVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-2xl w-full">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">How it Works</h1>
          <p className="text-zinc-400 text-lg">It's practically magic, but really it's just heavy mathematics.</p>
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={stepVariants} className="flex gap-6 md:gap-8 items-start relative z-10">
            <div className="shrink-0 w-16 h-16 bg-[#131416] border border-white/10 flex items-center justify-center font-bold text-2xl text-purple-400 mt-1 shadow-[0_0_30px_rgba(168,85,247,0.1)]">01</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Upload Media</h3>
              <p className="text-zinc-400 leading-relaxed">Upload your raw media. No green screen required, no complex lighting setups needed.</p>
            </div>
          </motion.div>
          <motion.div variants={stepVariants} className="p-6 rounded-2xl bg-[#131416] border border-white/[0.05] hover:border-white/10 transition-colors flex gap-6 items-start">
            <div className="text-3xl font-bold text-[#a855f7] pt-1">2</div>
            <div>
              <h3 className="text-2xl font-medium text-white mb-2">AI Processing</h3>
              <p className="text-zinc-400 leading-relaxed">Our massive GPU cluster analyzes every frame, identifying human subjects and perfectly extracting them from their background.</p>
            </div>
          </motion.div>
          <motion.div variants={stepVariants} className="p-6 rounded-2xl bg-[#131416] border border-white/[0.05] hover:border-white/10 transition-colors flex gap-6 items-start">
            <div className="text-3xl font-bold text-[#10b981] pt-1">3</div>
            <div>
              <h3 className="text-2xl font-medium text-white mb-2">Instant Download</h3>
              <p className="text-zinc-400 leading-relaxed">Grab your pristine, fully transparent WebM file and drop it right into Premiere Pro, CapCut, or AfterEffects.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
