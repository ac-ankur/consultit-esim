import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Globe,
  Wifi,
  Calendar,
  MapPin,
  Star,
  ShoppingCart,
  Filter,
  Users,
} from "lucide-react";
import EsimCountryCard from "../utils/EsimCountryCard";
import { useNavigate } from "react-router-dom";

const regionConfig = {
  Asia: {
    color: "from-green-400 to-emerald-600",
    icon: "🌏",
    bgColor: "bg-green-50",
  },
  Europe: {
    color: "from-blue-400 to-indigo-600",
    icon: "🏰",
    bgColor: "bg-blue-50",
  },
  "North America": {
    color: "from-purple-400 to-violet-600",
    icon: "🗽",
    bgColor: "bg-purple-50",
  },
  "South America": {
    color: "from-orange-400 to-red-600",
    icon: "🏔️",
    bgColor: "bg-orange-50",
  },
  LATAM: {
    color: "from-orange-400 to-red-600",
    icon: "🏔️",
    bgColor: "bg-orange-50",
  },
  Africa: {
    color: "from-yellow-400 to-orange-600",
    icon: "🦁",
    bgColor: "bg-yellow-50",
  },
  "Middle East": {
    color: "from-teal-400 to-cyan-600",
    icon: "🕌",
    bgColor: "bg-teal-50",
  },
  Oceania: {
    color: "from-pink-400 to-rose-600",
    icon: "🏝️",
    bgColor: "bg-pink-50",
  },
  Caribbean: {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
  },
  GLOBAL: {
    color: "from-teal-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
  },
  LATM: {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
  },
  "Eastern Europe": {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
  },
  Unknown: {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
  },
};

