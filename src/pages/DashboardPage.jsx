import { useQuery } from '@tanstack/react-query';
import { Server, Users, Package, MapPin, Activity, HardDrive } from 'lucide-react';
import { serverService } from '../services/serverService';
import { planService } from '../services/planService';
import { userService } from '../services/userService';
import { locationService } from '../services/miscServices';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';

function StatCard({ icon: Icon, label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    green:  'text-green-400 bg-green-500/10',
    blue:   'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    red:    'text-red-400 bg-red-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

function ServerStatusRow({ server }) {
  const statusColor = {
    running:   'bg-green-400',
    stopped:   'bg-red-400',
    suspended: 'bg-yellow-400',
  }[server.status?.toLowerCase()] ?? 'bg-slate-400';

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e2130] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <div>
          <p className="text-sm text-slate-200">{server.name}</p>
          <p className="text-xs text-slate-600">{server.ip || 'No IP'}</p>
        </div>
      </div>
      <span className="text-xs text-slate-500 capitalize">{server.status}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: serversData, isLoading: loadingServers } = useQuery({
    queryKey: ['servers'],
    queryFn: () => serverService.list({ per_page: 100 }).then(r => r.data),
  });
  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.list({ per_page: -1 }).then(r => r.data),
  });
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.list({ per_page: 100 }).then(r => r.data),
  });
  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.list().then(r => r.data),
  });

  const servers = serversData?.data ?? [];
  const running = servers.filter(s => s.status?.toLowerCase() === 'running').length;
  const stopped = servers.filter(s => s.status?.toLowerCase() === 'stopped').length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Server}   label="Total Servers"  value={serversData?.meta?.total ?? servers.length} color="indigo" />
        <StatCard icon={Activity} label="Running"        value={running} color="green" />
        <StatCard icon={Package}  label="Plans"          value={plansData?.meta?.total ?? plansData?.data?.length} color="blue" />
        <StatCard icon={Users}    label="Users"          value={usersData?.meta?.total ?? usersData?.data?.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Servers */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Server size={14} className="text-indigo-400" /> Recent Servers
          </h3>
          {loadingServers ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <div>
              {servers.slice(0, 8).map(s => <ServerStatusRow key={s.id} server={s} />)}
              {servers.length === 0 && (
                <p className="text-sm text-slate-600 text-center py-8">No servers found</p>
              )}
            </div>
          )}
        </Card>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity size={14} className="text-green-400" /> Server Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Running</span>
                <span className="text-green-400 font-medium">{running}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Stopped</span>
                <span className="text-red-400 font-medium">{stopped}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Other</span>
                <span className="text-slate-400 font-medium">{servers.length - running - stopped}</span>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-blue-400" /> Locations
            </h3>
            <div className="space-y-1">
              {(locationsData?.data ?? []).slice(0, 5).map(loc => (
                <div key={loc.id} className="text-sm text-slate-400">{loc.name}</div>
              ))}
              {!locationsData?.data?.length && (
                <p className="text-sm text-slate-600">No locations configured</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
