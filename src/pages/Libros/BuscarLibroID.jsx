import { useState } from "react";
import { FaSearch, FaBook, FaSpinner, FaExclamationTriangle, FaUserAlt, FaCalendarAlt, FaIdCard } from "react-icons/fa";

const BuscarLibroID = () => {
  const [id, setId] = useState("");
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return "Fecha inválida";
    }
  };

  const buscarLibro = async () => {
    setError(null);
    setLibro(null);

    if (!id.trim()) {
      setError("Por favor, ingresa un ID válido");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://microserviciolibro-xndk.onrender.com/api/LibroMaterial/${id.trim()}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || 
                             (res.status === 404 ? "Libro no encontrado" : "Error en el servidor");
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setLibro(data);
    } catch (err) {
      console.error("Error buscando libro:", err);
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      buscarLibro();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <FaBook className="mr-3 text-indigo-600" />
          Buscar Libro por ID
        </h1>
        <p className="mt-2 text-gray-600">Ingresa el ID del libro que deseas buscar</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaIdCard className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ejemplo: LIB12345"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
        </div>

        <button
          onClick={buscarLibro}
          disabled={loading}
          className={`w-full mt-4 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Buscando...
            </>
          ) : (
            <>
              <FaSearch className="mr-2" />
              Buscar Libro
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start">
            <FaExclamationTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error al buscar libro</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {libro && (
          <div className="mt-6 bg-gray-50 rounded-lg overflow-hidden shadow">
            <div className="px-6 py-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                  <FaBook className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {libro.titulo || "Título no disponible"}
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUserAlt className="flex-shrink-0 mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">Autor: </span>
                        {libro.autorLibro || "Desconocido"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">Publicación: </span>
                        {formatearFecha(libro.fechaPublicacion)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaIdCard className="flex-shrink-0 mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">ID: </span>
                        <span className="font-mono">{libro.libreriaMaterialId}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-3">
              <p className="text-xs text-gray-600">
                Libro encontrado - {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarLibroID;