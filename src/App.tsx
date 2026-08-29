import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup, { Abertura } from './pages/Signup'
import DocumentosPage, { ImobiliariasPage } from './pages/Documentos'
import Planos from './pages/Planos'
import Index from './pages/Index'
import Distrato from './pages/Distrato'
import Permuta from './pages/Permuta'
import PropostaReserva from './pages/PropostaReserva'
import Negocios from './pages/Negocios'
import NegocioDetalhe from './pages/NegocioDetalhe'
import ChamadoDetalhe from './pages/ChamadoDetalhe'
import ExpertSupport from './pages/ExpertSupport'
import ExpertSupportNew from './pages/ExpertSupportNew'
import ExpertSupportDetail from './pages/ExpertSupportDetail'
import LegalKnowledge from './pages/LegalKnowledge'
import ValidarMinuta from './pages/ValidarMinuta'
import MyProfile from './pages/MyProfile'
import Equipe from './pages/Equipe'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/sonner'

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Abertura publica: o "/" cai na landing nova para quem nao esta logado; quem esta entra no painel */}
          <Route
            path="/"
            element={
              <ProtectedRoute publicElement={<Abertura />}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/documentos" element={<DocumentosPage />} />
          <Route path="/imobiliarias" element={<ImobiliariasPage />} />
          <Route path="/planos" element={<Planos />} />

          {/* App autenticado */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/distrato"
            element={
              <ProtectedRoute>
                <Layout>
                  <Distrato />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/permuta"
            element={
              <ProtectedRoute>
                <Layout>
                  <Permuta />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/proposta-reserva"
            element={
              <ProtectedRoute>
                <Layout>
                  <PropostaReserva />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/validar-minuta"
            element={
              <ProtectedRoute>
                <Layout>
                  <ValidarMinuta />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/negocios"
            element={
              <ProtectedRoute>
                <Layout>
                  <Negocios />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/negocios/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <NegocioDetalhe />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/equipe"
            element={
              <ProtectedRoute>
                <Layout>
                  <Equipe />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/suporte-especialista"
            element={
              <ProtectedRoute>
                <Layout>
                  <ExpertSupport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/suporte-especialista/novo"
            element={
              <ProtectedRoute>
                <Layout>
                  <ExpertSupportNew />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/suporte-especialista/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ExpertSupportDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/base-conhecimento"
            element={
              <ProtectedRoute>
                <Layout>
                  <LegalKnowledge />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/chamados/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ChamadoDetalhe />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirecionamentos de compatibilidade para rotas antigas */}
          <Route path="/distrato" element={<Navigate to="/app/distrato" replace />} />
          <Route path="/permuta" element={<Navigate to="/app/permuta" replace />} />
          <Route
            path="/proposta-reserva"
            element={<Navigate to="/app/proposta-reserva" replace />}
          />
          <Route path="/validar-minuta" element={<Navigate to="/app/validar-minuta" replace />} />
          <Route path="/negocios" element={<Navigate to="/app/negocios" replace />} />
          <Route path="/negocios/:id" element={<Navigate to="/app/negocios/:id" replace />} />
          <Route path="/perfil" element={<Navigate to="/app/perfil" replace />} />
          <Route path="/equipe" element={<Navigate to="/app/equipe" replace />} />
          <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
          <Route
            path="/suporte-especialista/*"
            element={<Navigate to="/app/suporte-especialista" replace />}
          />
          <Route
            path="/base-conhecimento"
            element={<Navigate to="/app/base-conhecimento" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  )
}

export default App
