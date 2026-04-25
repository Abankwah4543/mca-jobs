import Layout from '../components/Layout';

const Applications = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>
        
        <div className="card">
          <p className="text-gray-600">No applications yet. Start browsing jobs to apply!</p>
        </div>
      </div>
    </Layout>
  );
};

export default Applications;
