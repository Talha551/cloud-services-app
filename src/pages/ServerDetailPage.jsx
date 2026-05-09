import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Play, Square, RotateCcw, Monitor, Trash2,
  HardDrive, Network, Shield, RefreshCw, Cpu
} from 'lucide-react';
import { serverService } from '../services/serverService';
import StatusBadge from '../components/UI/StatusBadge';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import toast from 'react-hot-toast';

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-[#1e2130] last:border-0 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right max-w-[60%] truncate">{value ?? '—'}</span>
    </div>
  );
}

export default function ServerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['server', id],
    queryFn: () => serverService.get(id).then(r => r.data?.data ?? r.data),
  });

  const { data: backupsData } = useQuery({
    queryKey: ['server-backups', id],
    queryFn: () => serverService.backups(id).then(r => r.data),
    enabled: !!id,
  });

  const { data: snapshotsData } = useQuery({
    queryKey: ['server-snapshots', id],
    queryFn: () => serverService.snapshots(id).then(r => r.data),
    enabled: !!id,
  });

  const doAction = (fn, label) => {
    toast.promise(
      fn().then(() => qc.invalidateQueries({ queryKey: ['server', id] })),
      { loading: `${label}...`, success: `${label} done`, error: `${label} failed` }
    );
  };

  const handleVnc = async () => {
    try {
      const res = await serverService.vnc(id);
      const url = res.data?.url || res.data?.vnc_url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      else toast.error('VNC URL not available');
    } catch {
      toast.error('Failed to get VNC access');
    }
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete server "${data?.name}"? This cannot be undone.`)) return;
    toast.promise(
      serverService.delete(id).then(() => navigate('/admin/servers')),
      { loading: 'Deleting...', success: 'Server deleted', error: 'Delete failed' }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;
  if (isError) return <ErrorMessage message={error?.response?.data?.message || error?.message} />;

  const server = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/servers')} className="p-1.5 rounded-lg hover:bg-[#1e2130] text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">{server?.name}</h2>
            <StatusBadge status={server?.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">ID: {server?.id}</p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => doAction(() => serverService.start(id), 'Start')}><Play size={13} /> Start</Button>
          <Button variant="secondary" onClick={() => doAction(() => serverService.stop(id), 'Stop')}><Square size={13} /> Stop</Button>
          <Button variant="secondary" onClick={() => doAction(() => serverService.restart(id), 'Restart')}><RotateCcw size={13} /> Restart</Button>
          <Button variant="secondary" onClick={handleVnc}><Monitor size={13} /> VNC</Button>
          <Button variant="danger" onClick={handleDelete}><Trash2 size={13} /> Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Details */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Cpu size={14} className="text-indigo-400" /> Server Details</h3>
          <InfoRow label="Name"         value={server?.name} />
          <InfoRow label="Description"  value={server?.description} />
          <InfoRow label="Status"       value={server?.status} />
          <InfoRow label="Virtualization" value={server?.virtualization_type} />
          <InfoRow label="OS"           value={server?.os_image_version?.os_image?.name || server?.os?.name} />
          <InfoRow label="Plan"         value={server?.plan?.name} />
          <InfoRow label="Location"     value={server?.location?.name} />
          <InfoRow label="Created"      value={server?.created_at ? new Date(server.created_at).toLocaleString() : null} />
        </Card>

        <div className="space-y-4">
          {/* IPs */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Network size={14} className="text-blue-400" /> IP Addresses</h3>
            {(server?.ip_addresses ?? []).map(ip => (
              <div key={ip.id} className="text-sm py-1 border-b border-[#1e2130] last:border-0">
                <span className="text-slate-300 font-mono">{ip.ip}</span>
                <span className="ml-2 text-xs text-slate-600">{ip.type}</span>
              </div>
            ))}
            {!server?.ip_addresses?.length && <p className="text-xs text-slate-600">No IPs</p>}
          </Card>

          {/* Resources */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><HardDrive size={14} className="text-yellow-400" /> Resources</h3>
            <InfoRow label="CPU"    value={server?.plan?.vcpu ? `${server.plan.vcpu} vCPU` : null} />
            <InfoRow label="RAM"    value={server?.plan?.memory ? `${server.plan.memory} MB` : null} />
            <InfoRow label="Disk"   value={server?.plan?.disk ? `${server.plan.disk} GB` : null} />
            <InfoRow label="BW"     value={server?.plan?.bandwidth ? `${server.plan.bandwidth} GB` : null} />
          </Card>
        </div>

        {/* Backups */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Shield size={14} className="text-green-400" /> Backups</h3>
          {(backupsData?.data ?? []).slice(0, 5).map(b => (
            <div key={b.id} className="text-xs py-1.5 border-b border-[#1e2130] last:border-0 text-slate-400">
              {b.name || b.created_at}
            </div>
          ))}
          {!backupsData?.data?.length && <p className="text-xs text-slate-600">No backups</p>}
        </Card>

        {/* Snapshots */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><RefreshCw size={14} className="text-purple-400" /> Snapshots</h3>
          {(snapshotsData?.data ?? []).slice(0, 5).map(s => (
            <div key={s.id} className="text-xs py-1.5 border-b border-[#1e2130] last:border-0 text-slate-400">
              {s.name || s.created_at}
            </div>
          ))}
          {!snapshotsData?.data?.length && <p className="text-xs text-slate-600">No snapshots</p>}
        </Card>
      </div>
    </div>
  );
}
