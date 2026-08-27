import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-forest-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-xl font-bold text-white">
              Packverse
            </Link>
            <p className="text-sm text-forest-300 mt-3 leading-relaxed">
              Bags built to last — for every journey, from daily commutes to weekend escapes.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest-300 mb-3">
              Shop
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/all-products" className="hover:text-brass-300 transition-colors">All Products</Link></li>
              <li><Link to="/cart" className="hover:text-brass-300 transition-colors">Cart</Link></li>
              <li><Link to="/myorders" className="hover:text-brass-300 transition-colors">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest-300 mb-3">
              Account
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/login" className="hover:text-brass-300 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-brass-300 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest-300 mb-3">
              Support
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-forest-300">
              <li>support@packverse.example</li>
              <li>Mon–Sat, 9am–6pm IST</li>
            </ul>
          </div>
        </div>

        <div className="stitch-divider my-8 opacity-20" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-400">
          <p>© {new Date().getFullYear()} Packverse. All rights reserved.</p>
          <p>Made for travellers, students &amp; professionals across India.</p>
        </div>
      </div>
    </footer>
  );
}
