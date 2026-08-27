import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import api from "../api/axios"
import { Button, Card, Alert, PageLoader } from "../components/ui";

export default function BuyNowCheckout() {
    const { id } = useParams()
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [product, setProduct] = useState(null);
    const [finalAddress, setFinalAddress] = useState(null);
    const [address, setAddress] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    const quantity = location.state?.quantity || 1;

    const loadProduct = async () => {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
    };

    useEffect(() => {
        if (id) {
            loadProduct()
        }
    }, [id]);

    useEffect(() => {
        if (!userId) return;

        api.get(`/address/${userId}`)
            .then((res) => {
                const fetchedAddress = Array.isArray(res.data)
                    ? res.data
                    : res.data.address ?? [];

                setAddress(fetchedAddress);
                if (fetchedAddress.length > 0) {
                    setFinalAddress(fetchedAddress[0]);
                }
            })
            .catch((err) => {
                console.error("Address fetch failed:", err.response?.data || err.message);
            });
    }, [userId]);

    const placeOrder = async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError("");
            if (!finalAddress) {
                setLoading(false)
                setError("Please select a delivery address.");
                return;
            }

            const res = await api.post('/order/buy-now', {
                userId,
                productName: product.title,
                image: product.images?.[0],
                address: {
                    fullName: finalAddress.fullname,
                    phone: finalAddress.phone,
                    street: finalAddress.street,
                    city: finalAddress.city,
                    state: finalAddress.state,
                    zipCode: finalAddress.zipCode,
                    country: finalAddress.country,
                },
                productId: id,
                quantity: quantity,
                amount: product.price * quantity,
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

    const handleDelete = (addressId) => {
        api.delete(`/address/delete/${addressId}`)
            .then(() => {
                setAddress(address.filter(addr => addr._id !== addressId));
                if (finalAddress?._id === addressId) setFinalAddress(null);
            })
            .catch(err => console.error("Delete failed:", err));
    }

    const handleEdit = (addr) => {
        navigate("/checkout-address", {
            state: {
                address: addr,
                edit: true,
                source: "buyNow",
                productId: id,
                quantity: quantity
            }
        });
    };

    if (!product) return <PageLoader label="Loading checkout..." />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">Checkout</h1>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-ink">Select Delivery Address</h2>
                        <button
                            onClick={() => navigate("/checkout-address", { state: { source: "buyNow", productId: id, quantity } })}
                            className="text-sm font-semibold text-brass-600 hover:text-brass-700 transition-colors cursor-pointer"
                        >
                            + Add New Address
                        </button>
                    </div>

                    {address.length === 0 ? (
                        <Card className="p-6 text-center text-muted">No saved addresses yet. Add one to continue.</Card>
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
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1 gap-2">
                                                <strong className="text-ink">{addr.fullname}</strong>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); handleEdit(addr); }}
                                                        className="text-brass-600 border border-brass-300 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-brass-50 transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); handleDelete(addr._id); }}
                                                        className="text-error border border-error/40 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-error-bg transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-body">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                            </p>
                                            <p className="text-sm text-muted">{addr.phone}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Card className="p-5 sticky top-24">
                        <h2 className="font-semibold text-ink mb-4">Order Summary</h2>
                        <div className="flex gap-3 mb-4">
                            <div className="w-16 h-16 rounded-lg bg-sand border border-border overflow-hidden flex-shrink-0">
                                <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-ink line-clamp-2">{product.title}</p>
                                <p className="text-xs text-muted mt-0.5">Qty: {quantity}</p>
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between items-center mb-4">
                            <span className="text-sm text-muted">Total</span>
                            <span className="text-xl font-bold text-ink font-data">
                                ₹{(product.price * quantity).toLocaleString("en-IN")}
                            </span>
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
