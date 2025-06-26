import Nav from "./Components/Nav";
import { Routes, Route } from "react-router-dom";
import BuscarLibros from "./Components/BuscarLibros";
import BuscarLibroID from "./Components/BuscarLibroID";
import NuevoLibro from "./Components/NuevoLibro";
import NuevoAutor from "./Components/NuevoAutor";
import BuscarAutorID from "./Components/BuscarAutorID";
import BuscarAutorNombre from "./Components/BuscarAutorNombre";

const App = () => {
  return (
    <div className="min-h-screen">
      <Nav /> 

      <div className="pt-20 px-4"> {/* espacio para que no se tape con el nav fijo */}
        <Routes>
          <Route path="/" element={<h1 className="text-white text-3xl">Home</h1>} />
          <Route path="/buscar-libros" element={<BuscarLibros />} />
          <Route path="/buscar-libro-id" element={<BuscarLibroID />} />
          <Route path="/nuevo-libro" element={<NuevoLibro />} />
          <Route path="/nuevo-autor" element={<NuevoAutor />} />
          <Route path="/buscar-autor-id" element={<BuscarAutorID />} />
          <Route path="/buscar-autor-nombre" element={<BuscarAutorNombre />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
