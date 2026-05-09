import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Server, ReceiptText, ShoppingCart, ArrowRight } from 'lucide-react';
import { clientService } from '../services/clientService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import StatusBadge from '../components/UI/StatusBadge';

function StatCard({ icon: Icon, label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  };
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

export default function ClientDashboard() {
  const navigate = useNavigate();

  const { data: profileData } = useQuery({
    queryKey: ['client-profile'],
    queryFn: () => clientService.profile().then(r => r.data),
  });

  const { data: servicesData } = useQuery({
    queryKey: ['client-services'],
    queryFn: () => clientService.services({ per_page: 10 }).then(r => r.data),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['client-invoices'],
    queryFn: () => clientService.invoices({ per_page: 5 }).then(r => r.data),
  });

  const profile = profileData?.data ?? profileData;
  const services = servicesData?.data ?? [];
  const invoices = invoicesData?.data ?? [];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.name || 'Customer'}</h1>
        <p className="text-slate-400 mt-2">Here's a summary of your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Server} label="Active Services" value={services.length} color="indigo" />
        <StatCard icon={ShoppingCart} label="Active Orders" value="—" color="green" />
        <StatCard icon={ReceiptText} label="Pending Invoices" value="—" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Services */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">My Services</h3>
            <Button variant="secondary" onClick={() => navigate('/client/services')}>
              View All
            </Button>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">You don't have any active services yet</p>
              <Button onClick={() => navigate('/store')}>
                Browse Plans <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {services.slice(0, 5).map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => navigate(`/client/services/${svc.id}`)}
                  className="flex items-center justify-between p-4 bg-[#0f1117] border border-[#2a2d3e] rounded-lg hover:border-indigo-600 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-white">{svc.name || svc.hostname}</p>
                    <p className="text-xs text-slate-500 mt-1">{svc.ip_addresses?.[0]?.ip || svc.ip || 'No IP'}</p>
                  </div>
                  <StatusBadge status={svc.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button onClick={() => navigate('/store')} variant="secondary" className="w-full">
                Order New Service
              </Button>
              <Button onClick={() => navigate('/client/invoices')} variant="secondary" className="w-full">
                View Invoices
              </Button>
            </div>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Recent Invoices</h3>
            {invoices.length === 0 ? (
              <p className="text-xs text-slate-600">No invoices yet</p>
            ) : (
              <div className="space-y-2 text-xs">
                {invoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="flex justify-between text-slate-400">
                    <span>Invoice #{inv.id}</span>
                    <span className="font-medium text-slate-200">${Number(inv.total || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
