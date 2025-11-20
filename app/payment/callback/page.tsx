'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (reference) {
      verifyPayment(reference);
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await axios.get(`/api/paystack/verify?reference=${reference}`);
      
      if (response.data.status === 'success') {
        setStatus('success');
        setPaymentData(response.data);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus('failed');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-xl">Verifying payment...</p>
          </>
        )}

        {status === 'success' && paymentData && (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <div className="text-left space-y-2 mb-6">
              <p><strong>Amount:</strong> {formatCurrency(paymentData.amount)}</p>
              <p><strong>Reference:</strong> {paymentData.reference}</p>
              <p><strong>Email:</strong> {paymentData.customer.email}</p>
            </div>
            <a
              href="/payment"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Make Another Payment
            </a>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <a
              href="/payment"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  );
}