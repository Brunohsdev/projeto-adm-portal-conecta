import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AlunoProvider } from './context/Alunocontext'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Welcome from './pages/Welcome'
import Conectado from './pages/Conectado'

export default function App() {
  return (
    <AlunoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/conectado" element={<Conectado />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AlunoProvider>
  )
}