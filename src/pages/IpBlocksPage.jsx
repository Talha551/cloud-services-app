import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { ipBlockService } from '../services/miscServices';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function IpBlocksPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ip-blocks'],
    queryFn: () => ipBlockService.list().then(r => r.data),
  });

  const columns = [
    { key: 'name',        label: 'Name',       render: v => <span className="font-medium text-white">{v || '—'}</span> },
    { key: 'network',     label: 'Network',    render: v => <span className="font-mono text-slate-300">{v || '—'}</span> },
    { key: 'type',        label: 'Type',       render: v => <span className="text-xs text-slate-400">{v || '—'}</span> },
    { key: 'gateway',     label: 'Gateway',    render: v => <span className="font-mono text-xs text-slate-400">{v || '—'}</span> },
    { key: 'ns1',         label: 'Nameserver', render: v => <span className="font-mono text-xs text-slate-400">{v || '—'}</span> },
    { key: 'ips_count',   label: 'IPs',        render: v => v ?? '—' },
  ];

  return (
    <div>
      <PageHeader
        title="IP Blocks"
        subtitle="Manage IP address pools"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && <Table columns={columns} data={data?.data ?? []} />}
    </div>
  );
}
