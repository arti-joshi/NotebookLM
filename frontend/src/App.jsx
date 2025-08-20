import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import UploadPage from './pages/UploadPage.jsx'
import ReaderPage from './pages/ReaderPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ChatWidget from './components/ChatWidget.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link to="/" className="font-semibold text-lg">NotebookLM Clone</Link>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <NavLink to="/upload" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Upload</NavLink>
              <NavLink to="/reader" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Reader</NavLink>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Dashboard</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/reader" element={<ReaderPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
      <ChatWidget />
    </BrowserRouter>
  )
}

export default App
