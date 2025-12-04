import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import axiosInstance from '../api/axios';
import useAuth from '../hooks/useAuth';


function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };


  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };


  const validateForm = () => {
    const newErrors = {};


    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }


    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }


    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }


    setIsLoading(true);
    setGeneralError('');


    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (error) {
      setGeneralError(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />


      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-xs">Sign in to your PeerNova account to continue</p>
            </div>


            {generalError && (
              <div className="mb-4 p-3 bg-[#1a1a1a] border border-[#333333] rounded-lg">
                <p className="text-gray-400 text-xs font-medium">{generalError}</p>
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : ''}
                required
                autoComplete="email"
              />


              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
                required
                autoComplete="current-password"
              />


              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 bg-[#111111] border border-[#333333] rounded cursor-pointer accent-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111111]"
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Forgot password?
                </Link>
              </div>


              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>


            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1a1a1a]"></div>
              <span className="text-gray-500 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-[#1a1a1a]"></div>
            </div>


            <p className="text-center text-gray-400 text-xs">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white font-semibold hover:text-gray-300 transition-colors">
                Create one now
              </Link>
            </p>
          </div>


          <p className="text-center text-gray-500 text-xs mt-6 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>


      <Footer />
    </div>
  );
}


export default Login;
