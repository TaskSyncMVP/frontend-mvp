import * as userExports from '@/entities/user';

describe('User Entity Exports', () => {
  it('should export API functions', () => {
    expect(userExports).toHaveProperty('profileApi');
    expect(userExports).toHaveProperty('authApi');
  });

  it('should export hooks', () => {
    expect(userExports).toHaveProperty('useUpdateProfile');
    expect(userExports).toHaveProperty('useUserProfile');
    expect(userExports).toHaveProperty('useAuthActions');
  });

  it('should have expected API and hook exports', () => {
    const expectedExports = [
      'profileApi',
      'authApi',
      'useUpdateProfile',
      'useUserProfile',
      'useAuthActions'
    ];

    expectedExports.forEach(exportName => {
      expect(userExports).toHaveProperty(exportName);
    });
  });
});