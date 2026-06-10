import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--color-terracotta)] overflow-hidden flex flex-col items-center justify-center py-32 px-4"
         style={{
           backgroundImage: 'repeating-linear-gradient(transparent, transparent 59px, rgba(0,0,0,0.1) 59px, rgba(0,0,0,0.1) 60px)'
         }}>
      
      {/* Top Cards Row */}
      <motion.div 
        className="w-full max-w-[1000px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 md:gap-4 mb-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Top Left Card (Yellow) */}
        <motion.div 
          variants={itemVariants} 
          className="w-[300px] h-[300px] bg-[var(--color-highlighter-yellow)] p-8 shadow-sm flex flex-col items-center text-center transform -rotate-3"
        >
          <div className="w-12 h-12 mb-4 text-[var(--color-forest-ink)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display text-[26px] text-[var(--color-forest-ink)] mb-3">Native Resolution</h3>
          <p className="text-[14px] text-[var(--color-forest-ink)] opacity-90 leading-relaxed font-medium">
            We never downscale your media. You get back the exact resolution you uploaded, preserving every single pixel of your original footage.
          </p>
        </motion.div>

        {/* Top Right Card (Blush) */}
        <motion.div 
          variants={itemVariants} 
          className="w-[300px] h-[300px] bg-[var(--color-sticky-note-blush)] p-8 shadow-sm flex flex-col items-center text-center transform rotate-2 md:mt-12"
        >
          <div className="w-12 h-12 mb-4 text-[var(--color-forest-ink)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="font-display text-[26px] text-[var(--color-forest-ink)] mb-3">Perfect Alpha</h3>
          <p className="text-[14px] text-[var(--color-forest-ink)] opacity-90 leading-relaxed font-medium">
            Download pristine WebM files with true transparency. No more green fringes or clunky chroma-key artifacts.
          </p>
        </motion.div>
      </motion.div>

      {/* Center Heading */}
      <motion.div 
        className="text-center z-20 my-8 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-[50px] md:text-[70px] lg:text-[86px] leading-[1.0] text-[var(--color-cream-paper)] drop-shadow-sm flex flex-col items-center">
          <span className="whitespace-nowrap">Built for flawless</span>
          <span className="relative inline-block whitespace-nowrap mt-2">
            extraction.
            <svg className="absolute w-[105%] h-[40%] bottom-[-15%] left-[-2.5%] text-[var(--color-highlighter-yellow)] -z-10" preserveAspectRatio="none" viewBox="0 0 200 40">
              <path d="M5,20 Q100,5 195,22 Q198,35 192,38 Q100,28 8,35 Q2,30 5,20 Z" fill="currentColor" />
            </svg>
          </span>
        </h2>
      </motion.div>

      {/* Bottom Cards Row */}
      <motion.div 
        className="w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 md:gap-8 mt-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Bottom Left Card (Teal) */}
        <motion.div 
          variants={itemVariants} 
          className="relative w-[300px] h-[300px] bg-[var(--color-sticky-note-teal)] p-8 shadow-sm flex flex-col items-center text-center transform -rotate-6 md:-mt-8"
        >
          {/* Pinned tag */}
          <div className="absolute top-12 -left-6 bg-[var(--color-forest-ink)] text-[var(--color-cream-paper)] text-[10px] font-mono font-bold py-1 px-3 transform -rotate-12 shadow-sm border border-white/20">
            SPEED
          </div>
          
          <div className="w-12 h-12 mb-4 text-[var(--color-forest-ink)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-display text-[26px] text-[var(--color-forest-ink)] mb-3">Lightning Fast</h3>
          <p className="text-[14px] text-[var(--color-forest-ink)] opacity-90 leading-relaxed font-medium">
            Our optimized GPU clusters process footage up to 10x faster than traditional manual rotoscoping tools.
          </p>
        </motion.div>

        {/* Bottom Right Card (Mint) */}
        <motion.div 
          variants={itemVariants} 
          className="w-[300px] h-[300px] bg-[var(--color-sticky-note-mint)] p-8 shadow-sm flex flex-col items-center text-center transform rotate-6"
        >
          <div className="w-12 h-12 mb-4 text-[var(--color-forest-ink)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-display text-[26px] text-[var(--color-forest-ink)] mb-3">Absolute Security</h3>
          <p className="text-[14px] text-[var(--color-forest-ink)] opacity-90 leading-relaxed font-medium">
            Your files never linger on our servers. The moment your video is processed and downloaded, it is permanently purged.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer Text */}
      <motion.div 
        className="text-center mt-24 max-w-[600px] z-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-[15px] text-[var(--color-cream-paper)] opacity-90 font-medium leading-relaxed">
          Starting with raw video and image processing, but we're just getting warmed up.<br/>
          More formats and tailored solutions coming soon.
        </p>
      </motion.div>

    </div>
  );
}
