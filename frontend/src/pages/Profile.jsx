import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-[#0B5ED7] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-[#0B5ED7] rounded-full text-sm font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            <p className="text-gray-600">Profile editing coming soon...</p>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Documents</h3>
            <p className="text-gray-600">Document upload coming soon...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
