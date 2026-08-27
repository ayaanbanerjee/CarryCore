import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";

export default function AdminNav({ adminName }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      isActive ? "bg-forest-700 text-white" : "text-forest-100 hover:bg-forest-700/60"
    }`;

  return (
    <nav className="bg-forest-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="text-brass-400">◆</span> Packverse <span className="text-forest-300 font-body font-normal text-sm">Admin</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/admin/product" className={linkClass}>Products</NavLink>
            <NavLink to="/admin/product/add" className={linkClass}>Add Product</NavLink>
            <Link to="/" className="text-sm font-medium px-3 py-2 rounded-lg text-forest-100 hover:bg-forest-700/60 transition-colors">
              View Store
            </Link>
            <span className="w-px h-5 bg-forest-600 mx-1" />
            {adminName && <span className="text-sm text-forest-300">{adminName}</span>}
            <button
              onClick={handleLogout}
              className="text-sm font-semibold px-3 py-2 rounded-lg text-rust-300 hover:bg-forest-700/60 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 py-3 border-t border-forest-700">
          <NavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/product" onClick={() => setMenuOpen(false)} className={linkClass}>Products</NavLink>
          <NavLink to="/admin/product/add" onClick={() => setMenuOpen(false)} className={linkClass}>Add Product</NavLink>
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg text-forest-100">
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-3 py-2 rounded-lg text-rust-300 text-left cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
