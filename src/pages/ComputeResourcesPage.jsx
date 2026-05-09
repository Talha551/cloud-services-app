import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Cpu } from 'lucide-react';
import { computeResourceService } from '../services/miscServices';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import StatusBadge from '../components/UI/StatusBadge';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function ComputeResourcesPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['compute-resources'],
    queryFn: () => computeResourceService.list().then(r => r.data),
  });

  const resources = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Compute Resources"
        subtitle="Physical host nodes"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resources.length === 0 && (
            <p className="text-sm text-slate-600 col-span-full text-center py-12">No compute resources found</p>
          )}
          {resources.map(cr => (
            <Card key={cr.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <Cpu size={14} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{cr.name}</p>
                    <p className="text-xs text-slate-600">{cr.host}</p>
                  </div>
                </div>
                <StatusBadge status={cr.status} />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-300 uppercase">{cr.virtualization_type || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VMs</span>
                  <span className="text-slate-300">{cr.virtual_servers_count ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-300">{cr.location?.name || '—'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
