"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requireSession } from "@/lib/rbac/guards";
import { unstable_update } from "@/lib/auth/auth";
import {
  changeTouristPassword,
  removeTouristAvatar,
  updateTouristAvatar,
  updateTouristName,
} from "@/services/auth.service";

export type ProfileActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  imageUrl?: string | null;
};

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  try {
    const session = await requireSession();
    const result = await updateTouristName(
      session.user.id,
      String(formData.get("name") ?? ""),
    );

    if (!result.ok) {
      return { error: result.error, fieldErrors: result.fieldErrors };
    }

    await unstable_update({ user: { name: result.data.name } });
    revalidatePath("/cuenta");
    revalidatePath("/cuenta/editar-perfil");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function updateAvatarAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  try {
    const session = await requireSession();
    const file = formData.get("avatar");
    if (!(file instanceof File)) {
      return { error: "Selecciona una imagen." };
    }

    const result = await updateTouristAvatar(session.user.id, file);
    if (!result.ok) {
      return { error: result.error };
    }

    await unstable_update({ user: { image: result.data.image } });
    revalidatePath("/", "layout");
    revalidatePath("/cuenta");
    revalidatePath("/cuenta/editar-perfil");
    return { success: true, imageUrl: result.data.image };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function removeAvatarAction(
  _prev: ProfileActionState,
  _formData: FormData,
): Promise<ProfileActionState> {
  try {
    const session = await requireSession();
    const result = await removeTouristAvatar(session.user.id);
    if (!result.ok) {
      return { error: result.error };
    }

    await unstable_update({ user: { image: null } });
    revalidatePath("/", "layout");
    revalidatePath("/cuenta");
    revalidatePath("/cuenta/editar-perfil");
    return { success: true, imageUrl: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function changePasswordAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  try {
    const session = await requireSession();
    const result = await changeTouristPassword(session.user.id, {
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    if (!result.ok) {
      return { error: result.error, fieldErrors: result.fieldErrors };
    }

    revalidatePath("/cuenta");
    revalidatePath("/cuenta/editar-perfil");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}
