import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { EmptyState, Button, PageLoader } from "../components/ui";

export default function MyOrder() {

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/order/user/${userId}`);
                setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) return <PageLoader label="Loading your orders..." />;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink text-center mb-8">My Orders</h1>

            {!userId ? (
                <EmptyState
                    title="Please log in"
                    description="Sign in to see your order history."
                    action={<Button onClick={() => navigate("/login")}>Login</Button>}
                />
            ) : orders.length === 0 ? (
                <EmptyState
                    title="No orders yet"
                    description="Once you place an order, it'll show up here."
                    action={<Button onClick={() => navigate("/all-products")}>Start Shopping</Button>}
                />
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => {
                        const firstItem = order.items[0];
                        const totalQty = order.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
                        const totalPrice = order.items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

                        return (
                            <button
                                key={order._id}
                                onClick={() => navigate(`/order/${order._id}`)}
                                className="bg-paper border border-border rounded-2xl p-4 flex items-center gap-4 text-left hover:border-brass-300 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-sand flex-shrink-0">
                                    <img
                                        src={firstItem.image}
                                        className="h-full w-full object-cover"
                                        alt={firstItem.title}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] text-muted uppercase tracking-widest mb-1 truncate">
                                        Order #{order._id.slice(-8)}
                                    </p>
                                    <h2 className="font-semibold text-ink truncate">{firstItem.title}</h2>
                                    <p className="text-xs text-muted mt-0.5">
                                        {totalQty > 1 ? `+${totalQty - 1} more item${totalQty - 1 > 1 ? "s" : ""}` : "1 item"}
                                    </p>
                                    <p className="font-bold text-ink mt-2 font-data">₹{totalPrice.toLocaleString("en-IN")}</p>
                                </div>

                                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
