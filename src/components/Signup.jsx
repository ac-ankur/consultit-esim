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
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, X } from "lucide-react";
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
    type === 'success' ? 'border-green-500' : 'border-red-500'
  } p-4 flex items-center space-x-3 animate-slide-in z-50`}>
    {type === 'success' ? (
      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
    ) : (
      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
    )}
    <div className="flex-1">
      <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
        {message}
      </p>
    </div>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <X size={16} />
    </button>
  </div>
);

// Floating Label Input Component
const FloatingLabelInput = ({ 
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
  hasToggle = false
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="relative mb-6">
      <div className="relative">
        {Icon && (
          <Icon 
            className={`absolute left-3 top-3 transition-colors duration-200 ${
              focused || hasValue ? 'text-blue-500' : 'text-gray-400'
            }`} 
            size={20} 
          />
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-4 py-3 ${Icon ? 'pl-12' : 'pl-4'} ${hasToggle ? 'pr-12' : 'pr-4'} 
            border-2 rounded-lg transition-all duration-200 outline-none
            ${error && touched 
              ? 'border-red-500 focus:border-red-500' 
              : focused || hasValue 
                ? 'border-blue-500 focus:border-blue-500' 
                : 'border-gray-300 focus:border-blue-500'
            }
            ${focused ? 'shadow-md' : ''}
          `}
        />
        
        <label className={`absolute left-4 ${Icon ? 'left-12' : 'left-4'} transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? '-top-2 text-xs bg-white px-1 font-medium' + (error && touched ? ' text-red-500' : ' text-blue-500')
            : 'top-3 text-gray-500'
          }
        `}>
          {label}
        </label>
        
        {hasToggle && (
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && touched && (
        <div className="mt-1 text-red-500 text-sm flex items-center space-x-1">
          <AlertCircle size={16} />
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

  // Custom API message handler
  const showApiMessage = (message, type = 'error') => {
    setApiMessage({ message, type });
    setTimeout(() => setApiMessage(null), 5000); // Auto dismiss after 5 seconds
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
        .matches(/^[\w.+-]+@gmail\.com$/, 'Only Gmail addresses allowed')
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
        <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-2">
            <FloatingLabelInput
              label="Full Name"
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.errors.fullName}
              touched={formik.touched.fullName}
              icon={User}
            />

            <FloatingLabelInput
              label="Email Address"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.errors.email}
              touched={formik.touched.email}
              icon={Mail}
            />

            <FloatingLabelInput
              label="Mobile Number"
              type="text"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.errors.mobile}
              touched={formik.touched.mobile}
              icon={Phone}
            />

            <FloatingLabelInput
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

            <FloatingLabelInput
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

            <button
              type="submit"
              disabled={loading}
              style={{ cursor: "pointer" }}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Custom API Message Toast */}
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








// import { useState } from "react";
// import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, X, Smartphone, Globe, Wifi } from "lucide-react";

// // Custom Toast Component for API messages
// const CustomToast = ({ message, type, onClose }) => (
//   <div className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
//     type === 'success' ? 'border-emerald-500' : 'border-red-500'
//   } p-4 flex items-center space-x-3 animate-slide-in z-50`}>
//     {type === 'success' ? (
//       <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
//     ) : (
//       <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
//     )}
//     <div className="flex-1">
//       <p className={`text-sm font-medium ${type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
//         {message}
//       </p>
//     </div>
//     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//       <X size={16} />
//     </button>
//   </div>
// );

// // Modern Input Component
// const ModernInput = ({ 
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
//   hasToggle = false,
//   placeholder
// }) => {
//   const [focused, setFocused] = useState(false);
  
//   return (
//     <div className="relative">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <Icon 
//             className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
//               focused ? 'text-emerald-500' : 'text-gray-400'
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
//           placeholder={placeholder}
//           className={`w-full px-4 py-3 ${Icon ? 'pl-12' : 'pl-4'} ${hasToggle ? 'pr-12' : 'pr-4'} 
//             border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50 focus:bg-white
//             ${error && touched 
//               ? 'border-red-500 focus:border-red-500' 
//               : focused
//                 ? 'border-emerald-500 focus:border-emerald-500 shadow-lg shadow-emerald-100' 
//                 : 'border-gray-200 hover:border-gray-300'
//             }
//           `}
//         />
        
//         {hasToggle && (
//           <button
//             type="button"
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
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

