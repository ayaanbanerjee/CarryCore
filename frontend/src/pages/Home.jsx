import api from '../api/axios'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router';
import { ProductCard, Button, SectionHeading, EmptyState, Spinner } from '../components/ui';
import bannerImg from '../images/banner.jpeg';
import leatherBagImg from '../assets/HeroLeatherBag.jpg';

export default function Home() {
  const [products, setProducts] = useState([])
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/product')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [])

  const addtocart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    const res = await api.post('/cart/add', { userId, productId });
    const total = res.data.cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    navigate("/checkout-address", { state: { source: "buyNow", productId: product._id, quantity: 1 } });
  };

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO BANNER ── */}
      <section className="relative w-full overflow-hidden">

        {/* Ticker */}
        <div className="bg-ink text-white text-xs font-semibold py-2 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {Array(6).fill('GRAB THE FREEBIE ❖ FREE TRAVEL POUCH ON ORDERS ABOVE ₹1,999 ❖ NEW ARRIVALS ARE HERE ❖ USE CODE CARRY10 FOR 10% OFF ❖ ').join('')}
          </div>
        </div>

        {/* Banner */}
        <div className="relative min-h-[88vh] flex items-center">
          {/* Full-width background image */}
          <img
            src={bannerImg}
            alt="CarryCore Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-ink/55" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-10">

              {/* LEFT — Badge */}
              <div className="flex-shrink-0 flex items-start md:items-center">
                <div className="bg-brass-500 text-white px-5 py-3 rounded-2xl shadow-xl rotate-[-2deg]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brass-100">CarryCore</p>
                  <p className="font-display text-2xl font-bold leading-tight mt-0.5">NEW<br />ARRIVAL</p>
                  <p className="text-[10px] text-brass-100 mt-1">Collection 2025</p>
                </div>
              </div>

              {/* RIGHT — Headline + CTA */}
              <div className="flex-1 flex flex-col justify-center items-start md:items-end text-left md:text-right">
                <p className="text-brass-300 text-xs font-bold uppercase tracking-[0.3em] mb-3">Premium Bags &amp; Backpacks</p>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.0]">
                  Carry Your<br />
                  <span className="text-brass-300">Style</span><br />
                  Everywhere.
                </h1>
                <p className="text-white/70 mt-5 text-base md:text-lg max-w-sm md:text-right">
                  Handcrafted bags for every journey — built to last, designed to impress.
                </p>
                <button
                  onClick={() => navigate('/all-products')}
                  className="mt-8 inline-flex items-center gap-2 bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer tracking-wide"
                >
                  SHOP COLLECTION
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Stats row */}
                <div className="flex gap-8 mt-10 pt-8 border-t border-white/15 w-full md:justify-end">
                  {[['2M+', 'Customers'], ['80+', 'Styles'], ['4.9★', 'Rating']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="font-display text-2xl font-bold text-white">{v}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom floating offer */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 bg-paper/95 backdrop-blur-sm text-ink text-xs font-semibold px-5 py-2.5 rounded-full shadow-xl border border-border whitespace-nowrap">
              <span className="text-base">🎁</span>
              Shop for ₹1,999 to get <span className="text-brass-600 font-bold ml-1">FREE Travel Pouch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS CAROUSEL ── */}
      <BestsellersCarousel products={products} loading={loading} onAddToCart={addtocart} navigate={navigate} />

      {/* ── PROMO BAR ── */}
      <PromoBar />

      {/* ── CATEGORY STRIP ── */}
      <section className="bg-paper border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1">
            {CATEGORIES.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => navigate(`/all-products?category=${label}`)}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-cream hover:bg-sand hover:border-brass-400 hover:text-brass-700 text-sm font-medium text-body transition-all duration-150 cursor-pointer"
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <SectionHeading
            eyebrow="Fresh in stock"
            title="Featured Products"
            subtitle="Our most-loved styles, picked for you."
            className="mb-0"
          />
          <Button variant="ghost" onClick={() => navigate("/all-products")}>
            View all →
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted">Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No products yet" description="Check back soon — new arrivals are on the way." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {(showAll ? products : products.slice(0, 8)).map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={addtocart} onBuyNow={buyNow} />
              ))}
            </div>
            {products.length > 8 && (
              <div className="text-center mt-10">
                <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                  {showAll ? 'Show Less' : `Show All`}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brass-500/20 flex items-center justify-center text-2xl">
                  {icon}
                </div>
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-xs text-forest-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT STORY SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* image side */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img src={leatherBagImg} alt="CarryCore leather bag" className="w-full h-full object-cover" />
            </div>
            {/* floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-brass-500 text-white rounded-2xl px-6 py-4 shadow-xl hidden md:block">
              <p className="font-display text-3xl font-bold">12+</p>
              <p className="text-xs text-brass-100 mt-0.5">Years of craft</p>
            </div>
          </div>

          {/* text side */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-500 mb-3">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-ink">
              Built for the<br />
              <span className="text-brass-500">bold traveller.</span>
            </h2>
            <p className="text-body mt-5 text-base leading-relaxed">
              Every CarryCore bag starts with a simple question: <em>what does a traveller actually need?</em> We obsess over materials, test every stitch, and design for real life — not just the photoshoot.
            </p>
            <p className="text-body mt-3 text-base leading-relaxed">
              From weekend escapes to daily commutes, our bags are built to move the way you move.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
              {[['80+', 'Bag styles'], ['2M+', 'Customers'], ['50+', 'Countries']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl font-bold text-brass-600">{n}</p>
                  <p className="text-sm text-body mt-1">{l}</p>
                </div>
              ))}
            </div>

            <Button className="mt-8" size="lg" onClick={() => navigate("/all-products")}>
              Explore Collection
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading
            eyebrow="What customers say"
            title="Loved by travellers"
            subtitle="Real reviews from real adventurers."
            className="text-center items-center"
          />
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <div key={name} className="bg-paper rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5 text-brass-400 text-sm">
                  {'★'.repeat(rating)}
                </div>
                <p className="text-body text-sm leading-relaxed flex-1">"{quote}"</p>
                <div>
                  <p className="font-semibold text-ink text-sm">{name}</p>
                  <p className="text-xs text-muted mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-forest-900 py-20 px-6 text-center">
          {/* subtle texture overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #B4762C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3E5B3E 0%, transparent 50%)' }}
          />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-400 mb-4">Limited time</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Your next journey<br />starts here.
            </h2>
            <p className="text-forest-300 text-base md:text-lg max-w-xl mx-auto mb-8">
              Shop the full CarryCore collection — free shipping on orders above ₹999.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                className="!bg-brass-500 hover:!bg-brass-400 !text-white"
                onClick={() => navigate("/all-products")}
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!border-white/20 !text-white hover:!bg-white/10"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT ── */}
      <AIAssistant />

    </div>
  );
}

