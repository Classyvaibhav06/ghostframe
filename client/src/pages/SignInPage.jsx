import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, Ghost } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/upload');
    } else {
      setError(result.error || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-[var(--color-cream-paper)] relative overflow-hidden"
      style={{ paddingTop: 'calc(88px + 2rem)' }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3] z-0"
        style={{
          backgroundImage: 'radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative yellow blob */}
      <div className="absolute top-24 -left-16 w-64 h-64 bg-[var(--color-highlighter-yellow)] rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-16 -right-16 w-48 h-48 bg-[var(--color-sticky-note-mint)] rounded-full blur-3xl opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Card */}
        <div className="bg-white border-2 border-[var(--color-forest-ink)] rounded-[8px] shadow-[8px_8px_0px_0px_var(--color-forest-ink)] p-8 sm:p-10 relative overflow-hidden">

          {/* Tape strip top */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#fffdf0]/90 border-x border-dashed border-black/10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] z-20"
            style={{
              clipPath: 'polygon(0% 10%, 3% 0%, 7% 10%, 11% 0%, 15% 8%, 19% 0%, 23% 10%, 27% 0%, 31% 8%, 35% 0%, 39% 10%, 43% 0%, 47% 8%, 51% 0%, 55% 10%, 59% 0%, 63% 8%, 67% 0%, 71% 10%, 75% 0%, 79% 8%, 83% 0%, 87% 10%, 91% 0%, 95% 8%, 100% 0%, 99% 90%, 95% 100%, 91% 90%, 87% 100%, 83% 90%, 79% 100%, 75% 90%, 71% 100%, 67% 90%, 63% 100%, 59% 90%, 55% 100%, 51% 90%, 47% 100%, 43% 90%, 39% 100%, 35% 90%, 31% 100%, 27% 90%, 23% 100%, 19% 90%, 15% 100%, 11% 90%, 7% 100%, 3% 90%, 0% 100%)',
            }}
          />

          {/* Logo mark */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-[6px] bg-[var(--color-forest-ink)] flex items-center justify-center shrink-0">
              <Ghost className="w-5 h-5 text-[var(--color-highlighter-yellow)]" />
            </div>
            <span className="font-bold text-[20px] text-[var(--color-forest-ink)] tracking-tight">GhostFrame</span>
          </div>

          <h1 className="font-display text-[36px] sm:text-[42px] leading-tight text-[var(--color-forest-ink)] mb-1 relative inline-block">
            Welcome Back
            <div className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-highlighter-yellow)] -z-10 transform -rotate-1" />
          </h1>
          <p className="text-[15px] text-[var(--color-forest-ink)] opacity-60 font-mono mb-8 mt-2">
            Sign in to continue to GhostFrame.
          </p>

          {error && (
            <div className="bg-[var(--color-sticky-note-blush)] border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] px-4 py-3 rounded-[4px] mb-6 text-sm font-mono font-medium">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-mono font-bold text-[var(--color-forest-ink)] uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-cream-paper)] border-2 border-[var(--color-forest-ink)] rounded-[6px] px-4 py-3 text-[var(--color-forest-ink)] text-[15px] font-mono placeholder:text-[var(--color-pencil-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-ink)] focus:ring-offset-1 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-mono font-bold text-[var(--color-forest-ink)] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-cream-paper)] border-2 border-[var(--color-forest-ink)] rounded-[6px] px-4 py-3 text-[var(--color-forest-ink)] text-[15px] font-mono placeholder:text-[var(--color-pencil-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-ink)] focus:ring-offset-1 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-forest-ink)] hover:bg-[#2d4a15] text-[var(--color-cream-paper)] font-bold text-[16px] rounded-[6px] py-[14px] px-6 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_var(--color-highlighter-yellow)] hover:shadow-[2px_2px_0px_0px_var(--color-highlighter-yellow)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dashed border-[var(--color-pencil-gray)]/50 text-center">
            <p className="text-[14px] text-[var(--color-forest-ink)] opacity-70 font-mono">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-bold text-[var(--color-forest-ink)] underline underline-offset-2 hover:opacity-100 transition-opacity">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Hand-drawn underline doodle */}
        <svg className="w-full h-3 mt-2 opacity-30" preserveAspectRatio="none" viewBox="0 0 400 10">
          <path d="M0,5 Q100,1 200,5 T400,4" fill="none" stroke="var(--color-pencil-gray)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
