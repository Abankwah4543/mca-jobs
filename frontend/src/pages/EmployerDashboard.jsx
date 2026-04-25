import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Active Jobs</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Total Applicants</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Interviews</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
          <p className="text-gray-600 mb-4">Create a new job listing to find qualified MCAs.</p>
          <button className="btn-primary">Post Job</button>
        </div>

        {/* Recent Applicants */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>
          <p className="text-gray-600">No applicants yet.</p>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerDashboard;
