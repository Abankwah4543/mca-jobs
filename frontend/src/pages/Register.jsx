import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mca',
    phone: '',
    companyName: '',
    licenseNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      };

      if (formData.role === 'employer') {
        registerData.companyName = formData.companyName;
        registerData.licenseNumber = formData.licenseNumber;
      }

      const response = await axios.post('/api/auth/register', registerData);
      
      // Redirect to payment or login
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        navigate('/login', { 
          state: { message: 'Registration successful! Please login.' } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                  formData.role === 'mca' 
                    ? 'border-[#0B5ED7] bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="mca"
                    checked={formData.role === 'mca'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-semibold">MCA</div>
                  <div className="text-sm text-gray-600">Medical Sales Rep</div>
                </label>
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                  formData.role === 'employer' 
                    ? 'border-[#20C997] bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-semibold">Employer</div>
                  <div className="text-sm text-gray-600">Pharmacy/Company</div>
                </label>
              </div>
            </div>

            {/* Common Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+233 XX XXX XXXX"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Employer Specific Fields */}
            {formData.role === 'employer' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Company/Pharmacy Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your Company Name"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="FDA License Number"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0B5ED7] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
