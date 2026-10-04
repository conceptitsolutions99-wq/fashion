"use client";

import { useState } from "react";

export default function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const dark = variant === "dark";

  if (status === "done") {
    return (
      <p
        className={`text-sm ${dark ? "text-ink-100" : "text-ink-700"}`}
        role="status"
      >
        You&rsquo;re on the list — welcome to the club. Check{" "}
        <span className="font-medium">{email}</span> for your 10% code.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
        setStatus(valid ? "done" : "error");
      }}
      className="w-full"
    >
      <div
        className={`flex items-center gap-2 rounded-full border p-1.5 pl-5 transition ${
          dark
            ? "border-white/20 bg-white/5 focus-within:border-white/60"
            : "border-ink-200 bg-white focus-within:border-ink-950"
        }`}
      >
        <label htmlFor={`newsletter-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${variant}`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email"
          className={`w-full bg-transparent text-sm outline-none placeholder:text-ink-400 ${
            dark ? "text-white" : "text-ink-900"
          }`}
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition ${
            dark
              ? "bg-white text-ink-950 hover:bg-brand-500 hover:text-white"
              : "bg-ink-950 text-white hover:bg-brand-600"
          }`}
        >
          Join
        </button>
      </div>
      {status === "error" && (
        <p className={`mt-2 text-xs ${dark ? "text-brand-300" : "text-brand-600"}`} role="alert">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
