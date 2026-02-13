import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { invoke } from "@tauri-apps/api/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function loadImage(url: string) {
  const bytes = await invoke<number[]>("fetch_image", { url });
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}