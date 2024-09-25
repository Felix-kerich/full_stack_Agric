import Link from 'next/link';

export default function PaymentChoice() {
    return (
      <div className="flex space-x-4 mt-6">
        {/* Mpesa Payment Button */}
        <Link
          href="/make-mpesa-payment"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Make Mpesa Payment
        </Link>
  
        {/* Paypal Payment Button */}
        <Link
          href="/make-paypal-payment"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Make Paypal Payment
        </Link>
      </div>
    );
  }
  