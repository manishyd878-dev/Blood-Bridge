import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Boxes, Bell, User, Settings, Plus, Minus, Trash2, AlertTriangle, Droplets, Users, Activity,
} from 'lucide-react';
import DashboardShell from '../components/layout/DashboardShell.jsx';
import BarChart from '../components/ui/BarChart.jsx';
import StatusPill, { stockStatus } from '../components/ui/StatusPill.jsx';
import { bloodGroups, notifications } from '../lib/data.js';

const navItems = [
  { to: '/hospital-dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/hospital-dashboard', label: 'Inventory', icon: Boxes },
  { to: '/hospital-dashboard', label: 'Notifications', icon: Bell },
  { to: '/hospital-dashboard', label: 'Profile', icon: User },
  { to: '/hospital-dashboard', label: 'Settings', icon: Settings },
];

const initialStock = { 'A+': 12, 'A-': 2, 'B+': 20, 'B-': 0, 'AB+': 5, 'AB-': 1, 'O+': 30, 'O-': 4 };
const toneLabel = { green: 'Healthy', yellow: 'Low', red: 'Empty' };

export default function HospitalDashboard() {
  const [stock, setStock] = useState(initialStock);

  const totalUnits = useMemo(() => Object.values(stock).reduce((a, b) => a + b, 0), [stock]);
  const lowStockGroups = useMemo(() => bloodGroups.filter((g) => stock[g] < 5), [stock]);

  const update = (g, delta) => {
    setStock((s) => ({ ...s, [g]: Math.max(0, s[g] + delta) }));
  };
  const remove = (g) => setStock((s) => ({ ...s, [g]: 0 }));

  return (
    <DashboardShell
      title="Sanjeevani General Hospital"
      subtitle="Hospital dashboard"
      navItems={navItems}
      topRight={
        <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white">
          <Bell size={18} className="text-ink-soft" />
          {notifications.length > 0 && (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blood-600" />
          )}
        </button>
      }
    >
      {lowStockGroups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <AlertTriangle size={18} className="shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Low stock alert: <span className="font-semibold">{lowStockGroups.join(', ')}</span> need
            replenishment soon.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total units', value: totalUnits, icon: Droplets },
          { label: 'Blood groups low', value: lowStockGroups.length, icon: AlertTriangle },
          { label: 'Requests today', value: 14, icon: Users },
          { label: 'Response rate', value: '96%', icon: Activity },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/8 bg-white p-4">
            <s.icon size={16} className="text-blood-600" />
            <p className="mt-3 font-display text-2xl font-medium text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-ink/8 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Stock by blood group</h2>
          <div className="mt-6">
            <BarChart data={bloodGroups.map((g) => ({ label: g, value: stock[g] }))} />
          </div>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Notifications</h2>
          <div className="mt-4 space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl bg-mist/60 p-3">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    n.tone === 'caution' ? 'bg-amber-500' : n.tone === 'success' ? 'bg-emerald-500' : 'bg-blood-500'
                  }`}
                />
                <div>
                  <p className="text-sm text-ink">{n.text}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* blood group cards */}
      <h2 className="mt-10 font-display text-lg font-medium text-ink">Blood inventory</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {bloodGroups.map((g, i) => {
          const tone = stockStatus(stock[g]);
          return (
            <motion.div
              key={g}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-ink/8 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-xl font-medium text-blood-600">{g}</p>
                <StatusPill tone={tone} label={toneLabel[tone]} />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-ink">{stock[g]}</p>
              <p className="text-xs text-ink-soft">units available</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-mist">
                <motion.div
                  className={`h-full ${tone === 'red' ? 'bg-blood-500' : tone === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stock[g] / 30) * 100, 100)}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => update(g, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-soft hover:border-blood-600 hover:text-blood-600"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => update(g, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-soft hover:border-blood-600 hover:text-blood-600"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => remove(g)}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-soft hover:border-blood-600 hover:text-blood-600"
                  aria-label={`Clear ${g} stock`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* table */}
      <h2 className="mt-10 font-display text-lg font-medium text-ink">Inventory records</h2>
      <div className="mt-4 overflow-hidden rounded-3xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-4 font-semibold">Blood group</th>
              <th className="px-6 py-4 font-semibold">Units</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last updated</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bloodGroups.map((g) => {
              const tone = stockStatus(stock[g]);
              return (
                <tr key={g} className="border-b border-ink/6 last:border-0 hover:bg-mist/40">
                  <td className="px-6 py-4 font-medium text-ink">{g}</td>
                  <td className="px-6 py-4 font-mono">{stock[g]}</td>
                  <td className="px-6 py-4">
                    <StatusPill tone={tone} label={toneLabel[tone]} />
                  </td>
                  <td className="px-6 py-4 text-ink-soft">Today, 10:42 AM</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => update(g, 1)} className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold hover:border-blood-600 hover:text-blood-600">
                        Add unit
                      </button>
                      <button onClick={() => remove(g)} className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold hover:border-blood-600 hover:text-blood-600">
                        Clear
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
