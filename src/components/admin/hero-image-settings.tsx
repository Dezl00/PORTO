"use client";

import { useState } from "react";
import { CloudinaryUploader } from "@/components/admin/cloudinary-uploader";
import { getHeroImage } from "@/lib/home-sections";

export function HeroImageSettings({ content }: { content: Record<string, unknown> | null }) {
  const initial = getHeroImage(content);
  const [image, setImage] = useState<{ id: string; secureUrl: string } | null>(initial.assetId ? { id: initial.assetId, secureUrl: initial.url } : null);

  return (
    <fieldset className="mt-5 rounded-[16px] border border-black/10 p-4 sm:p-5">
      <legend className="px-2 text-sm font-medium">Hero image</legend>
      <p className="mb-4 text-sm leading-6 text-black/55">Optional. Without an image, the title, description, and buttons are centered automatically. On mobile, the image appears above the centered text.</p>
      <CloudinaryUploader label="hero image" value={image?.id} url={image?.secureUrl} onChange={(asset) => setImage(asset ? { id: asset.id, secureUrl: asset.secureUrl } : null)} />
      <input type="hidden" name="imageAssetId" value={image?.id || ""} readOnly />
      <label className="mt-4 block"><span className="mb-1.5 block text-xs text-black/50">Image description (alt text)</span><input name="imageAlt" className="field" defaultValue={initial.alt} maxLength={240} placeholder="Describe the image, or leave empty if decorative" /></label>
      <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="showImage" defaultChecked={initial.showImage} className="h-4 w-4 accent-black" /> Display hero image when one is selected</label>
    </fieldset>
  );
}
