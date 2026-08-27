import api from '../api/axios';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

  const loadProduct = async () => {
    const res = await api.get(`/product/${id}`);
    setProduct(res.data);
    // load related by same category
    const rel = await api.get(`/product?category=${res.data.category}`);
    setRelatedProducts(rel.data.filter(p => p._id !== res.data._id).slice(0, 4));
  }

  useEffect(() => {
    loadProduct();
    setActiveImg(0);
    window.scrollTo(0, 0);
  }, [id])

  const addtocart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    const res = await api.post(`/cart/add`, { userId, productId });
    const total = res.data.cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity, 0
    );
    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    localStorage.setItem("productId", product._id);
    navigate("/checkout-address", {
      state: { source: "buyNow", quantity: quantity, productId: product._id }
    });
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeMsg("✓ Delivery available by May 20, 2026");
    } else {
      setPincodeMsg("Please enter a valid 6-digit pincode");
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-border border-t-brass-500 rounded-full animate-spin" />
        <p className="text-sm text-muted">Loading product...</p>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : [];
  const rating = product.rating || 4.0;
  const reviewCount = product.reviewCount || 0;
  const stock = product.stock ?? 10;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6 flex gap-2 items-center flex-wrap">
          <Link to="/" className="hover:text-brass-700 transition-colors">Home</Link>
          <span>/</span>
          <span
            className="hover:text-brass-700 cursor-pointer transition-colors"
            onClick={() => navigate(`/?category=${product.category}`)}
          >
            {product.category}
          </span>
          <span>/</span>
          <span className="text-brass-700 line-clamp-1">{product.title}</span>
        </nav>

        {/* ── Top Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-border rounded-xl flex items-center justify-center h-80 p-6">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="h-full w-full object-contain transition-all duration-300"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-1 border-2 rounded-lg overflow-hidden h-16 p-1 transition-all ${
                      activeImg === i
                        ? "border-brass-500"
                        : "border-border hover:border-brass-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-4">

            {/* Category + Wishlist */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brass-600 uppercase tracking-widest">
                {product.category}
              </span>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  wishlisted ? "text-red-500" : "text-muted"
                }`}
                title="Add to wishlist"
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-ink leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= Math.round(rating) ? "text-yellow-400" : "text-sand-dark"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-body">{rating}</span>
              {reviewCount > 0 && (
                <span className="text-sm text-muted">({reviewCount} reviews)</span>
              )}
            </div>

            {/* Price + Stock */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-brass-700">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                stock > 0
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}>
                {stock > 0 ? `In Stock (${stock} left)` : "Out of Stock"}
              </span>
            </div>

            <hr className="border-border" />

            {/* Offers */}
            <div className="bg-sand border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-brass-700 uppercase tracking-wide mb-2">
                🏷 Available Offers
              </p>
              <ul className="flex flex-col gap-1.5 text-sm text-body">
                <li>✓ 10% off on HDFC Bank Cards. Min. spend ₹2,000</li>
                <li>✓ Free delivery on orders above ₹999</li>
                <li>✓ No-cost EMI starting ₹{Math.round(product.price / 12)}/month</li>
              </ul>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-brass-700">Quantity</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-brass-600 hover:bg-cream font-bold text-lg transition-colors"
                >−</button>
                <span className="px-4 py-1.5 text-sm font-semibold text-ink border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="px-3 py-1.5 text-brass-600 hover:bg-cream font-bold text-lg transition-colors"
                >+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => addtocart(product._id)}
                disabled={stock === 0}
                className="flex-1 bg-sand hover:bg-brass-100 text-brass-700 font-semibold py-3 rounded-xl border border-border-strong transition-colors cursor-pointer disabled:opacity-50"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={buyNow}
                disabled={stock === 0}
                className="flex-1 bg-brass-500 hover:bg-brass-600 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery Check */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-brass-700 uppercase tracking-wide mb-2">
                🚚 Check Delivery
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setPincodeMsg(""); }}
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brass-400"
                />
                <button
                  onClick={checkPincode}
                  className="bg-brass-500 hover:bg-brass-600 text-white text-sm font-semibold px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p className={`text-xs mt-2 font-medium ${
                  pincodeMsg.startsWith("✓") ? "text-green-600" : "text-red-500"
                }`}>
                  {pincodeMsg}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── Description / Specs Tabs ── */}
        <div className="bg-white border border-border rounded-xl mb-8 overflow-hidden">
          <div className="flex border-b border-border">
            {["description", "specs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-brass-700 border-b-2 border-brass-500 bg-cream"
                    : "text-muted hover:text-brass-600"
                }`}
              >
                {tab === "description" ? "Description" : "Specifications"}
              </button>
            ))}
          </div>
          <div className="p-5 text-sm text-body leading-relaxed">
            {activeTab === "description" ? (
              <p>{product.description}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {[
                  ["Category", product.category],
                  ["Price", `₹${product.price.toLocaleString("en-IN")}`],
                  ["Stock", `${stock} units`],
                  ["Rating", `${rating} / 5`],
                  ["Warranty", "1 Year"],
                  ["Returns", "7-day easy return"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted">{k}</span>
                    <span className="font-medium text-ink">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-ink mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md hover:shadow-brass-100 transition-shadow flex flex-col cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <div className="bg-cream flex items-center justify-center h-36 p-3">
                    <img src={p.images?.[0]} alt={p.title} className="h-full w-full object-contain" />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs text-brass-600 font-medium mb-1">{p.category}</p>
                    <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug flex-1">
                      {p.title}
                    </h3>
                    <p className="text-sm font-bold text-brass-700 mt-2">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}