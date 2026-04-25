import Layout from '../components/Layout';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Total Users</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Active Jobs</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Applications</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-medium opacity-90">Revenue</h3>
            <p className="text-4xl font-bold mt-2">GHS 0</p>
          </div>
        </div>

        {/* Approval Queues */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">MCA Approvals Pending</h2>
            <p className="text-gray-600">No pending approvals.</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Employer Verifications</h2>
            <p className="text-gray-600">No pending verifications.</p>
          </div>
        </div>

        {/* Job Approvals */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Job Posts Pending Approval</h2>
          <p className="text-gray-600">No jobs pending approval.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
