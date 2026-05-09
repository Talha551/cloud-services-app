import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { osImageService } from '../services/osImageService';
import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/UI/ErrorMessage';

export default function OsImagesPage() {
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['os-images'],
    queryFn: () => osImageService.list({ per_page: -1 }).then(r => r.data),
  });

  const { data: versionsData } = useQuery({
    queryKey: ['os-image-versions', expandedId],
    queryFn: () => osImageService.versions(expandedId).then(r => r.data),
    enabled: !!expandedId,
  });

  const columns = [
    { key: 'name',                 label: 'Name',    render: v => <span className="font-medium text-white">{v}</span> },
    { key: 'virtualization_type',  label: 'Type',    render: v => <span className="uppercase text-xs text-slate-400">{v || '—'}</span> },
    { key: 'versions_count',       label: 'Versions', render: (v, row) => v ?? '—' },
    { key: 'actions',              label: '',         render: (_, row) => (
      <button
        onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        Versions <ChevronRight size={12} className={`transition-transform ${expandedId === row.id ? 'rotate-90' : ''}`} />
      </button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="OS Images"
        subtitle="Available operating system images and versions"
        actions={<Button variant="secondary" onClick={() => refetch()}><RefreshCw size={13} /> Refresh</Button>}
      />
      {isLoading && <div className="flex justify-center py-20"><Spinner size={28} /></div>}
      {isError && <ErrorMessage message={error?.response?.data?.message || error?.message} />}
      {!isLoading && !isError && (
        <>
          <Table columns={columns} data={data?.data ?? []} onRowClick={() => {}} />
          {expandedId && (
            <div className="mt-4 bg-[#0f1117] border border-[#2a2d3e] rounded-xl p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Versions</h4>
              {versionsData?.data?.length ? (
                <div className="space-y-1">
                  {versionsData.data.map(v => (
                    <div key={v.id} className="flex items-center justify-between text-sm py-1.5 border-b border-[#1e2130] last:border-0">
                      <span className="text-slate-300">{v.label || v.version || v.id}</span>
                      <span className="text-xs text-slate-600">{v.url || v.location_url || ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No versions found</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
