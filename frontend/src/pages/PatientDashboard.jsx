import { useMemo, useState } from 'react';
import { LayoutGrid, Search, History, User, Settings, Bell } from 'lucide-react';
import DashboardShell from '../components/layout/DashboardShell.jsx';
import HospitalCard from '../components/ui/HospitalCard.jsx';
import { bloodGroups, hospitals } from '../lib/data.js';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/find-blood', label: 'Find blood', icon: Search },
  { to: '/dashboard', label: 'Request history', icon: History },
  { to: '/dashboard', label: 'Profile', icon: User },
  { to: '/dashboard', label: 'Settings', icon: Settings },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const displayName = user?.name ? user.name.split(' ')[0] : 'Patient';
  const defaultGroup = user?.bloodGroup || 'B+';
  const [group, setGroup] = useState(defaultGroup);
  const [query, setQuery] = useState('');

  const results = useMemo(
    () =>
      hospitals
        .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (b.stock[group] || 0) - (a.stock[group] || 0)),
    [group, query]
  );

  return (
    <DashboardShell
      title={`Welcome back, ${displayName}`}
      subtitle="Patient portal"
      navItems={navItems}
      topRight={
        <div className="flex items-center gap-3">
          {user?.bloodGroup && (
            <span className="hidden sm:inline-block rounded-full bg-blood-100 px-3 py-1 text-xs font-semibold text-blood-700">
              Blood Group: {user.bloodGroup}
            </span>
          )}
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white">
            <Bell size={18} className="text-ink-soft" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blood-600" />
          </button>
        </div>
      }
    >
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospitals near you..."
              className="w-full rounded-full border border-ink/10 bg-white py-3.5 pl-11 pr-4 text-sm focus-ring"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {bloodGroups.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-ring ${
                  group === g ? 'bg-blood-600 text-white' : 'bg-white text-ink-soft hover:bg-mist'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active requests', value: '2' },
          { label: 'Matches nearby', value: results.length },
          { label: 'Saved hospitals', value: '5' },
          { label: 'Blood group', value: group },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/8 bg-white p-4">
            <p className="font-display text-2xl font-medium text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-medium text-ink">Nearby hospitals for {group}</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((h, i) => (
          <HospitalCard key={h.id} hospital={h} highlightGroup={group} index={i} />
        ))}
      </div>
    </DashboardShell>
  );
}
