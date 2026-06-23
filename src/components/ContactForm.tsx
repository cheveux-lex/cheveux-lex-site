"use client";

import { useState, FormEvent } from "react";
import { createMessage } from "@/lib/supabase/messages";

const servicesList = [
  "Lived-in Color",
  "Blonde Services",
  "Brunette Services",
  "Extensions",
  "Lashes",
  "Cut & Styling",
  "Bridal",
  "Other",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setService("");
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email."); return; }
    if (!message.trim()) { setError("Please enter your message."); return; }

    setLoading(true);
    try {
      await createMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        service: service || undefined,
        message: message.trim(),
      });
      setSuccess(true);
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-[3px] border border-beige/25 bg-offwhite px-4 py-3 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-[3px] border border-beige/25 bg-offwhite px-4 py-3 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full rounded-[3px] border border-beige/25 bg-offwhite px-4 py-3 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Service Interested In</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-[3px] border border-beige/25 bg-offwhite px-4 py-3 text-sm text-charcoal focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
        >
          <option value="">Select a service</option>
          {servicesList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about what you're looking for..."
          rows={5}
          className="w-full rounded-[3px] border border-beige/25 bg-offwhite px-4 py-3 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors resize-y"
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}

      {success && (
        <p className="text-xs font-medium text-green-600">Thank you! Your message has been sent. We&apos;ll get back to you soon.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
