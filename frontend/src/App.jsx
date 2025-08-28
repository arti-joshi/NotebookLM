// import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
// import UploadPage from './pages/UploadPage.jsx'
// import ReaderPage from './pages/ReaderPage.jsx'
// import DashboardPage from './pages/DashboardPage.jsx'
// import ChatWidget from './components/ChatWidget.jsx'

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen flex flex-col">
//         <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur sticky top-0 z-40">
//           <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
//             <Link to="/" className="font-semibold text-lg">NotebookLM Clone</Link>
//             <nav className="ml-auto flex items-center gap-4 text-sm">
//               <NavLink to="/upload" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Upload</NavLink>
//               <NavLink to="/reader" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Reader</NavLink>
//               <NavLink to="/dashboard" className={({isActive})=> isActive ? 'text-brand' : 'text-gray-600 dark:text-gray-300'}>Dashboard</NavLink>
//             </nav>
//           </div>
//         </header>
//         <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
//           <Routes>
//             <Route path="/" element={<UploadPage />} />
//             <Route path="/upload" element={<UploadPage />} />
//             <Route path="/reader" element={<ReaderPage />} />
//             <Route path="/dashboard" element={<DashboardPage />} />
//           </Routes>
//         </main>
//       </div>
//       <ChatWidget />
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import UploadPage from './pages/UploadPage.jsx'
import ReaderPage from './pages/ReaderPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { Navigate } from 'react-router-dom'

function RequireAuth({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (!token) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
        <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DocuChat
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <NavLink 
                  to="/upload" 
                  className={({isActive}) => 
                    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({isActive}) => (
                    <>
                      Upload
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
                <NavLink 
                  to="/reader" 
                  className={({isActive}) => 
                    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({isActive}) => (
                    <>
                      Reader
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({isActive}) => 
                    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({isActive}) => (
                    <>
                      Dashboard
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              </nav>

              {/* Theme Toggle & Mobile Menu */}
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/auth" 
                  className={({isActive}) => 
                    `hidden md:inline-block relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  Account
                </NavLink>
                <button
                  onClick={() => { try { localStorage.removeItem('auth_token') } catch {} window.location.href = '/auth' }}
                  className="hidden md:inline-block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border rounded-lg border-gray-200 dark:border-gray-700"
                >
                  Logout
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 animate-in slide-in-from-top duration-200">
                <nav className="flex flex-col space-y-2">
                  <NavLink 
                    to="/auth" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={() => { try { localStorage.removeItem('auth_token') } catch {} window.location.href = '/auth' }}
                    className="text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                  <NavLink 
                    to="/upload" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    Upload
                  </NavLink>
                  <NavLink 
                    to="/reader" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    Reader
                  </NavLink>
                  <NavLink 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </nav>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-in fade-in-50 duration-300">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<RequireAuth><UploadPage /></RequireAuth>} />
              <Route path="/upload" element={<RequireAuth><UploadPage /></RequireAuth>} />
              <Route path="/reader" element={<RequireAuth><ReaderPage /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            </Routes>
          </div>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Built with React + Vite • Enhanced Document Reading Experience
            </div>
          </div>
        </footer>
      </div>
      <ChatWidget />
    </BrowserRouter>
  )
}

export default App