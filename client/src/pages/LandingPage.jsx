import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react'; 
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden w-full bg-[var(--color-cream-paper)] pb-24">
      
      {/* Hero Section Container */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* Decorative Sketch Elements (Bottom Left and Right of Hero) */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-between items-end pb-0 px-10 overflow-hidden max-h-[600px]">
          {/* Bottom Left Sketch (Goals Note) */}
          <div className="relative w-64 h-64 -ml-16">
            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-[var(--color-highlighter-yellow)] rounded-full z-0"></div>
            <div className="absolute bottom-0 left-10 transform -rotate-[25deg] z-10 w-[200px] h-[250px]">
              <svg width="200" height="250" viewBox="0 0 200 250" fill="none" stroke="var(--color-forest-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0">
                <rect x="20" y="20" width="160" height="210" rx="4" fill="var(--color-cream-paper)" />
                <path d="M30 45 Q 100 40 170 50" strokeWidth="1" opacity="0.3" />
                <path d="M30 90 Q 100 85 170 95" strokeWidth="1" opacity="0.3" />
                <path d="M30 135 Q 100 130 170 140" strokeWidth="1" opacity="0.3" />
                <path d="M30 180 Q 100 175 170 185" strokeWidth="1" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 px-10 py-10 text-[var(--color-forest-ink)] font-display flex flex-col gap-6">
                <span className="text-[18px] font-bold tracking-wide -ml-2">Our Focus:</span>
                <div className="flex flex-col gap-4 text-[15px] font-mono font-bold tracking-tight">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />
                    <span>Speed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />
                    <span>Accuracy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />
                    <span>Privacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Sketch (Code snippet note) */}
          <div className="relative w-64 h-64 -mr-10">
            <div className="absolute -bottom-10 right-0 transform rotate-[15deg] w-[220px] h-[280px] z-10">
              <svg width="220" height="280" viewBox="0 0 220 280" fill="none" stroke="var(--color-forest-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0">
                <rect x="20" y="20" width="180" height="240" rx="4" fill="var(--color-cream-paper)" />
                <path d="M30 50 Q 110 45 190 55" strokeWidth="1" opacity="0.3" />
                <path d="M30 85 Q 110 80 190 90" strokeWidth="1" opacity="0.3" />
                <path d="M30 120 Q 110 115 190 125" strokeWidth="1" opacity="0.3" />
                <path d="M30 155 Q 110 150 190 160" strokeWidth="1" opacity="0.3" />
                <path d="M30 190 Q 110 185 190 195" strokeWidth="1" opacity="0.3" />
                <path d="M30 225 Q 110 220 190 230" strokeWidth="1" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 px-10 py-10 text-[var(--color-forest-ink)] font-mono text-[12px] flex flex-col gap-2 font-semibold">
                <span className="text-[18px] font-display mb-1 tracking-wide">Developer API</span>
                <span>{`await ghost.run({`}</span>
                <span className="text-[#8a9c7b] pl-4">{`media: raw_4k,`}</span>
                <span className="text-[#8a9c7b] pl-4">{`mode: 'fast'`}</span>
                <span>{`});`}</span>
                <span className="mt-4 text-[10px] text-[var(--color-terracotta)] italic">{`// flawless.`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 pt-32 text-center flex flex-col items-center justify-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
          
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-[4px] bg-[var(--color-highlighter-yellow)] mb-10 overflow-hidden border border-[var(--color-highlighter-yellow)]">
            <div className="bg-[#244211] p-1.5 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="px-3 text-[11px] font-mono font-medium text-[var(--color-forest-ink)] tracking-wider uppercase">
              GhostFrame V2.0 - built for creative agencies
            </span>
          </motion.div>
          
          {/* Main Display Heading */}
          <motion.div variants={itemVariants} className="mb-6 max-w-[1000px] mx-auto w-full">
            <h1 className="font-display text-[48px] md:text-[64px] lg:text-[84px] leading-[1.05] text-[var(--color-forest-ink)] flex flex-col items-center">
              <span className="whitespace-nowrap">
                Erase <span className="relative inline-block mx-1">
                  <span className="relative z-10">video & image</span>
                  <svg className="absolute w-[104%] h-[110%] top-[-5%] left-[-2%] text-[var(--color-highlighter-yellow)] -z-10" preserveAspectRatio="none" viewBox="0 0 200 100">
                    <path d="M3,18 Q100,2 196,15 Q199,50 194,88 Q100,98 6,85 Q1,50 3,18 Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
              <span className="whitespace-nowrap mt-2">backgrounds instantly.</span>
            </h1>
          </motion.div>
          
          {/* Subheading Paragraph */}
          <motion.p variants={itemVariants} className="text-[20px] md:text-[22px] font-medium text-[var(--color-forest-ink)] max-w-[780px] mx-auto mb-10 leading-[1.5]">
            Replace your green screens with our AI pipeline. No complex software, no massive RAM usage. Just raw rendering power for fast-moving creators.
          </motion.p>
          
          {/* Action Stack */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Link to="/upload" className="w-full sm:w-auto">
                <button className="bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[8px] py-[14px] px-8 text-[16px] font-medium shadow-sm w-full">
                  Start processing for free →
                </button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <button className="bg-transparent border border-[var(--color-pencil-gray)] hover:bg-black/5 text-[var(--color-forest-ink)] transition-colors rounded-[8px] py-[14px] px-8 text-[16px] font-medium shadow-sm w-full">
                  Read the Docs
                </button>
              </Link>
            </div>
            <span className="text-[12px] text-[var(--color-pencil-gray)] font-mono tracking-wide">no credit card required.</span>
          </motion.div>

        </motion.div>
      </div>

      </div> {/* End Hero Section Container */}

      {/* Backed By Logo Strip */}
      <motion.div 
        className="w-full max-w-[1000px] mx-auto px-6 mt-16 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="text-[11px] text-[var(--color-forest-ink)] font-mono tracking-wide opacity-80">Seamlessly Integrates With:</span>
        <div className="flex flex-wrap items-center justify-center gap-8 text-[var(--color-forest-ink)] opacity-90">
          <span className="text-[14px] font-black tracking-tight">Premiere Pro</span>
          <span className="text-[16px] font-bold tracking-tight italic">CapCut</span>
          <span className="text-[14px] font-semibold tracking-wide">YouTube</span>
          <span className="text-[16px] font-bold tracking-wide italic">TikTok</span>
          <span className="text-[14px] font-black tracking-tight">DaVinci</span>
        </div>
      </motion.div>

      {/* Empty Space for the sketch to be visible */}
      <div className="h-[100px] w-full"></div>

      {/* Features Grid (Sticky Note Cards) */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-24 pb-24 border-t border-[var(--color-pencil-gray)]/30 mt-12">
        
        <div className="text-center mb-16">
          <h2 className="font-display text-[40px] text-[var(--color-forest-ink)] mb-4">Flawless Extraction</h2>
          <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 max-w-[600px] mx-auto leading-[1.5]">
            Upload your media and let our decoupled AWS pipeline handle the rest.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Mint */}
          <motion.div variants={itemVariants} className="sticky-card bg-[var(--color-sticky-note-mint)] group">
            <div className="w-12 h-12 rounded-full bg-[var(--color-forest-ink)] flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-[var(--color-cream-paper)]" />
            </div>
            <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-3">Direct Upload</h3>
            <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 leading-[1.5]">
              Bypass the server. Send your massive raw media files securely and directly into our S3 storage vault.
            </p>
          </motion.div>

          {/* Card 2: Blush */}
          <motion.div variants={itemVariants} className="sticky-card bg-[var(--color-sticky-note-blush)] group">
            <div className="w-12 h-12 rounded-full bg-[var(--color-forest-ink)] flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-[var(--color-cream-paper)]" />
            </div>
            <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-3">AI Rotoscoping</h3>
            <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 leading-[1.5]">
              Scale infinitely. Our worker nodes pull your file and automatically rotoscope every single frame.
            </p>
          </motion.div>

          {/* Card 3: Teal */}
          <motion.div variants={itemVariants} className="sticky-card bg-[var(--color-sticky-note-teal)] group">
            <div className="w-12 h-12 rounded-full bg-[var(--color-forest-ink)] flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-[var(--color-cream-paper)]" />
            </div>
            <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-3">Secure Delivery</h3>
            <p className="text-[16px] text-[var(--color-forest-ink)] opacity-90 leading-[1.5]">
              Zero bottlenecks. Grab your high-quality transparent WebM instantly from the CDN via Pre-Signed URL.
            </p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}

export default LandingPage;
