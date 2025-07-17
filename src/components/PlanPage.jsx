import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProducts } from "../appContext/ProductContext";
import { useCart } from "../appContext/CartContext";
import { useOrders } from "../appContext/OrderContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../appContext/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

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

export default function PlanPage() {
  const { currency, user } = useUser();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { fetchOrders, setOrderCreated } = useOrders();
  const { country } = useParams();

  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const ACCESS_KEY = "DjnsCwxlFPH0uX3IZNf7oz_ekD4sZzPJemOAGDS4zww";
  const [quantity, setQuantity] = useState(1);
  const [groupedPlans, setGroupedPlans] = useState({});
  const [dataOptions, setDataOptions] = useState(["1 GB / 30 Days"]);
  const [selectedData, setSelectedData] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const location = useLocation();
  const [isRegionalPlan, setIsRegionalPlan] = useState(false);
  const [regionName, setRegionName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // Check if coming from regional page
    const state = location.state;
    if (state && state.fromRegional && state.regionName) {
      setIsRegionalPlan(true);
      setRegionName(state.regionName);
      const regionalConfig = regionConfig[state.regionName];
      if (regionalConfig && regionalConfig.image) {
        setImage(regionalConfig.image);
        setImageLoading(false);
      } else {
        getImageByKeyword(country.toLowerCase());
      }
    } else {
      getImageByKeyword(country.toLowerCase());
    }
  }, [country, location.state]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(country?.toLowerCase())
    );

    const grouped = filtered.reduce((acc, plan) => {
      if (!acc[plan.data] && plan.data !== "Unlimited") {
        acc[plan.data] = plan;
      }
      return acc;
    }, {});

    const options = Object.keys(grouped).sort((a, b) => {
      if (a === "Unlimited") return 1;
      if (b === "Unlimited") return -1;
      return parseFloat(a) - parseFloat(b);
    });

    setGroupedPlans(grouped);
    setDataOptions(options);
    if (options.length > 0) {
      setSelectedData(options[0]);
      setSelectedPlan(grouped[options[0]]);
    }
  }, [products, country]);

  // Update selectedPlan when selectedData changes
  useEffect(() => {
    if (groupedPlans && selectedData) {
      setSelectedPlan(groupedPlans[selectedData]);
    }
  }, [selectedData, groupedPlans]);

  async function getImageByKeyword(keyword) {
    try {
      setImageLoading(true);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&client_id=${ACCESS_KEY}`
      );
      const data = await res.json();
      const imageUrl = data.results?.[0]?.urls?.regular;
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setImageLoading(false);
    }
  }

  async function handleBuyProduct() {
    if (!user) {
      toast("Login to buy");
      navigate("/login");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setLoadingBuy(true);
    try {
      let token = localStorage.getItem("esim-accessToken");
      console.log("planId", selectedPlan?.localPlanId);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/place-new-order`,
        {
          planId: selectedPlan?.localPlanId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        setOrderCreated(res?.data?.data);
        fetchOrders();
        navigate(`/payment/${res?.data?.data?.orderSeqId}`);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoadingBuy(false);
    }
  }

  async function handleAddToCart() {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setLoadingAddToCart(true);
    try {
      addToCart({ ...selectedPlan, quantity });
      toast.success("Added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingAddToCart(false);
    }
  }

  const formatCountryName = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const numericPrice = parseFloat(selectedPlan?.price.replace(/[^0-9.]/g, ""));
  const totalPrice = numericPrice * quantity;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-900">
            {formatCountryName(country)} eSIM
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Compact Image */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
              {imageLoading ? (
                <div className="w-full h-[280px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : (
                <img
                  src={image || "/default-country-image.jpg"}
                  alt={`${country} esim`}
                  className="w-full h-[480px] object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">
                  {formatCountryName(country)} eSIM
                </h1>
                <p className="text-sm text-gray-200 drop-shadow">
                  Stay connected anywhere
                </p>
              </div>

              {/* Price badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-lg font-bold text-gray-900">
                  {currency} {totalPrice || 0}
                </span>
              </div>
            </div>

            {/* Compact Features */}
            <div className="bg-white rounded-xl p-4 shadow-lg mt-4">
              <h3 className="text-lg font-bold mb-3 text-gray-900">Features</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instant Activation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No SIM Swap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>QR Code Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Compact Plan Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Choose Your Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Plan Selection */}
                <div className="space-y-4">
                  {/* Data Selector */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <span className="mr-2">📶</span>
                      Data Plans
                    </h3>
                    <div className="space-y-2">
                      {dataOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedData(option)}
                          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                            selectedData === option
                              ? "bg-blue-50 border-blue-500 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {option} GB
                              </div>
                              <div className="text-xs text-gray-600">
                                {groupedPlans[option]?.validity} Days
                              </div>
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              {currency} {groupedPlans[option]?.price || "N/A"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  {/* <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      Quantity
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200 flex items-center justify-center text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200 flex items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div> */}
                </div>

                {/* Right Column: Summary & Actions */}
                <div className="space-y-4">
                  {/* Compact Plan Summary */}
                  {selectedPlan && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Order Summary
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-medium text-gray-900 text-xs">
                            {selectedPlan.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validity:</span>
                          <span className="font-medium text-gray-900">
                            {selectedPlan.validity} Days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="font-medium text-gray-900">
                            {selectedPlan.data} GB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium text-gray-900">
                            {quantity}
                          </span>
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-lg font-bold">Price:</span>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-lg font-bold text-blue-600">
                                {currency} {totalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-600">
                                + 18% GST Applicable
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Total Section */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-xl font-bold text-blue-600">
                              {currency} {(totalPrice * 1.18).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compact Action Buttons */}
                  <div className="space-y-2">
                    <button
                      disabled={loadingBuy || !selectedPlan}
                      onClick={handleBuyProduct}
                      style={{ cursor: "pointer" }}
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                    >
                      {loadingBuy ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "🚀 Buy Now"
                      )}
                    </button>

                    {/* <button
                      disabled={loadingAddToCart || !selectedPlan}
                      onClick={handleAddToCart}
                      style={{
                        cursor: loadingAddToCart ? "not-allowed" : "pointer",
                      }}
                      className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                    >
                      {loadingAddToCart ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        "🛒 Add to Cart"
                      )}
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
