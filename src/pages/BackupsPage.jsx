import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Trash2, RotateCcw } from 'lucide-react';
import { backupService } from '../services/miscServices';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import toast from 'react-hot-toast';

export default function BackupsPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['backups'],
    queryFn: () => backupService.list().then(r => r.data),
  });

  const handleRestore = (backup) => {
    if (!window.confirm(`Restore backup "${backup.name || backup.id}"? This will overwrite current data.`)) return;
    toast.promise(
      backupService.restore(backup.id),
      { loading: 'Restoring...', success: 'Restore initiated', error: 'Restore failed' }
    );
  };

  const handleDelete = (backup) => {
    if (!window.confirm(`Delete backup "${backup.name || backup.id}"?`)) return;
    toast.promise(
      backupService.delete(backup.id).then(() => qc.invalidateQueries({ queryKey: ['backups'] })),
      { loading: 'Deleting...', success: 'Backup deleted', error: 'Delete failed' }
    );
  };

  const columns = [
    { key: 'name',       label: 'Name',    render: v => <span className="font-medium text-white">{v || 'Unnamed'}</span> },
    { key: 'size',       label: 'Size',    render: v => v ? `${(v / 1024 / 1024).toFixed(1)} GB` : '—' },
    { key: 'server',     label: 'Server',  render: (_, row) => row.virtual_server?.name || '—' },
    { key: 'created_at', label: 'Created', render: v => v ? new Date(v).toLocaleString() : '—' },
    { key: 'actions',    label: '',        render: (_, row) => (
      <div className="flex items-center gap-1">
        <button title="Restore" onClick={() => handleRestore(row)} className="p-1.5 rounded hover:bg-green-500/20 text-green-400 transition-colors"><RotateCcw size={12} /></button>
        <button title="Delete"  onClick={() => handleDelete(row)}  className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 size={12} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Backups"
        subtitle="Server backup archives"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && <Table columns={columns} data={data?.data ?? []} />}
    </div>
  );
}
