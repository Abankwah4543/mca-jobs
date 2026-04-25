import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B5ED7] to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            MCA Job Platform
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connecting Medical Sales Representatives (MCAs) with Pharmacies and Pharmaceutical Companies across Ghana
          </p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-[#20C997] hover:bg-teal-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="bg-white text-[#0B5ED7] hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <Link
              to={user.role === 'mca' ? '/mca/dashboard' : user.role === 'employer' ? '/employer/dashboard' : '/admin/dashboard'}
              className="bg-[#20C997] hover:bg-teal-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MCA Job Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-[#0B5ED7] text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Verified Jobs</h3>
              <p className="text-gray-600">
                All job postings are verified by our admin team to ensure legitimacy and quality.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-[#20C997] text-5xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Access opportunities from top pharmaceutical companies and pharmacies in Ghana.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-[#FFC107] text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and verification processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-[#0B5ED7] mb-6">For MCAs</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-[#0B5ED7] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Register & Pay</h4>
                    <p className="text-gray-600">Create your account and complete the registration payment.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#0B5ED7] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Complete Profile</h4>
                    <p className="text-gray-600">Upload your CV, certificates, and professional documents.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#0B5ED7] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Apply & Get Hired</h4>
                    <p className="text-gray-600">Browse jobs, apply, and connect with employers.</p>
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#20C997] mb-6">For Employers</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-[#20C997] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Verify License</h4>
                    <p className="text-gray-600">Submit your pharmacy/pharma company license for verification.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#20C997] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Post Jobs</h4>
                    <p className="text-gray-600">Create job listings with detailed requirements and compensation.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#20C997] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Hire Talent</h4>
                    <p className="text-gray-600">Review applications, interview candidates, and hire the best MCAs.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0B5ED7] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join hundreds of MCAs and employers already using our platform
          </p>
          <Link
            to="/register"
            className="bg-[#20C997] hover:bg-teal-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
