

import React, { useState } from "react";
import { Smartphone, CreditCard, Zap, X, CheckCircle } from "lucide-react";

// Note: In a real app, you'd use react-hot-toast
const toast = {
  error: (msg) => console.error(msg),
  success: (msg) => console.log(msg),
};

const dummyPlans = [
  { id: 1, name: "1GB / 7 Days", amount: 199 },
  { id: 2, name: "1GB / 7 Days", amount: 499 },
  { id: 3, name: "5GB / 30 Days", amount: 899 },
];

export default function EsimTopup() {
  const [iccid, setIccid] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPlan = dummyPlans.find((p) => p.id === parseInt(selectedPlanId));
  const rechargeAmount = selectedPlan ? ` ₹${selectedPlan.amount}` : "₹0";

  const handleSubmit = async () => {
    if (!iccid || !selectedPlanId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Topup Successful");
      setIccid("");
      setSelectedPlanId("");
    } catch (err) {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center ">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Top-up</h2>
          </div>
          <p className="text-gray-500 text-sm mt-1">Recharge your eSIM plan instantly</p>
        </div>

        {/* ICCID Input */}
        <div className="mb-3">
          <label className="flex items-center mb-2 text-gray-700 font-medium">
            <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
            ICCID
          </label>
          <input
            type="text"
            placeholder="Enter your ICCID number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={iccid}
            onChange={(e) => setIccid(e.target.value)}
          />
        </div>

        {/* Plan Selection */}
        <div className="mb-6">
          <label className="flex items-center mb-2 text-gray-700 font-medium">
            <Zap className="w-4 h-4 mr-2 text-gray-500" />
            Select eSIM Plan
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
          >
            <option value="">-- Select Plan --</option>
            {dummyPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ₹{plan.amount}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Recharge Amount:</span>
            <span className="text-2xl font-bold text-blue-600">{rechargeAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Top up
              </>
            )}
          </button>

          <button
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            onClick={() => {
              setIccid("");
              setSelectedPlanId("");
            }}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Secure payment • Instant activation • 24/7 support</p>
        </div>
      </div>
    </div>
  );
}
