import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'
import { challengeQuestions, type ChallengeQuestion } from '../data/challengeData'
import { NebulaAvatar } from '../components/NebulaAvatar'

type GameState = 'intro' | 'playing' | 'result'

export function ChallengePage() {
  const { profile, setCurrentPage } = useStore()
  const [gameState, setGameState] = useState<GameState>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<('A' | 'B')[]>([])

  // Randomly select 5 questions for each game
  const selectedQuestions = useMemo(() => {
    const shuffled = [...challengeQuestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5)
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Gamepad2 size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          创建分身
        </button>
      </div>
    )
  }

  const question: ChallengeQuestion | undefined = selectedQuestions[currentQ]
  const correctCount = answers.reduce((acc, a, i) => {
    return acc + (a === selectedQuestions[i].correctAnswer ? 1 : 0)
  }, 0)
  const totalQuestions = 5
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

  function handleSelectAnswer(answer: 'A' | 'B') {
    if (selectedAnswer) return
    setSelectedAnswer(answer)
    setShowExplanation(true)
  }

  function handleNext() {
    if (selectedAnswer) {
      setAnswers([...answers, selectedAnswer])
    }

    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setGameState('result')
    }
  }

  function resetGame() {
    setGameState('intro')
    setCurrentQ(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setAnswers([])
  }

  function getResultTitle() {
    if (accuracy >= 80) return '默契十足！'
    if (accuracy >= 60) return '还不错！'
    if (accuracy >= 40) return '继续了解中...'
    return '还需多多交流~'
  }

  function getResultDesc() {
    if (accuracy >= 80) return '你对分身的了解非常深入，你们之间的默契度很高！'
    if (accuracy >= 60) return '你已经比较了解分身了，再多聊聊会更默契！'
    if (accuracy >= 40) return '有些了解但还有提升空间，多和分身对话吧！'
    return '看来你还需要和分身多多交流，它在等你！'
  }

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Intro */}
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gamepad2 size={64} className="text-primary-400 mx-auto mb-6" />
              </motion.div>

              <h1 className="text-2xl font-bold text-primary-100 mb-3">相似度挑战</h1>
              <p className="text-gray-400 mb-2 max-w-sm mx-auto leading-relaxed">
                AI会出题，给你两个回复选项。
                <br />
                猜猜看哪个是你的分身说的！
              </p>
              <p className="text-xs text-gray-500 mb-8">共5道题，看看你有多了解自己的数字分身</p>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold border-3 border-surface-50 z-10">
                    你
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-surface-50">
                    <NebulaAvatar size={48} animate={false} />
                  </div>
                </div>
                <span className="text-sm text-gray-400">VS</span>
                <div className="text-sm text-primary-300">谁说的？</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGameState('playing')}
                className="bg-gradient-to-r from-primary-600 to-warm-500 text-white px-8 py-4 rounded-2xl text-lg font-medium flex items-center gap-2 mx-auto cursor-pointer"
              >
                开始挑战
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Playing */}
          {gameState === 'playing' && question && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="py-8"
            >
              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-surface-200/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-600 to-warm-400 rounded-full"
                    animate={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-primary-300 font-medium">{currentQ + 1}/{totalQuestions}</span>
              </div>

              {/* Scenario */}
              <div className="bg-surface-100/50 border border-primary-900/30 rounded-2xl p-5 mb-6">
                <div className="text-xs text-gray-500 mb-2">场景</div>
                <p className="text-primary-100 font-medium">{question.scenario}</p>
              </div>

              <div className="text-sm text-gray-400 mb-4 text-center">
                下面哪个是你的分身会说的？
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {['A', 'B'].map((opt) => {
                  const isCorrect = opt === question.correctAnswer
                  const isSelected = selectedAnswer === opt
                  const showResult = showExplanation

                  let borderClass = 'border-primary-900/30 hover:border-primary-700/40'
                  let bgClass = 'bg-surface-100/50'
                  if (showResult && isCorrect) {
                    borderClass = 'border-green-500/50'
                    bgClass = 'bg-green-500/10'
                  } else if (showResult && isSelected && !isCorrect) {
                    borderClass = 'border-red-500/50'
                    bgClass = 'bg-red-500/10'
                  } else if (isSelected) {
                    borderClass = 'border-primary-500'
                    bgClass = 'bg-primary-600/20'
                  }

                  return (
                    <motion.button
                      key={opt}
                      whileHover={!selectedAnswer ? { scale: 1.01 } : {}}
                      whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectAnswer(opt as 'A' | 'B')}
                      disabled={!!selectedAnswer}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer disabled:cursor-default ${borderClass} ${bgClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          showResult && isCorrect ? 'bg-green-500 text-white' :
                          showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-primary-500 text-white' :
                          'bg-surface-200/50 text-gray-400'
                        }`}>
                          {showResult && isCorrect ? <CheckCircle2 size={16} /> :
                           showResult && isSelected && !isCorrect ? <XCircle size={16} /> :
                           opt}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed flex-1">
                          {opt === 'A' ? question.optionA : question.optionB}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className={`rounded-xl p-4 border ${
                      selectedAnswer === question.correctAnswer
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedAnswer === question.correctAnswer ? (
                          <>
                            <CheckCircle2 size={16} className="text-green-400" />
                            <span className="text-sm font-medium text-green-400">回答正确！</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-red-400" />
                            <span className="text-sm font-medium text-red-400">答错了~</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{question.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    {currentQ < totalQuestions - 1 ? '下一题' : '查看结果'}
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Result */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Trophy size={64} className={`mx-auto mb-6 ${
                  accuracy >= 80 ? 'text-yellow-400' :
                  accuracy >= 60 ? 'text-primary-400' :
                  'text-gray-400'
                }`} />
              </motion.div>

              <h2 className="text-2xl font-bold text-primary-100 mb-2">{getResultTitle()}</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">{getResultDesc()}</p>

              {/* Score display */}
              <div className="relative w-36 h-36 mx-auto mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={accuracy >= 80 ? '#facc15' : accuracy >= 60 ? '#8b5cf6' : '#f97316'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 251 - (accuracy / 100) * 251 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl font-bold text-primary-200"
                  >
                    {correctCount}/{totalQuestions}
                  </motion.span>
                  <span className="text-xs text-gray-500">正确率 {accuracy}%</span>
                </div>
              </div>

              {/* Answer review */}
              <div className="space-y-2 mb-8 max-w-md mx-auto">
                {selectedQuestions.map((q, i) => {
                  const isCorrect = answers[i] === q.correctAnswer
                  return (
                    <div key={q.id} className="flex items-center gap-3 text-left">
                      {isCorrect ? (
                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                      ) : (
                        <XCircle size={16} className="text-red-400 shrink-0" />
                      )}
                      <span className="text-xs text-gray-400 flex-1 truncate">{q.scenario}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetGame}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={18} />
                  再来一局
                </motion.button>
                <button
                  onClick={() => setCurrentPage('chat')}
                  className="bg-surface-100 hover:bg-surface-200 text-primary-300 px-6 py-3 rounded-xl font-medium cursor-pointer"
                >
                  去聊天
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
