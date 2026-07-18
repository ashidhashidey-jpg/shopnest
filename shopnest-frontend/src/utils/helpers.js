const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_ROOT = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Resolves a product imageUrl coming from the backend.
 * Backend stores either a full URL (seeded data) or a relative
 * path like "/uploads/filename.jpg" (uploaded via multer).
 */
export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-product.svg';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${SERVER_ROOT}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncate = (text, max = 80) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
};
