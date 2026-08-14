import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, ShieldCheck, Star } from 'lucide-react';
import StatusPill, { stockStatus } from './StatusPill.jsx';

const toneLabel = { green: 'In stock', yellow: 'Low stock', red: 'Out of stock' };

export default function HospitalCard({ hospital, highlightGroup, index = 0 }) {
  const groups = Object.entries(hospital.stock);
  const highlightUnits = highlightGroup ? hospital.stock[highlightGroup] : null;
  const overallTone = highlightGroup
    ? stockStatus(highlightUnits)
    : stockStatus(Math.max(...Object.values(hospital.stock)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-ink/8 bg-white p-6 shadow-[0_4px_20px_-10px_rgba(28,20,23,0.1)] transition-shadow hover:shadow-[0_20px_45px_-16px_rgba(220,38,38,0.22)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-medium text-ink">{hospital.name}</h3>
            {hospital.verified && <ShieldCheck size={16} className="shrink-0 text-emerald-600" />}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
            <MapPin size={13} /> {hospital.address} · {hospital.distance}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-ink">
          <Star size={12} className="fill-amber-400 text-amber-400" /> {hospital.rating}
        </div>
      </div>

      {highlightGroup ? (
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-blood-50 px-4 py-3">
          <div>
            <p className="text-xs text-ink-soft">{highlightGroup} available</p>
            <p className="font-display text-2xl font-medium text-blood-700">{highlightUnits} units</p>
          </div>
          <StatusPill tone={overallTone} label={toneLabel[overallTone]} />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-2">
          {groups.map(([g, units]) => (
            <div key={g} className="rounded-xl bg-mist px-2 py-2 text-center">
              <p className="text-[11px] font-semibold text-ink-soft">{g}</p>
              <p className={`font-mono text-sm font-semibold ${units === 0 ? 'text-blood-500' : 'text-ink'}`}>{units}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <a
          href={`tel:${hospital.phone}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/12 px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-blood-600 hover:text-blood-600"
        >
          <Phone size={14} /> Call
        </a>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/12 px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-blood-600 hover:text-blood-600">
          <Navigation size={14} /> Directions
        </button>
        <button className="flex-1 rounded-full bg-blood-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blood-700">
          Request blood
        </button>
      </div>
    </motion.div>
  );
}
