import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function ClientNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#13151f] border-b border-[#2a2d3e]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-white text-sm">CloudPanel</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/client')}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/client/services')}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            My Services
          </button>
          <button
            onClick={() => navigate('/client/orders')}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Orders
          </button>
          <button
            onClick={() => navigate('/store')}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Store
          </button>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-[#1e2130] text-slate-400 hover:text-slate-200 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
