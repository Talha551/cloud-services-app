import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Server, CpuIcon, Package, HardDrive,
  Users, FolderKanban, MapPin, DatabaseBackup, Network, Globe,
  UserRound, ReceiptText, ShoppingCart, Globe2, LifeBuoy
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',         to: '/admin',                  icon: LayoutDashboard },
  { label: 'Servers',           to: '/admin/servers',           icon: Server },
  { label: 'Compute Resources', to: '/admin/compute-resources', icon: CpuIcon },
  { label: 'Plans',             to: '/admin/plans',             icon: Package },
  { label: 'OS Images',         to: '/admin/os-images',         icon: HardDrive },
  { label: 'Users',             to: '/admin/users',             icon: Users },
  { label: 'Projects',          to: '/admin/projects',          icon: FolderKanban },
  { label: 'Clients',           to: '/admin/clients',           icon: UserRound },
  { label: 'Invoices',          to: '/admin/invoices',          icon: ReceiptText },
  { label: 'Orders',            to: '/admin/orders',            icon: ShoppingCart },
  { label: 'Domains',           to: '/admin/domains',           icon: Globe2 },
  { label: 'Tickets',           to: '/admin/tickets',           icon: LifeBuoy },
  { label: 'Locations',         to: '/admin/locations',         icon: MapPin },
  { label: 'Backups',           to: '/admin/backups',           icon: DatabaseBackup },
  { label: 'IP Blocks',         to: '/admin/ip-blocks',         icon: Network },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#13151f] border-r border-[#2a2d3e] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#2a2d3e]">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Globe size={16} className="text-white" />
        </div>
        <span className="font-semibold text-white text-sm tracking-wide">CloudPanel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e2130]'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="px-5 py-3 border-t border-[#2a2d3e]">
        <p className="text-xs text-slate-600">SolusVM2 Platform</p>
      </div>
    </aside>
  );
}
