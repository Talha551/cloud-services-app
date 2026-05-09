import { Link } from 'react-router-dom';
import {
  Server, Zap, Shield, Globe, Activity, HardDrive,
  ArrowRight, CheckCircle2, Cpu, Network, Clock
} from 'lucide-react';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';

function GradientBlob({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />;
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    blue:   'bg-blue-500/10 text-blue-400',
    green:  'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    pink:   'bg-pink-500/10 text-pink-400',
  };
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBadge({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-slate-400">
      <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
      {text}
    </li>
  );
}

const features = [
  { icon: Zap,      color: 'indigo', title: 'Instant Deployment',      desc: 'Spin up VPS instances in seconds. KVM-powered virtual machines with dedicated resources and full root access.' },
  { icon: Shield,   color: 'green',  title: 'Automatic Backups',        desc: 'Daily automated backups with one-click restore. Keep your data safe with configurable backup schedules.' },
  { icon: Activity, color: 'blue',   title: 'Real-Time Monitoring',     desc: 'Live CPU, RAM, disk, and network metrics. Get instant alerts on performance anomalies before they impact your users.' },
  { icon: Network,  color: 'purple', title: 'Advanced Networking',      desc: 'IPv4 & IPv6 support, VPC networks, custom IP blocks. Full control over your networking topology.' },
  { icon: HardDrive,color: 'yellow', title: 'Flexible Storage',         desc: 'NVMe SSD storage with expandable volumes. Attach additional disks on the fly without downtime.' },
  { icon: Globe,    color: 'pink',   title: 'Multiple Locations',       desc: 'Deploy globally across multiple data centers. Choose the region closest to your users for minimal latency.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <GradientBlob className="w-[600px] h-[600px] bg-indigo-600 -top-40 -left-40" />
        <GradientBlob className="w-[400px] h-[400px] bg-purple-600 top-20 right-0" />

        <div className="relative max-w-6xl mx-auto px-5 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 mb-6">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Powered by SolusVM2 — Enterprise-grade infrastructure
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Cloud Servers
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built for Speed
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy high-performance KVM virtual machines in seconds.
            Full root access, NVMe SSD storage, and 24/7 monitoring
            — all managed from one powerful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
            >
              Deploy Now <ArrowRight size={15} />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Explore Features
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-white/5">
            <StatBadge value="99.9%" label="Uptime SLA" />
            <StatBadge value="<1s"   label="Deploy Time" />
            <StatBadge value="NVMe"  label="SSD Storage" />
            <StatBadge value="24/7"  label="Support" />
          </div>
        </div>
      </section>

      {/* Server preview mockup */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4 bg-white/[0.04] rounded-md px-3 py-1 text-xs text-slate-600">
              cloudpanel.io/admin
            </div>
          </div>
          {/* Dashboard preview */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Servers', value: '24', color: 'text-indigo-400', icon: Server },
              { label: 'Running',       value: '21', color: 'text-green-400',  icon: Activity },
              { label: 'CPU Usage',     value: '34%',color: 'text-blue-400',   icon: Cpu },
              { label: 'Storage Used',  value: '1.2TB',color:'text-yellow-400',icon: HardDrive },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-slate-600 mb-1">{label}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <Icon size={14} className="text-slate-700" />
                </div>
              </div>
            ))}
          </div>
          <div className="mx-6 mb-6 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 px-4 py-2 bg-white/[0.03] text-xs text-slate-600 font-medium">
              <span>Name</span><span>Status</span><span>IP</span><span>Plan</span><span>Location</span>
            </div>
            {[
              { name: 'web-prod-01',  status: 'Running',  ip: '185.x.x.1',  plan: 'Pro 4',    loc: 'Frankfurt' },
              { name: 'db-primary',   status: 'Running',  ip: '185.x.x.2',  plan: 'Pro 8',    loc: 'Frankfurt' },
              { name: 'api-server',   status: 'Running',  ip: '185.x.x.3',  plan: 'Starter',  loc: 'London' },
              { name: 'staging-01',   status: 'Stopped',  ip: '185.x.x.4',  plan: 'Starter',  loc: 'Amsterdam' },
            ].map(row => (
              <div key={row.name} className="grid grid-cols-5 px-4 py-2.5 text-xs text-slate-400 border-t border-white/[0.04] hover:bg-white/[0.02]">
                <span className="text-white font-medium">{row.name}</span>
                <span className={row.status === 'Running' ? 'text-green-400' : 'text-red-400'}>{row.status}</span>
                <span className="font-mono">{row.ip}</span>
                <span>{row.plan}</span>
                <span>{row.loc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-slate-500 max-w-xl mx-auto">A complete cloud management platform with every tool to deploy, manage, and scale your infrastructure.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden py-20">
        <GradientBlob className="w-[500px] h-[500px] bg-indigo-700 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Why choose CloudPanel?</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">Built on SolusVM2 — the most advanced VPS management platform available. We give you full control with an intuitive interface.</p>
              <ul className="space-y-3">
                <CheckItem text="Deploy KVM VMs in under 60 seconds" />
                <CheckItem text="Full root access — you own your server" />
                <CheckItem text="Automatic daily backups included" />
                <CheckItem text="Instant VNC console access" />
                <CheckItem text="IPv4 + IPv6 support on all plans" />
                <CheckItem text="No setup fees or hidden charges" />
              </ul>
              <Link to="/pricing" className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
                View Pricing <ArrowRight size={14} />
              </Link>
            </div>
            {/* Uptime card */}
            <div className="space-y-3">
              {[
                { label: 'web-prod-01',  uptime: '99.98%', ping: '2ms',  color: 'bg-green-400' },
                { label: 'db-primary',   uptime: '99.99%', ping: '1ms',  color: 'bg-green-400' },
                { label: 'api-server',   uptime: '99.95%', ping: '4ms',  color: 'bg-green-400' },
                { label: 'cdn-node',     uptime: '100%',   ping: '1ms',  color: 'bg-green-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.color} shadow-lg shadow-green-500/50`} />
                    <span className="text-sm text-slate-300">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                      <p className="text-slate-500">Uptime</p>
                      <p className="text-green-400 font-medium">{s.uptime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500">Latency</p>
                      <p className="text-slate-300 font-medium">{s.ping}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-2">
                <Clock size={13} className="text-indigo-400" />
                <span className="text-xs text-slate-500">Last checked: just now</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-10 text-center relative overflow-hidden">
          <GradientBlob className="w-64 h-64 bg-indigo-600 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to launch your first server?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Get started in minutes. No credit card required to explore the platform.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 text-sm"
            >
              Get Started Free <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
