import { useEffect, useState } from "react";
import { FaBook, FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaUserEdit } from "react-icons/fa";

const BuscarLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "titulo", direction: "ascending" });

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch("https://microserviciolibro-xndk.onrender.com/api/LibroMaterial");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setLibros(data);
      } catch (err) {
        console.error("Error fetching libros:", err);
        setError(err.message || "Error al cargar los libros. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedLibros = [...libros].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredLibros = sortedLibros.filter(libro => 
    libro.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    libro.autorLibro?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p className="text-gray-600 text-lg">Cargando catálogo de libros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar los libros</h3>
        <p className="text-gray-700 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          <FaBook className="inline-block mr-3 text-indigo-600" />
          Catálogo de Libros
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:mt-4">
          Explora nuestra colección de libros disponibles
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-2xl">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <button
            onClick={() => handleSort("titulo")}
            className={`px-3 py-1 text-sm rounded ${sortConfig.key === "titulo" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
          >
            Título {sortConfig.key === "titulo" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("fechaPublicacion")}
            className={`px-3 py-1 text-sm rounded ${sortConfig.key === "fechaPublicacion" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
          >
            Fecha {sortConfig.key === "fechaPublicacion" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {filteredLibros.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaBook className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron libros</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Intenta con un término de búsqueda diferente" : "El catálogo parece estar vacío"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLibros.map((libro) => (
            <div
              key={libro.libreriaMaterialId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="p-5 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                    <FaBook className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {libro.titulo || "Título no disponible"}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaUserEdit className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="line-clamp-1">
                        {libro.autorLibro || "Autor desconocido"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{formatearFecha(libro.fechaPublicacion)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">ID:</span>{" "}
                  <span className="text-gray-600 font-mono">{libro.libreriaMaterialId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredLibros.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Mostrando {filteredLibros.length} de {libros.length} libros
        </div>
      )}
    </div>
  );
};

export default BuscarLibros;