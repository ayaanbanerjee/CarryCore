import api from '../api/axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { ProductCard, EmptyState, Spinner } from '../components/ui';

const CATEGORIES = [
  "Backpacks",
  "Laptop Bags",
  "Travel Bags",
  "Sling & Crossbody",
  "Tote Bags",
  "Duffle & Gym",
  "Handbags",
  "Messenger Bags",
  "School Bags",
  "Camera Bags",
  "Hiking & Outdoor",
  "Accessories",
];

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProduct = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/product?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );

      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadProduct, 250);

    return () => clearTimeout(timeout);
  }, [search, category])

  const addtocart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, {
        userId,
        productId
      });

      const total = res.data.cart.items.reduce(
        (acc, item) =>
          acc + item.productId.price * item.quantity,
        0
      );

      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (error) {
      console.error("Failed to add product to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const buyNow = (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    navigate("/checkout-address", {
      state: {
        source: "buyNow",
        productId: product._id,
        quantity: 1
      },
    });
  };

  return (
    <div>

      {/* Search & Filter Bar */}
      <div className="bg-paper border-b border-border sticky top-16 z-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="flex flex-1 border border-border-strong rounded-lg overflow-hidden bg-paper focus-within:ring-2 focus-within:ring-brass-400">

            <input
              type="text"
              className="flex-1 px-4 py-2.5 text-sm text-ink placeholder-muted focus:outline-none bg-transparent"
              placeholder="Search bags..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />

            <span className="flex items-center px-4 text-muted">

              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

            </span>

          </div>

          {/* Category Filter */}
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="border border-border-strong rounded-lg bg-paper text-sm text-body px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brass-400 sm:w-56"
          >

            <option value="">
              All Categories
            </option>

            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading ? (

          <div className="flex justify-center py-24">
            <Spinner className="w-8 h-8" />
          </div>

        ) : products.length === 0 ? (

          <EmptyState
            title="No bags found"
            description="Try a different search term or category."
          />

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addtocart}
                onBuyNow={buyNow}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  )
}