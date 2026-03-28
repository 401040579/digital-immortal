import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, X, Search, Filter, Clock, Tag } from 'lucide-react'
import { memoryNodes } from '../data/mockData'
import type { MemoryNode } from '../store/useStore'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'

interface SimNode extends MemoryNode {
  x: number
  y: number
  vx: number
  vy: number
}

const typeColors: Record<string, string> = {
  experience: '#8b5cf6',
  knowledge: '#3b82f6',
  opinion: '#f97316',
  relationship: '#ec4899',
  preference: '#10b981',
}

export function MemoryPage() {
  const { profile, setCurrentPage } = useStore()
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterTime, setFilterTime] = useState<string | null>(null)
  const [nodes, setNodes] = useState<SimNode[]>([])
  const animRef = useRef<number>(0)
  const nodesRef = useRef<SimNode[]>([])

  const typeLabels: Record<string, string> = {
    experience: t('memory.typeLabels.experience'),
    knowledge: t('memory.typeLabels.knowledge'),
    opinion: t('memory.typeLabels.opinion'),
    relationship: t('memory.typeLabels.relationship'),
    preference: t('memory.typeLabels.preference'),
  }

  // Filter nodes
  const filteredNodes = memoryNodes.filter((n) => {
    if (filterType && n.type !== filterType) return false
    if (filterTime === 'core' && !n.isCore) return false
    if (filterTime === 'recent' && n.timestamp) {
      const year = parseInt(n.timestamp.split('-')[0])
      if (year < 2024) return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return n.label.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) ||
        (n.emotionTags && n.emotionTags.some(tag => tag.includes(q)))
    }
    return true
  })

  const filteredIds = new Set(filteredNodes.map((n) => n.id))

  // Initialize nodes with positions
  useEffect(() => {
    const w = containerRef.current?.clientWidth ?? 600
    const h = containerRef.current?.clientHeight ?? 500
    const centerX = w / 2
    const centerY = h / 2

    const simNodes: SimNode[] = memoryNodes.map((n, i) => {
      const angle = (i / memoryNodes.length) * Math.PI * 2
      const radius = 100 + Math.random() * 100
      return {
        ...n,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      }
    })
    setNodes(simNodes)
    nodesRef.current = simNodes
  }, [])

  // Simple force simulation
  const simulate = useCallback(() => {
    const w = containerRef.current?.clientWidth ?? 600
    const h = containerRef.current?.clientHeight ?? 500
    const centerX = w / 2
    const centerY = h / 2
    const ns = nodesRef.current

    for (const node of ns) {
      node.vx += (centerX - node.x) * 0.001
      node.vy += (centerY - node.y) * 0.001

      for (const other of ns) {
        if (node.id === other.id) continue
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist < 80) {
          const force = (80 - dist) * 0.025
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }
      }

      for (const connId of node.connections) {
        const other = ns.find((n) => n.id === connId)
        if (!other) continue
        const dx = other.x - node.x
        const dy = other.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist > 70) {
          node.vx += dx * 0.003
          node.vy += dy * 0.003
        }
      }

      node.vx *= 0.9
      node.vy *= 0.9
      node.x += node.vx
      node.y += node.vy

      node.x = Math.max(30, Math.min(w - 30, node.x))
      node.y = Math.max(30, Math.min(h - 30, node.y))
    }

    setNodes([...ns])
  }, [])

  // Animation loop
  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      simulate()
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
    }
  }, [simulate])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = containerRef.current?.clientWidth ?? 600
    const h = containerRef.current?.clientHeight ?? 500
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const hasFilter = searchQuery || filterType || filterTime

    // Draw edges
    for (const node of nodes) {
      for (const connId of node.connections) {
        const other = nodes.find((n) => n.id === connId)
        if (!other) continue
        const bothHighlighted = !hasFilter || (filteredIds.has(node.id) && filteredIds.has(other.id))
        ctx.strokeStyle = bothHighlighted ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.04)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(other.x, other.y)
        ctx.stroke()
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHighlighted = !hasFilter || filteredIds.has(node.id)
      const isSelected = selectedNode?.id === node.id
      const baseSize = 6 + node.importance * 12
      const size = node.isCore ? baseSize + 2 : baseSize
      const alpha = isHighlighted ? 1 : 0.15

      if (isSelected || (isHighlighted && node.importance > 0.7)) {
        ctx.shadowColor = typeColors[node.type]
        ctx.shadowBlur = 15
      }

      ctx.globalAlpha = alpha
      ctx.fillStyle = typeColors[node.type]
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
      ctx.fill()

      // Core memory ring
      if (node.isCore && isHighlighted) {
        ctx.strokeStyle = typeColors[node.type]
        ctx.lineWidth = 1.5
        ctx.globalAlpha = alpha * 0.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, size + 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      if (isHighlighted) {
        ctx.fillStyle = '#e2e0f0'
        ctx.globalAlpha = alpha
        ctx.font = '10px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + size + 14)
        ctx.globalAlpha = 1
      }
    }
  }, [nodes, searchQuery, selectedNode, filterType, filterTime, filteredIds])

  // Click handler
  function handleCanvasClick(e: React.MouseEvent) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (const node of nodes) {
      const size = 6 + node.importance * 12
      const dx = x - node.x
      const dy = y - node.y
      if (dx * dx + dy * dy < (size + 5) * (size + 5)) {
        setSelectedNode(node)
        return
      }
    }
    setSelectedNode(null)
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Brain size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">{t('common.noAvatar')}</h2>
        <p className="text-gray-400 mb-6">{t('common.noAvatarDesc')}</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          {t('common.createAvatar')}
        </button>
      </div>
    )
  }

  const connectedNodes = selectedNode
    ? memoryNodes.filter((n) => selectedNode.connections.includes(n.id))
    : []

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 mt-4">
          <div>
            <h1 className="text-xl font-bold text-primary-100 flex items-center gap-2">
              <Brain size={22} className="text-primary-400" />
              {t('memory.title')}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {t('memory.memoryCount').replace('{count}', String(memoryNodes.length))} · {t('memory.coreCount').replace('{count}', String(memoryNodes.filter(n => n.isCore).length))} · {t('memory.clickToView')}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('memory.searchPlaceholder')}
            className="w-full bg-surface-100 border border-primary-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Type filter */}
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-gray-500" />
            <span className="text-[10px] text-gray-500 mr-1">{t('common.type')}:</span>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterType(filterType === key ? null : key)}
                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all ${
                  filterType === key
                    ? 'bg-primary-600/30 border border-primary-500/50'
                    : 'bg-surface-100/50 border border-transparent text-gray-400 hover:text-primary-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: typeColors[key] }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Time filter */}
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-gray-500" />
            <span className="text-[10px] text-gray-500 mr-1">{t('common.time')}:</span>
            {[
              { key: 'core', label: t('memory.timeFilters.core') },
              { key: 'recent', label: t('memory.timeFilters.recent') },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterTime(filterTime === f.key ? null : f.key)}
                className={`text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all ${
                  filterTime === f.key
                    ? 'bg-warm-500/20 border border-warm-500/50 text-warm-300'
                    : 'bg-surface-100/50 border border-transparent text-gray-400 hover:text-primary-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {(filterType || filterTime || searchQuery) && (
            <button
              onClick={() => { setFilterType(null); setFilterTime(null); setSearchQuery('') }}
              className="text-[10px] text-gray-500 hover:text-primary-300 cursor-pointer ml-auto"
            >
              {t('common.clearFilters')}
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full" style={{ background: typeColors[key] }} />
              {label} ({memoryNodes.filter(n => n.type === key).length})
            </div>
          ))}
        </div>

        {/* Graph */}
        <div
          ref={containerRef}
          className="relative bg-surface-100/30 border border-primary-900/30 rounded-2xl overflow-hidden"
          style={{ height: 500 }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer"
          />
        </div>

        {/* Node detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 bg-surface-100/50 border border-primary-900/30 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: typeColors[selectedNode.type] }} />
                  <h3 className="text-lg font-semibold text-primary-100">{selectedNode.label}</h3>
                  {selectedNode.isCore && (
                    <span className="text-[10px] bg-warm-500/20 text-warm-300 px-2 py-0.5 rounded-full">{t('memory.coreMemory')}</span>
                  )}
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedNode.content}</p>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                <span>{t('common.type')}: <span className="text-primary-300">{typeLabels[selectedNode.type]}</span></span>
                <span>{t('common.importance')}: <span className="text-primary-300">{Math.round(selectedNode.importance * 100)}%</span></span>
                <span>
                  {t('common.emotion')}:
                  <span className={selectedNode.emotionalValence > 0 ? 'text-warm-400' : selectedNode.emotionalValence < 0 ? 'text-blue-400' : 'text-gray-400'}>
                    {' '}{selectedNode.emotionalValence > 0 ? t('common.positive') : selectedNode.emotionalValence < 0 ? t('common.negative') : t('common.neutral')}
                    {' '}({selectedNode.emotionalValence > 0 ? '+' : ''}{selectedNode.emotionalValence.toFixed(1)})
                  </span>
                </span>
                {selectedNode.timestamp && (
                  <span>{t('common.time')}: <span className="text-primary-300">{selectedNode.timestamp}</span></span>
                )}
              </div>

              {/* Emotion tags */}
              {selectedNode.emotionTags && selectedNode.emotionTags.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Tag size={12} />
                    {t('memory.emotionTags')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.emotionTags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-primary-900/30 text-primary-300 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related dialogs */}
              {selectedNode.relatedDialogs && selectedNode.relatedDialogs.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">{t('memory.relatedDialogs')}</div>
                  <div className="space-y-1.5">
                    {selectedNode.relatedDialogs.map((dialog, i) => (
                      <div key={i} className="text-xs text-gray-300 bg-surface-200/30 px-3 py-2 rounded-lg border-l-2 border-primary-500/30">
                        "{dialog}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected nodes */}
              {connectedNodes.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">{t('memory.connectedMemories')} ({connectedNodes.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {connectedNodes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNode(n)}
                        className="flex items-center gap-1.5 text-xs bg-surface-200/30 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-primary-900/20 hover:text-primary-200 transition-colors cursor-pointer"
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: typeColors[n.type] }} />
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
