import { useState } from "react";

const NuevoAutor = ({ onLogout }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) errs.apellido = "El apellido es obligatorio.";
    if (!form.fechaNacimiento) errs.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    else if (isNaN(new Date(form.fechaNacimiento).getTime()))
      errs.fechaNacimiento = "Fecha inválida.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage("");

    if (!validar()) return;

    try {
      const autorRegistrado = await registrarAutor(form);
      setSubmitStatus("success");
      setSubmitMessage("Autor registrado correctamente.");
      setForm({ nombre: "", apellido: "", fechaNacimiento: "" });
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error.message || "Error al registrar autor.");
    }
  };

  const registrarAutor = async (form) => {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user?.token;
    let refreshToken = user?.refreshToken;

    if (!token || !refreshToken) {
      onLogout();
      throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    }

    const fechaISO = new Date(form.fechaNacimiento).toISOString();

    const fetchWithToken = async (accessToken) => {
      return await fetch("https://microservicioautorpostgres-token.onrender.com/api/Autor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          fechaNacimiento: fechaISO,
        }),
      });
    };

    let res = await fetchWithToken(token);

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
        onLogout();
        console.log("Sesión expirada el refreshToken expiro. Inicia sesión nuevamente.");
        return;
      }

      const data = await refreshRes.json();
      localStorage.setItem("user", JSON.stringify(data));
      token = data.token;
      console.log("nuevo token generado: ", token);

      res = await fetchWithToken(token);
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al registrar autor.");
    }

    return await res.json();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Nuevo Autor</h1>

      {submitStatus === "success" && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{submitMessage}</div>
      )}
      {submitStatus === "error" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="nombre" className="block font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.nombre ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
            placeholder="Ejemplo: Emmanuel"
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="apellido" className="block font-medium mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.apellido ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
            placeholder="Ejemplo: Calva"
          />
          {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="fechaNacimiento" className="block font-medium mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="datetime-local"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.fechaNacimiento
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.fechaNacimiento && (
            <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
        >
          Guardar Autor
        </button>
      </form>
    </div>
  );
};

export default NuevoAutor;
