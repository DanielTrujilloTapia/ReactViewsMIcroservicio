import { NavLink } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaUserAlt, 
  FaPlus, 
  FaSearch, 
  FaHome,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = ({ user, onLogout }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    libros: true,
    autores: true
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navItems = [
    { 
      name: 'Inicio', 
      path: '/', 
      icon: FaHome,
      exact: true
    },
    { 
      name: 'Libros', 
      icon: FaBookOpen,
      key: 'libros',
      subItems: [
        { name: 'Buscar Libros', path: '/libros/buscar', icon: FaSearch },
        { name: 'Buscar por ID', path: '/libros/buscar-id', icon: FaSearch },
        { name: 'Nuevo Libro', path: '/libros/nuevo', icon: FaPlus },
      ]
    },
    { 
      name: 'Autores', 
      icon: FaUserAlt,
      key: 'autores',
      subItems: [
        { name: 'Buscar por ID', path: '/autores/buscar-id', icon: FaSearch },
        { name: 'Buscar por Nombre', path: '/autores/buscar-nombre', icon: FaSearch },
        { name: 'Nuevo Autor', path: '/autores/nuevo', icon: FaPlus },
      ]
    }
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-indigo-800 to-indigo-700 shadow-md">
          <h1 className="text-xl font-bold text-white tracking-tight">Biblioteca App</h1>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col flex-grow px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.path ? (
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2.5 text-sm font-medium rounded-md mx-2 transition-colors duration-200
                      ${isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3 opacity-80" />
                    {item.name}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-md mx-2 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3 opacity-80" />
                        {item.name}
                      </div>
                      {expandedMenus[item.key] ? (
                        <FaChevronUp className="w-3 h-3 opacity-70" />
                      ) : (
                        <FaChevronDown className="w-3 h-3 opacity-70" />
                      )}
                    </button>
                    {expandedMenus[item.key] && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) => 
                              `flex items-center px-3 py-2 text-sm rounded-md mx-1 transition-colors duration-200
                              ${isActive ? 'bg-indigo-700/80 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`
                            }
                          >
                            <subItem.icon className="w-4 h-4 mr-3 opacity-70" />
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    className="w-9 h-9 rounded-full border-2 border-indigo-500/30"
                    src={user?.avatar || 'https://via.placeholder.com/36'}
                    alt="User profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/36';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-gray-800"></span>
                </div>
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-white truncate">{user?.username || 'Usuario'}</p>
                <p className="text-xs font-medium text-gray-400/80 truncate">
                  {user?.lastLogin ? `Último acceso: ${user.lastLogin}` : 'Sesión activa'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;