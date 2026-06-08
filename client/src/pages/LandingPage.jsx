import { Link } from 'react-router-dom';
import { Workflow, ShieldCheck, Zap } from 'lucide-react'; 
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

function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center overflow-hidden w-full bg-[#0a0a0a] font-sans selection:bg-purple-500/30">
      
      {/* Original GhostFrame Dot Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)',
             backgroundSize: '30px 30px',
             maskImage: 'radial-gradient(ellipse 80% 80% at 50% 10%, black 50%, transparent 100%)',
             WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 10%, black 50%, transparent 100%)'
           }}>
      </div>

      {/* Hero Section */}
      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131416] border border-white/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">GhostFrame V2.0 IS NOW LIVE</span>
        </motion.div>
        
        {/* Main Heading */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl lg:text-[4.75rem] font-medium tracking-tight text-white leading-[1.15] mb-6 max-w-5xl mx-auto">
            Erase <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #a855f7' }}>video & image</span><br className="hidden md:block" />
            backgrounds for fast-moving<br className="hidden md:block" />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #a855f7' }}>creators</span>
          </h1>
        </motion.div>
        
        {/* Subheading */}
        <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Replace your green screens with the AI solution<br className="hidden md:block" /> that's easy to use and loved by creators and editors.
        </motion.p>
        
        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/upload" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium rounded hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
              Start processing for free
            </button>
          </Link>
          <Link to="/how-it-works" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 text-white font-medium rounded border border-white/20 hover:bg-white/5 transition-colors cursor-pointer">
              Read the Docs
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Trusted By / Logos Section */}
      <motion.div 
        className="w-full border-y border-white/[0.05] py-10 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase mb-8">Perfect for your workflow</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            {/* Minimalist text representations of tools */}
            <span className="text-xl font-bold tracking-tighter text-white">Premiere Pro</span>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1"><Zap className="w-5 h-5"/> CapCut</span>
            <span className="text-xl font-bold text-white">YouTube</span>
            <span className="text-xl font-bold tracking-widest text-white italic">TikTok</span>
            <span className="text-xl font-bold text-white tracking-tighter">DaVinci</span>
            <span className="text-xl font-bold text-white tracking-widest">AE</span>
          </div>
        </div>
      </motion.div>

      {/* How it Works Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-32 flex-grow">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Flawless Extraction</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
            Upload your video or image and let our cloud AI handle the rest.<br className="hidden md:block" /> No complex software required, it just works.
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="group p-8 rounded-none bg-[#131416] border border-white/[0.05] hover:border-[#a855f7]/30 transition-colors flex flex-col h-full cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded bg-black border border-white/10 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Upload</h3>
            <p className="text-zinc-400 text-sm leading-relaxed"><strong className="text-zinc-200">Drag</strong> and drop your raw media files into our secure vault.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="group p-8 rounded-none bg-[#131416] border border-white/[0.05] hover:border-[#a855f7]/30 transition-colors flex flex-col h-full cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded bg-black border border-white/10 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white transition-colors">
              <Workflow className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Process</h3>
            <p className="text-zinc-400 text-sm leading-relaxed"><strong className="text-zinc-200">Wait</strong> while our neural networks automatically rotoscope every frame.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="group p-8 rounded-none bg-[#131416] border border-white/[0.05] hover:border-[#a855f7]/30 transition-colors flex flex-col h-full cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded bg-black border border-white/10 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Download</h3>
            <p className="text-zinc-400 text-sm leading-relaxed"><strong className="text-zinc-200">Grab</strong> your high-quality transparent WebM file instantly.</p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}

export default LandingPage;
