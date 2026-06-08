import { ArrowUpRight } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-6 pt-24 pb-24 overflow-hidden">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">Pricing</h1>
        <p className="text-zinc-400 text-lg">Simple, transparent plans for every creator.</p>
      </motion.div>
      
      <motion.div 
        className="grid md:grid-cols-2 gap-4 max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Starter Tier */}
        <motion.div variants={itemVariants} className="relative p-10 bg-black border border-white hover:bg-white/[0.03] transition-colors group flex flex-col min-h-[450px] cursor-pointer">
          <h3 className="text-sm tracking-widest text-zinc-300 uppercase mb-2">Starter</h3>
          <div className="flex items-end gap-2 mb-16">
            <span className="text-6xl md:text-7xl font-light text-white leading-none">$0</span>
            <span className="text-xs tracking-widest text-zinc-400 uppercase pb-2">/Month</span>
          </div>
          
          <p className="text-sm text-zinc-300 mb-6 font-medium">Short-term trial for beginners</p>
          <ul className="space-y-2 mb-8 text-sm text-zinc-400 flex-grow">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>5 background removals per month</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>Standard processing speed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>1080p resolution exports</span>
            </li>
          </ul>
          
          <div className="absolute bottom-8 right-8 opacity-40 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-8 h-8 text-white stroke-[1.5]" />
          </div>
        </motion.div>

        {/* Pro Tier */}
        <motion.div variants={itemVariants} className="relative p-10 bg-black border border-white hover:bg-white/[0.03] transition-colors group flex flex-col min-h-[450px] cursor-pointer">
          <h3 className="text-sm tracking-widest text-zinc-300 uppercase mb-2">Pro</h3>
          <div className="flex items-end gap-2 mb-16">
            <span className="text-6xl md:text-7xl font-light text-white leading-none">$5</span>
            <span className="text-xs tracking-widest text-zinc-400 uppercase pb-2">/Month</span>
          </div>
          
          <p className="text-sm text-zinc-300 mb-6 font-medium">Explore the basics with this advanced plan</p>
          <ul className="space-y-2 mb-8 text-sm text-zinc-400 flex-grow">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>50 background removals per month</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></div>
              <span>Included Cloud Storage for your media</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>Priority GPU processing queue</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 bg-zinc-500 mt-2 rounded-none shrink-0"></span>
              <span>4K resolution exports</span>
            </li>
          </ul>

          <div className="absolute bottom-8 right-8 opacity-40 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-8 h-8 text-white stroke-[1.5]" />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
