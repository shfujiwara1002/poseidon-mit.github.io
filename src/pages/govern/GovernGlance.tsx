/**
 * GovernGlance — Glance-mode: big numbers + trust summary.
 */
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { GlassCard, CountUp } from '@/components/poseidon'

export function GovernGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
      aria-label="Governance overview"
    >
      {/* Big number hero */}
      <motion.div variants={fadeUp}>
        <GlassCard className="flex flex-col items-center gap-3 py-8 glass-hover-govern">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(59,130,246,0.12)' }}
          >
            <ShieldCheck size={24} style={{ color: 'var(--engine-govern)' }} />
          </div>
          <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
            <CountUp value={847} />
          </span>
          <span className="text-sm font-medium" style={{ color: '#CBD5E1' }}>
            decisions fully audited
          </span>
          <span className="text-xs" style={{ color: 'var(--engine-govern)' }}>100% traceable</span>
        </GlassCard>
      </motion.div>

      {/* Trust metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div variants={fadeUp}>
          <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-govern">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Confidence</span>
            <span className="text-2xl font-bold" style={{ color: '#10B981' }}>
              <CountUp value={97} suffix="%" />
            </span>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-govern">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Verified</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--engine-govern)' }}>
              <CountUp value={812} />
            </span>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-govern">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Pending</span>
            <span className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
              <CountUp value={28} />
            </span>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-govern">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Flagged</span>
            <span className="text-2xl font-bold" style={{ color: '#EF4444' }}>
              <CountUp value={7} />
            </span>
          </GlassCard>
        </motion.div>
      </div>
    </motion.section>
  )
}

GovernGlance.displayName = 'GovernGlance'
