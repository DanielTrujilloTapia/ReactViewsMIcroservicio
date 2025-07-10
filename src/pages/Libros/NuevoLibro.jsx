import { useState } from "react";
import { FaBook, FaSave, FaUser, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validar = () => {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = "El título es obligatorio";
    if (!form.fechaPublicacion) errs.fechaPublicacion = "La fecha de publicación es obligatoria";
    else if (isNaN(new Date(form.fechaPublicacion).getTime())) errs.fechaPublicacion = "Fecha inválida";
    if (!form.autorLibro.trim()) errs.autorLibro = "El ID del autor es obligatorio";
    else if (!validarUUID(form.autorLibro)) errs.autorLibro = "Debe ser un UUID válido (ej: 3fa85f64-5717-4562-b3fc-2c963f66afa8)";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage("");

    if (!validar()) return;

    setIsSubmitting(true);

    try {
      const fechaISO = new Date(form.fechaPublicacion).toISOString();

      const res = await fetch("https://microserviciolibro-xndk.onrender.com/api/LibroMaterial", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          fechaPublicacion: fechaISO,
          autorLibro: form.autorLibro.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}: ${res.statusText}`);
      }

      setSubmitStatus("success");
      setSubmitMessage("Libro registrado exitosamente");
      setForm({ titulo: "", fechaPublicacion: "", autorLibro: "" });
    } catch (error) {
      console.error("Error al guardar libro:", error);
      setSubmitStatus("error");
      setSubmitMessage(error.message || "Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <FaBook className="text-4xl text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Registrar Nuevo Libro</h1>
          </div>

          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
              <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">¡Éxito!</h3>
                <p className="text-green-700 mt-1">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
              <FaTimesCircle className="text-red-500 text-xl mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{submitMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título del Libro <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors.titulo 
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Ejemplo: Cien años de soledad"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBook className={`h-5 w-5 ${errors.titulo ? "text-red-400" : "text-gray-400"}`} />
                </div>
              </div>
              {errors.titulo && (
                <p className="mt-2 text-sm text-red-600">{errors.titulo}</p>
              )}
            </div>

            <div>
              <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Publicación <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="fechaPublicacion"
                  name="fechaPublicacion"
                  value={form.fechaPublicacion}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors.fechaPublicacion 
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className={`h-5 w-5 ${errors.fechaPublicacion ? "text-red-400" : "text-gray-400"}`} />
                </div>
              </div>
              {errors.fechaPublicacion && (
                <p className="mt-2 text-sm text-red-600">{errors.fechaPublicacion}</p>
              )}
            </div>

            <div>
              <label htmlFor="autorLibro" className="block text-sm font-medium text-gray-700 mb-1">
                ID del Autor (UUID) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="autorLibro"
                  name="autorLibro"
                  value={form.autorLibro}
                  onChange={handleChange}
                  required
                  pattern="[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors.autorLibro 
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Ejemplo: 3fa85f64-5717-4562-b3fc-2c963f66afa8"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className={`h-5 w-5 ${errors.autorLibro ? "text-red-400" : "text-gray-400"}`} />
                </div>
              </div>
              {errors.autorLibro && (
                <p className="mt-2 text-sm text-red-600">{errors.autorLibro}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                El ID debe ser un UUID válido (ej: 550e8400-e29b-41d4-a716-446655440000)
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ImSpinner8 className="animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Guardar Libro
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Todos los campos marcados con <span className="text-red-500">*</span> son obligatorios
          </p>
        </div>
      </div>
    </div>
  );
};

export default NuevoLibro;