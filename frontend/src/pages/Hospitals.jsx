import { motion } from 'framer-motion';
import { hospitals } from '../lib/data.js';
import HospitalCard from '../components/ui/HospitalCard.jsx';

export default function Hospitals() {
  return (
    <div className="min-h-screen pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Network</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Verified hospitals near you
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Every facility here has been licensed and inventory-audited before joining the network.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h, i) => (
            <HospitalCard key={h.id} hospital={h} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
