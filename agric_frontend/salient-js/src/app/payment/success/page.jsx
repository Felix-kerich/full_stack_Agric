"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the paymentId and PayerID from the query parameters
  const paymentId = searchParams.get('paymentId');
  const PayerID = searchParams.get('PayerID');

  useEffect(() => {
    // Check if the necessary parameters are present before proceeding
    if (paymentId && PayerID) {
      savePaymentDetails(paymentId, PayerID);
    } else {
      alert("Missing paymentId or PayerID. Unable to process payment.");
    }
  }, [paymentId, PayerID]);

  const savePaymentDetails = async (paymentId, payerId) => {
    try {
      // Send a POST request to the backend with the required query parameters
      const response = await fetch(`http://localhost:8081/api/paypal/payment/success?paymentId=${paymentId}&PayerID=${payerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Payment details saved successfully.');
        router.push('/account');
        
      } else {
        alert('Payment not approved.');
      }
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Processing Payment...</h1>
    </div>
  );
}