function RegionalESIM() {
  const [esimData, setEsimData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState("all");
  const [dataRange, setDataRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRegionalPlans = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/product/get-regional-product`
        );
        const data = await response.json();
        console.log("Regional Plans API Response:", data);

        const regionalPlans = (data.data || []).filter(
          (plan) =>
            plan.isregional === true ||
            plan.planType?.toLowerCase().includes("regional") ||
            plan.region
        );

        console.log("Filtered Regional Plans:", regionalPlans);
        setEsimData(regionalPlans);
        const plans = data.data;
        const regionCounts = plans.reduce((acc, plan) => {
          const region = plan.region || "Unknown";
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {});

        console.log(regionCounts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching regional plans:", error);
        setLoading(false);
      }
    };

    fetchRegionalPlans();
  }, []);
  function handleOnBuy(countryName) {
    navigate(`/products/${countryName}`);
  }
  const extractPrice = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.toString().match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(",", "")) : 0;
  };

  const extractDataValue = (dataString) => {
    if (!dataString) return 0;
    if (
      dataString === "Unlimited" ||
      dataString.toLowerCase().includes("unlimited")
    )
      return 999;
    const match = dataString.toString().match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(",", "")) : 0;
  };

  const extractValidityDays = (validityString) => {
    if (!validityString) return 0;
    const match = validityString.toString().match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(",", "")) : 0;
  };

  const regionData = useMemo(() => {
    const grouped = {};

    esimData.forEach((plan) => {
      const region = plan.region || "Other";
      if (!grouped[region]) {
        grouped[region] = [];
      }
      grouped[region].push(plan);
    });

    return grouped;
  }, [esimData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = { ...regionData };

    if (selectedRegion !== "All") {
      filtered = { [selectedRegion]: regionData[selectedRegion] || [] };
    }

    if (searchTerm) {
      const searchFiltered = {};
      Object.keys(filtered).forEach((region) => {
        const matchingPlans = filtered[region].filter(
          (plan) =>
            plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.planType?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingPlans.length > 0) {
          searchFiltered[region] = matchingPlans;
        }
      });
      filtered = searchFiltered;
    }

    // Filter by price range
    if (priceRange !== "all") {
      const priceFiltered = {};
      Object.keys(filtered).forEach((region) => {
        const matchingPlans = filtered[region].filter((plan) => {
          const price = extractPrice(plan.price);
          switch (priceRange) {
            case "low":
              return price < 1000;
            case "medium":
              return price >= 1000 && price < 3000;
            case "high":
              return price >= 3000;
            default:
              return true;
          }
        });
        if (matchingPlans.length > 0) {
          priceFiltered[region] = matchingPlans;
        }
      });
      filtered = priceFiltered;
    }

    if (dataRange !== "all") {
      const dataFiltered = {};
      Object.keys(filtered).forEach((region) => {
        const matchingPlans = filtered[region].filter((plan) => {
          const dataValue = extractDataValue(plan.data);
          switch (dataRange) {
            case "low":
              return dataValue <= 5;
            case "medium":
              return dataValue > 5 && dataValue <= 20;
            case "high":
              return dataValue > 20 || dataValue === 999;
            default:
              return true;
          }
        });
        if (matchingPlans.length > 0) {
          dataFiltered[region] = matchingPlans;
        }
      });
      filtered = dataFiltered;
    }

    Object.keys(filtered).forEach((region) => {
      filtered[region].sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case "price":
            aVal = extractPrice(a.price);
            bVal = extractPrice(b.price);
            break;
          case "data":
            aVal = extractDataValue(a.data);
            bVal = extractDataValue(b.data);
            break;
          case "validity":
            aVal = extractValidityDays(a.validity);
            bVal = extractValidityDays(b.validity);
            break;
          default:
            aVal = (a.name || "").toLowerCase();
            bVal = (b.name || "").toLowerCase();
            break;
        }

        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    });

    return filtered;
  }, [
    regionData,
    selectedRegion,
    searchTerm,
    sortBy,
    sortOrder,
    priceRange,
    dataRange,
  ]);

  const regions = Object.keys(regionData);
  console.log(" Regional Data:", regions);
  const totalRegionalPlans = esimData.length;

  const dataStats = useMemo(() => {
    const allDataValues = esimData
      .map((plan) => extractDataValue(plan.data))
      .filter((val) => val > 0);
    const minData = Math.min(...allDataValues);
    const maxData = Math.max(...allDataValues.filter((val) => val !== 999));
    return { minData, maxData };
  }, [esimData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg h-80">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🌍 Regional eSIM Plans
        </h1>
        <p className="text-gray-600 text-lg">
          Stay connected across entire regions with our flexible data plans
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-500">Regional Plans</span>
            <div className="font-bold text-lg text-blue-600">
              {totalRegionalPlans}
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-500">Regions Available</span>
            <div className="font-bold text-lg text-purple-600">
              {regions.length}
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-500">Plan Type</span>
            <div className="font-bold text-lg text-green-600">
              Regional eSIM
            </div>
          </div>
          {dataStats.maxData > 0 && (
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <span className="text-sm text-gray-500">Data Range</span>
              <div className="font-bold text-lg text-orange-600">
                {dataStats.minData}GB - {dataStats.maxData}GB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Region Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search regional plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="lg:w-64">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="data">Data Amount</option>
                <option value="validity">Validity Days</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Price Range:
              </span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹1000</option>
                <option value="medium">₹1000 - ₹3000</option>
                <option value="high">Above ₹3000</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Data Amount:
              </span>
              <select
                value={dataRange}
                onChange={(e) => setDataRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Data Plans</option>
                <option value="low">5GB or less</option>
                <option value="medium">5GB - 20GB</option>
                <option value="high">20GB+ or Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Region Cards */}
      <div className="space-y-8">
        {Object.keys(filteredAndSortedData).map((region) => (
          <div
            key={region}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Region Header */}
            <div
              className={`bg-gradient-to-r ${
                regionConfig[region]?.color || "from-gray-400 to-gray-600"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    {regionConfig[region]?.icon || "🌐"}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{region}</h2>
                    <p className="text-white/90 flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {filteredAndSortedData[region].length} regional plan
                        {filteredAndSortedData[region].length !== 1 ? "s" : ""}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/90 text-sm">Avg. Price</div>
                  <div className="text-2xl font-bold text-white">
                    ₹
                    {Math.round(
                      filteredAndSortedData[region].reduce(
                        (acc, plan) => acc + extractPrice(plan.price),
                        0
                      ) / filteredAndSortedData[region].length
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedData[region].map((plan) => (
                  <EsimCountryCard
                    key={plan.localPlanId}
                    country={{
                      countryName: plan.country || plan.name,
                      countryCode: plan.countryCode || "us", // fallback
                    }}
                    dataLabel={
                      extractDataValue(plan.data) === 999
                        ? "Unlimited"
                        : `${extractDataValue(
                            plan.data
                          )}GB / ${extractValidityDays(plan.validity)} days`
                    }
                    price={plan.price}
                    onBuy={handleOnBuy}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {Object.keys(filteredAndSortedData).length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No regional plans found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <p className="text-sm text-gray-500">
            Regional plans offer coverage across entire geographical regions
          </p>
        </div>
      )}
    </div>
  );
}

export default RegionalESIM;
