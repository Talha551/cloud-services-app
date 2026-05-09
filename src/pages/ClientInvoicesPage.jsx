import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import StatusBadge from '../components/UI/StatusBadge';
import { ReceiptText } from 'lucide-react';

export default function ClientInvoicesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['client-invoices-list'],
    queryFn: () => clientService.invoices({ per_page: -1 }).then(r => r.data),
  });

  const invoices = data?.data ?? [];

  const columns = [
    { key: 'id', label: 'Invoice #' },
    { key: 'total', label: 'Amount', render: (_, row) => `$${Number(row.total || 0).toFixed(2)}` },
    { key: 'due_date', label: 'Due Date', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Issued', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Invoices</h1>
        <p className="text-slate-400 mt-1">View and manage your billing invoices</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      )}

      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}

      {!isLoading && !isError && (
        <>
          {invoices.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <ReceiptText size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500">No invoices yet</p>
              </div>
            </Card>
          ) : (
            <Table columns={columns} data={invoices} />
          )}
        </>
      )}
    </div>
  );
}
