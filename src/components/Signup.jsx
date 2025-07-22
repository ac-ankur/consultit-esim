// import { useEffect, useState } from "react";
// import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useUser } from "../appContext/UserContext";
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// // Custom Toast Component for API messages

// const CustomToast = ({ message, type, onClose }) => (
//   <div className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
//     type === 'success' ? 'border-green-500' : 'border-red-500'
//   } p-4 flex items-center space-x-3 animate-slide-in z-50`}>
//     {type === 'success' ? (
//       <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
//     ) : (
//       <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
//     )}
//     <div className="flex-1">
//       <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
//         {message}
//       </p>
//     </div>
//     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//       <X size={16} />
//     </button>
//   </div>
// );

// // Floating Label Input Component
// const FloatingLabelInput = ({ 
//   label, 
//   type = "text", 
//   name, 
//   value, 
//   onChange, 
//   error, 
//   touched, 
//   icon: Icon,
//   showPassword,
//   onTogglePassword,
//   hasToggle = false
// }) => {
//   const [focused, setFocused] = useState(false);
//   const hasValue = value && value.length > 0;
//   useEffect(() => {
//   window.scrollTo(0, 0);
// }, []);
//   return (
//     <div className="relative mb-6">
//       <div className="relative">
//         {Icon && (
//           <Icon 
//             className={`absolute left-3 top-3 transition-colors duration-200 ${
//               focused || hasValue ? 'text-blue-500' : 'text-gray-400'
//             }`} 
//             size={20} 
//           />
//         )}
        
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           className={`w-full px-4 py-3 ${Icon ? 'pl-12' : 'pl-4'} ${hasToggle ? 'pr-12' : 'pr-4'} 
//             border-2 rounded-lg transition-all duration-200 outline-none
//             ${error && touched 
//               ? 'border-red-500 focus:border-red-500' 
//               : focused || hasValue 
//                 ? 'border-blue-500 focus:border-blue-500' 
//                 : 'border-gray-300 focus:border-blue-500'
//             }
//             ${focused ? 'shadow-md' : ''}
//           `}
//         />
        
//         <label className={`absolute left-4 ${Icon ? 'left-12' : 'left-4'} transition-all duration-200 pointer-events-none
//           ${focused || hasValue 
//             ? '-top-2 text-xs bg-white px-1 font-medium' + (error && touched ? ' text-red-500' : ' text-blue-500')
//             : 'top-3 text-gray-500'
//           }
//         `}>
//           {label}
//         </label>
        
//         {hasToggle && (
//           <button
//             type="button"
//             className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//             onClick={onTogglePassword}
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         )}
//       </div>
      
//       {error && touched && (
//         <div className="mt-1 text-red-500 text-sm flex items-center space-x-1">
//           <AlertCircle size={16} />
//           <span>{error}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function SignupPage() {
//   const { setUserInContext } = useUser();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [apiMessage, setApiMessage] = useState(null);

//   // Custom API message handler
//   const showApiMessage = (message, type = 'error') => {
//     setApiMessage({ message, type });
//     setTimeout(() => setApiMessage(null), 5000); // Auto dismiss after 5 seconds
//   };

//   const formik = useFormik({
//     initialValues: {
//       fullName: '',
//       email: '',
//       mobile: '',
//       password: '',
//       confirmPassword: '',
//     },
//     validationSchema: Yup.object({
//       fullName: Yup.string()
//         .min(3, 'Full name must be at least 3 characters')
//         .required('Full name is required'),
//       email: Yup.string()
//         .email('Invalid email format')
//         .required('Email is required'),
//       mobile: Yup.string()
//         .matches(/^[6-9]\d{9}$/, 'Please enter a valid mobile number')
//         .required('Mobile number is required'),
//       password: Yup.string()
//         .min(6, 'Password must be at least 6 characters')
//         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
//         .required('Password is required'),
//       confirmPassword: Yup.string()
//         .required('Please confirm your password')
//         .oneOf([Yup.ref('password')], 'Passwords must match'),
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);
//       setApiMessage(null);
      
//       try {
//         // Check username availability (if needed)
//         const checkUsername = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/check-username/${values.email}`);
//         const usernameData = await checkUsername.json();
        
//         if (usernameData?.data?.isAvaible === false) {
//           formik.setErrors({ email: 'Email already exists' });
//           showApiMessage('This email is already registered. Please use a different email.', 'error');
//           return;
//         }
        