// export default function ModernSignupPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiMessage, setApiMessage] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   // Custom API message handler
//   const showApiMessage = (message, type = 'error') => {
//     setApiMessage({ message, type });
//     setTimeout(() => setApiMessage(null), 5000);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setTouched(prev => ({
//       ...prev,
//       [name]: true
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.fullName.trim()) {
//       newErrors.fullName = 'Full name is required';
//     } else if (formData.fullName.length < 3) {
//       newErrors.fullName = 'Full name must be at least 3 characters';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[\w.+-]+@gmail\.com$/.test(formData.email)) {
//       newErrors.email = 'Only Gmail addresses allowed';
//     }
    
//     if (!formData.mobile.trim()) {
//       newErrors.mobile = 'Mobile number is required';
//     } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
//       newErrors.mobile = 'Please enter a valid mobile number';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase, and number';
//     }
    
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords must match';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
    
//     if (!validateForm()) {
//       showApiMessage('Please fix the validation errors and try again.', 'error');
//       return;
//     }
    
//     setLoading(true);
//     setApiMessage(null);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       showApiMessage('Account created successfully! Welcome to MotifPe!', 'success');
//     } catch (error) {
//       showApiMessage('Something went wrong. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen w-full flex bg-gradient-to-br from-emerald-50 to-teal-50">
//         {/* Left Side - Hero Section */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
//           {/* Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
//             <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-lg rotate-45"></div>
//             <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white rounded-full"></div>
//             <div className="absolute bottom-40 right-10 w-12 h-12 border-2 border-white rounded-lg rotate-12"></div>
//           </div>
          
//           {/* Logo */}
//           <div className="mb-8 z-10">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
//                 <Smartphone className="text-emerald-500" size={28} />
//               </div>
//               <h1 className="text-3xl font-bold">MotifPe</h1>
//             </div>
//           </div>
          
//           {/* Hero Content */}
//           <div className="text-center z-10 max-w-md">
//             <h2 className="text-4xl font-bold mb-6 leading-tight">
//               Your Global eSIM Solution
//             </h2>
//             <p className="text-xl mb-8 text-emerald-100">
//               Connect anywhere, anytime with our premium eSIM services. No more physical SIM cards, just seamless connectivity.
//             </p>
            
//             {/* Feature Icons */}
//             <div className="flex justify-center space-x-8 mb-8">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
//                   <Globe size={24} />
//                 </div>
//                 <p className="text-sm text-emerald-100">Global Coverage</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
//                   <Wifi size={24} />
//                 </div>
//                 <p className="text-sm text-emerald-100">Instant Activation</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
//                   <Smartphone size={24} />
//                 </div>
//                 <p className="text-sm text-emerald-100">Easy Setup</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//           <div className="w-full max-w-md">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="lg:hidden mb-6">
//                 <div className="flex items-center justify-center space-x-3 mb-4">
//                   <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
//                     <Smartphone className="text-white" size={24} />
//                   </div>
//                   <h1 className="text-2xl font-bold text-gray-800">MotifPe</h1>
//                 </div>
//               </div>
              
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
//               <p className="text-gray-600">Join thousands of users worldwide</p>
//             </div>

//             {/* Form */}
//             <div className="space-y-6">
//               {/* Full Name */}
//               <ModernInput
//                 label="Full Name"
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 error={errors.fullName}
//                 touched={touched.fullName}
//                 icon={User}
//                 placeholder="Enter your full name"
//               />

//               {/* Email and Mobile on same line */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <ModernInput
//                   label="Email Address"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   error={errors.email}
//                   touched={touched.email}
//                   icon={Mail}
//                   placeholder="your@gmail.com"
//                 />

//                 <ModernInput
//                   label="Mobile Number"
//                   type="text"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   error={errors.mobile}
//                   touched={touched.mobile}
//                   icon={Phone}
//                   placeholder="9876543210"
//                 />
//               </div>

//               {/* Password and Confirm Password on same line */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <ModernInput
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   error={errors.password}
//                   touched={touched.password}
//                   icon={Lock}
//                   showPassword={showPassword}
//                   onTogglePassword={() => setShowPassword(!showPassword)}
//                   hasToggle={true}
//                   placeholder="Enter password"
//                 />

//                 <ModernInput
//                   label="Confirm Password"
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   error={errors.confirmPassword}
//                   touched={touched.confirmPassword}
//                   icon={Lock}
//                   showPassword={showConfirmPassword}
//                   onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
//                   hasToggle={true}
//                   placeholder="Confirm password"
//                 />
//               </div>

//               {/* Terms */}
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
//                 />
//                 <label htmlFor="terms" className="text-sm text-gray-600">
//                   I agree to the{" "}
//                   <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
//                     Privacy Policy
//                   </a>
//                 </label>
//               </div>

//               {/* Submit Button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               >
//                 {loading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Creating Account...</span>
//                   </div>
//                 ) : (
//                   <>
//                     <span>Create Account</span>
//                     <Smartphone size={20} />
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Footer */}
//             <p className="mt-8 text-center text-gray-600">
//               Already have an account?{" "}
//               <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
//                 Sign In
//               </a>
//             </p>
//           </div>
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