import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function avatarPublicPath(userId: string, ext: string) {
  return `/uploads/avatars/${userId}.${ext}`;
}

export async function removeAvatarFiles(userId: string) {
  await mkdir(AVATAR_DIR, { recursive: true });
  for (const ext of Object.values(EXT_BY_TYPE)) {
    try {
      await unlink(path.join(AVATAR_DIR, `${userId}.${ext}`));
    } catch {
      // ignore missing files
    }
  }
}

export async function saveAvatarFile(userId: string, file: File) {
  if (!file || file.size === 0) {
    return { ok: false as const, error: "Selecciona una imagen." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false as const,
      error: "Usa JPG, PNG, WebP o GIF.",
    };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false as const,
      error: "La imagen es demasiado grande (máx. 2 MB).",
    };
  }

  const ext = EXT_BY_TYPE[file.type];
  await mkdir(AVATAR_DIR, { recursive: true });
  await removeAvatarFiles(userId);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(AVATAR_DIR, `${userId}.${ext}`), buffer);

  const url = `${avatarPublicPath(userId, ext)}?v=${Date.now()}`;
  return { ok: true as const, url };
}
