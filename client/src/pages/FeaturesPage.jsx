import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function FeaturesPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0a0a0a] flex items-center justify-center p-6 pt-24 pb-24 overflow-hidden">
      <motion.div 
        className="text-center max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-8">Enterprise-Grade Features</h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-16 max-w-3xl mx-auto">
          GhostFrame uses state-of-the-art machine learning models to rotoscope your subjects with pixel-perfect accuracy. Stop wasting hours in AfterEffects masking frame by frame.
        </p>
        <motion.div 
          className="grid md:grid-cols-2 gap-6 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-[#131416] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Zap className="w-10 h-10 text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Native Resolution</h3>
            <p className="text-zinc-400 leading-relaxed">We never downscale your media. You get back the exact resolution you uploaded, preserving every single pixel of your original footage.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-[#131416] border border-white/[0.05] hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <h3 className="text-2xl font-medium text-white mb-3">Perfect Alpha Channels</h3>
            <p className="text-zinc-400 leading-relaxed">Download pristine WebM files with true transparency. No more green fringes or clunky chroma-key artifacts.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-[#131416] border border-white/[0.05] hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <h3 className="text-2xl font-medium text-white mb-3">Lightning Fast</h3>
            <p className="text-zinc-400 leading-relaxed">Our optimized GPU clusters process footage up to 10x faster than traditional manual rotoscoping tools.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-[#131416] border border-white/[0.05] hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <h3 className="text-2xl font-medium text-white mb-3">Absolute Security</h3>
            <p className="text-zinc-400 leading-relaxed">Your files never linger on our servers. The moment your video is processed and downloaded, it is permanently purged.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
