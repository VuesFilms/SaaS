import { hasPermission, Roles, PERMISSIONS, type Role, type Permission } from './rbac';

describe('hasPermission', () => {
  it('returns true for owner on all permissions', () => {
    const allPermissions = Object.keys(PERMISSIONS) as Permission[];
    for (const perm of allPermissions) {
      expect(hasPermission(Roles.Owner, perm)).toBe(true);
    }
  });

  it('returns true for writer on script:edit', () => {
    expect(hasPermission(Roles.Writer, 'script:edit')).toBe(true);
  });

  it('returns false for reader on script:edit', () => {
    expect(hasPermission(Roles.Reader, 'script:edit')).toBe(false);
  });

  it('returns false for writer on billing:manage', () => {
    expect(hasPermission(Roles.Writer, 'billing:manage')).toBe(false);
  });

  it('returns true for producer on project:create', () => {
    expect(hasPermission(Roles.Producer, 'project:create')).toBe(true);
  });

  it('returns false for reader on member:manage', () => {
    expect(hasPermission(Roles.Reader, 'member:manage')).toBe(false);
  });

  it('allows all roles to access project:read', () => {
    const allRoles: Role[] = [Roles.Owner, Roles.Producer, Roles.Writer, Roles.Reader];
    for (const role of allRoles) {
      expect(hasPermission(role, 'project:read')).toBe(true);
    }
  });

  it('allows only owner to access member:manage', () => {
    expect(hasPermission(Roles.Owner, 'member:manage')).toBe(true);
    expect(hasPermission(Roles.Producer, 'member:manage')).toBe(false);
    expect(hasPermission(Roles.Writer, 'member:manage')).toBe(false);
    expect(hasPermission(Roles.Reader, 'member:manage')).toBe(false);
  });
});
