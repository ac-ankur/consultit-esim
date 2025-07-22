// import { useState } from 'react';
// import { 
//   Facebook, 
//   Twitter, 
//   Linkedin, 
//   Instagram, 
//   ChevronUp 
// } from 'lucide-react';

// export default function Footer() {
//   const [expandedSection, setExpandedSection] = useState(null);

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   return (
//     <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-700 overflow-hidden relative">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative">
//         {/* Main Footer Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
//             {/* Company Section */}
//             <div className="lg:col-span-1 space-y-6">
//               <div className="flex items-center space-x-3">
//                 <img src="../../src/logo1.png" alt="ConsultIt Logo" className="h-12 w-auto object-contain" />
                
//               </div>
              
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 Leading provider of eSIM solutions and cellular services worldwide. 
//                 Connecting you globally with seamless mobile experiences.
//               </p>

//               {/* Social Media */}
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-800 mb-3">Follow Us</h4>
//                 <div className="flex space-x-3">
//                   <a href="#" className="group relative">
//                     <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
//                       <Facebook className="text-blue-600 group-hover:text-blue-700" size={16} />
//                     </div>
//                   </a>
//                   <a href="#" className="group relative">
//                     <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
//                       <Twitter className="text-blue-400 group-hover:text-blue-500" size={16} />
//                     </div>
//                   </a>
//                   <a href="#" className="group relative">
//                     <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
//                       <Linkedin className="text-blue-700 group-hover:text-blue-800" size={16} />
//                     </div>
//                   </a>
//                   <a href="#" className="group relative">
//                     <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
//                       <Instagram className="text-pink-500 group-hover:text-pink-600" size={16} />
//                     </div>
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Policies Section */}
//             <div className="lg:col-span-1">
//               <div className="lg:hidden">
//                 <button
//                   onClick={() => toggleSection('policies')}
//                   className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-800 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-lg transition-all duration-300 px-2 cursor-pointer"
//                 >
//                   <h3 className="text-lg font-semibold text-gray-800">Policies</h3>
//                   <ChevronUp 
//                     className={`transform transition-transform duration-200 ${
//                       expandedSection === 'policies' ? 'rotate-0' : 'rotate-180'
//                     }`}
//                     size={16}
//                   />
//                 </button>
//               </div>
              
//               <h3 className="hidden lg:block text-lg font-semibold text-gray-800 mb-6">Policies</h3>
              
//               <div className={`space-y-3 ${expandedSection === 'policies' ? 'block' : 'hidden'} lg:block`}>
//                 {[
//                   { to: "/refund-policy", text: "Refund Policy" },
//                   { to: "/termsofservices", text: "Terms Of Services" },
//                   { to: "/privacy", text: "Privacy Policy" },
//                   { to: "/kyc", text: "KYC Policy" }
//                 ].map((item, index) => (
//                   <a
//                     key={index}
//                     href={item.to}
//                     className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
//                   >
//                     {item.text}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Important Links Section */}
//             <div className="lg:col-span-2">
//               <div className="lg:hidden">
//                 <button
//                   onClick={() => toggleSection('links')}
//                   className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-800 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-lg transition-all duration-300 px-2 cursor-pointer"
//                 >
//                   <h3 className="text-lg font-semibold text-gray-800">Important Links</h3>
//                   <ChevronUp 
//                     className={`transform transition-transform duration-200 ${
//                       expandedSection === 'links' ? 'rotate-0' : 'rotate-180'
//                     }`}
//                     size={16}
//                   />
//                 </button>
//               </div>
              
//               <h3 className="hidden lg:block text-lg font-semibold text-gray-800 mb-6">Important Links</h3>
              
