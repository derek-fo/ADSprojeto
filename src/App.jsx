import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

import Splash      from './pages/Splash';
import Login       from './pages/Login';
import NovaConta   from './pages/NovaConta';
import ResetSenha  from './pages/ResetSenha';
import Inicio      from './pages/Inicio';
import Treinos      from './pages/Treinos';
import Treino      from './pages/Treino';
import NovoTreino  from './pages/NovoTreino';
import Comecar      from './pages/Comecar';
import Grupos      from './pages/Grupos';
import Perfil      from './pages/Perfil';
import Config      from './pages/Config';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<Navigate to="/splash" replace />} />
          <Route path="/splash"      element={<Splash />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/nova-conta"  element={<NovaConta />} />
          <Route path="/reset-senha" element={<ResetSenha />} />

          <Route path="/inicio"      element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
          <Route path="/treinos"      element={<ProtectedRoute><Treinos /></ProtectedRoute>} />
          <Route path="/treino/:id"  element={<ProtectedRoute><Treino /></ProtectedRoute>} />
          <Route path="/novo-treino" element={<ProtectedRoute><NovoTreino /></ProtectedRoute>} />
          <Route path="/comecar"      element={<ProtectedRoute><Comecar /></ProtectedRoute>} />
          <Route path="/grupos"      element={<ProtectedRoute><Grupos /></ProtectedRoute>} />
          <Route path="/perfil"      element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/config"      element={<ProtectedRoute><Config /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
