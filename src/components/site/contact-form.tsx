"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

const fields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "service", label: "What do you need?", type: "text", required: false },
  { name: "budget", label: "Estimated budget", type: "text", required: false },
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
    const payload = (await response.json()) as { message?: string };
    if (response.ok) {
      form.reset();
      setStatus("success");
      setMessage(payload.message || "Thanks — your message is on its way.");
    } else {
      setStatus("error");
      setMessage(payload.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-5 gap-y-6 sm:grid-cols-2" noValidate>
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-sm font-medium">{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</span>
          <input name={field.name} type={field.type} required={field.required} className="field" />
        </label>
      ))}
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium">Tell me about the project *</span>
        <textarea name="message" required rows={6} className="field resize-y" />
      </label>
      <div className="sm:col-span-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button disabled={status === "sending"} className="button button-primary disabled:cursor-wait disabled:opacity-60" type="submit">
          {status === "sending" ? <LoaderCircle className="animate-spin" size={16} /> : <ArrowRight size={16} />}
          {status === "sending" ? "Sending" : "Send enquiry"}
        </button>
        {message ? <p role="status" className={status === "error" ? "text-sm text-red-700" : "text-sm text-black/60"}>{message}</p> : null}
      </div>
    </form>
  );
}
