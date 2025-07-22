// import { Link } from "react-router-dom";
// import { useOrders } from "../appContext/OrderContext";
// import { useEffect, useState } from "react";




// const statusStyles = {
//   completed: "bg-green-100 text-green-700",
//   PENDING: "bg-yellow-100 text-yellow-700",
//   failed: "bg-red-100 text-red-700",
//   uncompleted: "bg-red-100 text-red-700",
// };

// export default function OrdersPage() {
//   const { orders } = useOrders();
//   const [viewOrders, setViewOrders] = useState([]);
//   const [selectedButton, setSelectedButton] = useState('all')

//   useState(() => {
//     setViewOrders(orders);
//   }, [orders])

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen w-full text-black">
//       <h1 className="text-2xl font-bold mb-6 text-black">Orders</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <SummaryCard title="Total Orders" value={orders?.length} />
//         <SummaryCard title="Completed Orders" value={orders.filter(order => order.orderStatus === "COMPLETED").length} />
//         <SummaryCard title="Pending Orders" value={orders.filter(order => order.orderStatus === "PENDING").length} />
//         <SummaryCard title="Canceled Orders" value={orders.filter(order => order.orderStatus === "CANCELLED").length} />
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="space-x-3 text-sm font-medium">
//           <button
//             className={`border-b-2 ${selectedButton === 'all'
//                 ? 'text-blue-600 border-blue-600'
//                 : 'text-gray-500 hover:text-blue-600 border-transparent'
//               }`}
//             onClick={() => {
//               setViewOrders(orders);
//               setSelectedButton('all');
//             }}
//           >
//             All
//           </button>
//           <button
//             className={`border-b-2 ${selectedButton === 'completed'
//                 ? 'text-blue-600 border-blue-600'
//                 : 'text-gray-500 hover:text-blue-600 border-transparent'
//               }`}
//             onClick={() => {
//               setViewOrders(orders.filter((o) => o.orderStatus === 'COMPLETED'));
//               setSelectedButton('completed');
//             }}
//           >
//             Completed
//           </button>
//           <button
//             className={`border-b-2 ${selectedButton === 'pending'
//                 ? 'text-blue-600 border-blue-600'
//                 : 'text-gray-500 hover:text-blue-600 border-transparent'
//               }`}
//             onClick={() => {
//               setViewOrders(orders.filter((o) => o.orderStatus === 'PENDING'));
//               setSelectedButton('pending');
//             }}
//           >
//             Pending
//           </button>
//           <button
//             className={`border-b-2 ${selectedButton === 'cancelled'
//                 ? 'text-blue-600 border-blue-600'
//                 : 'text-gray-500 hover:text-blue-600 border-transparent'
//               }`}
//             onClick={() => {
//               setViewOrders(orders.filter((o) => o.orderStatus === 'CANCELLED'));
//               setSelectedButton('cancelled');
//             }}
//           >
//             Cancelled
//           </button>
//         </div>

//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="min-w-full text-sm text-left">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="px-4 py-2">Order</th>
//               <th className="px-4 py-2">Date</th>
//               <th className="px-4 py-2">Payment</th>
//               <th className="px-4 py-2">Total</th>
//               {/* <th className="px-4 py-2">Delivery</th> */}
//               <th className="px-4 py-2">Items</th>
//               <th className="px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {viewOrders.map((order, i) => (
//               <tr key={i} className="border-t">
//                 <td className="px-4 py-2 font-medium text-blue-600"><Link to={`/dashboard/orders/${order?.orderSeqId}`} className="hover:underline hover:underline-offset-2 decoration-1" >{order?.orderSeqId}</Link></td>
//                 <td className="px-4 py-2">09-07-2025</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order?.orderStatus]}`}>
//                     {order.orderStatus}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">{order?.amount}</td>
//                 {/* <td className="px-4 py-2">{order.delivery_status}</td> */}
//                 <td className="px-4 py-2">{order?.planName}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order?.orderStatus]}`}>
//                     {order?.orderStatus?.toLowerCase()}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function SummaryCard({ title, value }) {
//   return (
//     <div className="bg-white shadow-sm rounded-lg p-4 text-black">
//       <h3 className="text-sm text-gray-500">{title}</h3>
//       <div className="text-xl font-bold">{value}</div>
//       {/* <div className="text-xs text-green-500">{change} last week</div> */}
//     </div>
//   );
// }











import { Link } from "react-router-dom";
import { useOrders } from "../appContext/OrderContext";
import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  CreditCard,
  Package
} from "lucide-react";

const statusStyles = {
  completed: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  uncompleted: "bg-red-100 text-red-700",
};

const statusIcons = {
  completed: <CheckCircle className="w-4 h-4" />,
  PENDING: <Clock className="w-4 h-4" />,
  failed: <XCircle className="w-4 h-4" />,
  uncompleted: <XCircle className="w-4 h-4" />,
};

// Skeleton Components
function SkeletonCard() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border-2 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-t animate-pulse">
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-4 py-2">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Order
              </div>
            </th>
            <th className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </div>
            </th>
            <th className="px-4 py-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment
              </div>
            </th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items
              </div>
            </th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
        </tbody>
      </table>
    </div>
  );
}

function OrdersPageSkeleton() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full text-black">
      <div className="h-8 bg-gray-300 rounded w-32 mb-6 animate-pulse"></div>

      {/* Skeleton Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Skeleton Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-3 flex animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-8"></div>
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-18"></div>
        </div>
      </div>

      {/* Skeleton Table */}
      <TableSkeleton />
    </div>
  );
}

