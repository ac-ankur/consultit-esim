import { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle, AlertCircle, X, ArrowLeft, RefreshCw, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../appContext/UserContext";
import apiClient from "../API/apiClient";

// Custom Toast Component
const CustomToast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-gray-100 ${
    type === 'success' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'
  } p-4 flex items-center space-x-3 animate-slide-in z-50 backdrop-blur-sm`}>
    {type === 'success' ? (
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
        <CheckCircle className="text-emerald-500 flex-shrink-0" size={18} />
      </div>
    ) : (
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
      </div>
    )}
    <div className="flex-1">
      <p className={`text-sm font-medium ${type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
        {message}
      </p>
    </div>
    <button 
      onClick={onClose} 
      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
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
    <div className="flex justify-center space-x-2">
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
          className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all duration-200 ${
            disabled 
              ? 'bg-gray-100 border-gray-300 text-gray-400'
              : digit 
                ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-md'
                : 'bg-white border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 hover:border-teal-400'
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
     
      const response = await apiClient.post('/auth/verification/verify-otp', {
        value: email,
        otp: otpValue,
        contactMethod: 'email'
      });

      if (response.data) {
        showApiMessage('Email verified successfully! Redirecting...', 'success');
        
       
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 p-4">
        <div className="w-full max-w-lg">
          {/* Main verification card */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
            {/* Header section with gradient */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-8 text-center relative">
              {/* Back Button */}
              <button
                onClick={() => navigate('/signup')}
                className="absolute top-4 left-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield className="text-white" size={36} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-teal-100 text-sm">
                We've sent a verification code to
              </p>
              <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-white font-medium text-sm">
                  {email}
                </p>
              </div>
            </div>

            {/* Form section */}
            <div className="px-8 py-8">
              {/* OTP Input */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-6 text-center">
                  Enter 6-digit verification code
                </label>
                <OTPInput
                  length={6}
                  onComplete={handleOTPComplete}
                  disabled={loading}
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center space-x-3 text-teal-600 mb-6 bg-teal-50 rounded-xl p-4">
                  <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Verifying your code...</span>
                </div>
              )}

              {/* Resend Section */}
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm mb-4">
                  Didn't receive the code?
                </p>
                
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
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
                  <div className="bg-gray-100 rounded-lg p-3 inline-block">
                    <p className="text-gray-600 text-sm font-medium">
                      Resend available in {countdown}s
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Need help?{" "}
                  <Link to="/support" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              🔒 Your verification is secured with end-to-end encryption
            </p>
          </div>
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

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100/10 rounded-full blur-3xl"></div>
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