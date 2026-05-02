import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute, Header } from '@/components'
import { LoginPage, CallbackPage, DashboardPage } from '@/pages'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
