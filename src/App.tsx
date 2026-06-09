import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loading всех страниц
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Shows = lazy(() => import('./pages/Shows'))
const Podcasts = lazy(() => import('./pages/Podcasts'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))

// Оптимизированный QueryClient с увеличенными таймаутами
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 минут (было 5)
      gcTime: 1000 * 60 * 60, // 1 час (было 30 минут)
      retry: 2, // повторить 2 раза при ошибке
      retryDelay: 1000, // ждать 1 секунду между попытками
      refetchOnWindowFocus: false, // не обновлять при фокусе
      refetchOnReconnect: false, // не обновлять при переподключении
      networkMode: 'offlineFirst', // работать офлайн
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Основные страницы с Header */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/podcasts" element={<Podcasts />} />
              </Route>
              
              {/* Админка без Header */}
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<Admin />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
