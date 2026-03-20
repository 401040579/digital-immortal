import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, X, Search } from 'lucide-react'
import { memoryNodes } from '../data/mockData'
import type { MemoryNode } from '../store/useStore'
import { useStore } from '../store/useStore'

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

const typeLabels: Record<string, string> = {
  experience: '经历',
  knowledge: '知识',
  opinion: '观点',
  relationship: '关系',
  preference: '偏好',
}

export function MemoryPage() {
  const { profile, setCurrentPage } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [nodes, setNodes] = useState<SimNode[]>([])
  const animRef = useRef<number>(0)
  const nodesRef = useRef<SimNode[]>([])

  // Initialize nodes with positions
  useEffect(() => {
    const w = containerRef.current?.clientWidth ?? 600
    const h = containerRef.current?.clientHeight ?? 500
    const centerX = w / 2
    const centerY = h / 2

    const simNodes: SimNode[] = memoryNodes.map((n, i) => {
      const angle = (i / memoryNodes.length) * Math.PI * 2
      const radius = 120 + Math.random() * 80
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
      // Center gravity
      node.vx += (centerX - node.x) * 0.001
      node.vy += (centerY - node.y) * 0.001

      // Repulsion between nodes
      for (const other of ns) {
        if (node.id === other.id) continue
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist < 100) {
          const force = (100 - dist) * 0.02
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }
      }

      // Attraction along edges
      for (const connId of node.connections) {
        const other = ns.find((n) => n.id === connId)
        if (!other) continue
        const dx = other.x - node.x
        const dy = other.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist > 80) {
          node.vx += dx * 0.003
          node.vy += dy * 0.003
        }
      }

      // Damping
      node.vx *= 0.9
      node.vy *= 0.9
      node.x += node.vx
      node.y += node.vy

      // Bounds
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

    const filteredIds = searchQuery
      ? memoryNodes.filter((n) => n.label.includes(searchQuery) || n.content.includes(searchQuery)).map((n) => n.id)
      : null

    // Draw edges
    for (const node of nodes) {
      for (const connId of node.connections) {
        const other = nodes.find((n) => n.id === connId)
        if (!other) continue
        const isHighlighted = !filteredIds || (filteredIds.includes(node.id) && filteredIds.includes(other.id))
        ctx.strokeStyle = isHighlighted ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(other.x, other.y)
        ctx.stroke()
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHighlighted = !filteredIds || filteredIds.includes(node.id)
      const isSelected = selectedNode?.id === node.id
      const size = 8 + node.importance * 14
      const alpha = isHighlighted ? 1 : 0.2

      // Glow
      if (isSelected || (isHighlighted && node.importance > 0.7)) {
        ctx.shadowColor = typeColors[node.type]
        ctx.shadowBlur = 15
      }

      ctx.globalAlpha = alpha
      ctx.fillStyle = typeColors[node.type]
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
      ctx.fill()

      // Inner glow
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.beginPath()
      ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // Label
      if (isHighlighted) {
        ctx.fillStyle = isHighlighted ? '#e2e0f0' : 'rgba(226,224,240,0.3)'
        ctx.font = '11px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + size + 14)
      }
    }
  }, [nodes, searchQuery, selectedNode])

  // Click handler
  function handleCanvasClick(e: React.MouseEvent) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (const node of nodes) {
      const size = 8 + node.importance * 14
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
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          创建分身
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 mt-4">
          <div>
            <h1 className="text-xl font-bold text-primary-100 flex items-center gap-2">
              <Brain size={22} className="text-primary-400" />
              记忆图谱
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {memoryNodes.length} 条记忆 &middot; 点击节点查看详情
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索记忆..."
            className="w-full bg-surface-100 border border-primary-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full" style={{ background: typeColors[key] }} />
              {label}
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
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedNode.content}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>类型: <span className="text-primary-300">{typeLabels[selectedNode.type]}</span></span>
                <span>重要性: <span className="text-primary-300">{Math.round(selectedNode.importance * 100)}%</span></span>
                <span>
                  情感:
                  <span className={selectedNode.emotionalValence > 0 ? 'text-warm-400' : selectedNode.emotionalValence < 0 ? 'text-blue-400' : 'text-gray-400'}>
                    {' '}{selectedNode.emotionalValence > 0 ? '正面' : selectedNode.emotionalValence < 0 ? '负面' : '中性'}
                  </span>
                </span>
                <span>关联: <span className="text-primary-300">{selectedNode.connections.length} 条记忆</span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
