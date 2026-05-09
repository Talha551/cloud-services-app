import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Search } from 'lucide-react';
import { billingService } from '../services/billingService';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import StatusBadge from '../components/UI/StatusBadge';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => billingService.clients({
      page,
      per_page: 20,
      ...(search ? { search } : {}),
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const clients = data?.data ?? [];
  const meta = data?.meta ?? {};

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'full_name', label: 'Name', render: (_, row) => row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || '—' },
    { key: 'email', label: 'Email', render: v => <span className="text-slate-200">{v || '—'}</span> },
    { key: 'company', label: 'Company' },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Created', render: v => (v ? new Date(v).toLocaleDateString() : '—') },
  ];

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${meta.total ?? clients.length} customer accounts`}
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search clients..."
          className="w-full bg-[#13151f] border border-[#2a2d3e] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <>
          <Table columns={columns} data={clients} />
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
