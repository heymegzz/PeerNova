import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import axiosInstance from '../api/axios';
import useAuth from '../hooks/useAuth';


function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));


    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(newValue));
    }


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


    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = 'Name must be less than 50 characters';
    }


    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }


    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak. Use uppercase, numbers, or symbols.';
    }


    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }


    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms to continue';
    }


    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        agreeToTerms: true
      });
      return;
    }


    setIsLoading(true);
    setGeneralError('');


    try {
      const response = await axiosInstance.post('/auth/signup', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // REDIRECT TO LOGIN (NOT DASHBOARD)
      navigate('/login');
    } catch (error) {
      setGeneralError(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-[#333333]';
    if (passwordStrength <= 2) return 'bg-gray-500';
    if (passwordStrength <= 3) return 'bg-gray-400';
    return 'bg-white';
  };


  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />


      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-gray-400 text-xs">Join PeerNova and start connecting with your campus community</p>
            </div>


            {generalError && (
              <div className="mb-4 p-3 bg-[#1a1a1a] border border-[#333333] rounded-lg">
                <p className="text-gray-400 text-xs font-medium">{generalError}</p>
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName ? errors.fullName : ''}
                required
                autoComplete="name"
              />


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


              <div>
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
                  autoComplete="new-password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs text-gray-500">Strength:</div>
                      <div className="flex gap-1 flex-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                              i < passwordStrength ? getPasswordStrengthColor() : 'bg-[#1a1a1a]'
                            }`}
                          ></div>
                        ))}
                      </div>
                      {passwordStrength > 0 && (
                        <span className="text-xs text-gray-400 font-medium">
                          {getPasswordStrengthLabel()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>


              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                required
                autoComplete="new-password"
              />


              <label className="flex items-start gap-3 text-gray-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-4 h-4 bg-[#111111] border border-[#333333] rounded mt-0.5 cursor-pointer accent-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111111]"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-white hover:text-gray-300 transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-white hover:text-gray-300 transition-colors">Privacy Policy</a>
                </span>
              </label>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <div className="flex items-center gap-1.5">
                  <XMarkIcon className="h-4 w-4 text-red-400" />
                  <p className="text-gray-400 text-xs font-medium">{errors.agreeToTerms}</p>
                </div>
              )}


              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>


            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1a1a1a]"></div>
              <span className="text-gray-500 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-[#1a1a1a]"></div>
            </div>


            <p className="text-center text-gray-400 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-semibold hover:text-gray-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
}


export default Signup;
