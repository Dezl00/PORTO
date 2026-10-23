"use client";

import { ChangeEvent, useId, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";

type UploadedAsset = { id: string; secureUrl: string; publicId: string };

export function CloudinaryUploader({ value, onChange, label = "cover" }: { value?: string | null; url?: string | null; onChange: (asset: UploadedAsset | null) => void; label?: string }) {
  const uploadId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type) || file.size > 20 * 1024 * 1024) { setState("error"); setMessage("Choose a JPG, PNG, WebP or AVIF image smaller than 20 MB."); return; }
    if (state === "uploading") return;
    setState("uploading");
    setMessage("");
    try {
      const signing = await fetch("/api/cloudinary/sign", { method: "POST" });
      const signature = (await signing.json()) as { signature?: string; timestamp?: number; folder?: string; cloudName?: string; apiKey?: string; message?: string };
      if (!signing.ok || !signature.signature || !signature.cloudName || !signature.apiKey || !signature.timestamp || !signature.folder) throw new Error("Image uploads are unavailable. Check your workspace setup and try again.");

      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("api_key", signature.apiKey);
      uploadData.set("timestamp", String(signature.timestamp));
      uploadData.set("folder", signature.folder);
      uploadData.set("signature", signature.signature);
      const uploadResult = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, { method: "POST", body: uploadData });
      const uploaded = (await uploadResult.json()) as Record<string, unknown>;
      if (!uploadResult.ok) throw new Error(typeof uploaded.error === "object" && uploaded.error && "message" in uploaded.error ? String((uploaded.error as { message: string }).message) : "Upload failed.");

      const saved = await fetch("/api/cloudinary/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: uploaded.asset_id,
          publicId: uploaded.public_id,
          secureUrl: uploaded.secure_url,
          format: uploaded.format,
          width: uploaded.width,
          height: uploaded.height,
          bytes: uploaded.bytes,
        }),
      });
      const asset = (await saved.json()) as { asset?: UploadedAsset; message?: string };
      if (!saved.ok || !asset.asset) throw new Error(asset.message || "The file uploaded but could not be recorded.");
      onChange(asset.asset);
      setMessage("Image uploaded.");
      setState("idle");
    } catch (error) {
      setState("error");
      const detail = error instanceof Error ? error.message : "Upload failed.";
      setMessage(/cloudinary|neon|prisma|postgres/i.test(detail) ? "Image upload failed. Please try again later." : detail);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[16px] border border-dashed border-black/20 bg-[#fafaf9] p-4">
      {value ? <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-3 py-2"><span className="min-w-0 truncate text-xs text-black/55">Selected {label}</span><button type="button" onClick={() => { onChange(null); setMessage(""); }} className="shrink-0 rounded-full border border-black/15 p-1 text-black/60 hover:bg-black hover:text-white" aria-label={`Remove ${label}`}><X size={13} /></button></div> : null}
      <input ref={inputRef} onChange={upload} accept="image/jpeg,image/png,image/webp,image/avif" disabled={state === "uploading"} type="file" className="sr-only" id={uploadId} />
      <label htmlFor={uploadId} className="flex cursor-pointer items-center justify-between gap-4">
        <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white">{state === "uploading" ? <LoaderCircle className="animate-spin" size={16} /> : <ImagePlus size={16} strokeWidth={1.5} />}</span><span><span className="block text-sm font-medium">{value ? `Replace ${label}` : `Upload ${label}`}</span><span className="mt-0.5 block text-xs text-black/45">JPG, PNG, WebP or AVIF</span></span></span>
        <span className="text-xs underline underline-offset-4">Browse</span>
      </label>
      <MediaPicker onSelect={asset => { onChange(asset); setMessage("Image selected from library."); }} />
      {message ? <p className={`mt-3 text-xs ${state === "error" ? "text-red-700" : "text-black/55"}`}>{message}</p> : null}
    </div>
  );
}
