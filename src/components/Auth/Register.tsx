import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface FormData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  isBusinessAccount: boolean;
  agreeToTerms: boolean;
  company: string;
  vehicleType: string;
  vehicleModel: string;
  businessDocument: File | null;
}

const RegisterForm: React.FC = () => {
  React.useEffect(() => {
    console.log('Register component mounted')
  }, [])
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    isBusinessAccount: false,
    agreeToTerms: false,
    company: '',
    vehicleType: '',
    vehicleModel: '',
    businessDocument: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()
  const { register } = useAuth()

  const companies = ['VinFast', 'ABC', 'CSD', '69MMB', 'WP MAS'];
  const vehicleTypes = ['VinFast VF34', 'Hyundai Ioniq 5', 'Tesla Model S'];
  const vehicleModels = ['Toilet Model S', 'Hyundai Ioniq 5', 'VF e34'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, businessDocument: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // Password rules: at least 8 chars, at least 1 uppercase letter and 1 special char
      const lengthOk = formData.password.length >= 8
      const upperOk = /[A-Z]/.test(formData.password)
      const specialOk = /[^A-Za-z0-9]/.test(formData.password)
      if (!lengthOk || !upperOk || !specialOk) {
        newErrors.password = 'Password must be at least 8 characters, include 1 uppercase letter and 1 special character'
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    if (formData.isBusinessAccount) {
      if (!formData.company) newErrors.company = 'Company is required';
      if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
      if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle model is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return

    (async () => {
      try {
        setLoading(true)
        setError('')

        // Map formData to RegisterRequest expected shape
        const payload = {
          Email: formData.emailAddress,
          PasswordHash: formData.password,
          ConfirmPassword: formData.confirmPassword,
          FullName: formData.fullName,
          PhoneNumber: formData.phoneNumber,
          Address: formData.company || '',
          DateOfBirth: '',
          SignatureImage: ''
        }

        // Try server registration first
        const resp = await register(payload)
        setSuccessMessage(resp?.message || 'Register successful! Please login.')
        // navigate to login after short delay
        setTimeout(() => navigate('/login'), 1500)
      } catch (err: any) {
        console.error('Register handler error:', err)
        // If network error or no response from server, fallback to local storage (for offline/demo)
        const isNetworkError = !err?.response
        if (isNetworkError) {
          // Save user locally so they can login against this browser instance
          const localUsersRaw = localStorage.getItem('local_users')
          const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : []
          const newUser = {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            emailAddress: formData.emailAddress,
            password: formData.password
          }
          localUsers.push(newUser)
          localStorage.setItem('local_users', JSON.stringify(localUsers))
          setSuccessMessage('Registered locally (offline mode). Please login.')
          setTimeout(() => navigate('/login'), 1200)
        } else {
          // Try to surface backend-provided message or validation details
          const serverMessage = err?.response?.data?.message || err?.message
          const validationErrors = err?.response?.data?.errors
          let combined = serverMessage || 'Registration failed'
          if (validationErrors && typeof validationErrors === 'object') {
            const details = Object.values(validationErrors).flat().join('; ')
            combined = `${combined}: ${details}`
          }

          setError(combined)
        }
      } finally {
        setLoading(false)
      }
    })()
  };

  const handleGoogleRegister = () => {
    console.log('Register with Google');
    // Handle Google registration
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-left">
          <h1 className="text-white text-4xl font-bold mb-2">Logo</h1>
          <p className="text-gray-400 text-sm">Optimizing your journey</p>
          <p className="text-gray-400 text-sm">Powering your life</p>
        </div>

        <div className="backdrop-blur-sm bg-black/30 rounded-3xl p-8 border border-emerald-500/20">
          <h2 className="text-white text-3xl font-bold text-center mb-8">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {successMessage}
              </div>
            )}
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {errors.emailAddress && <p className="text-red-400 text-sm mt-1">{errors.emailAddress}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {!formData.isBusinessAccount && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="isBusinessAccount"
                  checked={formData.isBusinessAccount}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-2 border-gray-600 rounded bg-transparent checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                  Register as a Business
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-2 border-gray-600 rounded bg-transparent checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                  I agree to the Terms & Conditions
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}
            </div>

            {formData.isBusinessAccount && (
              <div className="space-y-4 pt-4 border-t border-gray-700 mt-6">
                <h3 className="text-white text-lg font-semibold mb-3">Business Details</h3>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Select Company</label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Select Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.vehicleType && <p className="text-red-400 text-sm mt-1">{errors.vehicleType}</p>}
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Vehicle Model</label>
                    <select
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select model</option>
                      {vehicleModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    {errors.vehicleModel && <p className="text-red-400 text-sm mt-1">{errors.vehicleModel}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-center w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg border border-emerald-500/50 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 mr-2" />
                    <span>Driver's License / Business ID</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                  </label>
                  {formData.businessDocument && (
                    <p className="text-emerald-400 text-sm mt-2">
                      Selected: {formData.businessDocument.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-gray-800/80 hover:bg-gray-700/80 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Register with Google
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;