export default function OrdersPage() {
  const { orders } = useOrders();
  const [viewOrders, setViewOrders] = useState([]);
  const [selectedButton, setSelectedButton] = useState('all')
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
useEffect(() => {window.scrollTo(0, 0);}, []);
  useEffect(() => {
    if (orders && orders.length > 0) {
      setViewOrders(orders);
      setIsLoading(false);
      setIsTableLoading(false);
    } else if (orders) {
      // If orders is an empty array, still stop loading
      setViewOrders([]);
      setIsLoading(false);
      setIsTableLoading(false);
    }
  }, [orders])

  // Function to handle tab filtering with loading state
  const handleTabChange = (filterType, buttonName) => {
    setIsTableLoading(true);
    setSelectedButton(buttonName);
    
    // Simulate API call delay for filtering
    setTimeout(() => {
      let filteredOrders;
      switch (filterType) {
        case 'all':
          filteredOrders = orders;
          break;
        case 'completed':
          filteredOrders = orders.filter((o) => o.orderStatus === 'COMPLETED');
          break;
        case 'pending':
          filteredOrders = orders.filter((o) => o.orderStatus === 'PENDING');
          break;
        case 'cancelled':
          filteredOrders = orders.filter((o) => o.orderStatus === 'CANCELLED');
          break;
        default:
          filteredOrders = orders;
      }
      setViewOrders(filteredOrders);
      setIsTableLoading(false);
    }, 500); // Adjust delay as needed
  };

  if (isLoading) {
    return <OrdersPageSkeleton />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Orders</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Total Orders" 
          value={orders?.length} 
          color="orange"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <SummaryCard 
          title="Completed Orders" 
          value={orders.filter(order => order.orderStatus === "COMPLETED").length}
          color="green"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <SummaryCard 
          title="Pending Orders" 
          value={orders.filter(order => order.orderStatus === "PENDING").length}
          color="yellow"
          icon={<Clock className="w-6 h-6" />}
        />
        <SummaryCard 
          title="Canceled Orders" 
          value={orders.filter(order => order.orderStatus === "CANCELLED").length}
          color="red"
          icon={<XCircle className="w-6 h-6" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-3 text-sm font-medium">
          <button
            className={`border-b-2 px-2 py-1 ${selectedButton === 'all'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 border-transparent'
              }`}
            onClick={() => {
              setViewOrders(orders);
              setSelectedButton('all');
            }}
          >
            All
          </button>
          <button
            className={`border-b-2 px-2 py-1 ${selectedButton === 'completed'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 border-transparent'
              }`}
            onClick={() => {
              setViewOrders(orders.filter((o) => o.orderStatus === 'COMPLETED'));
              setSelectedButton('completed');
            }}
          >
            Completed
          </button>
          <button
            className={`border-b-2 px-2 py-1 ${selectedButton === 'pending'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 border-transparent'
              }`}
            onClick={() => {
              setViewOrders(orders.filter((o) => o.orderStatus === 'PENDING'));
              setSelectedButton('pending');
            }}
          >
            Pending
          </button>
          <button
            className={`border-b-2 px-2 py-1 ${selectedButton === 'cancelled'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 border-transparent'
              }`}
            onClick={() => {
              setViewOrders(orders.filter((o) => o.orderStatus === 'CANCELLED'));
              setSelectedButton('cancelled');
            }}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Table */}
      {isTableLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg ">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 bg-teal-50">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Order
                  </div>
                </th>
                <th className="px-4 py-2 bg-teal-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
                <th className="px-4 py-2  bg-teal-50">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </div>
                </th>
                <th className="px-4 py-2 bg-teal-50">Total</th>
                {/* <th className="px-4 py-2">Delivery</th> */}
                <th className="px-4 py-2 bg-teal-50">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items
                  </div>
                </th>
                <th className="px-4 py-2 bg-teal-50">Status</th>
              </tr>
            </thead>
            <tbody>
              {viewOrders.map((order, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 font-medium text-blue-600"><Link to={`/dashboard/orders/${order?.orderSeqId}`} className="hover:underline hover:underline-offset-2 decoration-1" >{order?.orderSeqId}</Link></td>
                  <td className="px-4 py-2">09-07-2025</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusStyles[order?.orderStatus]}`}>
                      {statusIcons[order?.orderStatus]}
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">{order?.amount}</td>
                  {/* <td className="px-4 py-2">{order.delivery_status}</td> */}
                  <td className="px-4 py-2">{order?.planName}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusStyles[order?.orderStatus]}`}>
                      {statusIcons[order?.orderStatus]}
                      {order?.orderStatus?.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color, icon }) {
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  const iconColorClasses = {
    orange: "text-orange-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className={`shadow-sm rounded-lg p-4 border-2 text-black ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <div className="text-xl font-bold">{value}</div>
          {/* <div className="text-xs text-green-500">{change} last week</div> */}
        </div>
        <div className={`${iconColorClasses[color]} opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  );
}














// const orders = [
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
//   {
//     order_id: "ORD123456",
//     date: "2025-07-03",
//     customer: "Rahul Mehta",
//     payment_status: "paid",
//     total: "$9.99",
//     delivery_status: "delivered",
//     items: "1 plan",
//     fulfillment: "completed",
//   },
// ];