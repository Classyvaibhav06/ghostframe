import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from './ui/button';

function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">GhostFrame</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/upload">
              <Button variant="ghost">Try for free</Button>
            </Link>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
