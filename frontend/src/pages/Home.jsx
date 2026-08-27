import api from '../api/axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { ProductCard, Button, SectionHeading, EmptyState } from '../components/ui';
import bannerImg from '../images/banner.jpeg';
import leatherBagImg from '../assets/HeroLeatherBag.jpg';

export default function Home() {
  const [products, setProducts] = useState([])
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/product').then(res => setProducts(res.data));
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

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* full-bleed background */}
        <div className="absolute inset-0">
          <img src={bannerImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-900/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="max-w-2xl">
            {/* pill badge */}
            <span className="inline-flex items-center gap-2 bg-brass-500/20 border border-brass-400/40 text-brass-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-400 animate-pulse" />
              New Collection 2025
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
              Carry More.<br />
              <span className="text-brass-300">Worry Less.</span>
            </h1>

            <p className="text-forest-200 mt-6 text-lg md:text-xl leading-relaxed max-w-lg">
              Premium bags crafted for every journey — from daily commutes to mountain escapes.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Button size="lg" onClick={() => navigate("/all-products")}>
                Shop Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white/60"
                onClick={() => navigate("/signup")}
              >
                Join Packverse
              </Button>
            </div>

            {/* stats row */}
            <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
              {[['2M+', 'Happy Customers'], ['80+', 'Bag Styles'], ['12+', 'Years Crafting'], ['4.9★', 'Avg Rating']].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-bold text-white">{v}</p>
                  <p className="text-xs text-forest-300 uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs">
          <span>Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

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

        {products.length === 0 ? (
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
                  {showAll ? 'Show Less' : `Show All ${products.length} Products`}
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
              <img src={leatherBagImg} alt="Packverse leather bag" className="w-full h-full object-cover" />
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
              Every Packverse bag starts with a simple question: <em>what does a traveller actually need?</em> We obsess over materials, test every stitch, and design for real life — not just the photoshoot.
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
              Shop the full Packverse collection — free shipping on orders above ₹999.
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

    </div>
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
    quote: 'I\'ve used my Packverse backpack on 3 international trips. The quality is unreal — zippers still smooth, straps still perfect.',
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
