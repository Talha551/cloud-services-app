import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search, Trash2, UserPlus } from 'lucide-react';
import { userService } from '../services/userService';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import StatusBadge from '../components/UI/StatusBadge';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export default function UsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => userService.list({
      page,
      per_page: 20,
      ...(search ? { 'filter[search]': search } : {}),
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => userService.create(payload),
    onSuccess: () => {
      toast.success('User created');
      qc.invalidateQueries({ queryKey: ['users'] });
      setCreateOpen(false);
      setForm({ email: '', password: '', first_name: '', last_name: '' });
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create user'),
  });

  const handleDelete = (user) => {
    if (!window.confirm(`Delete user "${user.email}"?`)) return;
    toast.promise(
      userService.delete(user.id).then(() => qc.invalidateQueries({ queryKey: ['users'] })),
      { loading: 'Deleting...', success: 'User deleted', error: 'Delete failed' }
    );
  };

  const columns = [
    { key: 'email',      label: 'Email',      render: v => <span className="font-medium text-white">{v}</span> },
    { key: 'first_name', label: 'Name',        render: (v, row) => `${v ?? ''} ${row.last_name ?? ''}`.trim() || '—' },
    { key: 'role',       label: 'Role',        render: (v, row) => <span className="text-xs text-slate-400 capitalize">{row.roles?.[0]?.name || v || '—'}</span> },
    { key: 'status',     label: 'Status',      render: v => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Created',     render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'actions',    label: '',            render: (_, row) => (
      <button onClick={() => handleDelete(row)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors">
        <Trash2 size={13} />
      </button>
    )},
  ];

  const meta = data?.meta ?? {};
  const fieldCls = 'w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors';

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${meta.total ?? ''} registered users`}
        actions={
          <>
            <Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>
            <Button onClick={() => setCreateOpen(true)}><UserPlus size={13} /> Add User</Button>
          </>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search users..."
          className="w-full bg-[#13151f] border border-[#2a2d3e] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <>
          <Table columns={columns} data={data?.data ?? []} />
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
              <span>Page {meta.current_page} of {meta.last_page}</span>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="secondary" disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button loading={createMutation.isPending} onClick={() => createMutation.mutate(form)}>Create</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div><label className="block text-xs text-slate-400 mb-1">Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={fieldCls} /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Password *</label><input required type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className={fieldCls} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs text-slate-400 mb-1">First Name</label><input value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))} className={fieldCls} /></div>
            <div><label className="block text-xs text-slate-400 mb-1">Last Name</label><input value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))} className={fieldCls} /></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
