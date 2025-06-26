import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const content = (
    <div className="lg:hidden block absolute top-16 w-full left-0 right-0 bg-slate-900 transition">
      <ul className="text-center text-xl p-20">
        <Link to="/">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Home</li>
        </Link>
        <Link to="/buscar-libros">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Buscar Libros</li>
        </Link>
        <Link to="/buscar-libro-id">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Buscar Libro por ID</li>
        </Link>
        <Link to="/nuevo-libro">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Nuevo Libro</li>
        </Link>
        <Link to="/nuevo-autor">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Nuevo Autor</li>
        </Link>
        <Link to="/buscar-autor-id">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Buscar Autor por ID</li>
        </Link>
        <Link to="/buscar-autor-nombre">
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded" onClick={handleClick}>Buscar Autor por NOmbre</li>
        </Link>
      </ul>
    </div>
  );

  return (
    <div>
        <nav className="h-16 bg-slate-900 fixed top-0 left-0 w-full z-50">
            <div className="flex justify-between items-center text-white px-20 h-full">
              <div className="flex items-center flex-1">
                <span className="text-3xl font-bold">Logo</span>
              </div>
    
              {/* Links escritorio */}
              <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden">
                <ul className="flex gap-8 mr-16 text-[18px]">
                  <Link to="/"><li className="hover:text-fuchsia-600 cursor-pointer">Home</li></Link>
                  <Link to="/buscar-libros"><li className="hover:text-fuchsia-600 cursor-pointer">BuscarLibros</li></Link>
                  <Link to="/buscar-libro-id"><li className="hover:text-fuchsia-600 cursor-pointer">BuscarLibroID</li></Link>
                  <Link to="/nuevo-libro"><li className="hover:text-fuchsia-600 cursor-pointer">NewLibro</li></Link>
                  <Link to="/nuevo-autor"><li className="hover:text-fuchsia-600 cursor-pointer">NewAutor</li></Link>
                  <Link to="/buscar-autor-id"><li className="hover:text-fuchsia-600 cursor-pointer">BuscarAutorID</li></Link>
                  <Link to="/buscar-autor-nombre"><li className="hover:text-fuchsia-600 cursor-pointer">BuscarAutorN</li></Link>
                </ul>
              </div>
    
              <div>{click && content}</div>
    
              <button className="md:hidden block transition text-2xl" onClick={handleClick}>
                {click ? <FaTimes /> : <CiMenuFries />}
              </button>
            </div>
        </nav>

    </div>
  );
};

export default Nav;
