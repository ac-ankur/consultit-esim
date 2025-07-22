import React, { useState, useEffect, useMemo, useCallback } from "react"          
import {
  Search,
  Building,
  Mail,
  Phone,
  FileText,
  CreditCard,
  MapPin,
  Percent,
  CheckSquare,
  Square,
  Plus,
  AlertCircle,
  CheckCircle,
  Save,
  User,
  Loader,
} from "lucide-react";
import apiClient from "../../API/apiClient";

const VendorRegistration = () => {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorAddress: "",
    email: "",
    mobileNumber: "",
    gstin: "",
    pan: "",
    remark: "",
    defaultCommission: "",
    bankName: "",
    branchName: "",
    ifsc: "",
    accountNumber: "",
    linkedPlans: [],
  });

  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // FIX 1: Add missing debouncedSearchTerm state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [bulkPortalCommission, setBulkPortalCommission] = useState("");
  const [bulkVendorCommission, setBulkVendorCommission] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await apiClient.get("/product/get-all-product");
        console.log("Fetched plans:", response.data);
        console.log("Response message:", response.data.message);
        setPlans(response.data.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setMessage({
          type: "error",
          text: "Error loading plans. Please try again.",
        });
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // FIX 2: Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // FIX 3: Optimized filtered plans
  const filteredPlans = useMemo(() => {
    if (!debouncedSearchTerm) return plans;
    
    return plans.filter((plan) => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        plan.name?.toLowerCase().includes(searchLower) ||
        plan.region?.toLowerCase().includes(searchLower) ||
        plan.planType?.toLowerCase().includes(searchLower)
      );
    });
  }, [debouncedSearchTerm, plans]);

  // FIX 4: Auto-hide messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "vendorName":
        if (!value.trim()) {
          newErrors.vendorName = "Vendor name is required";
        } else if (value.trim().length < 2) {
          newErrors.vendorName = "Vendor name must be at least 2 characters";
        } else {
          delete newErrors.vendorName;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "mobileNumber":
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!value) {
          newErrors.mobileNumber = "Mobile number is required";
        } else if (!mobileRegex.test(value)) {
          newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
        } else {
          delete newErrors.mobileNumber;
        }
        break;

      case "gstin":
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!value) {
          newErrors.gstin = "GSTIN is required";
        } else if (!gstinRegex.test(value)) {
          newErrors.gstin = "Please enter a valid GSTIN";
        } else {
          delete newErrors.gstin;
        }
        break;

      case "pan":
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!value) {
          newErrors.pan = "PAN is required";
        } else if (!panRegex.test(value)) {
          newErrors.pan = "Please enter a valid PAN";
        } else {
          delete newErrors.pan;
        }
        break;

      case "ifsc":
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!value) {
          newErrors.ifsc = "IFSC code is required";
        } else if (!ifscRegex.test(value)) {
          newErrors.ifsc = "Please enter a valid IFSC code";
        } else {
          delete newErrors.ifsc;
        }
        break;

      case "accountNumber":
        if (!value) {
          newErrors.accountNumber = "Account number is required";
        } else if (value.length < 9 || value.length > 18) {
          newErrors.accountNumber = "Account number must be between 9-18 digits";
        } else {
          delete newErrors.accountNumber;
        }
        break;

      case "defaultCommission":
        if (!value) {
          newErrors.defaultCommission = "Default commission is required";
        } else if (isNaN(value) || value < 0 || value > 100) {
          newErrors.defaultCommission = "Commission must be between 0-100%";
        } else {
          delete newErrors.defaultCommission;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // FIX 5: Optimized commission change handler
  const handlePlanCommissionChange = useCallback((planId, field, value) => {
    if (isNaN(value) || value < 0 || value > 100) return;

    setFormData((prev) => {
      const existingPlanIndex = prev.linkedPlans.findIndex(
        (p) => p.localPlanId === planId
      );
      let updatedPlans = [...prev.linkedPlans];

      if (existingPlanIndex >= 0) {
        updatedPlans[existingPlanIndex] = {
          ...updatedPlans[existingPlanIndex],
          [field]: parseFloat(value) || 0,
        };
      } else {
        updatedPlans.push({
          localPlanId: planId,
          version: 1,
          portalCommissionRate:
            field === "portalCommissionRate" ? parseFloat(value) || 0 : 0,
          vendorCommissionRate:
            field === "vendorCommissionRate" ? parseFloat(value) || 0 : 0,
        });
      }

      return { ...prev, linkedPlans: updatedPlans };
    });
  }, []);

  const getPlanCommission = (planId, field) => {
    const plan = formData.linkedPlans.find((p) => p.localPlanId === planId);
    return plan ? plan[field] || "" : "";
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll && bulkPortalCommission && bulkVendorCommission) {
      const updatedPlans = filteredPlans.map((plan) => ({
        localPlanId: plan.localPlanId,
        version: 1,
        portalCommissionRate: parseFloat(bulkPortalCommission) || 0,
        vendorCommissionRate: parseFloat(bulkVendorCommission) || 0,
      }));

      // Merge with existing plans that are not in filtered results
      const existingPlans = formData.linkedPlans.filter(
        (existing) =>
          !filteredPlans.some(
            (filtered) => filtered.localPlanId === existing.localPlanId
          )
      );

      setFormData((prev) => ({
        ...prev,
        linkedPlans: [...existingPlans, ...updatedPlans],
      }));

      setMessage({
        type: "success",
        text: "Bulk commission rates applied to all visible plans",
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "vendorName",
      "vendorAddress",
      "email",
      "mobileNumber",
      "gstin",
      "pan",
      "defaultCommission",
      "bankName",
      "branchName",
      "ifsc",
      "accountNumber",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    // Validate each field with its specific validation
    requiredFields.forEach((field) => {
      if (formData[field]) {
        validateField(field, formData[field]);
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys({ ...errors, ...newErrors }).length === 0;
  };

  // FIX 6: Cleaned up submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fix all validation errors before submitting",
      });
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        mobileNumber: parseInt(formData.mobileNumber),
        defaultCommission: parseFloat(formData.defaultCommission),
      };

      const response = await apiClient.post("/api/vendor/new", submitData);

      console.log("Vendor registration response:", response.data);
      setMessage({
        type: "success",
        text: "Vendor registered successfully!",
      });
      // Optional: Reset form
      // setFormData(initialFormData);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to register vendor. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8" style={{ height: "100%" }}>
      <div className="max-w-7xl mx-auto h-full">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-teal-500 px-6 py-4">
            <div className="flex items-center">
              <User className="text-white mr-3" size={24} />
              <h1 className="text-2xl font-bold text-white">
                Vendor Registration
              </h1>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`px-6 py-4 ${
                message.type === "success"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : "bg-red-50 border-l-4 border-red-400"
              }`}
            >
              <div className="flex items-center">
                {message.type === "success" ? (
                  <CheckCircle className="text-green-400 mr-2" size={20} />
                ) : (
                  <AlertCircle className="text-red-400 mr-2" size={20} />
                )}
                <span
                  className={
                    message.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }
                >
                  {message.text}
                </span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex h-screen">
            <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
              {/* Basic Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="text-teal-500 mr-2" size={20} />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.vendorName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter vendor name"
                    />
                    {errors.vendorName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vendorName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <textarea
                        name="vendorAddress"
                        value={formData.vendorAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.vendorAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter complete address"
                      />
                    </div>
                    {errors.vendorAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vendorAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.mobileNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Commission (%) *
                    </label>
                    <div className="relative">
                      <Percent
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <input
                        type="number"
                        name="defaultCommission"
                        value={formData.defaultCommission}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.defaultCommission
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="10"
                      />
                    </div>
                    {errors.defaultCommission && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.defaultCommission}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="text-teal-500 mr-2" size={20} />
                  Tax Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN *
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.gstin ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="29ABCDE1234F1Z5"
                    />
                    {errors.gstin && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gstin}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN *
                    </label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.pan ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ABCDE1234F"
                    />
                    {errors.pan && (
                      <p className="text-red-500 text-sm mt-1">{errors.pan}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="text-teal-500 mr-2" size={20} />
                  Bank Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.bankName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="HDFC Bank"
                    />
                    {errors.bankName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.branchName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Connaught Place"
                    />
                    {errors.branchName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.branchName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.ifsc ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="HDFC0000123"
                    />
                    {errors.ifsc && (
                      <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.accountNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="123456789012"
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Any additional remarks or notes"
                />
              </div>
            </div>

            {/* Plan Management */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Plus className="text-teal-500 mr-2" size={20} />
                  Plan Commission Setup
                </h2>

                {/* Bulk Actions */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Bulk Commission Setup
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portal Commission (%)
                      </label>
                      <input
                        type="number"
                        value={bulkPortalCommission}
                        onChange={(e) =>
                          setBulkPortalCommission(e.target.value)
                        }
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor Commission (%)
                      </label>
                      <input
                        type="number"
                        value={bulkVendorCommission}
                        onChange={(e) =>
                          setBulkVendorCommission(e.target.value)
                        }
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="7"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      disabled={!bulkPortalCommission || !bulkVendorCommission}
                      className="flex items-center justify-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {selectAll ? (
                        <CheckSquare className="mr-2" size={18} />
                      ) : (
                        <Square className="mr-2" size={18} />
                      )}
                      Apply to All
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Search plans by name or region..."
                  />
                </div>
                {/* Plans List */}
                {plansLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader
                      className="animate-spin text-teal-500 mr-2"
                      size={24}
                    />
                    <span className="text-gray-600">Loading plans...</span>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredPlans.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No plans found matching your search criteria
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredPlans.map((plan) => (
                          <div
                            key={plan.localPlanId}
                            className="p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {plan.name}
                                </h4>
                                <div className="text-sm text-gray-500">
                                  {plan.region} • {plan.planType} • {plan.data}
                                  GB • {plan.validity} days • {plan.price}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Portal Commission (%)
                                </label>
                                <input
                                  type="number"
                                  value={getPlanCommission(
                                    plan.localPlanId,
                                    "portalCommissionRate"
                                  )}
                                  onChange={(e) =>
                                    handlePlanCommissionChange(
                                      plan.localPlanId,
                                      "portalCommissionRate",
                                      e.target.value
                                    )
                                  }
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Vendor Commission (%)
                                </label>
                                <input
                                  type="number"
                                  value={getPlanCommission(
                                    plan.localPlanId,
                                    "vendorCommissionRate"
                                  )}
                                  onChange={(e) =>
                                    handlePlanCommissionChange(
                                      plan.localPlanId,
                                      "vendorCommissionRate",
                                      e.target.value
                                    )
                                  }
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
               <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
                className="flex items-center px-6 py-3 bg-teal-500 text-white mt-10 rounded-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={20} />
                    Register Vendor
                  </>
                )}
              </button>
            </div>
            </div>

            {/* Submit Button */}
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;