/* ═══════════════════════════════════════════
   BESTSELLERS CAROUSEL
═══════════════════════════════════════════ */
function BestsellersCarousel({ products, loading, onAddToCart, navigate }) {
  const [start, setStart] = useState(0);
  const [wishlist, setWishlist] = useState({});
  const visible = 4;
  const items = products.slice(0, 12);
  const canPrev = start > 0;
  const canNext = start + visible < items.length;

  const BADGES = ['Bestseller', 'New', 'Sale', 'Bestseller', 'New', 'Sale', 'Bestseller', 'New', 'Sale', 'Bestseller', 'New', 'Sale'];
  const BADGE_STYLES = {
    Bestseller: 'bg-brass-500 text-white',
    New: 'bg-forest-500 text-white',
    Sale: 'bg-rust-500 text-white',
  };

  const toggleWishlist = (id) => setWishlist(w => ({ ...w, [id]: !w[id] }));

  const getMRP = (price) => Math.round(price * 1.25);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-500 mb-1">Top Picks</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Explore Bestsellers</h2>
        </div>
        <button
          onClick={() => navigate('/all-products')}
          className="text-sm font-semibold text-brass-600 hover:text-brass-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 rounded-2xl bg-sand animate-pulse h-72" />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.slice(start, start + visible).map((product, idx) => {
              const badge = BADGES[(start + idx) % BADGES.length];
              const mrp = getMRP(product.price);
              return (
                <div key={product._id} className="bg-paper border border-border rounded-2xl overflow-hidden group hover:shadow-lg hover:border-brass-200 transition-all duration-200 flex flex-col">
                  {/* Image */}
                  <div className="relative bg-sand">
                    <div
                      className="h-48 flex items-center justify-center p-4 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    {/* Badge */}
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[badge]}`}>
                      {badge}
                    </span>
                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-paper/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    >
                      <svg className={`w-4 h-4 transition-colors ${wishlist[product._id] ? 'fill-rust-500 stroke-rust-500' : 'fill-none stroke-body'}`} viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <p
                      className="text-sm font-semibold text-ink leading-snug line-clamp-2 cursor-pointer hover:text-brass-600 transition-colors"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-base font-bold text-ink font-data">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-muted line-through font-data">
                        ₹{Number(mrp).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-success">
                        {Math.round(((mrp - product.price) / mrp) * 100)}% off
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToCart(product._id)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-brass-500 hover:bg-brass-600 active:bg-brass-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setStart(s => Math.max(0, s - visible))}
              disabled={!canPrev}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-body hover:border-brass-400 hover:text-brass-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setStart(s => Math.min(items.length - visible, s + visible))}
              disabled={!canNext}
              className="w-9 h-9 rounded-full bg-brass-500 hover:bg-brass-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROMO BAR
═══════════════════════════════════════════ */
function PromoBar() {
  const offers = [
    { icon: '🎒', text: 'Buy 2 bags, get 15% off', code: 'BAG2' },
    { icon: '🚚', text: 'Free shipping above ₹999', code: null },
    { icon: '↩️', text: '30-day hassle-free returns', code: null },
    { icon: '🎁', text: 'Gift wrapping available', code: 'GIFTWRAP' },
  ];
  return (
    <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 border-y border-forest-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-forest-700">
          {offers.map(({ icon, text, code }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-4">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <div>
                <p className="text-white text-xs font-semibold leading-snug">{text}</p>
                {code && (
                  <p className="text-brass-300 text-[10px] font-bold mt-0.5 tracking-wider">Code: {code}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI SHOPPING ASSISTANT
═══════════════════════════════════════════ */
function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I\'m CarryCore AI 👋 Tell me what you need — a travel bag, laptop bag, or something else — and I\'ll help you find the perfect one!' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const RESPONSES = [
    { keys: ['travel', 'trip', 'flight'], reply: 'For travel, I\'d recommend our Travel Bags collection — lightweight, TSA-friendly, and built for long hauls. 🧳' },
    { keys: ['laptop', 'office', 'work'], reply: 'Our Laptop Bags have padded compartments, USB ports, and a sleek look for the office. 💼' },
    { keys: ['backpack', 'college', 'school'], reply: 'Our Backpacks are perfect for college — spacious, ergonomic, and stylish. 🎒' },
    { keys: ['cheap', 'budget', 'affordable'], reply: 'We have great options under ₹999! Check our Sale section for the best deals. 🏷️' },
    { keys: ['gift'], reply: 'Great choice! We offer gift wrapping — use code GIFTWRAP at checkout. 🎁' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim() };
    const lower = input.toLowerCase();
    const match = RESPONSES.find(r => r.keys.some(k => lower.includes(k)));
    const aiReply = match
      ? match.reply
      : 'I\'d love to help! Try browsing our collections or search for what you need. 😊';
    setMessages(m => [...m, userMsg, { from: 'ai', text: aiReply }]);
    setInput('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brass-500 hover:bg-brass-400 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
        aria-label="CarryCore AI Assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-paper rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-forest-900 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brass-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
            <div>
              <p className="text-white text-sm font-semibold">CarryCore AI</p>
              <p className="text-forest-300 text-[10px]">Shopping Assistant</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 max-h-64 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-brass-500 text-white rounded-br-sm'
                    : 'bg-sand text-ink rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-cream focus:outline-none focus:ring-2 focus:ring-brass-400 text-ink placeholder-muted"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-lg bg-brass-500 hover:bg-brass-600 flex items-center justify-center text-white transition-colors cursor-pointer flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const CATEGORIES = [
  { label: 'Backpacks', icon: '🎒' },
  { label: 'Tote Bags', icon: '👜' },
  { label: 'Travel Bags', icon: '🧳' },
  { label: 'Laptop Bags', icon: '💼' },
  { label: 'Sling Bags', icon: '👝' },
  { label: 'Duffel Bags', icon: '🏋️' },
];

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On all orders above ₹999 across India' },
  { icon: '↩️', title: '30-Day Returns', desc: 'No questions asked return policy' },
  { icon: '🧵', title: 'Handcrafted', desc: 'Every bag stitched with precision' },
  { icon: '🛡️', title: '2-Year Warranty', desc: 'Built to last, backed by us' },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Frequent Traveller, Mumbai',
    quote: 'I\'ve used my CarryCore backpack on 3 international trips. The quality is unreal — zippers still smooth, straps still perfect.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'UX Designer, Bangalore',
    quote: 'Finally a laptop bag that looks professional AND fits everything. The internal organisation is chef\'s kiss.',
    rating: 5,
  },
  {
    name: 'Rohan Das',
    role: 'College Student, Delhi',
    quote: 'Bought the tote for college and got so many compliments. Sturdy, spacious and looks way more expensive than it is.',
    rating: 5,
  },
];
