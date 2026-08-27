import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { Button, EmptyState, PageLoader } from "../components/ui";

export default function Cart() {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadCart = async () => {
        if (!userId) { setLoading(false); return; }
        try {
            const res = await api.get(`/cart/${userId}`);
            setCart(res.data.cart);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleSubmit = () => {
        navigate("/checkout-address", { state: { source: "cart" } });
    }

    const removeItems = async (productId) => {
        await api.post(`/cart/remove`, { userId, productId });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity === 0) {
            await removeItems(productId);
            return;
        }
        await api.put(`/cart/update`, { userId, productId, quantity });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) return <PageLoader label="Loading your cart..." />;

    if (!userId) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <EmptyState
                    title="Please log in to view your cart"
                    description="Sign in to see items you've added and continue checkout."
                    action={<Button onClick={() => navigate("/login")}>Login</Button>}
                />
            </div>
        );
    }

    const items = cart?.items || [];
    const total = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-display text-3xl font-bold text-ink text-center mb-8">Your Cart</h1>

            {items.length === 0 ? (
                <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added anything yet."
                    action={<Button onClick={() => navigate("/all-products")}>Start Shopping</Button>}
                />
            ) : (
                <div className="bg-paper border border-border rounded-2xl overflow-hidden">
                    <ul className="divide-y divide-border">
                        {items.map((item) => (
                            <li key={item.productId._id} className="p-4 sm:p-5 flex gap-4">
                                <Link
                                    to={`/product/${item.productId._id}`}
                                    className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-border rounded-lg overflow-hidden bg-sand"
                                >
                                    <img
                                        src={item.productId.images?.[0]}
                                        alt={item.productId.title}
                                        className="w-full h-full object-contain"
                                    />
                                </Link>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex justify-between gap-3">
                                        <Link to={`/product/${item.productId._id}`} className="min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-ink truncate hover:text-brass-600 transition-colors">
                                                {item.productId.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm sm:text-base font-bold text-ink font-data flex-shrink-0">
                                            ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted mt-1">{item.productId.category}</p>

                                    <div className="flex-1 flex items-end justify-between mt-3">
                                        <div className="flex items-center border border-border-strong rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                                className="px-3 py-1 text-brass-600 hover:bg-sand font-bold cursor-pointer"
                                            >−</button>
                                            <span className="px-3 py-1 text-sm font-medium text-ink border-x border-border-strong">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                                className="px-3 py-1 text-brass-600 hover:bg-sand font-bold cursor-pointer"
                                            >+</button>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-xs sm:text-sm font-semibold text-error hover:text-rust-600 transition-colors cursor-pointer"
                                            onClick={() => removeItems(item.productId._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-border bg-sand/40 py-5 px-5 flex justify-between items-center">
                        <p className="text-sm font-medium text-body">Subtotal</p>
                        <p className="text-lg font-bold text-ink font-data">₹{total.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-5 pt-0">
                        <Button className="w-full" size="lg" onClick={handleSubmit}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
