import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaUserAlt, 
  FaPlus, 
  FaSearch, 
  FaHome,
  FaTimes,
  FaBars,
  FaSignOutAlt
} from 'react-icons/fa';

const MobileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', path: '/', icon: FaHome },
    { 
      name: 'Libros', 
      icon: FaBookOpen,
      subItems: [
        { name: 'Buscar Libros', path: '/libros/buscar', icon: FaSearch },
        { name: 'Buscar por ID', path: '/libros/buscar-id', icon: FaSearch },
        { name: 'Nuevo Libro', path: '/libros/nuevo', icon: FaPlus },
      ]
    },
    { 
      name: 'Autores', 
      icon: FaUserAlt,
      subItems: [
        { name: 'Buscar Autores', path: '/autores/buscar', icon: FaSearch },
        { name: 'Buscar por ID', path: '/autores/buscar-id', icon: FaSearch },
        { name: 'Nuevo Autor', path: '/autores/nuevo', icon: FaPlus },
      ]
    }
  ];

  const handleLogout = () => {
    onLogout();
    setIsOpen(false); // Cerrar el menú después de hacer logout
  };

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Mobile menu panel */}
      <div className={`fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-gray-800 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Biblioteca App</h1>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.path ? (
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                      ${isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ) : (
                  <>
                    <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 uppercase tracking-wider">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 
                            ${isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                          }
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  className="w-8 h-8 rounded-full" 
                  src="https://via.placeholder.com/32" 
                  alt="User profile" 
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.username || 'Usuario'}</p>
                <p className="text-xs font-medium text-gray-400">{user?.lastLogin || 'lastLogin'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
              title="Cerrar sesión"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;