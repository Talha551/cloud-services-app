import { Loader2 } from 'lucide-react';

export default function Button({ children, loading, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:   'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'bg-[#1e2130] hover:bg-[#262a3d] text-slate-300 border border-[#3a3f55]',
    danger:    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
    ghost:     'text-slate-400 hover:text-slate-200 hover:bg-[#1e2130]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
