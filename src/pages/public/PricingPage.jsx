import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';

function GradientBlob({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />;
}

const plans = [
  {
    name: 'Starter',
    price: '$5',
    period: '/mo',
    desc: 'Perfect for personal projects and small websites.',
    highlight: false,
    features: ['1 vCPU', '1 GB RAM', '25 GB NVMe SSD', '1 TB Bandwidth', '1 IPv4 Address', 'Automated Backups', 'VNC Console', '24/7 Support'],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    desc: 'Ideal for growing applications and small businesses.',
    highlight: true,
    badge: 'Most Popular',
    features: ['2 vCPU', '4 GB RAM', '80 GB NVMe SSD', '3 TB Bandwidth', '1 IPv4 + IPv6', 'Automated Backups', 'VNC Console', 'Priority Support'],
  },
  {
    name: 'Business',
    price: '$24',
    period: '/mo',
    desc: 'For production workloads that demand performance.',
    highlight: false,
    features: ['4 vCPU', '8 GB RAM', '160 GB NVMe SSD', '6 TB Bandwidth', '2 IPv4 + IPv6', 'Daily Snapshots', 'VNC Console', 'Priority Support'],
  },
  {
    name: 'Enterprise',
    price: '$48',
    period: '/mo',
    desc: 'Maximum power for resource-intensive applications.',
    highlight: false,
    features: ['8 vCPU', '16 GB RAM', '320 GB NVMe SSD', 'Unlimited BW', '4 IPv4 + IPv6', 'Hourly Snapshots', 'Dedicated vCPU', 'Dedicated Support'],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 flex flex-col">
      <PublicNavbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <GradientBlob className="w-[500px] h-[500px] bg-indigo-600 -top-20 left-1/2 -translate-x-1/2" />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400 mb-5">
            <Zap size={11} /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Plans for every scale
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            No hidden fees. No contracts. Deploy as many servers as you need and only pay for what you use.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-indigo-600/10 border-indigo-500/40 shadow-xl shadow-indigo-500/10'
                  : 'bg-white/[0.02] border-white/[0.07]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 rounded-full text-xs font-semibold text-white whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className="mb-5">
                <p className="text-sm font-semibold text-white mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 size={12} className={plan.highlight ? 'text-indigo-400' : 'text-slate-600'} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ / compare note */}
        <div className="mt-12 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { q: 'Can I upgrade anytime?',   a: 'Yes. Resize your server to a larger plan at any time directly from the dashboard with zero downtime.' },
            { q: 'What payment methods?',    a: 'We accept all major credit cards and PayPal. Monthly billing with no long-term contracts required.' },
            { q: 'Is there a free trial?',   a: 'New accounts get a 3-day free trial on the Starter plan. No credit card required to start.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="text-sm font-semibold text-white mb-2">{q}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
