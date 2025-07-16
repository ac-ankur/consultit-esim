// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function ActivateEsim() {
//   const [iccid, setIccid] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleActivate = async () => {
//     if (!iccid.trim()) {
//       toast.error("Please enter a valid ICC-ID");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch("https://your-api.com/esim/activate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ iccid }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("eSIM activated successfully!");
//         navigate("/orders");
//       } else {
//         toast.error(data.message || "Activation failed");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center px-4">
//       <div className="w-full h-70 mt-4 bg-white p-8 rounded-xl shadow-md border border-gray-200">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Activate eSIM</h2>

//         <label className="block mb-2 text-gray-700">ICC-ID</label>
//         <input
//           type="text"
//           placeholder="Enter iccid number"
//           className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={iccid}
//           onChange={(e) => setIccid(e.target.value)}
//         />

//         <div className="flex gap-4 max-w-md">
//           <button
//             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
//             onClick={handleActivate}
//             disabled={loading}
//           >
//             {loading ? "Activating..." : "Activate"}
//           </button>
//           <button
//             className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition duration-200"
//             onClick={() => setIccid("")}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Smartphone, Loader2, XCircle, CheckCircle } from "lucide-react";

export default function ActivateEsim() {
  const [iccid, setIccid] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleActivate = async () => {
    if (!iccid.trim()) {
      toast.error("Please enter a valid ICC-ID");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://your-api.com/esim/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iccid }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("eSIM activated successfully!");
        navigate("/orders");
      } else {
        toast.error(data.message || "Activation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center ">
      <div className="w-full max-w-2xl  min-h-[400px]  p-8 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Activate eSIM</h2>
        </div>

        {/* ICCID Input */}
        <label className="block mb-2 text-gray-700 font-medium">ICC-ID</label>
        <input
          type="text"
          placeholder="Enter ICCID number"
          className="w-full px-4 py-3 mb-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={iccid}
          onChange={(e) => setIccid(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Activate
              </>
            )}
          </button>

          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200"
            onClick={() => setIccid("")}
            disabled={loading}
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
