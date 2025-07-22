// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const { pathname } = useLocation();

//   const navItems = [
//     // { label: 'eSIMs', path: '/dashboard' },
//     { label: 'Orders', path: '/dashboard/orders' },
//     { label: 'Topup Plans', path: '/dashboard/topup' },
//     { label: 'Activate eSim', path: '/dashboard/activate' }
//   ];

//   return (
//     <div className="w-64 h-screen bg-gray-50 text-black flex flex-col p-4">
//       <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//       <nav className="flex flex-col space-y-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`px-4 py-2 rounded-lg hover:bg-gray-200 ${
//               pathname === item.path ? 'bg-gray-200' : ''
//             }`}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;












// import { Link, useLocation } from 'react-router-dom';
// import { useUser } from '../appContext/UserContext';

// const Sidebar = () => {
//   const { pathname } = useLocation();
//   const { user } = useUser();

//   // Define nav items for admin and regular users
//   const adminNavItems = [
//     { label: 'Dashboard', path: '/dashboard/orders' },
//     { label: 'Vendor Registration', path: '/vendorregistration' },
//     { label: 'Vendor Management', path: '/vendormanagement' },
//   ];

//   const userNavItems = [
//     { label: 'Orders', path: '/dashboard/orders' },
//     { label: 'Topup Plans', path: '/dashboard/topup' },
//     { label: 'Activate eSim', path: '/dashboard/activate' }
//   ];

//   // Choose nav items based on role
//   const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

//   return (
//     <div className="w-64 h-screen bg-gray-50 text-black flex flex-col p-4">
//       <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//       <nav className="flex flex-col space-y-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`px-4 py-2 rounded-lg hover:bg-gray-200 ${
//               pathname === item.path ? 'bg-gray-200' : ''
//             }`}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;








import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../appContext/UserContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useUser();

  // Log user to debug structure
  // console.log('Sidebar user:', user);

  // Try both possible structures
  const roleName =
    user?.role?.roleName?.toLowerCase() ||
    user?.profile?.role?.roleName?.toLowerCase();

     let userName =
    user?.userName ||
    user?.profile?.userName ||
    user?.email ||
    "";
if (userName && userName.includes('@')) {
  userName = userName.split('@')[0];
}

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard/Vendordashboard' },
    { label: 'User Management ', path: '/dashboard/usermanagement' },
    { label: 'Vendor Management', path: '/dashboard/vendormanagement' },
  ];

  const vendorNavItems = [
    { label: 'Dashboard', path: '/dashboard/orders' },
  ];

  const userNavItems = [
    { label: 'Orders', path: '/dashboard/orders' },
    { label: 'Topup Plans', path: '/dashboard/topup' },
    { label: 'Activate eSim', path: '/dashboard/activate' }
  ];

  let navItems = userNavItems;
  if (roleName === 'admin') {
    navItems = adminNavItems;
  } else if (roleName === 'vendor') {
    navItems = vendorNavItems;
  }

  // Only check for roleName, not all nested properties
  if (!roleName) {
  return (
    <div className="w-64 h-screen bg-gray-50 text-black flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">
        Hello{userName ? `, ${userName}` : ""}
      </h2>
      <nav className="flex flex-col space-y-2">
        <span className="text-gray-400">Loading...</span>
      </nav>
    </div>
  );
}

return (
  <div className="w-64 h-screen bg-gray-50 text-black flex flex-col p-4">
    <h2 className="text-xl font-bold mb-6">
      Hello{userName ? `, ${userName}` : ""}
    </h2>
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-4 py-2 rounded-lg hover:bg-gray-200 ${
            pathname === item.path ? 'bg-gray-200' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </div>
);
};

export default Sidebar;