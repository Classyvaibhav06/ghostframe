import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { BackgroundBeams } from '../components/ui/background-beams';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';

function LandingPage() {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden w-full">
      <BackgroundBeams />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-zinc-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Goodbye green screens</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Erase video backgrounds <br className="hidden md:block" />
          in <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">one click.</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          Drop in any video and get a perfectly transparent cutout back. It's fast, completely free, and runs entirely on your device.
        </p>

        <div className="pt-8">
          <Link to="/upload">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-black text-white px-10 py-4 text-lg"
            >
              Start Processing Now
            </HoverBorderGradient>
          </Link>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-6 mt-32">
        <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
          <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Native Resolution</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">We process every single frame at 100% native resolution to guarantee ultra-crisp edges and no quality loss.</p>
        </div>
        <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">True Transparency</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">No more green fringes. You get a perfect WebM file with a true alpha-channel ready to drop into any video editor.</p>
        </div>
        <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
          <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">100% Secure</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Your files never linger. They are processed securely and deleted from our servers the moment you download.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