//               <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${expandedSection === 'links' ? 'block' : 'hidden'} lg:block`}>
//                 {[
//                   "eSIM compatible devices for iOS",
//                   "eSIM compatible devices for Android", 
//                   "Other eSIM compatible devices",
//                   "eSIM delivery and activation",
//                   "Delivery timelines",
//                   "FAQ on eSIM",
//                   "Partner Login",
//                   "eSIM Technology"
//                 ].map((link, index) => (
//                   <a
//                     key={index}
//                     href="#"
//                     className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
//                   >
//                     {link}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Divider Line */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="bg-white/30 backdrop-blur-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
//               <div className="text-center sm:text-left">
//                 <p className="text-xs text-gray-500">
//                   © 2025 <span className="font-semibold text-gray-700">ConsultIt</span>
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   CONSULTIT CELLULAR (INTERNATIONAL) SERVICES PRIVATE LIMITED
//                 </p>
//               </div>
              
//               <div className="flex items-center space-x-6 text-xs text-gray-500">
//                 <span className="flex items-center">
//                   <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//                   All systems operational
//                 </span>
//                 <span>Made with ❤️ in India</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }










import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ChevronUp 
} from 'lucide-react';
import logo from '../assets/motifpe.png';
export default function Footer() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-700 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <img src={logo} alt="Motifpe Logo" className="w-32 h-12 sm:w-40 sm:h-50 object-contain" />

              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Leading provider of eSIM solutions and cellular services worldwide. 
                Connecting you globally with seamless mobile experiences.
              </p>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  <a href="#" className="group relative">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <Facebook className="text-blue-600 group-hover:text-blue-700" size={16} />
                    </div>
                  </a>
                  <a href="#" className="group relative">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <Twitter className="text-blue-400 group-hover:text-blue-500" size={16} />
                    </div>
                  </a>
                  <a href="#" className="group relative">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <Linkedin className="text-blue-700 group-hover:text-blue-800" size={16} />
                    </div>
                  </a>
                  <a href="#" className="group relative">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <Instagram className="text-pink-500 group-hover:text-pink-600" size={16} />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="lg:col-span-1">
              <div className="lg:hidden">
                <button
                  onClick={() => toggleSection('policies')}
                  className="w-full flex items-center justify-between py-3 text-left hover:shadow-lg hover:scale-[1] active:scale-[0.98] rounded-lg transition-all duration-300 px-2 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">Policies</h3>
                  <ChevronUp 
                    className={`transform transition-transform duration-200 ${
                      expandedSection === 'policies' ? 'rotate-0' : 'rotate-180'
                    }`}
                    size={16}
                  />
                </button>
              </div>
              
              <h3 className="hidden lg:block text-lg font-semibold text-gray-800 ml-3 mb-6">Policies</h3>
              
              <div className={`space-y-3 ${expandedSection === 'policies' ? 'block' : 'hidden'} lg:block`}>
                {[
                  { to: "/refund-policy", text: "Refund Policy" },
                  { to: "/termsofservices", text: "Terms Of Services" },
                  { to: "/privacy", text: "Privacy Policy" },
                  { to: "/kyc", text: "KYC Policy" }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.to}
                    className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Important Links Section */}
            <div className="lg:col-span-1">
              <div className="lg:hidden">
                <button
                  onClick={() => toggleSection('links')}
                  className="w-full flex items-center justify-between py-3 text-left hover:shadow-lg hover:scale-[1] active:scale-[0.98] rounded-lg transition-all duration-300 px-2 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-800">Important Links</h3>
                  <ChevronUp 
                    className={`transform transition-transform duration-200 ${
                      expandedSection === 'links' ? 'rotate-0' : 'rotate-180'
                    }`}
                    size={16}
                  />
                </button>
              </div>
              
              <h3 className="hidden lg:block text-lg font-semibold text-gray-800 ml-3 mb-6">Important Links</h3>
              
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${expandedSection === 'links' ? 'block' : 'hidden'} lg:block`}>
                {[
                  "eSIM compatible devices for iOS",
                  "eSIM compatible devices for Android", 
                  "Other eSIM compatible devices",
                  "eSIM delivery and activation",
                  "Delivery timelines",
                  "FAQ on eSIM",
                  "Partner Login",
                  "eSIM Technology"
                ].map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">
                  © 2025 <span className="font-semibold text-gray-700">MotifPe</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MotifPe ESIM
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  All systems operational
                </span>
                <span>Made with ❤️ in India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}