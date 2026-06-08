import { motion } from 'framer-motion';

export default function ApiPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          GhostFrame API
        </motion.h1>
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 text-sm font-medium text-[#a855f7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Coming Soon
        </motion.div>
        <motion.p 
          className="mt-8 text-zinc-400 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          We're finalizing our developer API to let you integrate GhostFrame's powerful background removal directly into your own apps and pipelines.
        </motion.p>
      </motion.div>
    </div>
  );
}
