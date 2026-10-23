"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Images, X } from "lucide-react";
type Asset = { id: string; secureUrl: string; publicId: string; alt?: string; kind?: string };
export function MediaPicker({ onSelect }: { onSelect: (asset: Asset) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [assets,setAssets] = useState<Asset[]>([]);
  const [query,setQuery] = useState("");
  const [message,setMessage] = useState("");
  async function open() {
    dialog.current?.showModal();
    setMessage("Loading images…");
    try {
      const response = await fetch('/api/admin/media', { cache:'no-store' });
      const body = await response.json();
      if (!response.ok) throw new Error();
      setAssets(body.assets.filter((asset: Asset) => asset.kind === 'IMAGE'));
      setMessage(body.assets.length ? "" : "No media yet. Upload your first image to get started.");
    } catch { setMessage("Could not load your library. Check your connection and try again."); }
  }
  return <><button type="button" className="button button-secondary mt-3 text-xs" onClick={open}><Images size={15} /> Choose from library</button><dialog ref={dialog} className="admin-picker" onClick={event => { if (event.target===event.currentTarget) dialog.current?.close(); }}><div className="flex items-center justify-between gap-4"><h2 className="font-medium">Choose an image</h2><button type="button" className="admin-icon-button" onClick={() => dialog.current?.close()} aria-label="Close media library"><X size={20} /></button></div><input className="field mt-4" placeholder="Search by filename or alt text" aria-label="Search image library" value={query} onChange={event=>setQuery(event.target.value)} />{message && <p role="status" className="mt-6 text-sm opacity-60">{message}</p>}<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{assets.filter(asset=>`${asset.publicId} ${asset.alt}`.toLowerCase().includes(query.toLowerCase())).map(asset=><button type="button" key={asset.id} onClick={()=>{onSelect(asset);dialog.current?.close();}} className="overflow-hidden rounded-xl border border-current/15 text-left"><div className="relative aspect-square"><Image src={asset.secureUrl} alt={asset.alt || asset.publicId} fill sizes="200px" className="object-cover" /></div><p className="truncate p-2 text-xs">{asset.alt || asset.publicId.split('/').pop()}</p></button>)}</div></dialog></>;
}
