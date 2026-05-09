export default function StatusBadge({ status }) {
  const map = {
    running:   'bg-green-500/15 text-green-400 border-green-500/30',
    stopped:   'bg-red-500/15 text-red-400 border-red-500/30',
    suspended: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    active:    'bg-green-500/15 text-green-400 border-green-500/30',
    inactive:  'bg-slate-500/15 text-slate-400 border-slate-500/30',
    pending:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  const cls = map[status?.toLowerCase()] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {status ?? 'unknown'}
    </span>
  );
}
