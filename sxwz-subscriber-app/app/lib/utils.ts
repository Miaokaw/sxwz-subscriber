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

export const biliHeader = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://www.bilibili.com/',
  'Origin': 'https://www.bilibili.com',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

export function getBiliLoginedHeader(Session: string) {
  return {
    ...biliHeader,
    'Cookie': `SESSDATA=${Session}`,
  }
}