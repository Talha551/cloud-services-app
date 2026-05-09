import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Server } from 'lucide-react';
import { clientService } from '../services/clientService';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import StatusBadge from '../components/UI/StatusBadge';
import Card from '../components/UI/Card';

export default function ClientServicesPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['client-services-list'],
    queryFn: () => clientService.services({ per_page: -1 }).then(r => r.data),
  });

  const services = data?.data ?? [];

  const columns = [
    { key: 'name', label: 'Service Name', render: (v, row) => <span className="font-medium text-white">{v || row.hostname || '—'}</span> },
    { key: 'ip', label: 'IP Address', render: (_, row) => <span className="font-mono text-sm">{row.ip_addresses?.[0]?.ip || row.ip || '—'}</span> },
    { key: 'plan', label: 'Plan', render: (_, row) => row.plan?.name || '—' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Created', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Services</h1>
        <p className="text-slate-400 mt-1">All your VPS and cloud services</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      )}

      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}

      {!isLoading && !isError && (
        <>
          {services.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Server size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500 mb-4">You don't have any services yet</p>
                <button
                  onClick={() => navigate('/store')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
                >
                  Browse Plans
                </button>
              </div>
            </Card>
          ) : (
            <Table
              columns={columns}
              data={services}
              onRowClick={(row) => navigate(`/client/services/${row.id}`)}
            />
          )}
        </>
      )}
    </div>
  );
}
