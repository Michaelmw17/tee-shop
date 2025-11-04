"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<{
    id: string;
    customer_details: {
      email: string;
      name: string;
    };
    amount_total: number;
    payment_status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      // Clear the cart since order is successful
      clearCart();
      
      // Optionally fetch session details for display
      fetchSessionDetails(sessionId);
    }
  }, [sessionId, clearCart]);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      }
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        
        {loading ? (
          <p className="text-gray-600 mb-6">Loading order details...</p>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase! Your order has been confirmed and you&apos;ll receive an email receipt shortly.
            </p>
            
            {session && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
                <p className="text-sm text-gray-600">Order ID: {sessionId?.slice(-8)}</p>
                <p className="text-sm text-gray-600">Email: {session.customer_details?.email}</p>
                <p className="text-sm text-gray-600">Total: ${(session.amount_total / 100).toFixed(2)}</p>
              </div>
            )}
          </>
        )}

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
          
          <p className="text-sm text-gray-500">
            You can track your order in your Stripe receipt email or contact us for updates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}