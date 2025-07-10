import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaExclamationCircle,
  FaArrowLeft,
  FaQuestionCircle,
  FaCheckCircle
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    confirmPassword: '',
    preguntaRecuperacion: '',
    respuestaRecuperacion: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const recoveryQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿Cuál es tu comida favorita?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
    "¿Cuál es tu película favorita?"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.usuario.trim() || !formData.password.trim()) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (!formData.preguntaRecuperacion || !formData.respuestaRecuperacion) {
        throw new Error('Debe seleccionar una pregunta de recuperación y proporcionar una respuesta');
      }

      // Preparar datos para enviar
      const payload = {
        usuario: formData.usuario,
        password: formData.password,
        preguntaRecuperacion: formData.preguntaRecuperacion,
        respuestaRecuperacion: formData.respuestaRecuperacion
      };

      // Enviar al endpoint
      const response = await fetch('https://localhost:7144/api/LoginControlador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      // Registro exitoso
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-800">
            ¡Registro exitoso!
          </h2>
          <p className="mt-2 text-gray-600">
            Tu cuenta ha sido creada correctamente.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Serás redirigido al login automáticamente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4"
          >
            <FaArrowLeft className="mr-1" /> Volver al login
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">
            Crear nueva cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete el formulario para registrarse en el sistema
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
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="usuario"
                name="usuario"
                type="text"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su usuario"
                value={formData.usuario}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
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
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Repita su contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="preguntaRecuperacion" className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta de recuperación
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaQuestionCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="preguntaRecuperacion"
                name="preguntaRecuperacion"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.preguntaRecuperacion}
                onChange={handleChange}
              >
                <option value="">Seleccione una pregunta</option>
                {recoveryQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="respuestaRecuperacion" className="block text-sm font-medium text-gray-700 mb-1">
              Respuesta de recuperación
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaQuestionCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="respuestaRecuperacion"
                name="respuestaRecuperacion"
                type="text"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su respuesta"
                value={formData.respuestaRecuperacion}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <FaSpinner className="h-5 w-5 text-blue-200 animate-spin" />
                ) : (
                  <FaUser className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors" />
                )}
              </span>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-500">Inicia sesión aquí</Link></p>
          <p className="mt-2">© {new Date().getFullYear()} Sistema de Biblioteca</p>
        </div>
      </div>
    </div>
  );
};

export default Register;