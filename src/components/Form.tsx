import { useState, ChangeEvent, FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type FormData = {
  fullName: string;
  age: string;
  gender: string;
  email: string;
  tel: string;
  schoolGrad?: string;
  churchNameAndLocation?: string;
  talents?: string;
  hearAbout: string;
  emailConsent?: boolean;
};

const initialFormData: FormData = {
  fullName: "",
  age: "",
  gender: "",
  email: "",
  tel: "",
  schoolGrad: "",
  churchNameAndLocation: "",
  talents: "",
  hearAbout: "",
  emailConsent: false,
};

export default function JesusFestivalForm() {
  const navigate = useNavigate();
  const [attendsChurch, setAttendsChurch] = useState("");
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

    try {
      const response = await fetch("/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setFormData(initialFormData);
      // redirect to payment page with state
      navigate("/payment-confirmation", {
        state: {
          fullName: formData.fullName,
          email: formData.email,
          amount: 5000,
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
              <SelectItem value="Prefer not to say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="e.g. 08012345678"
            name="tel"
            id="tel"
            value={formData.tel}
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
            School Graduated From
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded-lg"
            name="schoolGrad"
            id="schoolGrad"
            value={formData.schoolGrad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Do you attend a Christ Embassy church?
          </label>
          <div className="mt-2 space-x-4">
            <label>
              <input
                type="radio"
                name="attend"
                value="yes"
                onChange={() => setAttendsChurch("yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="attend"
                value="no"
                onChange={() => setAttendsChurch("no")}
              />{" "}
              No
            </label>
            <label>
              <input
                type="radio"
                name="attend"
                value="sometimes"
                onChange={() => setAttendsChurch("sometimes")}
              />{" "}
              Sometimes
            </label>
          </div>
        </div>

        {attendsChurch === "yes" && (
          <div>
            <label className="block text-sm font-medium">
              Church name & location
            </label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded-lg"
              placeholder="e.g. CE Lekki - Lagos"
              name="churchNameAndLocation"
              id="churchNameAndLocation"
              value={formData.churchNameAndLocation}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">
            Any talents you’d like to showcase?
          </label>
          <textarea
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="Singing, dancing, poetry… let us know!"
            name="talents"
            id="talents"
            value={formData.talents}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="hearAbout" className="block mb-1 text-sm font-medium">
            How did you hear about Jesus Festival?
          </label>
          <Select
            value={formData.hearAbout}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, hearAbout: val }))
            }
          >
            <SelectTrigger
              id="hearAbout"
              aria-required="true"
              className="w-full py-5 text-white font-satoshi text-base"
            >
              <SelectValue placeholder="Instagram" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 text-white font-satoshi backdrop-blur-md">
              <SelectItem value="Instagram">Instagram</SelectItem>
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
            name="emailConsent"
            id="emailConsent"
            checked={formData.emailConsent}
            onChange={handleChange}
          />
          <p className="text-sm">
            I agree to receive updates about Jesus Festival via SMS or email.
          </p>
        </div>

        <button
          type="submit"
          className="w-full disabled:opacity-70 disabled:cursor-not-allowed bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Count Me In!"}
        </button>
        {submitError && (
          <p className="text-red-400 text-sm mt-2" aria-live="assertive">
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
}
