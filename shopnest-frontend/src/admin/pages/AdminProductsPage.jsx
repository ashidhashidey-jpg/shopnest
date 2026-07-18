import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../redux/slices/productSlice';
import { resolveImageUrl, formatCurrency } from '../../utils/helpers';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import ProductFormModal from '../components/ProductFormModal';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, actionLoading } = useSelector((state) => state.products);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, formData })).unwrap();
        toast.success('Product updated');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product added');
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Could not save product');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(deleteTarget._id)).unwrap();
      toast.success('Product deleted');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Could not delete product');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-plum">Products</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-plum text-cream px-5 py-2.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />}

      {!error && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream text-left text-plum-soft text-xs uppercase tracking-wider">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product._id} className="border-b border-cream last:border-0 hover:bg-cream/30">
                    <td className="px-5 py-4 flex items-center gap-3">
                      <img
                        src={resolveImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-cream shrink-0"
                        onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                      />
                      <span className="text-plum font-medium truncate max-w-[200px]">{product.name}</span>
                    </td>
                    <td className="px-5 py-4 text-plum-soft">{product.category}</td>
                    <td className="px-5 py-4 text-plum">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4">
                      <span className={product.stock <= 0 ? 'text-coral' : 'text-plum-soft'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-plum-soft hover:text-gold p-1.5"
                        aria-label="Edit"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="text-plum-soft hover:text-coral p-1.5"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <p className="text-center text-plum-soft py-12">No products yet. Add your first one.</p>
          )}
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          submitting={actionLoading}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display text-xl text-plum mb-2">Delete Product?</h3>
            <p className="text-sm text-plum-soft mb-6">
              This will permanently remove "{deleteTarget.name}". This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-gold/30 text-plum py-2.5 rounded-full text-sm hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-coral text-white py-2.5 rounded-full text-sm hover:bg-coral/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
