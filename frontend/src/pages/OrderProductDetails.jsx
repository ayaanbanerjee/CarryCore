import { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../api/axios.js";
import { PageLoader } from "../components/ui";

export default function OrderProductDetails() {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDetails = await api.get(`/order/${id}`);
        setOrder(orderDetails.data);
      }
      catch (error) {
        console.log("Error fetching order:", error)
      }
    }
    if (userId) {
      fetchOrder();
    }
  }, [userId]);

  if (!order) return <PageLoader label="Loading order..." />;

  const total = order.items?.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0) ?? 0;

  return (
    <div className="min-h-[70vh] flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-paper border border-border rounded-2xl shadow-sm p-6 sm:p-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Order Summary</p>
          <h2 className="text-sm font-semibold text-ink font-data">Order ID: {order?._id}</h2>
          {order?.status && (
            <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-brass-50 text-brass-700 border border-brass-200 capitalize">
              {order.status}
            </span>
          )}
        </div>

        <hr className="border-border mb-6" />

        {/* Items */}
        <div className="flex flex-col gap-3">
          {order?.items?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 rounded-xl border border-border bg-sand/40 p-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-paper flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-ink truncate">{item.title}</h3>
                <p className="text-xs text-muted mt-1">
                  Qty {item.quantity ?? 1} · Item #{index + 1}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink whitespace-nowrap font-data">
                ₹{(item.price * (item.quantity ?? 1)).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* Address */}
        {order?.address && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs uppercase tracking-widest text-muted mb-2">Delivery Address</p>
            <p className="text-sm text-body leading-relaxed">
              {order.address.fullName}<br />
              {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}<br />
              {order.address.phone}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-sm text-muted">Total</span>
          <span className="text-lg font-bold text-ink font-data">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
