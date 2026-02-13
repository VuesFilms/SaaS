export const Roles = {
  Owner: 'owner',
  Producer: 'producer',
  Writer: 'writer',
  Reader: 'reader',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const PERMISSIONS = {
  'project:create': ['owner', 'producer'],
  'project:read': ['owner', 'producer', 'writer', 'reader'],
  'project:update': ['owner', 'producer', 'writer'],
  'project:delete': ['owner'],
  'script:edit': ['owner', 'producer', 'writer'],
  'script:read': ['owner', 'producer', 'writer', 'reader'],
  'script:export': ['owner', 'producer', 'writer'],
  'breakdown:edit': ['owner', 'producer', 'writer'],
  'breakdown:read': ['owner', 'producer', 'writer', 'reader'],
  'schedule:edit': ['owner', 'producer'],
  'schedule:read': ['owner', 'producer', 'writer', 'reader'],
  'budget:edit': ['owner', 'producer'],
  'budget:read': ['owner', 'producer'],
  'task:edit': ['owner', 'producer', 'writer'],
  'task:read': ['owner', 'producer', 'writer', 'reader'],
  'member:manage': ['owner'],
  'billing:manage': ['owner'],
  'settings:manage': ['owner', 'producer'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission] as readonly string[];
  return allowed.includes(role);
}
