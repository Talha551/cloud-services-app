import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCw, Trash2, Play, Square, RotateCcw } from 'lucide-react';
import { serverService } from '../services/serverService';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import StatusBadge from '../components/UI/StatusBadge';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import toast from 'react-hot-toast';

export default function ServersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['servers', page, search],
    queryFn: () => serverService.list({
      page,
      per_page: 20,
      ...(search ? { 'filter[search]': search } : {}),
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const actionMutation = useMutation({
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['servers'] }); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Action failed'),
  });

  const handleAction = (action, id, label) => {
    actionMutation.mutate(
      { action, id },
      {
        mutationFn: () => serverService[action](id),
      }
    );
    // workaround: call directly
    toast.promise(
      serverService[action](id).then(() => qc.invalidateQueries({ queryKey: ['servers'] })),
      { loading: `${label}...`, success: `${label} successful`, error: `${label} failed` }
    );
  };

  const servers = data?.data ?? [];
  const meta = data?.meta ?? {};

  const columns = [
    { key: 'name',    label: 'Name',    render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'status',  label: 'Status',  render: (v) => <StatusBadge status={v} /> },
    { key: 'ip',      label: 'IP',      render: (v, row) => row.ip_addresses?.[0]?.ip || v || '—' },
    { key: 'os',      label: 'OS',      render: (_, row) => row.os?.name || row.os_image_version?.os_image?.name || '—' },
    { key: 'plan',    label: 'Plan',    render: (_, row) => row.plan?.name || '—' },
    { key: 'actions', label: '',        render: (_, row) => (
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <button title="Start"   onClick={() => handleAction('start',   row.id, 'Start')}   className="p-1.5 rounded hover:bg-green-500/20 text-green-400 transition-colors"><Play size={12} /></button>
        <button title="Stop"    onClick={() => handleAction('stop',    row.id, 'Stop')}    className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Square size={12} /></button>
        <button title="Restart" onClick={() => handleAction('restart', row.id, 'Restart')} className="p-1.5 rounded hover:bg-yellow-500/20 text-yellow-400 transition-colors"><RotateCcw size={12} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Servers"
        subtitle={`${meta.total ?? servers.length} virtual servers`}
        actions={
          <>
            <Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>
            <Button onClick={() => navigate('/admin/servers/create')}><Plus size={13} /> Create Server</Button>
          </>
        }
      />

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search servers..."
          className="w-full bg-[#13151f] border border-[#2a2d3e] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <>
          <Table
            columns={columns}
            data={servers}
            onRowClick={(row) => navigate(`/admin/servers/${row.id}`)}
          />
          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
              <span>Page {meta.current_page} of {meta.last_page}</span>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="secondary" disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
