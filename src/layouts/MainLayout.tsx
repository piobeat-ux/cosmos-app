// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />  {/* Только один Header! */}
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Cosmos Radio. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}