//         // Sign up request
//         const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/sign-up`, {
//           method: 'POST',
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userName: values.email,
//             fullName: values.fullName,
//             email: values.email,
//             password: values.password,
//             mobile: values.mobile,
//             region: values.region
//           }),
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//           setUserInContext(data);
//           showApiMessage('Account created successfully! Welcome aboard!', 'success');
//           setTimeout(() => navigate("/"), 1500);
//         } else {
//           showApiMessage(data.error || 'Something went wrong. Please try again.', 'error');
//         }
//       } catch (error) {
//         showApiMessage('Network error. Please check your connection and try again.', 'error');
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <>
//       <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
//         <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
//               <User className="text-white" size={32} />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
//             <p className="text-gray-600 mt-1">Join us and start your journey</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={formik.handleSubmit} className="space-y-2">
//             <FloatingLabelInput
//               label="Full Name"
//               type="text"
//               name="fullName"
//               value={formik.values.fullName}
//               onChange={formik.handleChange}
//               error={formik.errors.fullName}
//               touched={formik.touched.fullName}
//               icon={User}
//             />

//             <FloatingLabelInput
//               label="Email Address"
//               type="email"
//               name="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               error={formik.errors.email}
//               touched={formik.touched.email}
//               icon={Mail}
//             />

//             <FloatingLabelInput
//               label="Mobile Number"
//               type="text"
//               name="mobile"
//               value={formik.values.mobile}
//               onChange={formik.handleChange}
//               error={formik.errors.mobile}
//               touched={formik.touched.mobile}
//               icon={Phone}
//             />

//             <FloatingLabelInput
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={formik.errors.password}
//               touched={formik.touched.password}
//               icon={Lock}
//               showPassword={showPassword}
//               onTogglePassword={() => setShowPassword(!showPassword)}
//               hasToggle={true}
//             />

//             <FloatingLabelInput
//               label="Confirm Password"
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formik.values.confirmPassword}
//               onChange={formik.handleChange}
//               error={formik.errors.confirmPassword}
//               touched={formik.touched.confirmPassword}
//               icon={Lock}
//               showPassword={showConfirmPassword}
//               onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
//               hasToggle={true}
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
//             >
//               {loading ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
//           </form>

//           {/* Footer */}
//           <p className="mt-6 text-center text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>

//         {/* Custom API Message Toast */}
//         {apiMessage && (
//           <CustomToast
//             message={apiMessage.message}
//             type={apiMessage.type}
//             onClose={() => setApiMessage(null)}
//           />
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
        
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// }










import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, X, Smartphone, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../appContext/UserContext";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "../API/apiClient";

