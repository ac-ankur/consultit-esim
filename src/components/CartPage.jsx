import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useCart } from "../appContext/CartContext";
import { useState, useEffect } from "react";

export default function CartPage() {
    const { cart, setCart, removeFromCart } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        calcTotalPrice();
    }, [cart]);

    function calcTotalPrice() {
        const total = cart.reduce((acc, item) => Number(acc) + Number(item.price) * Number(item.quantity), 0);
        setTotalPrice(total);
    }

    function updateQuantity(productId, newQuantity) {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <PiShoppingCartSimpleLight className="w-8 h-8 mr-3 text-blue-600" />
                            Shopping Cart
                        </h1>
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                            {cart?.length} {cart?.length === 1 ? 'item' : 'items'}
                        </div>
                    </div>
                </div>

                {cart?.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PiShoppingCartSimpleLight className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some eSIM plans to get started!</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            Browse Plans
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT: Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart?.map((product, inx) => (
                                <div
                                    key={inx}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Product Image with Flag/Region Icon */}
                                        <div className="w-full sm:w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-xl">
                                            <span className="text-3xl">🌐</span>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Product Info Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">Region</div>
                                                    <div className="font-semibold text-gray-900">{product.region}</div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">Plan Type</div>
                                                    <div className="font-semibold text-gray-900">{product.planType}</div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">Data</div>
                                                    <div className="font-semibold text-gray-900">{product.data} GB</div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">Validity</div>
                                                    <div className="font-semibold text-gray-900">{product.validity} days</div>
                                                </div>
                                            </div>

                                            {/* Covered Countries */}
                                            <div className="mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-2">Covered Countries:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {product.countries.slice(0, 6).map((country) => (
                                                        <span
                                                            key={country.id}
                                                            className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                                                        >
                                                            {country.country_name}
                                                        </span>
                                                    ))}
                                                    {product.countries.length > 6 && (
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                                                            +{product.countries.length - 6} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Row: Price, Quantity, Actions */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                                                <div className="text-2xl font-bold text-green-600">
                                                    ${product.price}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-lg font-bold bg-gray-100 border rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-lg font-semibold w-8 text-center">{product.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-lg font-bold bg-gray-100 border rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Buy Now Button */}
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Price Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                                    <span className="mr-2">💰</span>
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Discount</span>
                                        <span className="text-green-600 font-semibold">-$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax</span>
                                        <span className="font-semibold">$0.00</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
                                    Proceed to Checkout
                                </button>

                                {/* Additional Info */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">✅ What's included:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Instant activation</li>
                                        <li>• QR code delivery</li>
                                        <li>• 24/7 customer support</li>
                                        <li>• No roaming charges</li>
                                    </ul>
                                </div>

                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center text-green-800">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Free cancellation within 24 hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}