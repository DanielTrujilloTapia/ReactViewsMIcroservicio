import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaExclamationCircle,
  FaArrowLeft,
  FaQuestionCircle,
  FaCheckCircle,
  FaKey
} from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    usuario: '',
    respuestaRecuperacion: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (step === 1) {
        await verifyUser();
      } else if (step === 2) {
        await verifyAnswer();
      } else if (step === 3) {
        await updatePassword();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const verifyUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://microserviciologin-811z.onrender.com/api/LoginControlador/usuario/${formData.usuario}`);
      
      if (!response.ok) {
        throw new Error('Usuario no encontrado. Verifique el nombre de usuario.');
      }

      const data = await response.json();
      setUserData(data);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const verifyAnswer = async () => {
    setLoading(true);
    try {
      if (formData.respuestaRecuperacion.toLowerCase() !== userData.respuestaRecuperacion.toLowerCase()) {
        throw new Error('La respuesta no coincide con nuestros registros. Intente nuevamente.');
      }
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      if (formData.nuevaPassword !== formData.confirmarPassword) {
        throw new Error('Las contraseñas no coinciden. Por favor verifique.');
      }

      if (formData.nuevaPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      const payload = {
        loginGuid: userData.loginGuid,
        usuario: userData.usuario,
        password: formData.nuevaPassword,
        preguntaRecuperacion: userData.preguntaRecuperacion,
        respuestaRecuperacion: userData.respuestaRecuperacion
      };

      const response = await fetch('https://microserviciologin-811z.onrender.com/api/LoginControlador', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la contraseña. Intente nuevamente.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
            ¡Contraseña actualizada!
          </h2>
          <p className="mt-2 text-gray-600">
            Tu contraseña ha sido cambiada exitosamente.
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
            {step === 1 && 'Recuperar contraseña'}
            {step === 2 && 'Pregunta de seguridad'}
            {step === 3 && 'Nueva contraseña'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && 'Ingrese su nombre de usuario para comenzar el proceso de recuperación'}
            {step === 2 && 'Por favor responda su pregunta de seguridad'}
            {step === 3 && 'Ingrese y confirme su nueva contraseña'}
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

        <form onSubmit={handleSubmit}>
          {/* Paso 1: Ingresar usuario */}
          {step === 1 && (
            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario <span className="text-red-500">*</span>
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
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingrese su usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <FaSpinner className="h-5 w-5 text-blue-200 animate-spin" />
                  ) : (
                    <FaKey className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  )}
                </span>
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          )}

          {/* Paso 2: Pregunta de seguridad */}
          {step === 2 && userData && (
            <div className="mt-8 space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Pregunta de seguridad:</p>
                <p className="mt-1 text-gray-800">{userData.preguntaRecuperacion}</p>
              </div>

              <div>
                <label htmlFor="respuestaRecuperacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Su respuesta <span className="text-red-500">*</span>
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
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingrese su respuesta"
                    value={formData.respuestaRecuperacion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <FaSpinner className="h-5 w-5 text-blue-200 animate-spin" />
                  ) : (
                    <FaCheckCircle className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  )}
                </span>
                {loading ? 'Verificando...' : 'Verificar respuesta'}
              </button>
            </div>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === 3 && (
            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="nuevaPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nuevaPassword"
                    name="nuevaPassword"
                    type="password"
                    required
                    minLength={6}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ingrese nueva contraseña"
                    value={formData.nuevaPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nueva contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmarPassword"
                    name="confirmarPassword"
                    type="password"
                    required
                    minLength={6}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Repita la nueva contraseña"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <FaSpinner className="h-5 w-5 text-blue-200 animate-spin" />
                  ) : (
                    <FaKey className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  )}
                </span>
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </div>
          )}
        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>© {new Date().getFullYear()} Sistema de Biblioteca</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;