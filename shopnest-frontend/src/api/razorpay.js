import axiosInstance from './axiosInstance';

/**
 * Loads the Razorpay checkout script once and caches the promise.
 */
let razorpayScriptPromise = null;
export const loadRazorpayScript = () => {
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
};

/**
 * Creates a Razorpay order via the backend: POST /api/payment/order
 * Backend expects { amount } in rupees and multiplies by 100 internally.
 */
export const createRazorpayOrder = async (amountInRupees) => {
  const { data } = await axiosInstance.post('/payment/order', { amount: amountInRupees });
  return data; // Razorpay order object: { id, amount, currency, ... }
};

/**
 * Verifies payment signature via the backend: POST /api/payment/verify
 */
export const verifyRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const { data } = await axiosInstance.post('/payment/verify', {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return data;
};

/**
 * Full Razorpay checkout flow. Returns a promise that resolves with
 * { razorpay_order_id, razorpay_payment_id, razorpay_signature } on success,
 * or rejects with an Error on failure / user cancellation.
 */
export const openRazorpayCheckout = async ({ amountInRupees, name, email, contact = '' }) => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Could not load Razorpay. Check your internet connection.');
  }

  const order = await createRazorpayOrder(amountInRupees);

  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'ShopNest',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const verification = await verifyRazorpayPayment(response);
          if (verification.message === 'Payment verified successfully') {
            resolve(response);
          } else {
            reject(new Error('Payment verification failed.'));
          }
        } catch (err) {
          reject(new Error(err.response?.data?.message || 'Payment verification failed.'));
        }
      },
      prefill: { name, email, contact },
      theme: { color: '#C9A66B' },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled.')),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => reject(new Error('Payment failed. Please try again.')));
    rzp.open();
  });
};
