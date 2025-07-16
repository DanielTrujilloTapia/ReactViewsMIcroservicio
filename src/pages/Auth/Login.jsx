import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaExclamationCircle,
  FaArrowRight,
  FaUserPlus
} from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ruta a la que redirigir después del login
  const from = location.state?.from?.pathname || '/libros/buscar';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Validación básica del frontend
      if (!credentials.username.trim() || !credentials.password.trim()) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      // 2. Fetch al endpoint de autenticación
      const response = await fetch(`https://microserviciologin-811z.onrender.com/api/LoginControlador/usuario/${encodeURIComponent(credentials.username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'Usuario no encontrado' 
          : `Error en el servidor (${response.status})`);
      }

      const userData = await response.json();

      // 3. Validación de credenciales
      if (!userData || userData.usuario !== credentials.username) {
        throw new Error('Credenciales inválidas');
      }

      // 4. Validación de contraseña
      if (userData.password !== credentials.password) {
        throw new Error('Credenciales inválidas');
      }

      // 5. Almacenar datos del usuario en localStorage
      const userToStore = {
        id: userData.id,
        username: userData.usuario,
        lastLogin: new Date().toISOString(),
        recoveryQuestion: userData.preguntaRecuperacion,
        token: userData.loginGuid
      };

      // 6. Notificar éxito y redirigir
      onLogin(userToStore);
      navigate(from, { replace: true });

    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-800">
            Sistema de Biblioteca
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestión profesional de recursos bibliográficos
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 mb-4 border border-red-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <div className="mt-1 text-xs text-red-700">
                  Verifique sus credenciales e intente nuevamente
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ingrese su usuario"
                  value={credentials.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ingrese su contraseña"
                  value={credentials.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <FaSpinner className="h-5 w-5 text-blue-200 animate-spin" />
                ) : (
                  <FaLock className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors" />
                )}
              </span>
              {loading ? 'Autenticando...' : 'Iniciar sesión'}
              <span className="absolute right-0 inset-y-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaArrowRight className="h-4 w-4 text-blue-200" />
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Nuevo en el sistema?
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaUserPlus className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
              </span>
              Crear una nueva cuenta
            </Link>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>© {new Date().getFullYear()} Sistema de Biblioteca. Todos los derechos reservados.</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;