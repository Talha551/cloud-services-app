import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Trash2, Server } from 'lucide-react';
import { projectService } from '../services/miscServices';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.list({ per_page: 50 }).then(r => r.data),
  });

  const handleDelete = (project) => {
    if (!window.confirm(`Delete project "${project.name}"?`)) return;
    toast.promise(
      projectService.delete(project.id).then(() => qc.invalidateQueries({ queryKey: ['projects'] })),
      { loading: 'Deleting...', success: 'Project deleted', error: 'Delete failed' }
    );
  };

  const columns = [
    { key: 'name',        label: 'Name',        render: v => <span className="font-medium text-white">{v}</span> },
    { key: 'description', label: 'Description',  render: v => <span className="text-slate-500 text-xs">{v || '—'}</span> },
    { key: 'servers_count', label: 'Servers',    render: v => v ?? '—' },
    { key: 'owner',       label: 'Owner',        render: (_, row) => row.owner?.email || '—' },
    { key: 'created_at',  label: 'Created',      render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'actions',     label: '',             render: (_, row) => (
      <button onClick={() => handleDelete(row)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors">
        <Trash2 size={13} />
      </button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Organize servers into projects"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && <Table columns={columns} data={data?.data ?? []} />}
    </div>
  );
}
