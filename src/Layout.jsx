import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <ApperIcon name="Home" className="w-8 h-8 text-primary" />
                <span className="text-xl font-display font-bold text-primary">
                  EstateView
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:text-primary hover:bg-surface'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-surface"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 z-50 md:hidden"
              >
                <nav className="px-4 py-4 space-y-2">
                  {visibleRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-surface'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      <span>{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Bottom Tab Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <nav className="flex">
          {visibleRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-surface'
                    : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
              <span className="font-medium">{route.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;