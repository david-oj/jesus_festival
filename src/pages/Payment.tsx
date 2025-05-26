// components/PaymentConfirmation.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";

interface PaymentData {
  fullName: string;
  email: string;
  amount: number;
  tx_ref: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentData?.fullName || !paymentData?.email || !paymentData?.tx_ref) {
      navigate("/"); // Redirect if no data
    }
  }, [paymentData, navigate]);

  const handlePayment = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/make-payment?tx_ref=${paymentData.tx_ref}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: paymentData.amount }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Payment failed");
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tx_ref = params.get("tx_ref");
    const transaction_id = params.get("transaction_id");

    if (tx_ref && transaction_id) {
      fetch(
        `${API_BASE}/payment/verify?tx_ref=${tx_ref}&transaction_id=${transaction_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.student) {
            setShowSuccessModal(true);
          } else {
            setError(data.message);
          }
        })
        .catch((e) => setError(e.message));
    }
  }, []);

  return (
    <section className="max-w-[1536px] mx-auto">
      <div className="md:p-10 p-4">
        <div className="md:p-10 p-6 rounded-2xl text-white backdrop-blur-md border bg-white/10 border-white/50">
          <h3 className="text-center text-2xl font-montserrat font-bold mb-8">
            🎉 Almost There! Confirm Your Jesus Festival Registration
          </h3>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* User Details Section */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/20">
              <h4 className="font-montserrat text-lg mb-4">Your Details</h4>
              <div className="space-y-2 font-satoshi">
                <p>
                  <strong>Name:</strong> {paymentData?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {paymentData?.email}
                </p>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/20">
              <h4 className="font-montserrat text-lg mb-4">Event Details</h4>
              <div className="space-y-2 font-satoshi">
                <p>
                  <strong>Date:</strong> Saturday, July 12
                </p>
                <p>
                  <strong>Time:</strong> 10:00 AM (Doors open at 9:00 AM)
                </p>
                <p>
                  <strong>Venue:</strong> Loveworld Arena, Christ Embassy
                  Ministry Center, Behind Dove Filling Station, New Garage,
                  Ibadan.
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/20">
              <h4 className="font-montserrat text-lg mb-4">Payment Summary</h4>
              <div className="flex justify-between items-center font-satoshi">
                <span>Registration Fee:</span>
                <span className="text-xl font-bold">
                  ₦1000
                </span>
              </div>
              <div className="flex justify-between items-center font-satoshi">
                <span>charges:</span>
                <span className="text-xl font-bold">
                  ₦20
                </span>
              </div>
              <div className="flex justify-between items-center font-satoshi">
                <span>Total:</span>
                <span className="text-xl font-bold">₦{paymentData?.amount}</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 space-y-4">
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-montserrat font-semibold"
                onClick={handlePayment}
              >
                Confirm & Pay Now
              </button>

              <p className="text-center text-sm font-satoshi text-white/80">
                Secure payment processing powered by Flutterwave
              </p>

              <div className="text-center mt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-sm text-white/70 hover:text-white transition underline"
                >
                  ← Return to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 p-8 mx-4 rounded-2xl border border-white/20  max-w-md text-center">
            <h3 className="text-2xl font-montserrat mb-4">
              🎉 Registration Complete!
            </h3>
            <p className="font-satoshi mb-6">
              Thank you for registering for Jesus Festival! A confirmation email
              has been sent to{" "}
              <span className="text-blue-300">{paymentData?.email}</span>.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payment;
