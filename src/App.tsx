import { useStore } from './store/useStore'
import { Navigation } from './components/Navigation'
import { LandingPage } from './pages/LandingPage'
import { CreatePage } from './pages/CreatePage'
import { ChatPage } from './pages/ChatPage'
import { SocialPage } from './pages/SocialPage'
import { MemoryPage } from './pages/MemoryPage'
import { CapsulePage } from './pages/CapsulePage'

function App() {
  const currentPage = useStore((s) => s.currentPage)

  const pages: Record<string, React.ReactNode> = {
    landing: <LandingPage />,
    create: <CreatePage />,
    chat: <ChatPage />,
    social: <SocialPage />,
    memory: <MemoryPage />,
    capsule: <CapsulePage />,
  }

  return (
    <>
      <div className="stars-bg" />
      <Navigation />
      <div className="relative z-10">
        {pages[currentPage] || <LandingPage />}
      </div>
    </>
  )
}

export default App
