import { useState, useEffect } from "react";
import api from '../api/axios'
import { useNavigate, Link } from "react-router";
import { Button, Card, Alert, PageLoader } from "../components/ui";

export default function Checkout() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [finalAddress, setFinalAddress] = useState(null);
    const [cartItems, setCartItems] = useState(null);
    const [address, setAddress] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/cart/${userId}`)
            .then((res) => {
                const cartData = res.data.cart;
                if (!cartData || cartData.items.length === 0) {
                    navigate('/cart');
                } else {
                    setCartItems(cartData);
                }
            });

        api.get(`/address/${userId}`)
            .then((res) => {
                setAddress(res.data);
                setFinalAddress(res.data[0]);
            });

    }, [userId]);

    if (!cartItems) return <PageLoader label="Loading checkout..." />;
    const total = cartItems.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    const placeOrder = async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError("");
            if (!finalAddress) {
                setError("Please select a delivery address.");
                return;
            }

            const res = await api.post('/order/place', {
                userId,
                address: {
                    fullName: finalAddress.fullname,
                    phone: finalAddress.phone,
                    street: finalAddress.street,
                    city: finalAddress.city,
                    state: finalAddress.state,
                    zipCode: finalAddress.zipCode,
                    country: finalAddress.country,
                },
            })
            navigate(`/order-success/${res.data.orderId}`);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Could not place your order. Please try again.');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">Checkout</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Address selection */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-ink">Select Delivery Address</h2>
                        <Link to="/checkout-address" className="text-sm font-semibold text-brass-600 hover:text-brass-700 transition-colors">
                            + Add New
                        </Link>
                    </div>

                    {address.length === 0 ? (
                        <Card className="p-6 text-center text-muted">
                            No saved addresses.{" "}
                            <Link to="/checkout-address" className="text-brass-600 font-semibold">Add one</Link> to continue.
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {address.map((addr) => (
                                <label
                                    key={addr._id}
                                    className={`block border rounded-xl p-4 cursor-pointer transition-colors ${
                                        finalAddress?._id === addr._id
                                            ? "border-brass-400 bg-brass-50/50 ring-1 ring-brass-300"
                                            : "border-border bg-paper hover:border-border-strong"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            className="mt-1 accent-brass-500"
                                            onChange={() => setFinalAddress(addr)}
                                            checked={finalAddress?._id === addr._id}
                                            value={addr._id}
                                            name="address"
                                        />
                                        <div>
                                            <strong className="text-ink">{addr.fullname}</strong>
                                            <p className="text-sm text-body mt-0.5">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                            </p>
                                            <p className="text-sm text-muted mt-0.5">{addr.phone}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order summary */}
                <div>
                    <Card className="p-5 sticky top-24">
                        <h2 className="font-semibold text-ink mb-4">Order Summary</h2>
                        <ul className="flex flex-col gap-2 mb-4 max-h-56 overflow-y-auto scrollbar-thin">
                            {cartItems.items.map((item) => (
                                <li key={item.productId._id} className="flex justify-between text-sm text-body gap-2">
                                    <span className="truncate">{item.productId.title} × {item.quantity}</span>
                                    <span className="font-medium text-ink flex-shrink-0">
                                        ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-border pt-4 flex justify-between items-center mb-4">
                            <span className="text-sm text-muted">Total</span>
                            <span className="text-xl font-bold text-ink font-data">₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        {error && <Alert tone="error" className="mb-4">{error}</Alert>}
                        <Button className="w-full" size="lg" onClick={placeOrder} disabled={loading}>
                            {loading ? "Placing Order..." : "Place Order"}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
