import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Package, Zap, HardDrive, Network, ArrowRight, Loader2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function StorePage() {
  const navigate = useNavigate();

  const { data: plansData, isLoading, isError, error } = useQuery({
    queryKey: ['plans-store'],
    queryFn: () => clientService.plans({ per_page: -1 }).then(r => r.data),
  });

  const plans = plansData?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.response?.data?.message || error?.message} />;
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">VPS Plans</h1>
        <p className="text-slate-400">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">No plans available at this moment</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#13151f] border border-[#2a2d3e] rounded-xl p-6 hover:border-indigo-600 transition-all flex flex-col"
            >
              {/* Header */}
              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-indigo-400">
                  ${Number(plan.price || 0).toFixed(2)}
                </span>
                <span className="text-slate-400 text-sm ml-2">/month</span>
              </div>

              {/* Specs */}
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-slate-300">{plan.vcpu} vCPU</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <HardDrive size={16} className="text-blue-400" />
                  <span className="text-slate-300">{plan.memory} MB RAM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package size={16} className="text-green-400" />
                  <span className="text-slate-300">{plan.disk} GB SSD</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Network size={16} className="text-purple-400" />
                  <span className="text-slate-300">{plan.bandwidth || 'Unlimited'} GB BW</span>
                </div>
              </div>

              {/* Button */}
              <Button
                onClick={() => navigate(`/checkout?plan=${plan.id}`)}
                className="w-full"
              >
                Order Now <ArrowRight size={14} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
