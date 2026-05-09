import { Link } from 'react-router-dom';
import {
  Zap, Shield, Activity, Globe, HardDrive, Network,
  Monitor, RefreshCw, Lock, Cpu, Server, ArrowRight,
  BarChart2, Key, Database
} from 'lucide-react';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';

function GradientBlob({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />;
}

function FeatureBlock({ icon: Icon, color, title, desc }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    blue:   'bg-blue-500/10 text-blue-400',
    green:  'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    pink:   'bg-pink-500/10 text-pink-400',
    sky:    'bg-sky-500/10 text-sky-400',
    orange: 'bg-orange-500/10 text-orange-400',
  };
  return (
    <div className="flex gap-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const allFeatures = [
  { icon: Zap,       color: 'indigo', title: 'Instant VM Deployment',       desc: 'KVM-based virtual machines deploy in under 60 seconds. Choose your OS, plan, and location — server is live instantly.' },
  { icon: Monitor,   color: 'blue',   title: 'VNC Console Access',          desc: 'Browser-based VNC console for direct server access even when SSH is unavailable. Emergency access at any time.' },
  { icon: Shield,    color: 'green',  title: 'Automated Backups',           desc: 'Scheduled daily backups with one-click restore. Keep multiple restore points and recover from any incident instantly.' },
  { icon: RefreshCw, color: 'purple', title: 'Snapshots',                   desc: 'Take point-in-time snapshots before major changes. Roll back instantly if anything goes wrong.' },
  { icon: Activity,  color: 'yellow', title: 'Real-Time Metrics',           desc: 'Live CPU, RAM, disk I/O, and network graphs. Historical usage data to plan capacity and optimize performance.' },
  { icon: Network,   color: 'pink',   title: 'VPC & Private Networking',    desc: 'Create private VPC networks to connect your servers securely without exposing traffic to the public internet.' },
  { icon: Globe,     color: 'sky',    title: 'IPv4 & IPv6',                 desc: 'Every server gets a dedicated IPv4 address. Native IPv6 support with /64 block available on all plans.' },
  { icon: HardDrive, color: 'orange', title: 'NVMe SSD Storage',            desc: 'All servers run on enterprise NVMe SSDs for maximum read/write performance. Expandable volumes with no downtime.' },
  { icon: Lock,      color: 'indigo', title: 'SSH Key Management',          desc: 'Manage SSH keys from the dashboard. Inject keys at deployment or add them to running servers.' },
  { icon: Cpu,       color: 'blue',   title: 'Dedicated vCPU Plans',        desc: 'Business and Enterprise plans feature dedicated vCPUs with no noisy-neighbor contention. Consistent performance guaranteed.' },
  { icon: BarChart2, color: 'green',  title: 'Bandwidth Monitoring',        desc: 'Track inbound and outbound traffic in real time. Get alerts before hitting bandwidth limits.' },
  { icon: Key,       color: 'purple', title: 'API Access',                  desc: 'Full REST API access to manage everything programmatically. Automate deployments, scaling, and monitoring.' },
  { icon: Database,  color: 'yellow', title: 'Flexible OS Images',          desc: 'Choose from dozens of pre-built OS images: Ubuntu, Debian, CentOS, AlmaLinux, Windows, and custom templates.' },
  { icon: Server,    color: 'pink',   title: 'Multi-Region Availability',   desc: 'Deploy in multiple data centers across different continents. Low-latency access for your global users.' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <GradientBlob className="w-[500px] h-[500px] bg-purple-600 -top-20 left-1/2 -translate-x-1/2" />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Everything in one place
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            A complete cloud management platform. From deploying your first VM to scaling a fleet of servers — we've got every tool you need.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            See Pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {allFeatures.map(f => <FeatureBlock key={f.title} {...f} />)}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm mb-4">Ready to experience all of this?</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25 text-sm"
          >
            Get Started Today <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
