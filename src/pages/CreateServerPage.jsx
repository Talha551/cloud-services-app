import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { serverService } from '../services/serverService';
import { planService } from '../services/planService';
import { osImageService } from '../services/osImageService';
import { locationService } from '../services/miscServices';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import toast from 'react-hot-toast';

export default function CreateServerPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: '', description: '', password: '',
    plan: '', location: '', os: '',
  });

  const { data: plansData }     = useQuery({ queryKey: ['plans-all'],     queryFn: () => planService.list({ per_page: -1 }).then(r => r.data) });
  const { data: locationsData } = useQuery({ queryKey: ['locations-all'], queryFn: () => locationService.list().then(r => r.data) });
  const { data: osData }        = useQuery({ queryKey: ['os-images-all'], queryFn: () => osImageService.list({ per_page: -1 }).then(r => r.data) });

  const mutation = useMutation({
    mutationFn: (payload) => serverService.create(payload),
    onSuccess: (res) => {
      toast.success('Server created!');
      qc.invalidateQueries({ queryKey: ['servers'] });
      navigate(`/admin/servers/${res.data?.data?.id ?? ''}`);
    },
    onError: (e) => {
      const msg = e?.response?.data?.message || JSON.stringify(e?.response?.data?.errors || 'Failed to create server');
      toast.error(msg);
    },
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      ...(form.description && { description: form.description }),
      ...(form.password    && { password:    form.password }),
      ...(form.plan        && { plan:        Number(form.plan) }),
      ...(form.location    && { location:    Number(form.location) }),
      ...(form.os          && { os:          Number(form.os) }),
    };
    mutation.mutate(payload);
  };

  const fieldCls = 'w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors';
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/servers')} className="p-1.5 rounded-lg hover:bg-[#1e2130] text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">Create Server</h2>
          <p className="text-xs text-slate-500">Deploy a new virtual server</p>
        </div>
      </div>

      <div className="max-w-xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Hostname <span className="text-red-400">*</span></label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="server.example.com" className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional description" className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Root Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Leave blank to auto-generate" className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <select value={form.location} onChange={e => set('location', e.target.value)} className={fieldCls}>
                <option value="">— Select Location —</option>
                {(locationsData?.data ?? []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Plan</label>
              <select value={form.plan} onChange={e => set('plan', e.target.value)} className={fieldCls}>
                <option value="">— Select Plan —</option>
                {(plansData?.data ?? []).map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.vcpu} vCPU / {p.memory}MB / {p.disk}GB</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>OS Image</label>
              <select value={form.os} onChange={e => set('os', e.target.value)} className={fieldCls}>
                <option value="">— Select OS —</option>
                {(osData?.data ?? []).map(os => (
                  <option key={os.id} value={os.id}>{os.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/admin/servers')}>Cancel</Button>
              <Button type="submit" loading={mutation.isPending}>Deploy Server</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
