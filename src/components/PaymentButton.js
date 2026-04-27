// components/PaymentButton.js
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard } from 'lucide-react';

export default function PaymentButton({ amount, email, passengerData, flightData, keyDetails }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Initializing secure payment...');
    
    try {
      // Log what we're sending
      // console.log('Sending to payment API:', {
      //   email,
      //   amount,
      //   passengerData,
      //   flightData,
      //   keyDetails,
      // });

      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount,
          passengerData,
          flightData,
          keyDetails, // Make sure keyDetails is included
        }),
      });

      const data = await response.json();

      if (data.success && data.authorization_url) {
        toast.dismiss(loadingToast);
        toast.success('Redirecting to secure payment page...');
        
        setTimeout(() => {
          window.location.href = data.authorization_url;
        }, 500);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || 'Failed to initialize payment');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-800 hover:to-indigo-800 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay ${amount} Securely
          </>
        )}
      </button>
    </div>
  );
}