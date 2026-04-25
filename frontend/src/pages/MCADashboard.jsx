import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const MCADashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Applications Sent</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Interviews Scheduled</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Messages</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <p className="text-gray-600">No applications yet. Start browsing jobs!</p>
        </div>

        {/* Profile Completion */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-[#20C997] h-4 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <p className="text-gray-600">Complete your profile to increase your chances of getting hired.</p>
        </div>
      </div>
    </Layout>
  );
};

export default MCADashboard;
