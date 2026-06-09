import { Routes, Route, Navigate } from 'react-router-dom'
import AdminOverview from '../admin/AdminOverview'

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  )
}
