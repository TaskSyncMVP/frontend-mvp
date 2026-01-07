import type { SettingsFormSchemas } from './settings-form-schemas';
import type { User, UpdateProfileData } from '@/entities/user';

export const buildUpdateProfileData = (
  user: User | null | undefined,
  data: SettingsFormSchemas
): UpdateProfileData => {
  const update: UpdateProfileData = {};

  if (data.name && data.name.trim() && data.name !== user?.name) {
    update.name = data.name.trim();
  }

  if (data.password && data.password.trim()) {
    update.password = data.password.trim();
  }

  return update;
};

export const buildProfileUpdatedMessage = (updateData: UpdateProfileData): string => {
  const fields = Object.keys(updateData);

  if (!fields.length) return 'No changes to save';

  if (fields.length === 1) {
    const field = fields[0];
    const label =
      field === 'name'
        ? 'Name'
        : field === 'password'
        ? 'Password'
        : field.charAt(0).toUpperCase() + field.slice(1);

    return `${label} updated successfully!`;
  }

  return 'Profile updated successfully!';
};


