import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../api/axios';
import { Card } from '../components/ui';

function StatCard({ label, value, sub, icon, tone }) {
  const tones = {
    brass: "bg-brass-50 text-brass-600",
    forest: "bg-forest-100 text-forest-600",
    error: "bg-error-bg text-error",
    warning: "bg-warning-bg text-warning",
  };
  return (
    <Card className="p-5 flex items-center gap-4 font-data">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-ink mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/product')
      .then(r => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalStock    = products.reduce((s, p) => s + (p.stock || 0), 0);
  const outOfStock    = products.filter(p => p.stock === 0).length;
  const avgPrice      = products.length
    ? Math.round(products.reduce((s, p) => s + (p.price || 0), 0) / products.length)
    : 0;
  const recent        = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const adminName = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.name || 'Admin'; }
    catch { return 'Admin'; }
  })();

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Welcome */}
      <div className="mb-7">
        <h2 className="font-display text-2xl font-bold text-ink">Good morning, {adminName}</h2>
        <p className="text-sm text-muted mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-sand rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={products.length}
            sub="in catalog"
            tone="brass"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            }
          />
          <StatCard
            label="Total Stock"
            value={totalStock.toLocaleString()}
            sub="units available"
            tone="forest"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            }
          />
          <StatCard
            label="Out of Stock"
            value={outOfStock}
            sub={outOfStock > 0 ? 'needs restocking' : 'all stocked'}
            tone="error"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            }
          />
          <StatCard
            label="Avg Price"
            value={`₹${avgPrice.toLocaleString()}`}
            sub="across all products"
            tone="warning"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/product/add"
          className="group flex items-center gap-4 bg-brass-500 hover:bg-brass-600 text-white rounded-2xl p-5 transition-colors shadow-md shadow-brass-900/10"
        >
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-base">Add New Product</p>
            <p className="text-brass-50 text-sm">Add a product to the catalog</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>

        <Link
          to="/admin/product"
          className="group flex items-center gap-4 bg-paper hover:bg-sand border border-border rounded-2xl p-5 transition-colors shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-brass-50 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4762C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-base text-ink">Manage Products</p>
            <p className="text-muted text-sm">Edit, delete, view all products</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto group-hover:translate-x-1 transition-transform">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>
      </div>

      {/* Recent products */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-ink">Recently Added</h3>
          <Link to="/admin/product" className="text-brass-600 hover:text-brass-700 text-sm font-semibold">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sand rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-sand rounded animate-pulse w-1/2" />
                  <div className="h-2 bg-sand rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-14 text-muted">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <p className="font-medium">No products yet</p>
            <p className="text-sm mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map(product => (
              <div key={product._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-sand/40 transition-colors">
                <img
                  src={product.images?.[0] || ''}
                  alt={product.title}
                  className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0 bg-sand"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{product.title}</p>
                  <p className="text-xs text-muted truncate">{product.category}</p>
                </div>
                <div className="text-right flex-shrink-0 font-data">
                  <p className="text-sm font-bold text-ink">₹{product.price?.toLocaleString()}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.stock > 0 ? 'bg-success-bg text-success' : 'bg-error-bg text-error'
                  }`}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                  </span>
                </div>
                <Link
                  to={`/admin/product/edit/${product._id}`}
                  className="ml-2 text-muted hover:text-brass-600 transition-colors flex-shrink-0"
                  aria-label="Edit"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
