import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Play, Square, RotateCcw, Monitor, HardDrive, Network, Zap } from 'lucide-react';
import { clientService } from '../services/clientService';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import StatusBadge from '../components/UI/StatusBadge';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import { useState } from 'react';

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between py-3 border-b border-[#1e2130] last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-slate-200 text-sm ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  );
}

export default function ClientServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [reinstallOpen, setReinstallOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['client-service', id],
    queryFn: () => clientService.service(id).then(r => r.data?.data ?? r.data),
  });

  const { data: osImages } = useQuery({
    queryKey: ['os-images-client'],
    queryFn: () => clientService.plans({ per_page: -1 }).then(r => r.data),
  });

  const doAction = (fn, label) => {
    toast.promise(
      fn().then(() => qc.invalidateQueries({ queryKey: ['client-service', id] })),
      { loading: `${label}...`, success: `${label} done`, error: `${label} failed` }
    );
  };

  const handleReinstall = async () => {
    if (!selectedOS) {
      toast.error('Please select an OS');
      return;
    }
    toast.promise(
      clientService.vpsReinstall(id, { os_id: selectedOS }).then(() => {
        qc.invalidateQueries({ queryKey: ['client-service', id] });
        setReinstallOpen(false);
      }),
      { loading: 'Reinstalling OS...', success: 'OS reinstall initiated', error: 'Reinstall failed' }
    );
  };

  const handleConsole = async () => {
    try {
      const res = await clientService.vpsConsole(id);
      const url =
        res.data?.data?.url ||
        res.data?.data?.console_url ||
        res.data?.url ||
        res.data?.console_url;
      if (url) {
        let parsedUrl;
        try {
          parsedUrl = new URL(url, window.location.origin);
        } catch {
          toast.error('Invalid console URL received from server');
          return;
        }

        // Avoid opening placeholder/demo hosts that will fail DNS resolution.
        if (parsedUrl.hostname === 'console.example.com' || parsedUrl.hostname.endsWith('.example.com')) {
          toast('Console is in demo mode right now. Real console integration is coming next.');
          return;
        }

        const popup = window.open(parsedUrl.toString(), '_blank', 'noopener,noreferrer');
        if (!popup) {
          toast.error('Browser blocked console popup. Please allow popups and try again.');
        }
      } else {
        toast.error('Console URL not available');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to open console');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.response?.data?.message || error?.message} />;
  }

  const service = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/client/services')}
          className="p-1.5 rounded-lg hover:bg-[#1e2130] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{service?.name || service?.hostname}</h2>
          <p className="text-sm text-slate-500 mt-1">Service ID: {service?.id}</p>
        </div>
      </div>

      {/* Status & Controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <StatusBadge status={service?.status} />
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => doAction(() => clientService.vpsStart(id), 'Start')}>
            <Play size={13} /> Start
          </Button>
          <Button variant="secondary" onClick={() => doAction(() => clientService.vpsStop(id), 'Stop')}>
            <Square size={13} /> Stop
          </Button>
          <Button variant="secondary" onClick={() => doAction(() => clientService.vpsRestart(id), 'Restart')}>
            <RotateCcw size={13} /> Restart
          </Button>
          <Button variant="secondary" onClick={handleConsole}>
            <Monitor size={13} /> Console
          </Button>
          <Button onClick={() => setReinstallOpen(true)}>
            <HardDrive size={13} /> Reinstall OS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
          <InfoRow label="Hostname" value={service?.hostname} mono />
          <InfoRow label="Status" value={service?.status} />
          <InfoRow label="Plan" value={service?.plan?.name} />
          <InfoRow label="OS" value={service?.os_image_version?.os_image?.name || service?.os?.name} />
          <InfoRow label="Virtualization" value={service?.virtualization_type} />
          <InfoRow label="Location" value={service?.location?.name} />
          <InfoRow label="Created" value={service?.created_at ? new Date(service.created_at).toLocaleString() : null} />
          <InfoRow label="Billing Cycle" value={service?.billing_cycle || 'Monthly'} />
        </Card>

        {/* Resources */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            Resources
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#0f1117] rounded-lg">
              <Zap size={16} className="text-yellow-400" />
              <div>
                <p className="text-xs text-slate-500">CPU</p>
                <p className="text-lg font-semibold text-white">{service?.plan?.vcpu || '—'} vCPU</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0f1117] rounded-lg">
              <HardDrive size={16} className="text-blue-400" />
              <div>
                <p className="text-xs text-slate-500">RAM</p>
                <p className="text-lg font-semibold text-white">{service?.plan?.memory || '—'} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0f1117] rounded-lg">
              <Network size={16} className="text-green-400" />
              <div>
                <p className="text-xs text-slate-500">Disk</p>
                <p className="text-lg font-semibold text-white">{service?.plan?.disk || '—'} GB</p>
              </div>
            </div>
          </div>
        </Card>

        {/* IP Addresses */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Network size={16} /> IP Addresses
          </h3>
          {(service?.ip_addresses ?? []).length > 0 ? (
            <div className="space-y-2">
              {service.ip_addresses.map((ip) => (
                <div
                  key={ip.id}
                  className="p-2 bg-[#0f1117] rounded-lg border border-[#2a2d3e]"
                >
                  <p className="font-mono text-sm text-slate-200">{ip.ip}</p>
                  <p className="text-xs text-slate-500 mt-1">{ip.type || 'Primary'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">No IP addresses assigned</p>
          )}
        </Card>
      </div>

      {/* Reinstall Modal */}
      <Modal
        open={reinstallOpen}
        onClose={() => setReinstallOpen(false)}
        title="Reinstall Operating System"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReinstallOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReinstall}>Proceed</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            This will erase all data on your VPS and install a fresh OS. This action cannot be undone.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Select OS</label>
            <select
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">— Choose OS —</option>
              <option value="1">Ubuntu 20.04 LTS</option>
              <option value="2">Ubuntu 22.04 LTS</option>
              <option value="3">CentOS 7</option>
              <option value="4">CentOS 8</option>
              <option value="5">Debian 11</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
