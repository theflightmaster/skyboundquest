'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, Home, Plane, RefreshCw, Headphones, AlertCircle, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

function CancelContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    toast.error('Payment was cancelled or failed');
  }, []);

  const getErrorMessage = () => {
    switch (error) {
      case 'missing_reference':
        return 'Invalid payment reference. Please try booking again.';
      case 'payment_failed':
        return 'Your payment could not be processed. Please try again with a different payment method.';
      case 'verification_error':
        return 'We encountered an issue verifying your payment. Please contact support.';
      case 'verification_failed':
        return 'Payment verification failed. Please contact support.';
      default:
        return 'Your payment was not completed. No charges have been made to your account.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-24">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <XCircle className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
                <p className="text-red-100">Your transaction was not completed</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Error Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <p className="text-yellow-800 font-medium">Transaction Status</p>
                  <p className="text-yellow-700 text-sm">{getErrorMessage()}</p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Need Assistance?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition">
                  <Headphones className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="font-medium">24/7 Customer Support</p>
                  <p className="text-sm text-gray-500">support@skyboundquest.com</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition">
                  <RefreshCw className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="font-medium">Try Again</p>
                  <p className="text-sm text-gray-500">No charges were made</p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={16} />
                Common reasons for payment failure:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">• Insufficient funds in your account</li>
                <li className="flex items-center gap-2">• Incorrect card details entered</li>
                <li className="flex items-center gap-2">• Bank declined the transaction for security reasons</li>
                <li className="flex items-center gap-2">• Payment session timed out</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
              >
                <RefreshCw size={18} />
                Try Booking Again
              </Link>
              
              <Link
                href="/flights/search"
                className="flex items-center justify-center gap-2 w-full border-2 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-all font-medium"
              >
                <Plane size={18} />
                Browse More Flights
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                <Home size={18} />
                Return to Homepage
              </Link>
            </div>

            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@skyboundquest.com" className="text-blue-600 hover:underline">
                  support@skyboundquest.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Plane size={32} className="text-blue-600 animate-bounce" />
          </div>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}