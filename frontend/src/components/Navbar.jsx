import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-[#0B5ED7] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              MCA Jobs
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/jobs" className="hover:text-[#20C997] transition-colors">
                Browse Jobs
              </Link>
              {isAuthenticated && user.role === 'mca' && (
                <>
                  <Link to="/mca/dashboard" className="hover:text-[#20C997] transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/mca/applications" className="hover:text-[#20C997] transition-colors">
                    Applications
                  </Link>
                </>
              )}
              {isAuthenticated && user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="hover:text-[#20C997] transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/employer/jobs" className="hover:text-[#20C997] transition-colors">
                    Post Jobs
                  </Link>
                </>
              )}
              {isAuthenticated && user.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:text-[#20C997] transition-colors">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="hover:text-[#20C997] transition-colors">
                  Messages
                </Link>
                <Link to="/profile" className="hover:text-[#20C997] transition-colors">
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="bg-[#20C997] hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#20C997] transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#20C997] hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
