import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import StatusBadge from '../components/UI/StatusBadge';
import { ShoppingCart } from 'lucide-react';

export default function ClientOrdersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['client-orders'],
    queryFn: () => clientService.orders({ per_page: -1 }).then(r => r.data),
  });

  const orders = data?.data ?? [];

  const columns = [
    { key: 'id', label: 'Order #' },
    { key: 'product_name', label: 'Product', render: (_, row) => row.product_name || row.plan?.name || '—' },
    { key: 'total', label: 'Amount', render: (_, row) => `$${Number(row.total || 0).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Created', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
        <p className="text-slate-400 mt-1">Track your service orders</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      )}

      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}

      {!isLoading && !isError && (
        <>
          {orders.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500">No orders yet</p>
              </div>
            </Card>
          ) : (
            <Table columns={columns} data={orders} />
          )}
        </>
      )}
    </div>
  );
}
