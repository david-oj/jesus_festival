// components/PaymentConfirmation.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaymentData {
  fullName: string;
  email: string;
  amount: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData;

  useEffect(() => {
    if (!paymentData?.fullName || !paymentData?.email) {
      navigate("/"); // Redirect if no data
    }
  }, [paymentData, navigate]);

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
                <p><strong>Name:</strong> {paymentData?.fullName}</p>
                <p><strong>Email:</strong> {paymentData?.email}</p>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/20">
              <h4 className="font-montserrat text-lg mb-4">Event Details</h4>
              <div className="space-y-2 font-satoshi">
                <p><strong>Date:</strong> Saturday, July 12</p>
                <p><strong>Time:</strong> 10:00 AM (Doors open at 9:00 AM)</p>
                <p><strong>Venue:</strong> Loveworld Arena, Christ Embassy Ministry Center, Behind Dove Filling Station, New Garage, Ibadan.</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/20">
              <h4 className="font-montserrat text-lg mb-4">Payment Summary</h4>
              <div className="flex justify-between items-center font-satoshi">
                <span>Registration Fee:</span>
                <span className="text-xl font-bold">₦{paymentData?.amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 space-y-4">
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-montserrat font-semibold"
                onClick={() => {
                  // Add your payment gateway trigger here
                  console.log("Initiating payment...");
                }}
              >
                Confirm & Pay Now
              </button>
              
              <p className="text-center text-sm font-satoshi text-white/80">
                Secure payment processing powered by [Your Payment Gateway]
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
    </section>
  );
};

export default Payment;