import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MobileMenu from './components/Nav/MobileMenu';
import Sidebar from './components/Nav/Sidebar';
import LoginPage from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import BuscarLibrosPage from './pages/Libros/BuscarLibros';
import BuscarLibroIDPage from './pages/Libros/BuscarLibroID';
import NuevoLibroPage from './pages/Libros/NuevoLibro';
import BuscarAutorIDPage from './pages/Autores/BuscarAutorID';
import BuscarAutorNombrePage from './pages/Autores/BuscarAutorNombre';
import NuevoAutorPage from './pages/Autores/NuevoAutor';

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Ruta actual para redirección después de login
  const from = location.state?.from?.pathname || '/libros/buscar';

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar user={user} onLogout={handleLogout} />
        <MobileMenu user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-x-hidden">
          <div className="md:ml-64 pt-16 md:pt-0">
            <Routes>
              {/* Rutas protegidas */}
              <Route path="/libros/buscar" element={<BuscarLibrosPage />} />
              <Route path="/libros/buscar-id" element={<BuscarLibroIDPage />} />
              <Route path="/libros/nuevo" element={<NuevoLibroPage />} />
              
              <Route path="/autores/buscar-id" element={<BuscarAutorIDPage />} />
              <Route path="/autores/buscar-nombre" element={<BuscarAutorNombrePage />} />
              <Route path="/autores/nuevo" element={<NuevoAutorPage />} />
              
              {/* Redirección desde raíz si está autenticado */}
              <Route path="/" element={<Navigate to={from} replace />} />
              
              {/* Catch-all para rutas no definidas */}
              <Route path="*" element={<Navigate to="/libros/buscar" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;