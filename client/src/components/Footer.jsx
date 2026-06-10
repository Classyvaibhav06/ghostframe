import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] py-20 px-8 lg:px-24 z-20 relative font-sans text-white">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Left Column - Brand & Info (Spans 5 cols on desktop) */}
        <div className="md:col-span-5 flex flex-col justify-between h-full min-h-[250px]">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <Ghost className="w-10 h-10 text-[#ffe95c]" />
              <span className="font-bold text-[24px] tracking-widest uppercase">
                GHOSTFRAME
              </span>
            </Link>
            
            <p className="text-[#a0a0a0] text-[15px] leading-[1.8] max-w-[380px]">
              GhostFrame helps creators isolate subjects from video, seamlessly and instantly without green screens or manual rotoscoping.
            </p>
          </div>

          <div className="space-y-6 mt-12 md:mt-0">
            <p className="text-[#888888] text-[14px]">
              @2026 All Rights Reserved to GhostFrame.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-[4px] border border-white/5">
              <span className="text-[#888888] text-[13px]">Website crafted with</span>
              <span className="text-white text-[10px]">♥</span>
              <span className="text-[#888888] text-[13px]">by</span>
              <span className="text-[#4ade80] font-mono text-[13px] tracking-wider">vaibhav</span>
            </div>
          </div>
        </div>

        {/* Right Columns - Links (Spans 7 cols on desktop) */}
        <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 pt-2">
          
          {/* Explore Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#888888] text-[13px] font-bold tracking-widest uppercase mb-2">EXPLORE</h4>
            <Link to="/pricing" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Pricing</Link>
            <Link to="/features" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Platform</Link>
            <Link to="/how-it-works" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">How it Works</Link>
            <Link to="/" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Contact Us</Link>
          </div>

          {/* Developers Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#888888] text-[13px] font-bold tracking-widest uppercase mb-2">DEVELOPERS</h4>
            <Link to="/api" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">API Reference</Link>
            <Link to="/docs" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Documentation</Link>
            <a href="#" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Status</a>
          </div>

          {/* Socials Column */}
          <div className="flex flex-col gap-6 col-span-2 lg:col-span-1">
            <h4 className="text-[#888888] text-[13px] font-bold tracking-widest uppercase mb-2">SOCIALS</h4>
            <a href="https://www.linkedin.com/in/vaibhavghoshi/" target="_blank" rel="noreferrer" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">LinkedIn</a>
            <a href="https://www.instagram.com/vaibhav.ghoshi/" target="_blank" rel="noreferrer" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">Instagram</a>
            <a href="https://www.youtube.com/@code_jaibabba" target="_blank" rel="noreferrer" className="text-[#e0e0e0] text-[15px] hover:text-white transition-colors">YouTube</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
