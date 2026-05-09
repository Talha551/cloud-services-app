import { useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const titles = {
  '/admin':                    'Dashboard',
  '/admin/servers':            'Servers',
  '/admin/servers/create':     'Create Server',
  '/admin/plans':              'Plans',
  '/admin/os-images':          'OS Images',
  '/admin/users':              'Users',
  '/admin/projects':           'Projects',
  '/admin/locations':          'Locations',
  '/admin/backups':            'Backups',
  '/admin/ip-blocks':          'IP Blocks',
  '/admin/compute-resources':  'Compute Resources',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const title = Object.entries(titles)
    .filter(([path]) => pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'CloudPanel';

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="h-14 bg-[#13151f] border-b border-[#2a2d3e] flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User size={14} />
          <span>{user?.email || 'Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  );
}