// Custom Toast Component for API messages
const CustomToast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
    type === 'success' ? 'border-teal-500' : 'border-red-500'
  } p-4 flex items-center space-x-3 animate-slide-in z-50`}>
    {type === 'success' ? (
      <CheckCircle className="text-teal-500 flex-shrink-0" size={20} />
    ) : (
      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
    )}
    <div className="flex-1">
      <p className={`text-sm font-medium ${type === 'success' ? 'text-teal-800' : 'text-red-800'}`}>
        {message}
      </p>
    </div>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <X size={16} />
    </button>
  </div>
);

// Compact Floating Label Input Component
const CompactFloatingInput = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  touched, 
  icon: Icon,
  showPassword,
  onTogglePassword,
  hasToggle = false,
  className = ""
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {Icon && (
          <Icon 
            className={`absolute left-3 top-3 transition-colors duration-200 ${
              focused || hasValue ? 'text-teal-500' : 'text-gray-400'
            }`} 
            size={18} 
          />
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3 py-2.5 ${Icon ? 'pl-10' : 'pl-3'} ${hasToggle ? 'pr-10' : 'pr-3'} 
            border-2 rounded-lg transition-all duration-200 outline-none text-sm
            ${error && touched 
              ? 'border-red-500 focus:border-red-500' 
              : focused || hasValue 
                ? 'border-teal-500 focus:border-teal-500' 
                : 'border-gray-300 focus:border-teal-500'
            }
            ${focused ? 'shadow-md' : ''}
          `}
        />
        
        <label className={`absolute ${Icon ? 'left-10' : 'left-3'} transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? '-top-2 text-xs bg-white px-1 font-medium' + (error && touched ? ' text-red-500' : ' text-teal-500')
            : 'top-2.5 text-gray-500 text-sm'
          }
        `}>
          {label}
        </label>
        
        {hasToggle && (
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && touched && (
        <div className="mt-1 text-red-500 text-xs flex items-center space-x-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default function SignupPage() {
  const { setUserInContext } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Custom API message handler
  const showApiMessage = (message, type = 'error') => {
    setApiMessage({ message, type });
    setTimeout(() => setApiMessage(null), 5000);
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid mobile number')
        .required('Mobile number is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiMessage(null);
      
      try {
        // Step 1: Check username availability
        const usernameResponse = await apiClient.get(`/auth/check-username/${values.email}`);
        
        if (usernameResponse.data?.isAvaible === false) {
          formik.setErrors({ email: 'Email already exists' });
          showApiMessage('This email is already registered. Please use a different email.', 'error');
          return;
        }
        
        // Step 2: Create user account
        const signupResponse = await apiClient.post('/auth/sign-up', {
          userName: values.email,
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          mobile: values.mobile,
          region: values.region
        });
        
        if (signupResponse.data) {
          // Step 3: Send OTP for email verification
          try {
            await apiClient.post('/auth/verification/send-otp', {
              value: values.email,
              contactMethod:"email"
            });
            
            showApiMessage('Account created successfully! Please check your email for verification code.', 'success');
            
            // Store user data temporarily for OTP verification
            const userData = {
              ...signupResponse.data,
              email: values.email,
              fullName: values.fullName,
              mobile: values.mobile,
              isVerified: false
            };
            
            // Navigate to OTP verification page with user data
            setTimeout(() => {
              navigate('/verify-email', { 
                state: { 
                  userData,
                  email: values.email,
                  fromSignup: true 
                } 
              });
            }, 1500);
            
          } catch (otpError) {
            // If OTP sending fails, still navigate but show warning
            console.error('OTP sending failed:', otpError);
            showApiMessage('Account created! However, there was an issue sending the verification email. You can request it again.', 'error');
            
            setTimeout(() => {
              navigate('/verify-email', { 
                state: { 
                  userData: signupResponse.data,
                  email: values.email,
                  fromSignup: true,
                  otpFailed: true
                } 
              });
            }, 2000);
          }
        }
        
      } catch (error) {
        console.error('Signup error:', error);
        
        // Handle different error types from the API interceptor
        if (error.validationErrors) {
          // Handle validation errors
          const formErrors = {};
          Object.keys(error.validationErrors).forEach(field => {
            formErrors[field] = error.validationErrors[field][0];
          });
          formik.setErrors(formErrors);
          showApiMessage('Please fix the validation errors and try again.', 'error');
        } else if (error.userMessage) {
          // Handle user-friendly error messages from interceptor
          showApiMessage(error.userMessage, 'error');
        } else {
          // Fallback error message
          showApiMessage('Something went wrong. Please try again.', 'error');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="min-h-screen w-full flex bg-white" style={{height: '90%'}}>
   
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
        
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-20 w-60 h-60 bg-white rounded-full"></div>
            <div className="absolute top-60 right-40 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center mb-30 left-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                <Smartphone className="text-white" size={48} />
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome to eSIM World</h1>
              <p className="text-xl text-teal-100 mb-1leading-relaxed">
                Connect globally with instant eSIM activation. No physical SIM cards needed.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-7 max-w-sm">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={16} />
                </div>
                <span className="text-teal-100">Instant activation worldwide</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="text-white" size={16} />
                </div>
                <span className="text-teal-100">200+ countries coverage</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <span className="text-teal-100">No roaming charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 lg:max-w-lg xl:max-w-xl flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600">Join thousands of travelers using eSIM</p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Full Name */}
              <CompactFloatingInput
                label="Full Name"
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.errors.fullName}
                touched={formik.touched.fullName}
                icon={User}
              />

              {/* Email */}
              <CompactFloatingInput
                label="Email Address"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email}
                touched={formik.touched.email}
                icon={Mail}
              />

              {/* Mobile */}
              <CompactFloatingInput
                label="Mobile Number"
                type="text"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={formik.errors.mobile}
                touched={formik.touched.mobile}
                icon={Phone}
              />

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CompactFloatingInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  icon={Lock}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  hasToggle={true}
                />

                <CompactFloatingInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.errors.confirmPassword}
                  touched={formik.touched.confirmPassword}
                  icon={Lock}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  hasToggle={true}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{cursor: loading ? 'not-allowed' : 'pointer'}}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mt-6 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <Smartphone size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        
        {apiMessage && (
          <CustomToast
            message={apiMessage.message}
            type={apiMessage.type}
            onClose={() => setApiMessage(null)}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

