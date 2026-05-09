import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing',  label: 'Pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c12]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Globe size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">CloudPanel</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                pathname === to
                  ? 'text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0d0f18] border-t border-white/5 px-5 py-4 space-y-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="block py-2 text-sm text-slate-300 hover:text-white">{label}</Link>
          ))}
          <div className="pt-3 flex gap-3">
            <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm border border-white/10 rounded-lg text-slate-300 hover:text-white">Sign In</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm bg-indigo-600 rounded-lg text-white">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
