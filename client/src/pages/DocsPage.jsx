import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Terminal, Key, Shield, FileJson, Copy, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0a0a0a] flex pt-16 selection:bg-purple-500/30">
      
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 fixed h-[calc(100vh-64px)] border-r border-white/10 bg-[#0a0a0a] hidden md:block overflow-y-auto"
      >
        <div className="p-6">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-4">Documentation</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 lg:p-24 overflow-y-auto w-full max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'quickstart' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-medium tracking-tight text-white mb-4">Quick Start</h1>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
                    Integrate GhostFrame's ultra-fast AI background removal directly into your application using our REST API. You can process videos programmatically with just a few lines of code.
                  </p>
                </div>
                
                <hr className="border-white/5" />

                <div className="space-y-4">
                  <h3 className="text-2xl font-medium text-white">1. Install the SDK</h3>
                  <p className="text-zinc-400">Currently, we support Node.js officially. For other languages, use standard HTTP requests.</p>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-[#131416] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                      <code className="text-sm font-mono text-zinc-300">npm install @ghostframe/node</code>
                      <button 
                        onClick={() => copyCode('npm install @ghostframe/node')}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-medium text-white">2. Process a Video</h3>
                  <p className="text-zinc-400">Initialize the client with your API key and send a video file for processing.</p>
                  
                  <div className="bg-[#131416] border border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-black/50 px-4 py-2 border-b border-white/5 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 ml-2">index.js</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono leading-relaxed">
                        <span className="text-purple-400">import</span> {'{ GhostFrame }'} <span className="text-purple-400">from</span> <span className="text-green-300">'@ghostframe/node'</span>;{'\n\n'}
                        <span className="text-blue-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-yellow-200">GhostFrame</span>(process.env.<span className="text-blue-300">GHOSTFRAME_API_KEY</span>);{'\n\n'}
                        <span className="text-zinc-500">// Upload and process the video asynchronously</span>{'\n'}
                        <span className="text-blue-400">const</span> response = <span className="text-purple-400">await</span> client.videos.<span className="text-yellow-200">removeBackground</span>({'{'}{'\n'}
                        {'  '}file: <span className="text-green-300">'./raw-footage.mp4'</span>,{'\n'}
                        {'  '}outputFormat: <span className="text-green-300">'webm'</span>,{'\n'}
                        {'  '}quality: <span className="text-green-300">'high'</span>{'\n'}
                        {'}'});{'\n\n'}
                        console.<span className="text-yellow-200">log</span>(<span className="text-green-300">'Video processed! Download URL:'</span>, response.url);
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auth' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-medium tracking-tight text-white mb-4">Authentication</h1>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
                    Authenticate your API requests by including your secret API key in the Authorization header.
                  </p>
                </div>
                
                <hr className="border-white/5" />

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 font-medium mb-1">Keep your keys secure</h4>
                    <p className="text-red-400/80 text-sm">Never expose your API keys in client-side code, public repositories, or frontend applications. Always make GhostFrame API calls from a secure backend server.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">Bearer Token</h3>
                  <p className="text-zinc-400">Pass your API key as a Bearer token in the header of all HTTP requests.</p>
                  
                  <div className="bg-[#131416] border border-white/10 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <span className="text-blue-400">Authorization:</span> Bearer gf_live_xxxxxxxxxxxxxxxxx
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'endpoints' || activeTab === 'security') && (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                <FileJson className="w-8 h-8 text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Content Drafted</h3>
                <p className="text-zinc-500 text-center max-w-md">Detailed endpoint schemas and security limits documentation are currently being written.</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
