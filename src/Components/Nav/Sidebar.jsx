import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaUserAlt, 
  FaPlus, 
  FaSearch,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Sidebar = ({ user, onLogout }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    libros: false,
    autores: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleSidebar = () => {
    if (!isCollapsed) {
      setExpandedMenus({
        libros: false,
        autores: false
      });
      setTimeout(() => {
        setIsCollapsed(!isCollapsed);
      }, 150);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const navItems = [
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

  const handleHomeClick = () => {
    navigate('/');
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      <aside 
        className={`fixed md:relative z-30 flex flex-col h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out
          ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'w-64'}`}
      >
        {/* Collapse Toggle Button (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="absolute hidden md:block -right-3 top-4 p-1 bg-gray-700 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:bg-gray-600 transition-all"
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? (
            <FaChevronDown className="w-3 h-3 transform rotate-270" />
          ) : (
            <FaChevronDown className="w-3 h-3 transform rotate-90" />
          )}
        </button>

        {/* Header - Ahora es clickable */}
        <div 
          onClick={handleHomeClick}
          className={`flex items-center h-16 px-4 bg-gray-700 border-b border-gray-600 shadow-sm overflow-hidden transition-all duration-300 cursor-pointer
            ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          {isCollapsed ? (
            <h1 className="text-xl font-bold text-white hover:text-blue-300 transition-colors">BA</h1>
          ) : (
            <h1 className="text-xl font-bold text-white tracking-tight hover:text-blue-300 transition-colors">Biblioteca</h1>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col flex-grow px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-md mx-1 hover:bg-gray-700 transition-colors duration-200
                    ${isCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    expandedMenus[item.key] ? (
                      <FaChevronUp className="w-3 h-3 ml-2" />
                    ) : (
                      <FaChevronDown className="w-3 h-3 ml-2" />
                    )
                  )}
                </button>

                {/* Submenús con animación */}
                <div 
                  className={`overflow-hidden transition-all duration-200 ease-in-out
                    ${isCollapsed ? 'max-h-0' : ''}
                    ${expandedMenus[item.key] ? 'max-h-96' : 'max-h-0'}`}
                >
                  {!isCollapsed && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) => 
                            `flex items-center px-3 py-2 text-sm rounded-md mx-1 transition-colors duration-200
                            ${isActive ? 'bg-gray-700/80 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`
                          }
                          onClick={() => isMobile && toggleSidebar()}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          <span className="truncate">{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className={`p-3 border-t border-gray-700 bg-gray-800/90 transition-all duration-300
          ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <>
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    <img 
                      className="w-8 h-8 rounded-full border border-gray-600"
                      src={user?.avatar || 'https://via.placeholder.com/32'}
                      alt="User profile"
                    />
                  </div>
                  <div className="ml-3 truncate">
                    <p className="text-sm font-medium text-white truncate">{user?.username || 'Usuario'}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.lastLogin || 'Sesión activa'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  title="Cerrar sesión"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </>
            )}
            {isCollapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                title="Cerrar sesión"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Floating Menu Button (Mobile) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-30 bottom-6 right-6 p-4 bg-gray-800 border border-gray-700 rounded-full shadow-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 md:hidden"
          aria-label="Toggle menu"
        >
          {isCollapsed ? (
            <FaBars className="w-5 h-5" />
          ) : (
            <FaTimes className="w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

export default Sidebar;