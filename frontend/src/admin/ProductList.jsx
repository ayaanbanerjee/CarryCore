import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { Card, EmptyState } from "../components/ui";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadProduct = async () => {
        try {
            const response = await api.get("/product");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/product/delete/${id}`);
            loadProduct();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        loadProduct();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
                    <p className="text-sm text-muted mt-1">{products.length} total products</p>
                </div>
                <Link
                    to="/admin/product/add"
                    className="bg-brass-500 hover:bg-brass-600 text-white text-sm font-semibold py-2 px-5 rounded-lg transition-colors"
                >
                    + Add Product
                </Link>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-14 bg-sand rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState
                        title="No products found"
                        description="Start by adding your first product."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-sand/50 border-b border-border text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                    <th className="py-3 px-5">Image</th>
                                    <th className="py-3 px-5">Title</th>
                                    <th className="py-3 px-5">Category</th>
                                    <th className="py-3 px-5">Price</th>
                                    <th className="py-3 px-5">Stock</th>
                                    <th className="py-3 px-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-sand/30 transition-colors">
                                        <td className="py-3 px-5">
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.title}
                                                className="h-12 w-12 object-cover rounded-lg border border-border"
                                            />
                                        </td>
                                        <td className="py-3 px-5">
                                            <p className="font-medium text-ink line-clamp-1">{product.title}</p>
                                            <p className="text-xs text-muted line-clamp-1 mt-0.5">{product.description}</p>
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className="bg-brass-50 text-brass-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 font-semibold text-ink font-data">₹{product.price}</td>
                                        <td className="py-3 px-5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                                                    className="bg-warning-bg hover:bg-brass-100 text-warning text-xs font-semibold py-1.5 px-3 rounded-lg border border-warning/20 transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="bg-error-bg hover:bg-rust-100 text-error text-xs font-semibold py-1.5 px-3 rounded-lg border border-error/20 transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
