import { motion } from 'framer-motion';

export default function ApiPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[var(--color-cream-paper)] flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Subtle Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <motion.div 
        className="relative z-10 p-12 bg-[var(--color-highlighter-yellow)] border border-[var(--color-forest-ink)] shadow-[4px_4px_0px_0px_var(--color-forest-ink)] rounded-[4px] transform -rotate-2 max-w-xl text-center"
        initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Taped top edge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-sm border border-[var(--color-pencil-gray)]/50 shadow-sm z-30 transform rotate-3 mix-blend-multiply"></div>

        <motion.h1 
          className="font-display text-[48px] md:text-[64px] tracking-tight text-[var(--color-forest-ink)] mb-4 leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          API
        </motion.h1>

        <motion.div 
          className="inline-block border-2 border-[var(--color-forest-ink)] rounded-full px-4 py-1 mb-6 transform rotate-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-mono text-[14px] font-bold tracking-widest uppercase text-[var(--color-forest-ink)]">
            Coming Soon
          </span>
        </motion.div>

        <motion.p 
          className="mt-4 text-[18px] text-[var(--color-forest-ink)] font-medium max-w-md mx-auto leading-[1.5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          We're finalizing our developer API to let you integrate GhostFrame's powerful background removal directly into your own apps and pipelines. Check back soon.
        </motion.p>
      </motion.div>
    </div>
  );
}
