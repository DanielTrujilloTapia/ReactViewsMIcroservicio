import { useState } from "react";

const validarUUID = (uuid) => {
  const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regexUUID.test(uuid);
};

const NuevoLibro = () => {
  const [form, setForm] = useState({
    titulo: "",
    fechaPublicacion: "",
    autorLibro: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const validar = () => {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = "El título es obligatorio.";
    if (!form.fechaPublicacion) errs.fechaPublicacion = "La fecha y hora de publicación es obligatoria.";
    else if (isNaN(new Date(form.fechaPublicacion).getTime())) errs.fechaPublicacion = "Fecha y hora inválidas.";
    if (!form.autorLibro.trim()) errs.autorLibro = "El ID del autor es obligatorio.";
    else if (!validarUUID(form.autorLibro)) errs.autorLibro = "El ID del autor debe ser un UUID válido.";

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

    // Convertir fechaPublicacion a ISO string con zona horaria (añadir ":00" si falta)
    // input datetime-local devuelve formato 'YYYY-MM-DDTHH:mm' (sin segundos ni zona)
    const fechaISO = new Date(form.fechaPublicacion).toISOString();

    try {
      const res = await fetch("https://microserviciolibro-xndk.onrender.com/api/LibroMaterial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          fechaPublicacion: fechaISO,
          autorLibro: form.autorLibro.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar el libro");
      }

      setSubmitStatus("success");
      setSubmitMessage("Libro guardado correctamente");
      setForm({ titulo: "", fechaPublicacion: "", autorLibro: "" });
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Nuevo Libro</h1>

      {submitStatus === "success" && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{submitMessage}</div>
      )}
      {submitStatus === "error" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="titulo" className="block font-medium mb-1">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.titulo ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
            placeholder="Ejemplo: Harry Potter"
          />
          {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="fechaPublicacion" className="block font-medium mb-1">Fecha y hora de publicación</label>
          <input
            type="datetime-local"
            id="fechaPublicacion"
            name="fechaPublicacion"
            value={form.fechaPublicacion}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.fechaPublicacion ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.fechaPublicacion && <p className="text-red-500 text-sm mt-1">{errors.fechaPublicacion}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="autorLibro" className="block font-medium mb-1">ID Autor (UUID)</label>
          <input
            type="text"
            id="autorLibro"
            name="autorLibro"
            value={form.autorLibro}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.autorLibro ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
            placeholder="Ejemplo: 3fa85f64-5717-4562-b3fc-2c963f66afa8"
          />
          {errors.autorLibro && <p className="text-red-500 text-sm mt-1">{errors.autorLibro}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
        >
          Guardar Libro
        </button>
      </form>
    </div>
  );
};

export default NuevoLibro;
