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

export default function DomainsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['domains', page, search],
    queryFn: () => billingService.domains({
      page,
      per_page: 20,
      ...(search ? { search } : {}),
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const domains = data?.data ?? [];
  const meta = data?.meta ?? {};

  const columns = [
    { key: 'domain', label: 'Domain', render: v => <span className="font-medium text-white">{v || '—'}</span> },
    { key: 'client_name', label: 'Client', render: (_, row) => row.client_name || row.client?.email || '—' },
    { key: 'registrar', label: 'Registrar', render: v => v || '—' },
    { key: 'expires_at', label: 'Expiry', render: v => (v ? new Date(v).toLocaleDateString() : '—') },
    { key: 'auto_renew', label: 'Auto Renew', render: v => (v ? 'Yes' : 'No') },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Domains"
        subtitle={`${meta.total ?? domains.length} managed domains`}
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search domains..."
          className="w-full bg-[#13151f] border border-[#2a2d3e] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <>
          <Table columns={columns} data={domains} />
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
