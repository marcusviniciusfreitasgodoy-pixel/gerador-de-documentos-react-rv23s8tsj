/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LegalKnowledgePage from './pages/LegalKnowledge'
import MyProfilePage from './pages/MyProfile'
import ValidarMinutaPage from './pages/ValidarMinuta'
import ExpertSupportPage from './pages/ExpertSupport'
import ExpertSupportNewPage from './pages/ExpertSupportNew'
import ExpertSupportDetailPage from './pages/ExpertSupportDetail'
import Layout from './components/Layout'
import { ReservaPropostaForm } from '@/components/ReservaPropostaForm'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/legal-knowledge" element={<LegalKnowledgePage />} />
              <Route path="/validar" element={<ValidarMinutaPage />} />
              <Route path="/especialista" element={<ExpertSupportPage />} />
              <Route path="/especialista/nova" element={<ExpertSupportNewPage />} />
              <Route path="/especialista/:id" element={<ExpertSupportDetailPage />} />
              <Route path="/perfil" element={<MyProfilePage />} />
              <Route path="/proposta-reserva" element={<ReservaPropostaForm />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
