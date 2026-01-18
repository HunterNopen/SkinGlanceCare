import React, { useState } from "react";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8000/users/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      setEmail("");
      setMessage("");
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 px-6 py-12 lg:px-16 max-w-7xl mx-auto">
      <section className="flex flex-1 flex-col justify-center text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          Get in touch with us
        </h2>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
          Have a question?
          <br />
          Fill out the form below and our team will get back to you as soon as
          possible.
        </p>
      </section>

      <section className="flex flex-1 flex-col justify-center mt-20">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-8 text-center lg:text-left">
          Contact Us
        </h3>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto lg:mx-0 space-y-6"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm sm:text-base font-medium">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="h-12 sm:h-14 rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#4DA19F]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm sm:text-base font-medium">
              Your message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Write your message here..."
              className="resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#4DA19F]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`h-12 sm:h-14 w-full sm:w-1/2 rounded-xl text-white font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#4DA19F] to-[#334F4F] hover:opacity-90"
              }`}
          >
            {loading ? "Sending..." : "Send message"}
          </button>

          {success && (
            <p className="text-green-600 text-sm sm:text-base font-medium">
              Message sent successfully!
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default Contact;
