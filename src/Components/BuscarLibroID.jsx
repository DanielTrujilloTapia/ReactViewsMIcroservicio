import { useState } from "react";

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha desconocida";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BuscarLibroID = () => {
  const [id, setId] = useState("");
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarLibro = async () => {
    setError(null);
    setLibro(null);

    if (!id.trim()) {
      setError("Por favor, ingresa un ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://microserviciolibro-xndk.onrender.com/api/LibroMaterial/${id.trim()}`);

      if (!res.ok) {
        if (res.status === 404) setError("Libro no encontrado.");
        else setError("Error al consultar el libro.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLibro(data);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Buscar Libro por ID</h1>

      <input
        type="text"
        placeholder="Ingresa el ID del libro"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-indigo-500"
      />

      <button
        onClick={buscarLibro}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
      >
        Buscar
      </button>

      {loading && <p className="mt-4 text-center text-gray-500">Buscando libro...</p>}

      {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}

      {libro && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{libro.titulo || "Sin título"}</h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Autor (ID): </span>
            {libro.autorLibro || "Desconocido"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fecha de publicación: </span>
            {formatearFecha(libro.fechaPublicacion)}
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarLibroID;
