import { Link, useNavigate, useLocation } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName") || "Account";
    const isHome = location.pathname === "/";

    /* scroll detection */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
        navigate("/login");
    };

    /* transparent on home hero, solid after scroll */
    const isTransparent = isHome && !scrolled && !menuOpen;

    const navLinks = [
        { to: "/all-products", label: "Shop" },
        { to: "/myorders", label: "My Orders", authOnly: true },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isTransparent
                    ? 'bg-transparent'
                    : 'bg-paper/95 backdrop-blur-md border-b border-border shadow-sm'
            }`}>

                {/* top announcement bar — only on home, not scrolled */}
                {isHome && !scrolled && (
                    <div className="bg-brass-500 text-white text-xs font-medium text-center py-2 px-4 tracking-wide">
                        🚚 Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code <span className="font-bold">PACK10</span> for 10% off
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ── Logo ── */}
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-brass-500 flex items-center justify-center shadow-md group-hover:bg-brass-400 transition-colors">
                                <span className="text-white font-bold text-sm font-display">P</span>
                            </div>
                            <span className={`font-display text-xl font-bold tracking-tight transition-colors ${
                                isTransparent ? 'text-white' : 'text-ink'
                            }`}>
                                Packverse
                            </span>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ to, label, authOnly }) =>
                                authOnly && !userId ? null : (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        label={label}
                                        active={location.pathname === to}
                                        transparent={isTransparent}
                                    />
                                )
                            )}
                        </div>

                        {/* ── Desktop Right Actions ── */}
                        <div className="hidden md:flex items-center gap-3">
                            {!userId ? (
                                <>
                                    <Link
                                        to="/signup"
                                        className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10 ${
                                            isTransparent ? 'text-white/80 hover:text-white' : 'text-body hover:text-brass-600'
                                        }`}
                                    >
                                        Register
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold bg-brass-500 hover:bg-brass-400 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-brass-900/20 hover:shadow-lg hover:-translate-y-px"
                                    >
                                        Login
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Cart pill */}
                                    <Link to="/cart" className="relative group">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                            isTransparent
                                                ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                                                : 'bg-sand hover:bg-brass-100 text-brass-700 border border-border'
                                        }`}>
                                            <CartIcon className="w-4 h-4" />
                                            <span>Cart</span>
                                            {cartCount > 0 && (
                                                <span className="bg-rust-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* User avatar dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                                isTransparent
                                                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                                                    : 'text-body hover:bg-sand hover:text-ink'
                                            }`}
                                        >
                                            <div className="w-7 h-7 rounded-full bg-brass-500 flex items-center justify-center text-white text-xs font-bold">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="max-w-[80px] truncate">{userName.split(' ')[0]}</span>
                                            <ChevronIcon className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown */}
                                        {dropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-paper border border-border rounded-2xl shadow-xl overflow-hidden">
                                                <div className="px-4 py-3 border-b border-border bg-sand">
                                                    <p className="text-xs text-muted">Signed in as</p>
                                                    <p className="text-sm font-semibold text-ink truncate">{userName}</p>
                                                </div>
                                                <div className="py-1">
                                                    <DropdownItem icon="📦" label="My Orders" onClick={() => { navigate("/myorders"); setDropdownOpen(false); }} />
                                                    <DropdownItem icon="🛒" label="Cart" onClick={() => { navigate("/cart"); setDropdownOpen(false); }} />
                                                    <div className="border-t border-border mt-1 pt-1">
                                                        <DropdownItem icon="🚪" label="Logout" onClick={handleLogout} danger />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Mobile Right ── */}
                        <div className="flex md:hidden items-center gap-2">
                            {userId && (
                                <Link to="/cart" className="relative p-2">
                                    <CartIcon className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-body'}`} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 bg-rust-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    isTransparent ? 'text-white hover:bg-white/10' : 'text-body hover:bg-sand'
                                }`}
                                aria-label="Toggle menu"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <span className={`block h-0.5 rounded-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-ink'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                                    <span className={`block h-0.5 rounded-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-ink'} ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                                    <span className={`block h-0.5 rounded-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-ink'} ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                                </div>
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

            {/* ── Mobile Drawer ── */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
                {/* backdrop */}
                <div
                    className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMenuOpen(false)}
                />
                {/* drawer panel */}
                <div className={`absolute top-0 right-0 h-full w-72 bg-paper shadow-2xl transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* drawer header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-brass-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs font-display">P</span>
                            </div>
                            <span className="font-display text-lg font-bold text-ink">Packverse</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-sand text-muted cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* user info if logged in */}
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

                    {/* nav links */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                        <DrawerLink to="/" label="Home" icon="🏠" active={location.pathname === "/"} />
                        <DrawerLink to="/all-products" label="Shop All" icon="🛍️" active={location.pathname === "/all-products"} />
                        {userId && (
                            <>
                                <DrawerLink to="/myorders" label="My Orders" icon="📦" active={location.pathname === "/myorders"} />
                                <DrawerLink to="/cart" label="Cart" icon="🛒" active={location.pathname === "/cart"}
                                    badge={cartCount > 0 ? cartCount : null}
                                />
                            </>
                        )}
                    </div>

                    {/* bottom auth actions */}
                    <div className="px-4 py-5 border-t border-border">
                        {!userId ? (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)}
                                    className="w-full text-center bg-brass-500 hover:bg-brass-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setMenuOpen(false)}
                                    className="w-full text-center border border-border text-body hover:bg-sand font-medium py-3 rounded-xl text-sm transition-colors">
                                    Create Account
                                </Link>
                            </div>
                        ) : (
                            <button onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-error hover:bg-error-bg font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer border border-error/20">
                                <span>🚪</span> Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* spacer so content doesn't hide under fixed navbar (not on home — hero is full bleed) */}
            {!isHome && <div className="h-16" />}
        </>
    );
}

/* ── Sub-components ── */

function NavLink({ to, label, active, transparent }) {
    return (
        <Link
            to={to}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all group ${
                transparent
                    ? active ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    : active ? 'text-brass-600' : 'text-body hover:text-brass-600 hover:bg-sand'
            }`}
        >
            {label}
            {/* active underline */}
            <span className={`absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-brass-500 transition-all duration-200 ${
                active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
            }`} />
        </Link>
    );
}

function DropdownItem({ icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-left ${
                danger ? 'text-error hover:bg-error-bg' : 'text-body hover:bg-sand hover:text-ink'
            }`}
        >
            <span>{icon}</span>
            {label}
        </button>
    );
}

function DrawerLink({ to, label, icon, active, badge }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-brass-50 text-brass-700 border border-brass-200' : 'text-body hover:bg-sand hover:text-ink'
            }`}
        >
            <span className="text-base">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && (
                <span className="bg-rust-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {badge}
                </span>
            )}
        </Link>
    );
}

function CartIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.876-4.706 2.25-7.187a1.125 1.125 0 00-1.187-1.263H5.14M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    );
}

function ChevronIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}
