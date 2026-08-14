import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { bloodGroups, hospitals } from '../lib/data.js';
import HospitalCard from '../components/ui/HospitalCard.jsx';

export default function FindBlood() {
  const [group, setGroup] = useState('O+');
  const [query, setQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);

  const results = useMemo(() => {
    return hospitals
      .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
      .filter((h) => parseFloat(h.distance) <= maxDistance)
      .sort((a, b) => (b.stock[group] || 0) - (a.stock[group] || 0));
  }, [group, query, maxDistance]);

  return (
    <div className="min-h-screen bg-paper-dim pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Find blood</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Search nearby availability
          </h1>
        </motion.div>

        {/* controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass mt-10 rounded-3xl p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hospitals or area..."
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

          <div className="mt-5 flex items-center gap-4 border-t border-ink/8 pt-5">
            <SlidersHorizontal size={16} className="text-ink-soft" />
            <label className="flex flex-1 items-center gap-3 text-xs text-ink-soft">
              Within
              <input
                type="range"
                min="1"
                max="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="flex-1 accent-blood-600"
              />
              <span className="font-mono font-semibold text-ink">{maxDistance} km</span>
            </label>
          </div>
        </motion.div>

        <p className="mt-8 text-sm text-ink-soft">
          {results.length} hospital{results.length !== 1 ? 's' : ''} found with {group}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((h, i) => (
            <HospitalCard key={h.id} hospital={h} highlightGroup={group} index={i} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-16 text-center text-ink-soft">No hospitals match those filters yet.</div>
        )}
      </div>
    </div>
  );
}
