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

const BuscarAutorNombre = ({ onLogout }) => {
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
      const autor = await fetchAutor(nombre);
      setAutor(autor);
    } catch (err) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAutor = async (nombre) => {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user?.token;
    let refreshToken = user?.refreshToken;

    const fetchWithToken = async (accessToken) => {
      const res = await fetch(
        `https://microservicioautorpostgres-token.onrender.com/api/Autor/buscar?nombre=${nombre.trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res;
    };

    // Primer intento con el token actual
    let res = await fetchWithToken(token);

    // Si expiró, intenta renovar token con refreshToken
    if (res.status === 401) {
      console.log("El token expiro");
      const refreshRes = await fetch(
        "https://microserviciologintoken.onrender.com/api/UsuarioControlador/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, refreshToken }),
        }
      );

      if (!refreshRes.ok) {
        // Si falla también el refresh, borrar sesión y redirigir al login con el metodo onLogout
         onLogout();
         console.log("El refreshToken expiro inicia sesion nuevamente");
         return; 
      }

      // Guardar nuevo token y reintentar
      const data = await refreshRes.json();
      localStorage.setItem("user", JSON.stringify(data)); // Guarda el nuevo token
      token = data.token;
      console.log("nuevo token generado: ", token);
      res = await fetchWithToken(token); // Reintenta con nuevo token
    }

    if (!res.ok) {
      if (res.status === 404) throw new Error("No se encontró autor con ese nombre.");
      throw new Error("Error al consultar el autor.");
    }

    const data = await res.json();
    return data[0];
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
