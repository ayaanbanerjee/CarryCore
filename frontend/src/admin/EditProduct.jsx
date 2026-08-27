import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";
import { Button, Input, Textarea, Alert, Card, PageLoader } from '../components/ui';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        gender: 'unisex',
        images: '',
        stock: '',
        keyFeatures: '',
        usage: ''
    });
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const loadProduct = async () => {
        try {
            const response = await api.get(`/product/${id}`);
            const data = response.data;
            setForm({
                ...data,
                images: Array.isArray(data.images) ? data.images.join(', ') : data.images || '',
                keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures.join(', ') : data.keyFeatures || ''
            });
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        loadProduct();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.put(`/product/update/${id}`, {
                ...form,
                images: typeof form.images === 'string'
                    ? form.images.split(',').map(img => img.trim()).filter(Boolean)
                    : form.images,
                keyFeatures: typeof form.keyFeatures === 'string'
                    ? form.keyFeatures.split(',').map(f => f.trim()).filter(Boolean)
                    : form.keyFeatures
            });
            navigate('/admin/product');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { name: 'title', label: 'Product Title', placeholder: 'Enter product title' },
        { name: 'price', label: 'Price (₹)', placeholder: 'Enter price' },
        { name: 'category', label: 'Category', placeholder: 'e.g. Backpacks, Duffels' },
        { name: 'stock', label: 'Stock Quantity', placeholder: 'Enter stock quantity' },
        { name: 'images', label: 'Image URLs', placeholder: 'Enter image URLs separated by commas' },
        { name: 'description', label: 'Description', placeholder: 'Enter product description' },
        { name: 'keyFeatures', label: 'Key Features', placeholder: 'e.g. Waterproof, Lightweight' },
        { name: 'usage', label: 'Usage', placeholder: 'e.g. Daily wear, Outdoor activities' },
    ];

    if (!loaded) return <PageLoader label="Loading product..." />;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-ink">Edit Product</h1>
                <p className="text-sm text-muted mt-1">Update the product details below</p>
            </div>

            <Card className="p-6">
                {error && <Alert tone="error" className="mb-4">{error}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map(({ name, label, placeholder }) => (
                        name === 'description' ? (
                            <Textarea
                                key={name}
                                name={name}
                                label={label}
                                value={form[name] || ''}
                                onChange={handleChange}
                                placeholder={placeholder}
                                rows={3}
                            />
                        ) : (
                            <Input
                                key={name}
                                type="text"
                                name={name}
                                label={label}
                                value={form[name] || ''}
                                onChange={handleChange}
                                placeholder={placeholder}
                            />
                        )
                    ))}

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Gender Section</label>
                        <select
                            name="gender"
                            value={form.gender || 'unisex'}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border-strong rounded-lg text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-transparent"
                        >
                            <option value="unisex">Unisex</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate('/admin/product')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={saving}>
                            {saving ? 'Saving...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
