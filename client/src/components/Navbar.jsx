import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300">
              <img src="/ghost.svg" alt="GhostFrame Logo" className="w-4 h-4 opacity-80" />
            </div>
            <span className="font-medium text-lg tracking-tight text-white">GhostFrame</span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</Link>
            <Link to="/api" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">API</Link>
            <Link to="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Docs</Link>
          </div>

          {/* Action Buttons - Right */}
          <div className="flex items-center gap-5 shrink-0">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Free Plan</span>
                  <div className="flex gap-3 text-sm text-zinc-300">
                    <span>Images: {user.imagesProcessed}/25</span>
                    <span>Videos: {user.videosProcessed}/5</span>
                  </div>
                </div>
                <Link to="/upload" className="hidden lg:block">
                  <button className="px-4 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-zinc-200 transition-colors">
                    Upload
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  className="px-4 py-1.5 text-xs font-medium text-white border border-white/20 rounded hover:bg-white/5 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="hidden sm:block">
                  <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">Sign in</span>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-zinc-200 transition-colors">
                    Try for free
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
