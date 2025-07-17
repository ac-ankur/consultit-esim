import { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle, AlertCircle, X, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../appContext/UserContext";
import apiClient from "../API/apiClient";


// Custom Toast Component
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

// OTP Input Component
const OTPInput = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').filter(char => !isNaN(char)).slice(0, length);
    
    if (pasteArray.length === length) {
      setOtp(pasteArray);
      onComplete(pasteArray.join(''));
    }
  };

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
            disabled 
              ? 'bg-gray-100 border-gray-300 text-gray-400'
              : 'bg-white border-gray-300 focus:border-blue-500 focus:shadow-md'
          }`}
          maxLength="1"
        />
      ))}
    </div>
  );
};

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserInContext } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Get data from navigation state
  const userData = location.state?.userData;
  const email = location.state?.email;
  const fromSignup = location.state?.fromSignup;
  const otpFailed = location.state?.otpFailed;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }
    
    // Show initial message if OTP failed to send
    if (otpFailed) {
      showApiMessage('Please request a new verification code.', 'error');
    }
  }, [email, navigate, otpFailed]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Custom API message handler
  const showApiMessage = (message, type = 'error') => {
    setApiMessage({ message, type });
    setTimeout(() => setApiMessage(null), 5000);
  };

  const handleOTPComplete = async (otpValue) => {
    setLoading(true);
    setApiMessage(null);

    try {
      // Verify OTP
      const response = await apiClient.post('/auth/verification/verify-otp', {
        value: email,
        otp: otpValue,
        contactMethod: 'email'
      });

      if (response.data) {
        showApiMessage('Email verified successfully! Redirecting...', 'success');
        
        // Update user context with verified status
        if (userData) {
          setUserInContext({
            ...userData,
            isVerified: true,
            emailVerified: true
          });
        }

        // Redirect to dashboard or home page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      
      if (error.userMessage) {
        showApiMessage(error.userMessage, 'error');
      } else {
        showApiMessage('Invalid or expired OTP. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setApiMessage(null);

    try {
      await api.post('/auth/verification/send-otp', {
        email: email,
        type: 'email_verification'
      });

      showApiMessage('Verification code sent successfully!', 'success');
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Resend OTP failed:', error);
      
      if (error.userMessage) {
        showApiMessage(error.userMessage, 'error');
      } else {
        showApiMessage('Failed to send verification code. Please try again.', 'error');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
        <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
          {/* Back Button */}
          <button
            onClick={() => navigate('/signup')}
            className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-8 mt-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
            <p className="text-gray-600 mt-2">
              We've sent a verification code to
            </p>
            <p className="text-blue-600 font-medium text-sm mt-1">
              {email}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter 6-digit verification code
            </label>
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              disabled={loading}
            />
          </div>

          {/* Resend Section */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
            
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1 mx-auto transition-colors duration-200"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Resend Code</span>
                  </>
                )}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend code in {countdown}s
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Verifying...</span>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm">
            Need help?{" "}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Contact Support
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