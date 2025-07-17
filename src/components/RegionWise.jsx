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
  Clock,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import oceanic from "../assets/images/regions/ocenia.jpg";
import asia from "../assets/images/regions/asia.jpg";
import europe from "../assets/images/regions/europe.jpg";
import northAmerica from "../assets/images/regions/northamerica.jpg";
import latam from "../assets/images/regions/latm.jpg";
import global from "../assets/images/regions/GLOBAL.jpg";
import africa from "../assets/images/regions/africa.jpg";
import caribbean from "../assets/images/regions/caribbean.jpg";
import middleEast from "../assets/images/regions/middleeast.jpg";

const regionConfig = {
  Asia: {
    color: "from-green-400 to-emerald-600",
    icon: "🌏",
    bgColor: "bg-green-50",
    image: asia,
  },
  Europe: {
    color: "from-blue-400 to-indigo-600",
    icon: "🏰",
    bgColor: "bg-blue-50",
    image: europe,
  },
  "North America": {
    color: "from-purple-400 to-violet-600",
    icon: "🗽",
    bgColor: "bg-purple-50",
    image: northAmerica,
  },
  "South America": {
    color: "from-orange-400 to-red-600",
    icon: "🏔️",
    bgColor: "bg-orange-50",
    image: latam,
  },
  LATAM: {
    color: "from-orange-400 to-red-600",
    icon: "🏔️",
    bgColor: "bg-orange-50",
    image: latam,
  },
  Africa: {
    color: "from-yellow-400 to-orange-600",
    icon: "🦁",
    bgColor: "bg-yellow-50",
    image: africa,
  },
  "Middle East": {
    color: "from-teal-400 to-cyan-600",
    icon: "🕌",
    bgColor: "bg-teal-50",
    image: middleEast,
  },
  Oceania: {
    color: "from-pink-400 to-rose-600",
    icon: "🏝️",
    bgColor: "bg-pink-50",
    image: oceanic,
  },
  Caribbean: {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
    image: caribbean,
  },
  GLOBAL: {
    color: "from-teal-400 to-blue-600",
    icon: "🌍",
    bgColor: "bg-cyan-50",
    image: global,
  },
  LATM: {
    color: "from-cyan-400 to-blue-600",
    icon: "🏖️",
    bgColor: "bg-cyan-50",
    image: latam,
  },
  "Eastern Europe": {
    color: "from-cyan-400 to-blue-600",
    icon: "🏰",
    bgColor: "bg-cyan-50",
  },
  Unknown: {
    color: "from-gray-400 to-gray-600",
    icon: "🌐",
    bgColor: "bg-gray-50",
  },
};

// New consolidated card component
const ConsolidatedRegionCard = ({ region, plans, onBuy }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const config = regionConfig[region] || regionConfig.Unknown;

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

  const formatDataDisplay = (dataStr) => {
    const dataValue = extractDataValue(dataStr);
    if (dataValue === 999) return "Unlimited";
    return `${dataValue}GB`;
  };

  const formatValidityDisplay = (validityStr) => {
    const days = extractValidityDays(validityStr);
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  const priceRange = useMemo(() => {
    const prices = plans.map((plan) => extractPrice(plan.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [plans]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Card Header with Region Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={config.image}
          alt={region}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${config.color} opacity-40`}
        ></div>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{region}</h3>
            <p className="text-white/90 text-sm">
              {plans.length} plans available
            </p>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">
            ₹{priceRange.min} - ₹{priceRange.max}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Plan Selection Tabs */}
        <div className="mb-4"style={{border:'1px solid black',borderRadius:'5px',padding:'10px'}}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Select Plan:
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {plans.map((plan, index) => (
              <button
                key={plan.localPlanId || index}
                onClick={() => setSelectedPlan(plan)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedPlan === plan
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {formatDataDisplay(plan.data)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatValidityDisplay(plan.validity)}
                    </span>
                  </div>
                </div>
                <div className="mt-1 text-lg font-bold text-blue-600">
                  ₹{extractPrice(plan.price)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h5 className="font-semibold text-gray-900">Selected Plan</h5>
              <p className="text-sm text-gray-600">
                {selectedPlan.name || `${region} Plan`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ₹{extractPrice(selectedPlan.price)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDataDisplay(selectedPlan.data)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatValidityDisplay(selectedPlan.validity)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Regional Coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">4G/5G Speed</span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            onBuy(selectedPlan.country || selectedPlan.name, region)
          }
          style={{ cursor: "pointer" }}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r ${config.color} hover:shadow-lg hover:scale-[1.02] flex items-center justify-center space-x-2`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching regional plans:", error);
        setLoading(false);
      }
    };

    fetchRegionalPlans();
  }, []);

  function handleOnBuy(countryName, regionName) {
    navigate(`/products/${countryName}`, {
      state: {
        fromRegional: true,
        regionName: regionName,
      },
    });
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

  // Group plans by region
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

  // Apply filters and sorting
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

    // Apply price range filter
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

    // Apply data range filter
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

    // Sort plans within each region
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

        return sortOrder === "asc"
          ? aVal > bVal
            ? 1
            : -1
          : aVal < bVal
          ? 1
          : -1;
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

      {/* Consolidated Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredAndSortedData).map(([region, plans]) => (
          <ConsolidatedRegionCard
            key={region}
            region={region}
            plans={plans}
            onBuy={handleOnBuy}
          />
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
