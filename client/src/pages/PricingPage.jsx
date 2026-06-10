import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function PricingPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[var(--color-cream-paper)] flex flex-col items-center justify-center p-6 pt-24 pb-24 overflow-hidden">
      
      {/* Hand-drawn dot grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <motion.div 
        className="relative z-10 text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-[55px] md:text-[64px] tracking-tight text-[var(--color-forest-ink)] leading-none mb-4">
          Simple Pricing
        </h1>
        <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 font-medium">
          Straightforward plans for fast-moving creators.
        </p>
      </motion.div>
      
      <motion.div 
        className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-6 max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Starter Tier */}
        <motion.div variants={itemVariants} className="relative p-10 bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[8px] hover:shadow-[var(--shadow-subtle-2)] transition-shadow group flex flex-col min-h-[450px]">
          <h3 className="text-[12px] font-mono font-bold tracking-widest text-[var(--color-forest-ink)] opacity-70 uppercase mb-4">Starter</h3>
          
          <div className="flex items-end gap-2 mb-12">
            <span className="font-display text-[66px] font-extrabold text-[var(--color-forest-ink)] leading-[0.8]">$0</span>
            <span className="text-[12px] font-mono tracking-widest text-[var(--color-forest-ink)] opacity-60 uppercase pb-1">/Month</span>
          </div>
          
          <p className="text-[16px] text-[var(--color-forest-ink)] mb-8 font-semibold">Free forever for basic rendering</p>
          <ul className="space-y-4 mb-8 text-[15px] text-[var(--color-forest-ink)] opacity-80 font-medium flex-grow">
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-pencil-gray)] shrink-0" />
              <span>5 background removals per month</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-pencil-gray)] shrink-0" />
              <span>Standard processing speed</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-pencil-gray)] shrink-0" />
              <span>1080p resolution exports</span>
            </li>
          </ul>
          
          <button className="w-full py-[14px] px-8 bg-transparent border border-[var(--color-forest-ink)] text-[var(--color-forest-ink)] hover:bg-[var(--color-forest-ink)] hover:text-[var(--color-cream-paper)] font-medium text-[16px] rounded-[6px] transition-colors flex items-center justify-center gap-2">
            Get Started <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Pro Tier (Sticky Note) */}
        <motion.div variants={itemVariants} className="relative p-10 bg-[var(--color-highlighter-yellow)] border border-[var(--color-forest-ink)] shadow-[var(--shadow-subtle-2)] rounded-[4px] transform md:rotate-[2deg] hover:rotate-0 transition-transform group flex flex-col min-h-[450px]">
          
          {/* Hand-drawn circle for the price */}
          <svg className="absolute top-[80px] left-[25px] w-[140px] h-[90px] opacity-20 pointer-events-none" viewBox="0 0 140 90">
            <path d="M 70 5 C 120 5 135 40 135 60 C 135 80 110 85 70 85 C 30 85 5 70 5 45 C 5 20 30 5 70 5" fill="none" stroke="var(--color-forest-ink)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 60 5 C 110 0 130 35 130 55 C 130 75 100 80 60 80 C 20 80 0 65 0 40 C 0 15 20 0 60 5" fill="none" stroke="var(--color-forest-ink)" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <div className="absolute -top-4 right-6 bg-[#244211] text-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transform rotate-[5deg] shadow-sm">
            Most Popular
          </div>

          <h3 className="text-[12px] font-mono font-bold tracking-widest text-[var(--color-forest-ink)] opacity-70 uppercase mb-4">Pro</h3>
          
          <div className="flex items-end gap-2 mb-12 relative z-10">
            <span className="font-display text-[66px] font-extrabold text-[var(--color-forest-ink)] leading-[0.8]">$5</span>
            <span className="text-[12px] font-mono tracking-widest text-[var(--color-forest-ink)] opacity-70 uppercase pb-1">/Month</span>
          </div>
          
          <p className="text-[16px] text-[var(--color-forest-ink)] mb-8 font-semibold">Full GPU power for fast-moving creators</p>
          <ul className="space-y-4 mb-8 text-[15px] text-[var(--color-forest-ink)] opacity-90 font-bold flex-grow relative z-10">
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-forest-ink)] shrink-0" />
              <span>50 background removals per month</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-forest-ink)] shrink-0" />
              <span>Included Cloud Storage for your media</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-forest-ink)] shrink-0" />
              <span>Priority GPU processing queue</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-[var(--color-forest-ink)] shrink-0" />
              <span>4K resolution exports</span>
            </li>
          </ul>

          <button className="w-full py-[14px] px-8 bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] border border-[var(--color-forest-ink)] font-medium text-[16px] rounded-[6px] transition-colors flex items-center justify-center gap-2 relative z-10 shadow-[2px_2px_0px_0px_var(--color-forest-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            Upgrade to Pro <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
