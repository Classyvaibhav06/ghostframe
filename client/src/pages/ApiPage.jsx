import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCw, Trash2, Key, Activity, Terminal, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── tiny helper ─────────────────────────────────────────────────────────────
const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-[4px] border border-[var(--color-pencil-gray)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-forest-ink)] text-[var(--color-cream-paper)]">
        <span className="font-mono text-[11px] uppercase tracking-widest opacity-60">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 font-mono text-[11px] opacity-60 hover:opacity-100 transition-opacity">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#1a1a1a] text-[#d4e8c2] text-[13px] font-mono p-4 overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
    </div>
  );
};

const EXAMPLES = (key = 'YOUR_API_KEY') => [
  {
    lang: 'cURL',
    icon: Terminal,
    code: `curl -X POST ${API_URL}/api/video/upload-url \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"fileType":"video/mp4","isImage":false}'`,
  },
  {
    lang: 'JavaScript (fetch)',
    icon: Code2,
    code: `const res = await fetch('${API_URL}/api/video/upload-url?fileType=video/mp4&isImage=false', {
  headers: { 'x-api-key': '${key}' }
});
const { uploadUrl, key: s3Key } = await res.json();

// Upload directly to S3
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: { 'Content-Type': 'video/mp4' }
});

// Kick off background removal
const task = await fetch('${API_URL}/api/video/upload', {
  method: 'POST',
  headers: { 'x-api-key': '${key}', 'Content-Type': 'application/json' },
  body: JSON.stringify({ originalname: 'video.mp4', s3Key })
}).then(r => r.json());

console.log('Task ID:', task.taskId);`,
  },
  {
    lang: 'Python',
    icon: Code2,
    code: `import requests

headers = {"x-api-key": "${key}"}

# 1. Get a pre-signed S3 upload URL
r = requests.get("${API_URL}/api/video/upload-url",
                  params={"fileType": "video/mp4", "isImage": "false"},
                  headers=headers)
upload_url, s3_key = r.json()["uploadUrl"], r.json()["key"]

# 2. Upload directly to S3
with open("video.mp4", "rb") as f:
    requests.put(upload_url, data=f, headers={"Content-Type": "video/mp4"})

# 3. Submit for background removal
task = requests.post("${API_URL}/api/video/upload",
                     json={"originalname": "video.mp4", "s3Key": s3_key},
                     headers=headers).json()
print("Task ID:", task["taskId"])`,
  },
];

