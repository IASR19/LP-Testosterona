const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixa paths absolutos internos com o basePath do Next.js (`/testosterona`). */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  return `${basePath}${path}`;
}
