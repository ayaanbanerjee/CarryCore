import { Link, useParams } from "react-router";
import { Button } from "../components/ui";

export default function OrderSuccess() {
    const { id } = useParams();

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-success-bg flex items-center justify-center">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
                    Order Placed Successfully
                </h1>
                <p className="text-body mb-1">Thank you for shopping with Packverse.</p>
                <p className="text-sm text-muted mb-8">
                    Order ID: <span className="font-data font-semibold text-ink">{id}</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button as={Link} to="/" size="lg">
                        Continue Shopping
                    </Button>
                    <Button as={Link} to="/myorders" variant="outline" size="lg">
                        View My Orders
                    </Button>
                </div>
            </div>
        </div>
    )
}