// ── main component ───────────────────────────────────────────────────────────
export default function ApiPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [apiKey, setApiKey] = useState(null);
  const [plan, setPlan] = useState('free');
  const [videoCalls, setVideoCalls] = useState(0);
  const [imageCalls, setImageCalls] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openExample, setOpenExample] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    fetchStats();
  }, [user]);

  const authHeaders = () => ({ Authorization: `Bearer ${user?.token}` });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/developer/stats`, { headers: authHeaders() });
      setApiKey(data.apiKey);
      setPlan(data.plan || 'free');
      setVideoCalls(data.videoCallsThisMonth || 0);
      setImageCalls(data.imageCallsThisMonth || 0);
    } catch {
      setError('Could not load API stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/api/developer/generate-key`, {}, { headers: authHeaders() });
      setApiKey(data.apiKey);
      setRevealed(true);
    } catch {
      setError('Failed to generate key. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Revoke your key? Any integrations using it will stop working.')) return;
    setRevoking(true);
    try {
      await axios.delete(`${API_URL}/api/developer/revoke-key`, { headers: authHeaders() });
      setApiKey(null);
      setCalls(0);
      setRevealed(false);
    } catch {
      setError('Failed to revoke key.');
    } finally {
      setRevoking(false);
    }
  };

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedKey = apiKey
    ? revealed
      ? apiKey
      : apiKey.slice(0, 6) + '••••••••••••••••••••••••••' + apiKey.slice(-4)
    : null;

  const examples = EXAMPLES(apiKey || 'YOUR_API_KEY');

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[var(--color-cream-paper)] flex flex-col items-center p-6 pt-20 pb-24 overflow-hidden">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{ backgroundImage: 'radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 w-full max-w-3xl space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-[48px] md:text-[60px] tracking-tight text-[var(--color-forest-ink)] leading-none mb-3">
            Developer API
          </h1>
          <p className="text-[17px] text-[var(--color-forest-ink)] opacity-70 font-medium max-w-xl">
            Integrate GhostFrame's AI background removal directly into your apps. Authenticate every request with your API key using the <code className="font-mono bg-[var(--color-highlighter-yellow)] px-1 rounded">x-api-key</code> header.
          </p>
        </motion.div>

        {/* Key card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }}
          className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] p-8 shadow-[var(--shadow-subtle-2)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--color-highlighter-yellow)] border border-[var(--color-forest-ink)] flex items-center justify-center shadow-[2px_2px_0px_var(--color-forest-ink)]">
              <Key className="w-5 h-5 text-[var(--color-forest-ink)]" />
            </div>
            <h2 className="font-display text-[24px] text-[var(--color-forest-ink)]">Your API Key</h2>
            {apiKey && (
              <span className="ml-auto font-mono text-[11px] uppercase tracking-widest bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)]/30 px-3 py-1 rounded-full text-[var(--color-forest-ink)]">
                Active
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-12 bg-[var(--color-pencil-gray)]/20 rounded-[4px] animate-pulse" />
          ) : apiKey ? (
            <div className="space-y-4">
              {/* Key display */}
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-[13px] bg-[var(--color-forest-ink)]/5 border border-[var(--color-pencil-gray)] rounded-[4px] px-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap select-all">
                  {maskedKey}
                </div>
                <button
                  onClick={() => setRevealed(v => !v)}
                  title={revealed ? 'Hide key' : 'Reveal key'}
                  className="px-3 py-3 border border-[var(--color-pencil-gray)] rounded-[4px] text-[var(--color-forest-ink)] hover:bg-[var(--color-highlighter-yellow)]/30 transition-colors font-mono text-[11px] uppercase tracking-wide shrink-0"
                >
                  {revealed ? 'Hide' : 'Show'}
                </button>
                <button onClick={copyKey} title="Copy key" className="px-3 py-3 border border-[var(--color-pencil-gray)] rounded-[4px] hover:bg-[var(--color-highlighter-yellow)]/30 transition-colors shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[var(--color-forest-ink)]" />}
                </button>
              </div>

              {/* Usage bars */}
              <div className="space-y-4">
                {[
                  { label: 'Video removals', used: videoCalls, limit: plan === 'pro' ? 200 : 4 },
                  { label: 'Image removals', used: imageCalls, limit: plan === 'pro' ? 200 : 20 },
                ].map(({ label, used, limit }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] font-mono font-bold uppercase tracking-wide mb-2 opacity-60">
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {label} this month</span>
                      <span>{used} / {limit}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-pencil-gray)]/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${used >= limit ? 'bg-[var(--color-terracotta)]' : 'bg-[var(--color-forest-ink)]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
                {plan === 'free' && (
                  <p className="text-[11px] font-mono text-[var(--color-forest-ink)] opacity-50 pt-1">
                    Upgrade to Pro for 200 videos + 200 images/month.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--color-pencil-gray)] text-[var(--color-forest-ink)] text-[13px] font-medium rounded-[4px] hover:bg-[var(--color-highlighter-yellow)]/30 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                  {generating ? 'Regenerating...' : 'Regenerate'}
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--color-terracotta)]/40 text-[var(--color-terracotta)] text-[13px] font-medium rounded-[4px] hover:bg-[var(--color-terracotta)]/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {revoking ? 'Revoking...' : 'Revoke'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <p className="text-[15px] text-[var(--color-forest-ink)] opacity-60 font-mono">No key generated yet.</p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="py-[12px] px-8 bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] border border-[var(--color-forest-ink)] font-medium text-[15px] rounded-[4px] transition-all shadow-[2px_2px_0px_0px_var(--color-forest-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2 mx-auto"
              >
                <Key className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate API Key'}
              </button>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 text-[13px] font-mono text-[var(--color-terracotta)]"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }}
          className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] p-6 shadow-[var(--shadow-subtle-2)]"
        >
          <h2 className="font-display text-[20px] text-[var(--color-forest-ink)] mb-3">Base URL</h2>
          <code className="block font-mono text-[14px] bg-[var(--color-forest-ink)]/5 border border-[var(--color-pencil-gray)] rounded-[4px] px-4 py-3">
            {API_URL}
          </code>
          <p className="mt-3 text-[13px] text-[var(--color-forest-ink)] opacity-60 font-mono">
            All endpoints require <span className="font-bold">x-api-key: gf_your_key</span> in the request headers.
          </p>
        </motion.div>

        {/* Endpoints reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45 }}
          className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] shadow-[var(--shadow-subtle-2)] overflow-hidden"
        >
          <div className="px-6 pt-6 pb-4 border-b border-[var(--color-pencil-gray)]">
            <h2 className="font-display text-[20px] text-[var(--color-forest-ink)]">Endpoints</h2>
          </div>
          <div className="divide-y divide-[var(--color-pencil-gray)]">
            {[
              { method: 'GET', path: '/api/video/upload-url', desc: 'Get a pre-signed S3 URL. Params: fileType, isImage.' },
              { method: 'POST', path: '/api/video/upload', desc: 'Submit a video for background removal after uploading to S3.' },
              { method: 'POST', path: '/api/video/upload-image', desc: 'Submit an image for background removal after uploading to S3.' },
              { method: 'GET', path: '/api/video/status/:taskId', desc: 'Poll task status: queued | processing | completed | failed.' },
              { method: 'GET', path: '/api/video/download/:taskId', desc: 'Download the processed WebM video.' },
              { method: 'GET', path: '/api/video/download-image/:taskId', desc: 'Download the processed PNG image.' },
              { method: 'GET', path: '/api/developer/stats', desc: 'Returns your current API key and monthly call count.' },
            ].map(({ method, path, desc }) => (
              <div key={path} className="flex flex-col sm:flex-row sm:items-center gap-2 px-6 py-4">
                <span className={`font-mono text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0 ${method === 'GET' ? 'bg-[var(--color-sticky-note-mint)]' : 'bg-[var(--color-highlighter-yellow)]'} text-[var(--color-forest-ink)]`}>
                  {method}
                </span>
                <code className="font-mono text-[13px] text-[var(--color-forest-ink)] shrink-0">{path}</code>
                <span className="text-[13px] text-[var(--color-forest-ink)] opacity-60 sm:ml-auto">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }}
          className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] shadow-[var(--shadow-subtle-2)] overflow-hidden"
        >
          <div className="px-6 pt-6 pb-4 border-b border-[var(--color-pencil-gray)]">
            <h2 className="font-display text-[20px] text-[var(--color-forest-ink)]">Code Examples</h2>
            <p className="text-[13px] font-mono text-[var(--color-forest-ink)] opacity-60 mt-1">
              {apiKey ? 'Your live key is pre-filled below.' : 'Generate a key above to see live examples.'}
            </p>
          </div>
          <div className="divide-y divide-[var(--color-pencil-gray)]">
            {examples.map((ex, i) => (
              <div key={ex.lang}>
                <button
                  onClick={() => setOpenExample(openExample === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--color-highlighter-yellow)]/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ex.icon className="w-4 h-4 text-[var(--color-forest-ink)] opacity-60" />
                    <span className="font-mono font-bold text-[14px] text-[var(--color-forest-ink)]">{ex.lang}</span>
                  </div>
                  {openExample === i ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                </button>
                <AnimatePresence>
                  {openExample === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <CodeBlock code={ex.code} lang={ex.lang} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
