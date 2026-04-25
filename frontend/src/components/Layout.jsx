import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <main className="py-8">{children}</main>
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 MCA Job Platform. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Connecting Medical Sales Representatives with Pharmacies and Pharmaceutical Companies in Ghana
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
