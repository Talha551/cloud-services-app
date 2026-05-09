import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a0c12] border-t border-white/5 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <Globe size={13} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm">CloudPanel</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              High-performance cloud infrastructure powered by SolusVM2.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</p>
            <div className="space-y-2">
              <Link to="/features" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Features</Link>
              <Link to="/pricing"  className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Account</p>
            <div className="space-y-2">
              <Link to="/login" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Sign In</Link>
              <Link to="/login" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Support</p>
            <div className="space-y-2">
              <a href="#" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Documentation</a>
              <a href="#" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} CloudPanel. All rights reserved.</p>
          <p className="text-xs text-slate-600">Powered by SolusVM2</p>
        </div>
      </div>
    </footer>
  );
}
