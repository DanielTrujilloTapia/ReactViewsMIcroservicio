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

const BuscarAutorNombre = () => {
  const [nombre, setNombre] = useState("");
  const [autor, setAutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarAutorPorNombre = async () => {
    setError(null);
    setAutor(null);

    if (!nombre.trim()) {
      setError("Por favor, ingresa un nombre.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://autor-postgres.somee.com/api/AutorControlador/nombre/${nombre.trim()}`
      );

      if (!res.ok) {
        if (res.status === 404) setError("No se encontró autor con ese nombre.");
        else setError("Error al consultar el autor.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAutor(data);

    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Buscar Autor por Nombre</h1>

      <input
        type="text"
        placeholder="Ingresa el nombre del autor"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-indigo-500"
      />

      <button
        onClick={buscarAutorPorNombre}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
      >
        Buscar
      </button>

      {loading && <p className="mt-4 text-center text-gray-500">Buscando autor...</p>}

      {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}

      {autor && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {autor.nombre} {autor.apellido}
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Fecha de nacimiento: </span>
            {formatearFecha(autor.fechaNacimiento)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">ID Autor: </span>
            {autor.autorLibroGuid}
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarAutorNombre;
