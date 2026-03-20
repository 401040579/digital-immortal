import { motion } from 'framer-motion'

interface NebulaAvatarProps {
  size?: number
  className?: string
  animate?: boolean
}

export function NebulaAvatar({ size = 120, className = '', animate = true }: NebulaAvatarProps) {
  return (
    <motion.div
      className={`relative rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={animate ? { scale: [1, 1.03, 1] } : undefined}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.15,
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />
      {/* Main nebula body */}
      <div className="nebula-avatar absolute inset-0 rounded-full" />
      {/* Inner bright core */}
      <div
        className="absolute rounded-full"
        style={{
          inset: size * 0.3,
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(196,181,253,0.3) 50%, transparent 100%)',
          filter: 'blur(3px)',
        }}
      />
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent, rgba(139,92,246,0.15), transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}
