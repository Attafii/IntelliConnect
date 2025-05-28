'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type UserRole = 'projectManager' | 'deliveryHead' | 'executive' | 'all';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string }[] = [
  { value: 'all', label: 'Default View' },
  { value: 'projectManager', label: 'Project Manager' },
  { value: 'deliveryHead', label: 'Delivery Head' },
  { value: 'executive', label: 'Executive' },
];

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="mb-6 flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
      <label htmlFor="role-switcher" className="text-sm font-medium text-muted-foreground">
        View as:
      </label>
      <Select value={currentRole} onValueChange={(value) => onRoleChange(value as UserRole)}>
        <SelectTrigger className="w-[200px] bg-background hover:bg-muted transition-colors">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}