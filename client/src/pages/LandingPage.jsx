import { Link } from 'react-router-dom';
import { Sparkles, UploadCloud, Wand2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

// Card config keeps the grid DRY and lets each note feel hand-placed
const features = [
  {
    icon: UploadCloud,
    bg: 'var(--color-sticky-note-mint)',
    rotate: '-rotate-2',
    title: 'Direct Upload',
    body: 'Bypass the server. Send your massive raw media files securely and directly into our S3 storage vault.'
  },
  {
    icon: Wand2,
    bg: 'var(--color-sticky-note-blush)',
    rotate: 'rotate-1',
    title: 'AI Rotoscoping',
    body: 'Scale infinitely. Our worker nodes pull your file and automatically rotoscope every single frame.'
  },
  {
    icon: ShieldCheck,
    bg: 'var(--color-sticky-note-teal)',
    rotate: '-rotate-1',
    title: 'Secure Delivery',
    body: 'Zero bottlenecks. Grab your high-quality transparent WebM instantly from the CDN via Pre-Signed URL.'
  }
];

function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden w-full bg-[var(--color-cream-paper)] pb-24">

      {/* Subtle paper grain / dot grid backdrop */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-pencil-gray) 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Hero Section Container */}
      <div className="relative w-full flex flex-col items-center">

        {/* Decorative sketches: hidden below lg to avoid overlapping hero text */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden lg:flex justify-between items-end pb-0 px-10 overflow-hidden max-h-[600px]">
          {/* Bottom Left Sketch (Goals Note) */}
          <motion.div
            className="relative w-64 h-64 -ml-16"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-[var(--color-highlighter-yellow)] rounded-full z-0 blur-[1px]"></div>
            <div className="absolute bottom-0 left-10 transform -rotate-[25deg] z-10 w-[200px] h-[250px] drop-shadow-md">
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
                  {['Speed', 'Accuracy', 'Privacy'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Right Sketch (Code snippet note) */}
          <motion.div
            className="relative w-64 h-64 -mr-10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <div className="absolute -bottom-10 right-0 transform rotate-[15deg] w-[220px] h-[280px] z-10 drop-shadow-md">
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
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 pt-24 md:pt-32 text-center flex flex-col items-center justify-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center">

            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full bg-[var(--color-highlighter-yellow)] mb-10 overflow-hidden border border-[var(--color-forest-ink)]/15 shadow-[2px_2px_0_rgba(0,0,0,0.08)]">
              <div className="bg-[#244211] py-1.5 px-2.5 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="px-3 text-[11px] font-mono font-medium text-[var(--color-forest-ink)] tracking-wider uppercase">
                GhostFrame V2.0 — built for creative agencies
              </span>
            </motion.div>

            {/* Main Display Heading */}
            <motion.div variants={itemVariants} className="mb-6 max-w-[1000px] mx-auto w-full">
              <h1 className="font-display text-[40px] sm:text-[48px] md:text-[64px] lg:text-[84px] leading-[1.05] tracking-tight text-[var(--color-forest-ink)] text-center [text-wrap:balance]">
                Erase{' '}
                <span className="relative inline-block mx-1">
                  <span className="relative z-10">video &amp; image</span>
                  {/* Highlighter swipe animates in */}
                  <motion.svg
                    className="absolute w-[104%] h-[110%] top-[-5%] left-[-2%] text-[var(--color-highlighter-yellow)] -z-10"
                    preserveAspectRatio="none" viewBox="0 0 200 100"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  >
                    <path d="M3,18 Q100,2 196,15 Q199,50 194,88 Q100,98 6,85 Q1,50 3,18 Z" fill="currentColor" />
                  </motion.svg>
                </span>{' '}
                <br className="hidden sm:inline" />
                <span className="inline-block sm:whitespace-nowrap">backgrounds instantly.</span>
              </h1>
            </motion.div>

            {/* Subheading Paragraph */}
            <motion.p variants={itemVariants} className="text-[18px] md:text-[22px] font-medium text-[var(--color-forest-ink)]/85 max-w-[680px] mx-auto mb-10 leading-[1.6]">
              Replace your green screens with our AI pipeline. No complex software, no massive RAM usage. Just raw rendering power for fast-moving creators.
            </motion.p>

            {/* Action Stack */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Link to="/upload" className="w-full sm:w-auto group">
                  <button className="bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-all duration-200 rounded-[8px] py-[14px] px-8 text-[16px] font-medium w-full shadow-[3px_3px_0_rgba(36,66,17,0.25)] hover:shadow-[4px_4px_0_rgba(36,66,17,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest-ink)] focus-visible:ring-offset-2">
                    Start processing for free
                    <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto">
                  <button className="bg-transparent border-2 border-[var(--color-forest-ink)]/30 hover:border-[var(--color-forest-ink)]/60 hover:bg-black/5 text-[var(--color-forest-ink)] transition-all duration-200 rounded-[8px] py-[13px] px-8 text-[16px] font-medium w-full hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest-ink)] focus-visible:ring-offset-2">
                    Read the Docs
                  </button>
                </Link>
              </div>
              <span className="text-[12px] text-[var(--color-pencil-gray)] font-mono tracking-wide">no credit card required.</span>
            </motion.div>

          </motion.div>
        </div>

      </div>

      {/* Backed By Logo Strip */}
      <motion.div
        className="w-full max-w-[1000px] mx-auto px-6 mt-20 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="text-[11px] text-[var(--color-forest-ink)] font-mono tracking-widest uppercase opacity-60">Seamlessly Integrates With</span>
        <div className="hidden md:block w-px h-5 bg-[var(--color-pencil-gray)]/40" />
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[var(--color-forest-ink)]">
          {[
            <span key="pp" className="text-[14px] font-black tracking-tight">Premiere Pro</span>,
            <span key="cc" className="text-[16px] font-bold tracking-tight italic">CapCut</span>,
            <span key="yt" className="text-[14px] font-semibold tracking-wide">YouTube</span>,
            <span key="tt" className="text-[16px] font-bold tracking-wide italic">TikTok</span>,
            <span key="dv" className="text-[14px] font-black tracking-tight">DaVinci</span>
          ].map((logo) => (
            <span key={logo.key} className="opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="h-[100px] w-full"></div>

      {/* Features Grid (Sticky Note Cards) */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-24 pb-24 border-t border-dashed border-[var(--color-pencil-gray)]/40 mt-12">

        <div className="text-center mb-16">
          <h2 className="font-display text-[32px] md:text-[40px] text-[var(--color-forest-ink)] mb-3 relative inline-block">
            Flawless Extraction
            {/* Hand-drawn underline */}
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
              <path d="M2,5 Q50,1 100,4 T198,3" stroke="var(--color-terracotta)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-[17px] md:text-[18px] text-[var(--color-forest-ink)] opacity-70 max-w-[600px] mx-auto leading-[1.6] mt-4">
            Upload your media and let our decoupled AWS pipeline handle the rest.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map(({ icon: Icon, bg, rotate, title, body }, i) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{
                y: -10,
                rotate: 0,
                boxShadow: "0 16px 28px rgba(26, 51, 0, 0.12)",
                borderColor: "rgba(26, 51, 0, 0.08)"
              }}
              transition={{
                duration: 0.4,
                ease: [0.32, 0.72, 0, 1]
              }}
              className={`sticky-card relative group shadow-[4px_6px_12px_rgba(0,0,0,0.06)] border border-[var(--color-forest-ink)]/5 rounded-[12px] p-6 pt-10 pb-8 flex flex-col items-center text-center md:items-start md:text-left`}
              style={{
                backgroundColor: bg,
                backgroundImage: 'linear-gradient(rgba(26, 51, 0, 0.04) 1px, transparent 1px)',
                backgroundSize: '100% 26px',
                backgroundPosition: '0 10px',
                rotate: rotate === '-rotate-2' ? -2 : rotate === 'rotate-1' ? 1 : -1,
                y: 0
              }}
            >
              {/* Realistic Masking Tape Strip with Torn Edges */}
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#fffdf0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-x border-dashed border-black/10 backdrop-blur-[0.5px] pointer-events-none z-10"
                style={{
                  clipPath: 'polygon(0% 12%, 4% 0%, 8% 12%, 12% 0%, 16% 8%, 20% 0%, 24% 12%, 28% 0%, 32% 8%, 36% 0%, 40% 12%, 44% 0%, 48% 8%, 52% 0%, 56% 12%, 60% 0%, 64% 8%, 68% 0%, 72% 12%, 76% 0%, 80% 8%, 84% 0%, 88% 12%, 92% 0%, 96% 8%, 100% 0%, 99% 88%, 95% 100%, 91% 88%, 87% 100%, 83% 88%, 79% 100%, 75% 88%, 71% 100%, 67% 88%, 63% 100%, 59% 88%, 55% 100%, 51% 88%, 47% 100%, 43% 88%, 39% 100%, 35% 88%, 31% 100%, 27% 88%, 23% 100%, 19% 88%, 15% 100%, 11% 88%, 7% 100%, 0% 88%)',
                  transform: `translateX(-50%) rotate(${i % 2 === 0 ? '-3.5deg' : '2.5deg'})`
                }}
              />

              {/* Hand-drawn connecting line overlay between columns (Desktop only) */}
              {i < features.length - 1 && (
                <div className="hidden lg:block absolute top-[30%] right-[-18%] w-[25%] h-8 z-20 pointer-events-none">
                  <svg viewBox="0 0 100 20" fill="none" className="w-full h-full text-[var(--color-forest-ink)] opacity-25">
                    <path d="M5,10 C 35,2 65,18 95,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
                    <path d="M86,3 L 95,8 L 88,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Stamp style icon seal */}
              <div className="stamp-seal w-12 h-12 rounded-full border-2 border-[var(--color-forest-ink)] bg-[var(--color-cream-paper)] text-[var(--color-forest-ink)] flex items-center justify-center mb-6 shadow-[3px_3px_0px_var(--color-forest-ink)] group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-[var(--color-highlighter-yellow)] group-hover:shadow-[1px_1px_0px_var(--color-forest-ink)] group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-3 tracking-tight">{title}</h3>
              <p className="text-[15px] text-[var(--color-forest-ink)] opacity-85 leading-[1.6]">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

export default LandingPage;
