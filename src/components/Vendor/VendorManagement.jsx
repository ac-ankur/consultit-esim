import React, { useState, useEffect } from 'react';
import { Edit, Building2, Mail, Phone, CreditCard, MapPin, Banknote, ChevronLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../../API/apiClient';

// VendorList Component
const VendorList = ({ onEditVendor }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient('/vendor/get-all');
      
      // Ensure response.data is an array
      if (Array.isArray(response.data.data)) {
        setVendors(response.data.data);
      } else {
        console.warn('API response.data is not an array:', response.data);
        setVendors([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vendors');
      console.error('Error fetching vendors:', err);
      setVendors([]); // Ensure vendors is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading vendors: {error}</p>
          <button
            onClick={fetchVendors}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Manage your vendor relationships and partnerships</p>
      </div>

      <div className="grid gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor.vendorId}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-100 p-3 rounded-lg mr-4">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {vendor.vendorName}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {vendor.vendorId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{vendor.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{vendor.mobileNumber}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{vendor.gstin}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  {vendor.defaultVendorCommission && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                      Vendor Commission: {vendor.defaultVendorCommission}%
                    </span>
                  )}
                  {vendor.defaultPortalCommission && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Portal Commission: {vendor.defaultPortalCommission}%
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onEditVendor(vendor.vendorId)}
                className="ml-4 flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {vendors.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No vendors found</p>
        </div>
      )}
    </div>
  );
};

// VendorEdit Component
const VendorEdit = ({ vendorId, onBack }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient(`/vendor/get-by-id/${vendorId}`);
      
      if (response.data.data) {
        setVendor(response.data.data);
      } else {
        throw new Error('No vendor data received');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vendor details');
      console.error('Error fetching vendor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600">Loading vendor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Vendors</span>
        </button>
        
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading vendor details: {error}</p>
          <button
            onClick={fetchVendorDetails}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Vendors</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-8">
          <div className="bg-teal-100 p-4 rounded-lg mr-4">
            <Building2 className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vendor.vendorName}</h1>
            <p className="text-gray-500">Vendor ID: {vendor.vendorId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-500" />
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{vendor.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-500" />
                <div>
                  <label className="text-sm text-gray-500">Mobile Number</label>
                  <p className="text-gray-900">{vendor.mobileNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-teal-500" />
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="text-gray-900">{vendor.vendorAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax & Legal Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Tax & Legal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-teal-500" />
                <div>
                  <label className="text-sm text-gray-500">GSTIN</label>
                  <p className="text-gray-900">{vendor.gstin}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-teal-500" />
                <div>
                  <label className="text-sm text-gray-500">PAN</label>
                  <p className="text-gray-900">{vendor.pan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
            Banking Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Banknote className="w-5 h-5 text-teal-500" />
              <div>
                <label className="text-sm text-gray-500">Bank Name</label>
                <p className="text-gray-900">{vendor.bankName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Banknote className="w-5 h-5 text-teal-500" />
              <div>
                <label className="text-sm text-gray-500">Branch Name</label>
                <p className="text-gray-900">{vendor.branchName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-teal-500" />
              <div>
                <label className="text-sm text-gray-500">IFSC Code</label>
                <p className="text-gray-900">{vendor.ifsc}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-teal-500" />
              <div>
                <label className="text-sm text-gray-500">Account Number</label>
                <p className="text-gray-900">{vendor.accountNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {vendor.remark && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Remarks
            </h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{vendor.remark}</p>
          </div>
        )}

        {/* Plan Commissions */}
        {vendor.planCommission && vendor.planCommission.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
              Plan Commissions
            </h2>
            
            <div className="grid gap-4">
              {vendor.planCommission.map((commission) => (
                <div key={commission.localPlanId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {commission.productPlan.name}
                    </h3>
                    <span className="text-lg font-bold text-teal-600">
                      ${commission.productPlan.price}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">{commission.productPlan.data}GB</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Validity:</span>
                      <p className="font-medium">{commission.productPlan.validity} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Portal Commission:</span>
                      <p className="font-medium text-blue-600">{commission.portalCommissionRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vendor Commission:</span>
                      <p className="font-medium text-green-600">{commission.vendorCommissionRate}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 space-x-4">
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">
                      {commission.productPlan.region}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {commission.productPlan.planType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const VendorManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleEditVendor = (vendorId) => {
    setSelectedVendorId(vendorId);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedVendorId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' ? (
        <VendorList onEditVendor={handleEditVendor} />
      ) : (
        <VendorEdit vendorId={selectedVendorId} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default VendorManagement;