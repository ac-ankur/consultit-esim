import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Users, Package, Calendar, Filter, Download, Eye } from 'lucide-react';
// import { IndianRupee } from 'react-icons/bi';

const VendorSalesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Mock data for demonstration
  const salesData = [
    { date: '2024-01-01', sales: 1200, commission: 120, esims: 45 },
    { date: '2024-01-02', sales: 980, commission: 98, esims: 38 },
    { date: '2024-01-03', sales: 1450, commission: 145, esims: 52 },
    { date: '2024-01-04', sales: 1800, commission: 180, esims: 67 },
    { date: '2024-01-05', sales: 1350, commission: 135, esims: 49 },
    { date: '2024-01-06', sales: 2100, commission: 210, esims: 78 },
    { date: '2024-01-07', sales: 1650, commission: 165, esims: 61 }
  ];

  const countryData = [
    { country: 'United States', sales: 8500, commission: 850, esims: 320, growth: 12.5 },
    { country: 'United Kingdom', sales: 6200, commission: 620, esims: 245, growth: 8.3 },
    { country: 'Germany', sales: 5800, commission: 580, esims: 220, growth: -2.1 },
    { country: 'France', sales: 4900, commission: 490, esims: 185, growth: 15.7 },
    { country: 'Canada', sales: 3700, commission: 370, esims: 140, growth: 9.2 }
  ];

  const pieData = [
    { name: 'Travel eSIMs', value: 45, color: '#14b8a6' },
    { name: 'Business eSIMs', value: 30, color: '#0d9488' },
    { name: 'Local eSIMs', value: 25, color: '#0f766e' }
  ];

  const topPerformers = [
    { rank: 1, vendor: 'TechSolutions Ltd', sales: 25400, commission: 2540, change: 18.5 },
    { rank: 2, vendor: 'GlobalConnect Inc', sales: 22100, commission: 2210, change: 12.3 },
    { rank: 3, vendor: 'MobileFirst Co', sales: 19800, commission: 1980, change: -3.2 },
    { rank: 4, vendor: 'DigitalBridge', sales: 18600, commission: 1860, change: 8.7 },
    { rank: 5, vendor: 'ConnectWorld', sales: 16900, commission: 1690, change: 22.1 }
  ];

  const kpis = {
    totalSales: 112400,
    totalCommission: 11240,
    totalEsims: 4250,
    avgOrderValue: 26.45,
    conversionRate: 3.2,
    growthRate: 15.3
  };

  const StatCard = ({ title, value, icon: Icon, change, prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}% vs last period
            </div>
          )}
        </div>
        <div className="bg-teal-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-teal-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Sales Dashboard</h1>
          <p className="text-gray-600">Track your eSIM sales performance and commission earnings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Countries</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
              </select>
            </div>
            <button className="ml-auto bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Sales" value={kpis.totalSales} icon={IndianRupee} change={kpis.growthRate} prefix="₹" />
<StatCard title="Commission Earned" value={kpis.totalCommission} icon={TrendingUp} change={12.3} prefix="₹" />
<StatCard title="Avg Order Value" value={kpis.avgOrderValue} icon={IndianRupee} change={5.2} prefix="₹" />
          <StatCard title="Avg Order Value" value={kpis.avgOrderValue} icon={IndianRupee} change={5.2} prefix="₹" />
          <StatCard title="Conversion Rate" value={kpis.conversionRate} icon={Users} change={2.1} suffix="%" />
          <StatCard title="Growth Rate" value={kpis.growthRate} icon={TrendingUp} change={3.8} suffix="%" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales & Commission Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Commission Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
  contentStyle={{backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px'}}
  formatter={(value, name) => [`₹${value}`, name === 'sales' ? 'Sales' : 'Commission']}
/>
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="commission" stackId="2" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* eSIM Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">eSIM Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Country Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Country</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Country</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Sales</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Commission</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {countryData.map((country, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{country.country}</div>
                        <div className="text-sm text-gray-500">{country.esims} eSIMs</div>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">₹{country.sales.toLocaleString()}</td>
<td className="text-right py-3 px-2 font-medium">₹{country.commission.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          country.growth >= 0 ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {country.growth >= 0 ? '+' : ''}{country.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Vendors</h3>
            <div className="space-y-4">
              {topPerformers.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      vendor.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      vendor.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      vendor.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-teal-50 text-teal-700'
                    }`}>
                      #{vendor.rank}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{vendor.vendor}</div>
                     <div className="font-medium text-gray-900">₹{vendor.commission.toLocaleString()} commission</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{vendor.sales.toLocaleString()}</div>
                    <div className={`text-sm ${vendor.change >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                      {vendor.change >= 0 ? '+' : ''}{vendor.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px'}}
                  formatter={(value, name) => [value, name === 'esims' ? 'eSIMs Sold' : 'Value']}
                />
                <Bar dataKey="esims" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Base Commission (10%)</span>
               <span className="font-semibold">₹8,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance Bonus</span>
               <span className="font-semibold text-teal-600">+₹1,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Volume Incentive</span>
                <span className="font-semibold text-teal-600">+₹900</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Commission</span>
                <span className="font-bold text-xl text-teal-600">₹11,240</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-teal-100 rounded-lg hover:bg-teal-50 transition-colors">
              <Eye className="w-5 h-5 text-teal-500" />
              <span className="font-medium text-gray-900">View Detailed Report</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-teal-100 rounded-lg hover:bg-teal-50 transition-colors">
              <Download className="w-5 h-5 text-teal-500" />
              <span className="font-medium text-gray-900">Download CSV</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-teal-100 rounded-lg hover:bg-teal-50 transition-colors">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              <span className="font-medium text-gray-900">Performance Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSalesDashboard;