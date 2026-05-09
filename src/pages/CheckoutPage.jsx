import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');

  const [form, setForm] = useState({
    hostname: '',
    location: '',
    os: '1',
    billing_period: 'monthly',
  });

  const { data: planData } = useQuery({
    queryKey: ['plan-checkout', planId],
    queryFn: () => planId ? clientService.plans().then(r => {
      const p = r.data?.data?.find(x => x.id == planId);
      return { data: p };
    }) : null,
    enabled: !!planId,
  });

  const plan = planData?.data;

  const mutation = useMutation({
    mutationFn: (payload) => clientService.createOrder(payload),
    onSuccess: () => {
      toast.success('Order placed successfully!');
      qc.invalidateQueries({ queryKey: ['client-orders'] });
      setTimeout(() => navigate('/client/orders'), 2000);
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message || 'Order failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hostname) {
      toast.error('Please enter a hostname');
      return;
    }
    mutation.mutate({
      plan_id: planId,
      hostname: form.hostname,
      location_id: form.location,
      os_id: form.os,
      billing_period: form.billing_period,
    });
  };

  const fieldCls = 'w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors';

  if (!planId || !plan) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">No plan selected</p>
        <Button onClick={() => navigate('/store')}>Back to Store</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/store')}
          className="p-1.5 rounded-lg hover:bg-[#1e2130] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Configure Your VPS</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Hostname *</label>
              <input
                required
                value={form.hostname}
                onChange={(e) => setForm({ ...form, hostname: e.target.value })}
                placeholder="server.example.com"
                className={fieldCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={fieldCls}
              >
                <option value="">— Select Location —</option>
                <option value="1">USA - New York</option>
                <option value="2">USA - Los Angeles</option>
                <option value="3">Europe - Amsterdam</option>
                <option value="4">Asia - Singapore</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Operating System</label>
              <select
                value={form.os}
                onChange={(e) => setForm({ ...form, os: e.target.value })}
                className={fieldCls}
              >
                <option value="1">Ubuntu 22.04 LTS</option>
                <option value="2">Ubuntu 20.04 LTS</option>
                <option value="3">CentOS 8</option>
                <option value="4">Debian 11</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Billing Period</label>
              <select
                value={form.billing_period}
                onChange={(e) => setForm({ ...form, billing_period: e.target.value })}
                className={fieldCls}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly (3 months)</option>
                <option value="semi-annual">Semi-Annual (6 months)</option>
                <option value="annual">Annual (12 months)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={() => navigate('/store')}>
                Cancel
              </Button>
              <Button loading={mutation.isPending} type="submit">
                Place Order
              </Button>
            </div>
          </form>
        </Card>

        {/* Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Plan</p>
              <p className="text-lg font-semibold text-white">{plan.name}</p>
            </div>

            <div className="border-t border-[#2a2d3e] pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">vCPU</span>
                <span className="text-white">{plan.vcpu}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">RAM</span>
                <span className="text-white">{plan.memory} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disk</span>
                <span className="text-white">{plan.disk} GB</span>
              </div>
            </div>

            <div className="border-t border-[#2a2d3e] pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Subtotal</span>
                <div>
                  <span className="text-2xl font-bold text-indigo-400">
                    ${Number(plan.price || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/month</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-6">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-400 mt-0.5" />
                <div className="text-xs text-green-300">
                  <p className="font-medium">Money-back guarantee</p>
                  <p>30 days money-back guarantee if not satisfied</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
