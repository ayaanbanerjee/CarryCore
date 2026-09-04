import { Link, useNavigate, useLocation } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const NAV_CATEGORIES = ['BAGS', 'BACKPACKS', 'LAPTOP BAGS', 'TRAVEL', 'OFFICE', 'COLLECTIONS', 'SALE'];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Account';

    /* close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    /* cart count */
    useEffect(() => {
        const loadCart = async () => {
            if (!userId) return;
            try {
                const res = await api.get(`/cart/${userId}`);
                const total = res.data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(total);
            } catch { /* silent */ }
        };
        loadCart();
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        setCartCount(0);
        setDropdownOpen(false);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/all-products?search=${searchQuery.trim()}`);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-paper shadow-sm border-none">

                {/* ── Tier 1: Announcement Bar ── */}
                <div className="bg-forest-900 text-white text-xs font-medium text-center py-2 px-4 tracking-wide">
                    🚚 Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code{' '}
                    <span className="font-bold text-brass-300">CARRY10</span> for 10% off
                </div>

                {/* ── Tier 2: Main Bar — Logo + Search + Icons ── */}
                <div className="border-b border-border ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 h-16">

                            {/* Logo */}
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-lg bg-brass-500 flex items-center justify-center shadow-md group-hover:bg-brass-400 transition-colors">
                                    <span className="text-white font-bold text-sm font-display">C</span>
                                </div>
                                <span className="font-display text-xl font-bold text-ink tracking-tight hidden sm:block">
                                    CarryCore
                                </span>
                            </Link>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
                                <div className="flex items-center border-2 border-border hover:border-brass-400 focus-within:border-brass-500 rounded-xl overflow-hidden bg-cream transition-colors">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search bags, backpacks, travel bags..."
                                        className="flex-1 px-4 py-2.5 text-sm text-ink placeholder-muted bg-transparent focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-brass-500 hover:bg-brass-600 transition-colors cursor-pointer"
                                    >
                                        <SearchIcon className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </form>

                            {/* Icons */}
                            <div className="flex items-center gap-1">

                                {/* Store/Location */}
                                <IconBtn label="Store" onClick={() => navigate('/all-products')}>
                                    <StoreIcon className="w-5 h-5" />
                                </IconBtn>

                                {/* Wishlist */}
                                <IconBtn label="Wishlist" onClick={() => navigate('/all-products')}>
                                    <WishlistIcon className="w-5 h-5" />
                                </IconBtn>

                                {/* Account */}
                                {!userId ? (
                                    <IconBtn label="Login" onClick={() => navigate('/login')}>
                                        <AccountIcon className="w-5 h-5" />
                                    </IconBtn>

                                ) : (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-sand transition-colors cursor-pointer group"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-brass-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-[10px] text-muted group-hover:text-brass-600 hidden sm:block">
                                                {userName.split(' ')[0]}
                                            </span>
                                        </button>

                                        {dropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-paper border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                                                <div className="px-4 py-3 border-b border-border bg-sand">
                                                    <p className="text-xs text-muted">Signed in as</p>
                                                    <p className="text-sm font-semibold text-ink truncate">{userName}</p>
                                                </div>
                                                <div className="py-1">
                                                    <DropdownItem icon="📦" label="My Orders" onClick={() => { navigate('/myorders'); setDropdownOpen(false); }} />
                                                    <div className="border-t border-border mt-1 pt-1">
                                                        <DropdownItem icon="🚪" label="Logout" onClick={handleLogout} danger />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Cart */}
                                <Link to="/cart" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-sand transition-colors group relative">
                                    <div className="relative">
                                        <CartIcon className="w-5 h-5 text-ink group-hover:text-brass-600 transition-colors" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-rust-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted group-hover:text-brass-600 hidden sm:block">Cart</span>
                                </Link>

                                {/* Mobile hamburger */}
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="md:hidden p-2 rounded-lg hover:bg-sand text-body cursor-pointer ml-1"
                                    aria-label="Menu"
                                >
                                    <div className="w-5 h-4 flex flex-col justify-between">
                                        <span className={`block h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                                        <span className={`block h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                                        <span className={`block h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tier 3: Category Menu Bar ── */}
                <div className="hidden md:block bg-paper border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center gap-0">
                            {NAV_CATEGORIES.map((cat) => (
                                <Link
                                    key={cat}
                                    to={`/all-products?category=${cat}`}
                                    className={`relative px-5 py-3 text-xs font-bold tracking-widest transition-colors group whitespace-nowrap
                                        ${cat === 'SALE'
                                            ? 'text-rust-500 hover:text-rust-600'
                                            : 'text-ink hover:text-brass-600'
                                        }`}
                                >
                                    {cat}
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brass-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </header>

            {/* ── Mobile Drawer ── */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMenuOpen(false)}
                />
                <div className={`absolute top-0 right-0 h-full w-72 bg-paper shadow-2xl transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-brass-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs font-display">C</span>
                            </div>
                            <span className="font-display text-lg font-bold text-ink">CarryCore</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-sand text-muted cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {userId && (
                        <div className="flex items-center gap-3 px-5 py-4 bg-sand border-b border-border">
                            <div className="w-10 h-10 rounded-full bg-brass-500 flex items-center justify-center text-white font-bold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-ink text-sm">{userName}</p>
                                <p className="text-xs text-muted">Logged in</p>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                        {NAV_CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                to={`/all-products?category=${cat}`}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-colors ${cat === 'SALE' ? 'text-rust-500' : 'text-body hover:bg-sand hover:text-ink'}`}
                            >
                                {cat}
                            </Link>
                        ))}
                        <div className="border-t border-border mt-2 pt-2">
                            <DrawerLink to="/" label="Home" icon="🏠" active={location.pathname === '/'} />
                            <DrawerLink to="/all-products" label="All Products" icon="🛍️" active={location.pathname === '/all-products'} />
                            {userId && (
                                <>
                                    <DrawerLink to="/myorders" label="My Orders" icon="📦" active={location.pathname === '/myorders'} />
                                    <DrawerLink to="/cart" label="Cart" icon="🛒" active={location.pathname === '/cart'} badge={cartCount > 0 ? cartCount : null} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="px-4 py-5 border-t border-border">
                        {!userId ? (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full text-center bg-brass-500 hover:bg-brass-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors">Login</Link>
                                <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full text-center border border-border text-body hover:bg-sand font-medium py-3 rounded-xl text-sm transition-colors">Create Account</Link>
                            </div>
                        ) : (
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-error hover:bg-error-bg font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer border border-error/20">
                                <span>🚪</span> Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer for fixed header height: announcement(32) + main bar(64) + category bar(40) = 136px */}
            <div className="h-[136px] md:h-[136px]" />
        </>
    );
}

function IconBtn({ label, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-sand transition-colors cursor-pointer group"
        >
            <span className="text-ink group-hover:text-brass-600 transition-colors">{children}</span>
            <span className="text-[10px] text-muted group-hover:text-brass-600 hidden sm:block">{label}</span>
        </button>
    );
}

function DropdownItem({ icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-left ${danger ? 'text-error hover:bg-error-bg' : 'text-body hover:bg-sand hover:text-ink'}`}
        >
            <span>{icon}</span>{label}
        </button>
    );
}

function DrawerLink({ to, label, icon, active, badge }) {
    return (
        <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-brass-50 text-brass-700 border border-brass-200' : 'text-body hover:bg-sand hover:text-ink'}`}>
            <span className="text-base">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && <span className="bg-rust-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{badge}</span>}
        </Link>
    );
}

function SearchIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function StoreIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h1.5a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39-9.483c.02.05.028.1.028.148v.002a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75v-.002c0-.05.009-.099.028-.148m0 0a3.75 3.75 0 00-7.5 0m7.5 0a3.75 3.75 0 01-7.5 0M3.124 9.483a.75.75 0 01.028.148v.002A.75.75 0 012.4 10.383H2.25a.75.75 0 01-.75-.75v-.002c0-.05.009-.099.028-.148a3.75 3.75 0 017.5 0" />
        </svg>
    );
}

function WishlistIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}

function AccountIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function CartIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.876-4.706 2.25-7.187a1.125 1.125 0 00-1.187-1.263H5.14M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    );
}
