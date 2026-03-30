import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin } from "lucide-react";
import { sendContactMessage } from "../lib/contact";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "" // honeypot anti-spam
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        subject: "Message from portfolio contact form",
        message: form.message
      });

      setSuccess("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        message: "",
        website: ""
      });
    } catch (err: any) {
      setError(err?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-16"
    >
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Get in touch
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          I&apos;m always open to discussing project or partnership
          opportunities.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <p className="text-gray-500 mb-2">Drop me a line anytime.</p>
              <a
                href="mailto:arthurwiriansyah@gmail.com"
                className="text-black font-medium hover:underline decoration-1 underline-offset-4"
              >
                arthurwiriansyah@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Location</h3>
              <p className="text-gray-500">Based in Batam, Indonesia.</p>
              <p className="text-gray-500">
                Currently Working at PT Sat Nusapersada Tbk.
              </p>
            </div>
          </div>
        </div>

        <form
          className="space-y-6 bg-gray-50 p-8 rounded-3xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
              placeholder="How can I help you?"
              required
            />
          </div>

          {/* Honeypot anti-spam */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-sm text-green-600 font-medium">{success}</p>
          )}

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
