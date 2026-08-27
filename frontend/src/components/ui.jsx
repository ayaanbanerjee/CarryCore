import { Link } from "react-router";

/* ------------------------------------------------------------------
   Packverse shared UI kit.
   Keep these primitives boring and consistent — every page composes
   its layout from these instead of inventing new button/card styles.
------------------------------------------------------------------ */

const BUTTON_VARIANTS = {
  primary:
    "bg-brass-500 text-white hover:bg-brass-600 active:bg-brass-700 shadow-sm shadow-brass-900/10 disabled:bg-brass-300",
  secondary:
    "bg-forest-600 text-white hover:bg-forest-700 active:bg-forest-800 disabled:bg-forest-300",
  outline:
    "bg-transparent border border-border-strong text-ink hover:border-brass-400 hover:text-brass-600 disabled:opacity-50",
  ghost:
    "bg-transparent text-body hover:bg-sand disabled:opacity-50",
  danger:
    "bg-error text-white hover:bg-rust-600 disabled:bg-rust-100 disabled:text-rust-400",
};

const BUTTON_SIZES = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-lg",
  lg: "text-base px-6 py-3 rounded-xl",
};

export function Button({
  as,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`;
  const Comp = as || "button";
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}

export function IconButton({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer text-muted hover:text-brass-600 hover:bg-sand ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-transparent ${
          error ? "border-error" : "border-border-strong"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-transparent resize-none ${
          error ? "border-error" : "border-border-strong"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-paper border border-border rounded-2xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = "neutral", className = "", children }) {
  const tones = {
    neutral: "bg-sand text-body",
    brass: "bg-brass-50 text-brass-600 border border-brass-200",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    error: "bg-error-bg text-error",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = "" }) {
  return (
    <div
      className={`border-2 border-brass-200 border-t-brass-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="w-9 h-9" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      {icon && <div className="mx-auto mb-4 text-brass-300">{icon}</div>}
      <p className="font-display text-xl font-bold text-ink">{title}</p>
      {description && <p className="text-sm text-muted mt-1.5 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Alert({ tone = "info", children, className = "" }) {
  const tones = {
    success: "bg-success-bg text-success border-success/20",
    error: "bg-error-bg text-error border-error/20",
    warning: "bg-warning-bg text-warning border-warning/20",
    info: "bg-info-bg text-info border-info/20",
  };
  return (
    <div className={`text-sm px-4 py-3 rounded-lg border ${tones[tone]} ${className}`} role="status">
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-500 mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">{title}</h2>
      {subtitle && <p className="text-body mt-2 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

/* Product card used across Home / AllProducts / ProductDetails (related) */
export function ProductCard({ product, onAddToCart, onBuyNow }) {
  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-md hover:border-brass-200 transition-all duration-200">
      <Link to={`/product/${product._id}`} className="block bg-sand">
        <div className="flex items-center justify-center h-44 p-4 overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-3.5 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <p className="text-[11px] text-brass-600 font-semibold uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2 min-h-[2.5em]">
            {product.title}
          </h3>
          <p className="text-base font-bold text-ink mt-1.5 font-data">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </Link>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAddToCart?.(product._id)}
          >
            Add to Cart
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onBuyNow?.(product)}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
