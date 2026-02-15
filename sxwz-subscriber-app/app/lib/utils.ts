import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { invoke } from "@tauri-apps/api/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const objectUrlCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

export async function loadImageCached(url: string) {
  if (!url) throw new Error("empty url");

  const cached = objectUrlCache.get(url);
  if (cached) return cached;

  const running = inflight.get(url);
  if (running) return running;

  const p = (async () => {
    const bytes = await invoke<number[]>("fetch_image", { url });
    const blob = new Blob([new Uint8Array(bytes)], { type: "image/jpeg" });
    const objectUrl = URL.createObjectURL(blob);

    objectUrlCache.set(url, objectUrl);
    inflight.delete(url);
    return objectUrl;
  })().catch((e) => {
    inflight.delete(url);
    throw e;
  });

  inflight.set(url, p);
  return p;
}

export function clearImageCache() {
  for (const objectUrl of objectUrlCache.values()) {
    URL.revokeObjectURL(objectUrl);
  }
  objectUrlCache.clear();
  inflight.clear();
}