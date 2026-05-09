import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
      <AlertTriangle size={16} className="shrink-0" />
      {message || 'Something went wrong. Please try again.'}
    </div>
  );
}
