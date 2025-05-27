import { useState, ChangeEvent, FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";

type FormData = {
  fullName: string;
  age: string;
  gender: string;
  email: string;
  phoneNumber: string;
  school: string;
  address: string;
  ParentGuardianNumber: string;
  howDidYouHearAboutUs: string;
  agreementFestivalEmailSms: boolean;
};

const initialFormData: FormData = {
  fullName: "",
  age: "",
  gender: "",
  email: "",
  phoneNumber: "",
  school: "",
  address: "",
  ParentGuardianNumber: "",
  howDidYouHearAboutUs: "",
  agreementFestivalEmailSms: false,
};

export default function JesusFestivalForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (
      !formData.fullName ||
      !formData.age ||
      !formData.gender ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.ParentGuardianNumber ||
      !formData.school ||
      !formData.address ||
      !formData.howDidYouHearAboutUs ||
      !formData.agreementFestivalEmailSms
    ) {
      setSubmitError("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    const body = {
      ...formData,
      age: Number(formData.age),
    };

    console.log("Sending registration data:", body);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Submission failed");
      }

      const { tx_ref } = await response.json();
      setFormData(initialFormData);
      console.log("Registration successful");
      // redirect to payment page with state
      navigate("/payment", {
        state: {
          fullName: formData.fullName,
          email: formData.email,
          amount: 1020, // fixed registration fee
          tx_ref,
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 shadow-xl rounded-2xl">
      <h3 className=" text-center">✍️ Quick Sign-Up — Let’s Get You In!</h3>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="Your name here"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block mb-1 text-sm font-medium">
            Gender
          </label>
          <Select
            value={formData.gender}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, gender: val }))
            }
            required
          >
            <SelectTrigger
              id="gender"
              className="w-full py-5  font-satoshi text-base"
            >
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent className="bg-white/10 text-white font-satoshi backdrop-blur-md">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="e.g. 08012345678"
            name="phoneNumber"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="you@example.com"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Parent/Guardian Number
          </label>
          <input
            type="tel"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="e.g. 08012345678"
            name="ParentGuardianNumber"
            id="ParentGuardianNumber"
            value={formData.ParentGuardianNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder=""
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">School</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded-lg"
            name="school"
            id="school"
            value={formData.school}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="howDidYouHearAboutUs"
            className="block mb-1 text-sm font-medium"
          >
            How did you hear about Jesus Festival?
          </label>
          <Select
            value={formData.howDidYouHearAboutUs}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, howDidYouHearAboutUs: val }))
            }
          >
            <SelectTrigger
              id="howDidYouHearAboutUs"
              aria-required="true"
              className="w-full py-5 text-white font-satoshi text-base"
            >
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent className="bg-white/10 text-white font-satoshi backdrop-blur-md">
              <SelectItem value="School">School</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Church">Church</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mr-2 mt-1"
            name="agreementFestivalEmailSms"
            id="agreementFestivalEmailSms"
            checked={formData.agreementFestivalEmailSms}
            onChange={handleChange}
          />
          <p className="text-sm">
            I agree to receive updates about Jesus Festival via SMS or email.
          </p>
        </div>
        {/* <div className="mt-8 w-fit mx-auto">
          <button
            onClick={() =>
              navigate("/payment", {
                state: {
                  fullName: "Test User",
                  email: "test@example.com",
                  amount: 1020,
                },
              })
            }
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            Test Payment Page
          </button>
        </div> */}

        <button
          type="submit"
          className="w-full disabled:opacity-70 disabled:cursor-not-allowed bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Count Me In!"}
        </button>
        {submitError && (
          <p className="text-red-400 text-sm " aria-live="assertive">
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
}
