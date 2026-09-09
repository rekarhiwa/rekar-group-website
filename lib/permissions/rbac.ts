import type { UserRole } from "@/types/database";

const roleRank: Record<UserRole, number> = {
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export function hasMinRole(userRole: UserRole, required: UserRole): boolean {
  return roleRank[userRole] >= roleRank[required];
}

export function canManageUsers(role: UserRole): boolean {
  return role === "super_admin";
}

export function canManageSettings(role: UserRole): boolean {
  return role === "super_admin" || role === "admin";
}

export function canEditContent(role: UserRole): boolean {
  return roleRank[role] >= roleRank.editor;
}

export function canUseCustomHtml(role: UserRole): boolean {
  return role === "super_admin";
}
