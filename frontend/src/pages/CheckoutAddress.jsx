import { useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router";
import { Button, Input, Alert } from "../components/ui";

const FIELD_LABELS = {
    fullname: "Full Name",
    phone: "Phone Number",
    street: "Street Address",
    city: "City",
    state: "State",
    zipCode: "ZIP / Postal Code",
    country: "Country",
};

export default function CheckOutAddress() {
    const navigate = useNavigate();
    const location = useLocation();
    const source = location.state?.source;
    const id = location.state?.productId;
    const quantity = location.state?.quantity;

    const [form, setForm] = useState({
        fullname: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            await api.post("/address/add", {
                ...form,
                userId
            })

            if (source === "buyNow") {
                navigate(`/buy-now/${id}`, {
                    state: {
                        productId: id,
                        quantity: quantity
                    }
                });
            }
            else {
                navigate('/checkout')
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">Delivery Address</h1>
            <p className="text-sm text-muted mb-6">Tell us where to send your order.</p>

            <form onSubmit={handleSubmit} className="bg-paper border border-border rounded-2xl p-6 flex flex-col gap-4">
                {error && <Alert tone="error">{error}</Alert>}
                {Object.keys(form).map((key) => (
                    <Input
                        key={key}
                        type={key === "phone" || key === "zipCode" ? "text" : "text"}
                        name={key}
                        label={FIELD_LABELS[key] || key}
                        placeholder={FIELD_LABELS[key] || key}
                        value={form[key]}
                        onChange={handleChange}
                        required
                    />
                ))}
                <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
                    {loading ? "Saving..." : "Save Address & Continue"}
                </Button>
            </form>
        </div>
    )
}
