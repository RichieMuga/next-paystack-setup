'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { getProducts, Product } from '@/models/product';

export default function PaymentPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const products = getProducts();

  const initializePayment = async () => {
    if (!selectedProduct || !email) {
      setError('Please select a product and enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/paystack/initialize', {
        email,
        amount: selectedProduct.price * 100, // Convert to kobo
        productId: selectedProduct.id,
        currency: 'KES'
      });

      // Redirect to Paystack payment page
      window.location.href = response.data.authorization_url;
    } catch (err: any) {
      console.error('Payment initialization failed:', err);
      setError(err.response?.data?.error || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Paystack Payment - Kenya Shillings
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Products */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Select Product</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-white rounded-lg p-6 cursor-pointer border-2 ${
                    selectedProduct?.id === product.id
                      ? 'border-green-500'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{product.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
            <div className="bg-white rounded-lg p-6 shadow">
              {selectedProduct ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <button
                    onClick={initializePayment}
                    disabled={loading || !email}
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : `Pay ${formatCurrency(selectedProduct.price)}`}
                  </button>
                </>
              ) : (
                <p className="text-center text-gray-600">Select a product to continue</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}