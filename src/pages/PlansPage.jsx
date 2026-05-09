import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Trash2 } from 'lucide-react';
import { planService } from '../services/planService';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import toast from 'react-hot-toast';

export default function PlansPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.list({ per_page: -1 }).then(r => r.data),
  });

  const handleDelete = (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"?`)) return;
    toast.promise(
      planService.delete(plan.id).then(() => qc.invalidateQueries({ queryKey: ['plans'] })),
      { loading: 'Deleting...', success: 'Plan deleted', error: 'Delete failed' }
    );
  };

  const columns = [
    { key: 'name',        label: 'Name',         render: v => <span className="font-medium text-white">{v}</span> },
    { key: 'vcpu',        label: 'vCPU',          render: v => v ?? '—' },
    { key: 'memory',      label: 'RAM (MB)',       render: v => v ?? '—' },
    { key: 'disk',        label: 'Disk (GB)',      render: v => v ?? '—' },
    { key: 'bandwidth',   label: 'BW (GB)',        render: v => v ?? '—' },
    { key: 'virtualization_type', label: 'Type',   render: v => <span className="uppercase text-xs">{v}</span> },
    { key: 'actions',     label: '',               render: (_, row) => (
      <button onClick={() => handleDelete(row)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors">
        <Trash2 size={13} />
      </button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Plans"
        subtitle="Manage VPS plans and pricing tiers"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && <Table columns={columns} data={data?.data ?? []} />}
    </div>
  );
}
