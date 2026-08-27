import { useNavigate } from 'react-router';
import { useState } from "react";
import api from "../api/axios.js";
import { Button, Input, Textarea, Alert, Card } from '../components/ui';

export default function AddProduct() {
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/product/add', {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                images: form.images.split(',').map(img => img.trim()).filter(Boolean),
                keyFeatures: form.keyFeatures.split(',').map(f => f.trim()).filter(Boolean)
            });
            navigate('/admin/product');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
        } finally {
            setLoading(false);
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

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-ink">Add New Product</h1>
                <p className="text-sm text-muted mt-1">Fill in the details to add a new product</p>
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
                                value={form[name]}
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
                                value={form[name]}
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
                            value={form.gender}
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
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
