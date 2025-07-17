// import React, { useEffect, useRef, useState } from 'react';
// import { Link, redirect } from 'react-router-dom';
// import { useUser } from '../appContext/UserContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { PiShoppingCartSimpleLight } from "react-icons/pi";
// import { useCart } from '../appContext/CartContext';
// import { MdDashboard } from "react-icons/md";

// export default function Header() {
//   const [selected, setSelected] = useState('dashboard');
//   const [showMenu, setShowMenu] = useState(false);
//   const { user, setUser } = useUser();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const menuRef = useRef(null);
//   const { cart } = useCart();

//   useEffect(() => {
//     if (location.pathname == '/') setSelected('home');
//     else if (location.pathname.includes('/dashboard')) setSelected('dashboard');
//     else if (location.pathname.includes('/contact')) setSelected('contact');
//     else setSelected(null)
//   }, [location]);

//   // Close on outside click
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     }

//     // Attach the listener
//     document.addEventListener("mousedown", handleClickOutside);
//     // Clean up
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   async function handleLogout() {
//     setUser(null);
//     localStorage.removeItem('esim-user');
//     localStorage.removeItem('esim-accessToken');
//     localStorage.removeItem('esim-refreshToken');
//     navigate('/login')
//   }

//   return (

//     <header className="bg-white w-full sticky top-0 z-50 border-b border-gray-300">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">

//           <Link to={'/'} className="text-2xl font-bold text-red-600 flex items-center gap-1">
//             <span className="text-black">E</span>
//             <span className="text-red-600">SIM</span>
//           </Link>

//           {/* <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
//             <Link to={'/'} className="hover:text-red-600">Home</Link>
//             <Link to={'/'} className="hover:text-red-600">eSIMs</Link>
//             <Link to={'/'} className="hover:text-red-600">Free Gifts</Link>
//             {!!user && <Link to={'/dashboard/orders'} className="hover:text-red-600">Dashboard</Link>}
//           </nav> */}

//           {/* User Actions */}
//           {!user ? (
//             <div className="ml-2 flex items-center gap-3">
//               <Link
//                 to="/login"
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition font-medium"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition font-medium"
//               >
//                 Signup
//               </Link>
//             </div>
//           ) : (
//             <div ref={menuRef} className="relative ml-4 flex items-center">
//               {user &&
//                 <div>
//                   <div
//                     onClick={() => {
//                       navigate('/dashboard/orders')
//                     }}
//                     className="relative inline-block mr-4 cursor-pointer">
//                         <MdDashboard className="text-black w-7 h-7" />
//                   </div>

//                   <div
//                     onClick={() => {
//                       navigate('/cart')
//                     }}
//                     className="relative inline-block mr-4  cursor-pointer">

//                     <PiShoppingCartSimpleLight className="text-black w-7 h-7" />
//                     {cart?.length > 0 && <div className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                       {cart?.length}
//                     </div>}
//                   </div>
//                 </div>
//               }
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 text-white cursor-pointer rounded-full inline items-center justify-center text-lg font-bold shadow-md hover:scale-105 transition"
//               >
//                 {user?.userName?.slice(0, 1).toUpperCase()}
//               </button>

//               {showMenu && (
//                 <div className="absolute top-14 right-0 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
//                   <Link to="/profile">
//                     <div className="px-4 py-3 text-gray-800 font-medium hover:bg-indigo-50 transition cursor-pointer">
//                       {user?.userName?.split(' ')[0]}
//                     </div>
//                   </Link>
//                   <div className="border-t border-gray-100" />
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>

//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useUser } from "../appContext/UserContext";
// import { useCart } from "../appContext/CartContext";
// import { PiShoppingCartSimpleLight } from "react-icons/pi";
// import { MdDashboard } from "react-icons/md";
// import { FiUser } from "react-icons/fi"; // User icon
// import { IoPersonOutline } from "react-icons/io5";

// export default function Header() {
//   const [showMenu, setShowMenu] = useState(false);
//   const { user, setUser } = useUser();
//   const { cart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const menuRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("esim-user");
//     localStorage.removeItem("esim-accessToken");
//     localStorage.removeItem("esim-refreshToken");
//     navigate("/login");
//   };

//   return (
//     <header className="bg-white w-full sticky top-0 z-50 border-b border-gray-200 shadow-sm">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-2xl font-extrabold text-blue-600 tracking-tight flex items-center gap-1"
//           >
//             <span className="text-gray-900">E</span>
//             <span className="text-red-600">SIM</span>
//           </Link>

//           {/* Auth Section */}
//           {!user ? (
//             <div className="flex items-center gap-3">
//               <Link
//                 to="/login"
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : (
//             <div ref={menuRef} className="relative flex items-center gap-4">
//               {/* Dashboard Icon */}
//               <div
//                 onClick={() => navigate("/dashboard/orders")}
//                 className="cursor-pointer text-gray-800 hover:text-blue-600 transition"
//                 title="Dashboard"
//               >
//                 <MdDashboard className="w-6 h-6" />
//               </div>

//               {/* Cart Icon */}
//               {Array.isArray(cart) && (
//                 <div
//                   onClick={() => navigate("/cart")}
//                   className="cursor-pointer text-gray-800 hover:text-blue-600 transition relative"
//                   title="Cart"
//                 >
//                   <PiShoppingCartSimpleLight className="w-6 h-6" />
//                   {cart.length > 0 && (
//                     <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
//                       {cart.length}
//                     </span>
//                   )}
//                 </div>
//               )}

//               {/* User Icon */}
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="w-9 h-9 flex items-center justify-center text-xl text-gray-700 hover:text-blue-600 transition-transform"
//                 title="Account"
//               >
//                 <IoPersonOutline className="w-7 h-7" />
//               </button>

//               {/* Dropdown */}
//               {showMenu && (
//                 <div className="absolute top-14 right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
//                   <Link to="/profile">
//                     <div className="px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 cursor-pointer">
//                       {user?.userName?.split(" ")[0] || "Profile"}
//                     </div>
//                   </Link>
//                   <hr className="border-gray-100" />
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }






import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../appContext/UserContext";
import { useCart } from "../appContext/CartContext";
import { IoPersonOutline, IoGridOutline, IoCartOutline } from "react-icons/io5";
import motifpe from "../assets/motifpe.png";
export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, setUser } = useUser();
  const { cart } = useCart();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("esim-user");
    localStorage.removeItem("esim-accessToken");
    localStorage.removeItem("esim-refreshToken");
    navigate("/login");
  };

  return (
    <header className="bg-white w-full sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-blue-600 tracking-tight flex items-center gap-1"
          >
            <img src={motifpe} alt="motifpelogo" className="w-45 h-18 p-2" />
          </Link>

          {/* Auth Section */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div ref={menuRef} className="relative flex items-center gap-5">
              {/* Dashboard Icon */}
              <div
                onClick={() => navigate("/dashboard/orders")}
                className="cursor-pointer text-gray-800 hover:text-blue-600 transition"
                title="Dashboard"
              >
                <IoGridOutline className="w-7 h-7" />
              </div>

              {/* Cart Icon */}
              {/* {Array.isArray(cart) && (
                <div
                  onClick={() => navigate("/cart")}
                  className="cursor-pointer text-gray-800 hover:text-blue-600 transition relative"
                  title="Cart"
                >
                  <IoCartOutline className="w-7 h-7" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {cart.length}
                    </span>
                  )}
                </div>
              )} */}

              {/* User Icon */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 flex items-center justify-center text-xl text-gray-700 hover:text-blue-600 transition-transform"
                title="Account"
                style={{ cursor: "pointer" }}
              >
                <IoPersonOutline className="w-7 h-7" />
              </button>

              {/* Dropdown */}
              {showMenu && (
               <div className="absolute top-14 right-0 min-w-[11rem] max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
  <Link to="/profile">
    <div className="px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 cursor-pointer whitespace-nowrap">
      {user?.userName?.split(" ")[0] || "Profile"}
    </div>
  </Link>
  <hr className="border-gray-100" />
  <button
    onClick={handleLogout}
    style={{ cursor: "pointer" }}
    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition whitespace-nowrap"
  >
    Logout
  </button>
</div>

              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
