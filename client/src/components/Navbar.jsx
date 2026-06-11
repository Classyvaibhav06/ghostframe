import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ghost, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { to: '/features',     label: 'Features'     },
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/api',          label: 'API'           },
  { to: '/pricing',      label: 'Pricing'       },
  { to: '/docs',         label: 'Docs'          },
];

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed w-full top-0 z-50 px-4 sm:px-6 pt-6 pointer-events-none">
      <nav className="max-w-[1100px] mx-auto pointer-events-auto">

        {/* ── Desktop bar ── */}
        <div className="flex items-center justify-between h-[60px] bg-[var(--color-cream-paper)] rounded-[16px] border border-dashed border-[#b6b6b6] px-2 shadow-[var(--shadow-subtle)]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 ml-1" onClick={() => setMenuOpen(false)}>
            <div className="w-[42px] h-[34px] rounded-[6px] bg-[var(--color-forest-ink)] flex items-center justify-center">
              <Ghost className="w-6 h-6 text-[var(--color-highlighter-yellow)]" />
            </div>
            <span className="font-bold text-[20px] sm:text-[22px] text-[var(--color-forest-ink)] tracking-tight">GhostFrame</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-[14px] font-mono font-medium text-[var(--color-forest-ink)] transition-opacity ${
                  location.pathname === to ? 'opacity-100 underline underline-offset-4' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[10px] text-[var(--color-forest-ink)] opacity-60 uppercase tracking-widest font-bold font-mono">Free Plan</span>
                  <div className="flex gap-4 text-[12px] font-medium text-[var(--color-forest-ink)] opacity-90">
                    <span>Images: {user.imagesProcessed}/25</span>
                    <span>Videos: {user.videosProcessed}/5</span>
                  </div>
                </div>
                <Link to="/upload">
                  <button className="bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[6px] py-[10px] px-5 text-[14px] font-medium">
                    Upload →
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="bg-transparent text-[var(--color-forest-ink)] border border-[var(--color-pencil-gray)] hover:bg-black/5 rounded-[6px] py-[10px] px-5 text-[14px] font-medium transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="bg-transparent text-[var(--color-forest-ink)] border border-[var(--color-pencil-gray)] hover:bg-black/5 rounded-[6px] py-[10px] px-5 text-[14px] font-medium transition-colors">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[6px] py-[10px] px-5 text-[14px] font-medium">
                    It&apos;s Free →
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-[8px] border border-[var(--color-pencil-gray)] text-[var(--color-forest-ink)] mr-1 transition-colors hover:bg-black/5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-2 bg-[var(--color-cream-paper)] border border-dashed border-[#b6b6b6] rounded-[16px] shadow-[var(--shadow-subtle)] overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-[8px] text-[15px] font-mono font-medium text-[var(--color-forest-ink)] transition-colors ${
                      location.pathname === to
                        ? 'bg-[var(--color-highlighter-yellow)] font-bold'
                        : 'hover:bg-black/5'
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-2 border-t border-dashed border-[var(--color-pencil-gray)]/50 space-y-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2">
                        <span className="text-[10px] text-[var(--color-forest-ink)] opacity-60 uppercase tracking-widest font-bold font-mono block mb-1">Free Plan</span>
                        <div className="flex gap-4 text-[13px] font-medium text-[var(--color-forest-ink)] opacity-90">
                          <span>Images: {user.imagesProcessed}/25</span>
                          <span>Videos: {user.videosProcessed}/5</span>
                        </div>
                      </div>
                      <Link to="/upload" onClick={() => setMenuOpen(false)} className="block">
                        <button className="w-full bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[8px] py-3 text-[15px] font-medium">
                          Upload →
                        </button>
                      </Link>
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full bg-transparent text-[var(--color-forest-ink)] border border-[var(--color-pencil-gray)] hover:bg-black/5 rounded-[8px] py-3 text-[15px] font-medium transition-colors"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setMenuOpen(false)} className="block">
                        <button className="w-full bg-transparent text-[var(--color-forest-ink)] border border-[var(--color-pencil-gray)] hover:bg-black/5 rounded-[8px] py-3 text-[15px] font-medium transition-colors">
                          Log In
                        </button>
                      </Link>
                      <Link to="/signup" onClick={() => setMenuOpen(false)} className="block">
                        <button className="w-full bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[8px] py-3 text-[15px] font-medium">
                          It&apos;s Free → Try now!
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </div>
  );
}

export default Navbar;
