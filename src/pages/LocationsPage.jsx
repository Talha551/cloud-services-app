import { useQuery } from '@tanstack/react-query';
import { RefreshCw, MapPin } from 'lucide-react';
import { locationService } from '../services/miscServices';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function LocationsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.list().then(r => r.data),
  });

  const columns = [
    { key: 'name',        label: 'Name',    render: v => <span className="font-medium text-white">{v}</span> },
    { key: 'code',        label: 'Code' },
    { key: 'description', label: 'Description', render: v => <span className="text-slate-500 text-xs">{v || '—'}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Data center locations"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && <Table columns={columns} data={data?.data ?? []} />}
    </div>
  );
}
