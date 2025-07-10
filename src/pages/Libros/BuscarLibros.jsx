import { useEffect, useState } from "react";

const BuscarLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://microserviciolibro-xndk.onrender.com/api/LibroMaterial")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los libros");
        return res.json();
      })
      .then((data) => {
        setLibros(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error desconocido");
        setLoading(false);
      });
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha desconocida";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg">Cargando libros...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-red-500 font-semibold">{error}</span>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Libros Disponibles
      </h2>

      {libros.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron libros.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {libros.map(({ libreriaMaterialId, titulo, autorLibro, fechaPublicacion }) => (
            <li
              key={libreriaMaterialId}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{titulo || "Sin título"}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Autor (ID):</span> {autorLibro || "Desconocido"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fecha de publicación:</span> {formatearFecha(fechaPublicacion)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscarLibros;
