import { useState } from "react";

const NuevoAutor = () => {
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

    const fechaISO = new Date(form.fechaNacimiento).toISOString();

    try {
      const res = await fetch(
        "https://microservicioautor-yu4t.onrender.com/api/AutorControlador",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            fechaNacimiento: fechaISO,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar autor.");
      }

      setSubmitStatus("success");
      setSubmitMessage("Autor registrado correctamente.");
      setForm({ nombre: "", apellido: "", fechaNacimiento: "" });
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error.message);
    }
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
