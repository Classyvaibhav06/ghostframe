import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Key, Shield, FileJson, Copy, CheckCircle2 } from 'lucide-react';

const sidebarItems = [
  { id: 'quickstart', label: 'Quick Start', icon: Terminal },
  { id: 'auth', label: 'Authentication', icon: Key },
  { id: 'endpoints', label: 'API Endpoints', icon: FileJson },
  { id: 'security', label: 'Security & Limits', icon: Shield },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-cream-paper)] pt-[88px] selection:bg-[var(--color-highlighter-yellow)] selection:text-[var(--color-forest-ink)] relative pb-24">
      
      {/* Hand-drawn dot grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3] z-0"
        style={{
          backgroundImage: `radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="max-w-[1000px] mx-auto w-full relative z-10 px-6 mt-12">
        
        {/* Top Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[15px] font-bold transition-all border-2 border-[var(--color-forest-ink)] ${
                  isActive 
                    ? 'bg-[var(--color-sticky-note-mint)] shadow-[4px_4px_0px_0px_var(--color-forest-ink)] text-[var(--color-forest-ink)] -translate-y-1' 
                    : 'bg-white text-[var(--color-forest-ink)] hover:bg-[var(--color-whisper-gray)] shadow-[2px_2px_0px_0px_var(--color-forest-ink)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="w-full bg-white border-2 border-[var(--color-forest-ink)] shadow-[8px_8px_0px_0px_var(--color-forest-ink)] rounded-[8px] p-8 md:p-16 relative">
          
          {/* Decorative Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-white/40 backdrop-blur-md border border-[var(--color-pencil-gray)]/50 mix-blend-multiply transform rotate-1 z-20"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'quickstart' && (
                <div className="space-y-10">
                  <div className="text-center md:text-left">
                    <h1 className="font-display text-[48px] md:text-[55px] tracking-tight text-[var(--color-forest-ink)] mb-4 leading-none relative inline-block">
                      Quick Start
                      {/* Highlighter underline */}
                      <div className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-highlighter-yellow)] -z-10 transform -rotate-1"></div>
                    </h1>
                    <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 font-medium leading-relaxed max-w-3xl mt-4">
                      Integrate GhostFrame's ultra-fast AI background removal directly into your application using our REST API. You can process videos programmatically with just a few lines of code.
                    </p>
                  </div>
                  
                  {/* Hand-drawn divider */}
                  <svg className="w-full h-4 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="var(--color-pencil-gray)" strokeWidth="1" />
                  </svg>

                  <div className="space-y-4">
                    <h3 className="font-display text-[28px] text-[var(--color-forest-ink)]">1. Install the SDK</h3>
                    <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80">Currently, we support Node.js officially. For other languages, use standard HTTP requests.</p>
                    
                    <div className="relative group">
                      <div className="relative bg-[#faf8f5] border-2 border-[var(--color-forest-ink)] rounded-[4px] p-4 flex items-center justify-between">
                        <code className="text-[15px] font-mono font-bold text-[#8a9c7b]">npm install @ghostframe/node</code>
                        <button 
                          onClick={() => copyCode('npm install @ghostframe/node')}
                          className="text-[var(--color-pencil-gray)] hover:text-[var(--color-forest-ink)] transition-colors"
                        >
                          {copied ? <CheckCircle2 className="w-5 h-5 text-[var(--color-sticky-note-mint)]" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-display text-[28px] text-[var(--color-forest-ink)]">2. Process a Video</h3>
                    <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80">Initialize the client with your API key and send a video file for processing.</p>
                    
                    <div className="bg-white border-2 border-[var(--color-forest-ink)] rounded-[4px] overflow-hidden">
                      <div className="bg-[var(--color-whisper-gray)] px-4 py-2 border-b-2 border-[var(--color-forest-ink)] flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full border border-[var(--color-forest-ink)] bg-[var(--color-terracotta)]"></div>
                          <div className="w-3 h-3 rounded-full border border-[var(--color-forest-ink)] bg-[var(--color-highlighter-yellow)]"></div>
                          <div className="w-3 h-3 rounded-full border border-[var(--color-forest-ink)] bg-[var(--color-sticky-note-mint)]"></div>
                        </div>
                        <span className="text-[12px] font-mono font-bold text-[var(--color-forest-ink)] ml-2 uppercase tracking-wide">index.js</span>
                      </div>
                      <div className="p-5 overflow-x-auto bg-[#faf8f5]">
                        <pre className="text-[15px] font-mono leading-relaxed">
                          <span className="text-[#cb5521]">import</span> {'{ GhostFrame }'} <span className="text-[#cb5521]">from</span> <span className="text-[#8a9c7b]">'@ghostframe/node'</span>;{'\n\n'}
                          <span className="text-[#cb5521]">const</span> client = <span className="text-[#cb5521]">new</span> <span className="font-bold">GhostFrame</span>(process.env.<span className="text-[#cb5521]">GHOSTFRAME_API_KEY</span>);{'\n\n'}
                          <span className="text-[var(--color-pencil-gray)] italic">// Upload and process the video asynchronously</span>{'\n'}
                          <span className="text-[#cb5521]">const</span> response = <span className="text-[#cb5521]">await</span> client.videos.<span className="font-bold">removeBackground</span>({'{'}{'\n'}
                          {'  '}file: <span className="text-[#8a9c7b]">'./raw-footage.mp4'</span>,{'\n'}
                          {'  '}outputFormat: <span className="text-[#8a9c7b]">'webm'</span>,{'\n'}
                          {'  '}quality: <span className="text-[#8a9c7b]">'high'</span>{'\n'}
                          {'}'});{'\n\n'}
                          console.<span className="font-bold">log</span>(<span className="text-[#8a9c7b]">'Video processed! Download URL:'</span>, response.url);
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'auth' && (
                <div className="space-y-10">
                  <div className="text-center md:text-left">
                    <h1 className="font-display text-[48px] tracking-tight text-[var(--color-forest-ink)] mb-4 leading-none">Authentication</h1>
                    <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 font-medium max-w-3xl">
                      Authenticate your API requests by including your secret API key in the Authorization header.
                    </p>
                  </div>
                  
                  {/* Hand-drawn divider */}
                  <svg className="w-full h-4 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="var(--color-pencil-gray)" strokeWidth="1" />
                  </svg>

                  <div className="bg-[var(--color-sticky-note-blush)] border-2 border-[var(--color-forest-ink)] rounded-[4px] p-6 flex gap-4">
                    <Shield className="w-6 h-6 text-[var(--color-forest-ink)] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-display text-[22px] text-[var(--color-forest-ink)] mb-1">Keep your keys secure</h4>
                      <p className="text-[15px] text-[var(--color-forest-ink)] opacity-90 font-medium">Never expose your API keys in client-side code, public repositories, or frontend applications. Always make GhostFrame API calls from a secure backend server.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-display text-[28px] text-[var(--color-forest-ink)]">Bearer Token</h3>
                    <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80">Pass your API key as a Bearer token in the header of all HTTP requests.</p>
                    
                    <div className="bg-[#faf8f5] border-2 border-[var(--color-forest-ink)] rounded-[4px] p-4 font-mono text-[15px] font-bold overflow-x-auto">
                      <span className="text-[#cb5521]">Authorization:</span> Bearer gf_live_xxxxxxxxxxxxxxxxx
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {(activeTab === 'endpoints' || activeTab === 'security') && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[var(--color-pencil-gray)] rounded-[4px] bg-[var(--color-whisper-gray)]/50 mt-10 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/50 border border-[var(--color-pencil-gray)]/50 mix-blend-multiply transform rotate-2"></div>
                  <FileJson className="w-10 h-10 text-[var(--color-pencil-gray)] mb-4" />
                  <h3 className="font-display text-[28px] text-[var(--color-forest-ink)] mb-2">Content Drafted</h3>
                  <p className="text-[16px] text-[var(--color-forest-ink)] opacity-70 text-center max-w-md font-mono">Detailed endpoint schemas and security limits documentation are currently being written.</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
