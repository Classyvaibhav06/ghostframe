import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ghost } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="fixed w-full top-0 z-50 px-4 sm:px-6 pt-6 pointer-events-none">
      <nav className="max-w-[1100px] mx-auto pointer-events-auto">
        <div className="flex items-center justify-between h-[60px] bg-[var(--color-cream-paper)] rounded-[16px] border border-dashed border-[#b6b6b6] px-2 shadow-[var(--shadow-subtle)]">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3 shrink-0 ml-1">
            <div className="w-[42px] h-[34px] rounded-[6px] bg-[var(--color-forest-ink)] flex items-center justify-center">
              <Ghost className="w-6 h-6 text-[var(--color-highlighter-yellow)]" />
            </div>
            <span className="font-bold text-[22px] text-[var(--color-forest-ink)] tracking-tight">GhostFrame</span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-[14px] font-mono font-medium text-[var(--color-forest-ink)] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">Features</Link>
            <Link to="/how-it-works" className="text-[14px] font-mono font-medium text-[var(--color-forest-ink)] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">How it Works</Link>
            <Link to="/api" className="text-[14px] font-mono font-medium text-[var(--color-forest-ink)] opacity-80 hover:opacity-100 transition-opacity">API</Link>
            <Link to="/pricing" className="text-[14px] font-mono font-medium text-[var(--color-forest-ink)] opacity-80 hover:opacity-100 transition-opacity">Pricing</Link>
            <Link to="/docs" className="text-[14px] font-mono font-medium text-[var(--color-forest-ink)] opacity-80 hover:opacity-100 transition-opacity">Docs</Link>
          </div>

          {/* Action Buttons - Right */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[10px] text-[var(--color-forest-ink)] opacity-60 uppercase tracking-widest font-bold font-mono">Free Plan</span>
                  <div className="flex gap-4 text-[12px] font-medium text-[var(--color-forest-ink)] opacity-90">
                    <span>Images: {user.imagesProcessed}/25</span>
                    <span>Videos: {user.videosProcessed}/5</span>
                  </div>
                </div>
                <Link to="/upload" className="hidden lg:block">
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
                <Link to="/signin" className="hidden sm:block">
                  <button className="bg-transparent text-[var(--color-forest-ink)] border border-[var(--color-pencil-gray)] hover:bg-black/5 rounded-[6px] py-[10px] px-5 text-[14px] font-medium transition-colors">Log In</button>
                </Link>
                <Link to="/signup">
                  <button className="bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] transition-colors rounded-[6px] py-[10px] px-5 text-[14px] font-medium">
                    It's Free → Try now!
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
}

export default Navbar;

