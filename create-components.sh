#!/bin/bash

echo "🎨 Создаю компоненты и страницы..."

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dark-950 text-white antialiased;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transition-all;
  }
  .glass-card:hover {
    @apply bg-white/10 border-white/20;
  }
  .btn-primary {
    @apply px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl;
  }
  .btn-secondary {
    @apply px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20;
  }
  .input-field {
    @apply w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
  .textarea-field {
    @apply w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none;
  }
  .section-title {
    @apply text-4xl md:text-5xl font-bold mb-8 text-center;
  }
  .container-custom {
    @apply container mx-auto px-4;
  }
}

@keyframes audio-wave {
  0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}

.audio-wave-bar {
  animation: audio-wave 1s ease-in-out infinite;
  transform-origin: bottom;
}
.audio-wave-bar:nth-child(1) { animation-delay: 0s; }
.audio-wave-bar:nth-child(2) { animation-delay: 0.1s; }
.audio-wave-bar:nth-child(3) { animation-delay: 0.2s; }
.audio-wave-bar:nth-child(4) { animation-delay: 0.3s; }
.audio-wave-bar:nth-child(5) { animation-delay: 0.4s; }

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type="range"] {
  @apply appearance-none bg-transparent;
}
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-500 rounded-full cursor-pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
  @apply w-full h-1 bg-dark-700 rounded-lg;
}
EOF

# src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
EOF

# src/App.tsx
cat > src/App.tsx << 'EOF'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Shows from './pages/Shows'
import Podcasts from './pages/Podcasts'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
EOF

# src/components/Header.tsx
cat > src/components/Header.tsx << 'EOF'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { MenuItem } from '@/types'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      if (error) throw error
      return data as MenuItem[]
    },
  })

  const { data: siteName } = useQuery({
    queryKey: ['siteName'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_name')
        .single()
      return data?.value || 'Cosmos Radio'
    },
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary-400">
            {siteName}
          </Link>
          <ul className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.url}
                  className={`transition-colors ${
                    location.pathname === item.url
                      ? 'text-primary-400 font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 fade-in">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block ${
                      location.pathname === item.url
                        ? 'text-primary-400 font-semibold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
EOF

echo "✅ Компоненты созданы! Продолжение..."