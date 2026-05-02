import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              TeamTask
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/projects" className="flex items-center text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-slate-400">Welcome,</span>{' '}
              <span className="font-semibold text-slate-200">{user.name}</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-dark-700 text-primary-400 border border-slate-700">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
