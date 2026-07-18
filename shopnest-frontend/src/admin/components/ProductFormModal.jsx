import { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets', 'Watches', 'Other'];

const ProductFormModal = ({ initialData, onSubmit, onClose, submitting }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price ?? '',
    category: initialData?.category || CATEGORIES[0],
    stock: initialData?.stock ?? '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.imageUrl || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    if (form.price === '' || Number(form.price) < 0) errs.price = 'Enter a valid price';
    if (form.stock === '' || Number(form.stock) < 0) errs.stock = 'Enter valid stock';
    if (!initialData && !imageFile) errs.image = 'Image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    if (imageFile) formData.append('image', imageFile);

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-plum/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-soft">
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream sticky top-0 bg-white">
          <h2 className="font-display text-xl text-plum">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-plum-soft hover:text-coral">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">
              Image {!initialData && <span className="text-coral">*</span>}
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-6 cursor-pointer hover:bg-cream/50 transition-colors relative overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="flex items-center gap-2 text-plum-soft text-sm">
                  <FiUpload size={16} /> Click to upload
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
            {errors.image && <p className="text-coral text-xs mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${errors.name ? 'border-coral' : 'border-gold/30'}`}
            />
            {errors.name && <p className="text-coral text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none ${errors.description ? 'border-coral' : 'border-gold/30'}`}
            />
            {errors.description && <p className="text-coral text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${errors.price ? 'border-coral' : 'border-gold/30'}`}
              />
              {errors.price && <p className="text-coral text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${errors.stock ? 'border-coral' : 'border-gold/30'}`}
              />
              {errors.stock && <p className="text-coral text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gold/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gold/30 text-plum py-3 rounded-full text-sm uppercase tracking-wider hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-plum text-cream py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
