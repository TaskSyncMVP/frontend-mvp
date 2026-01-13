import type { 
  User, 
  UpdateProfileData, 
  UpdateProfileResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData 
} from '@/entities/user/types';

describe('User Types', () => {
  describe('User interface', () => {
    it('should have required properties', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 4,
        createdAt: '2024-01-01T00:00:00Z'
      };

      expect(user.id).toBe('1');
      expect(user.email).toBe('test@test.com');
      expect(user.workInterval).toBe(25);
      expect(user.breakInterval).toBe(5);
      expect(user.intervalsCount).toBe(4);
      expect(user.createdAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should allow optional properties', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      };

      expect(user.name).toBe('Test User');
      expect(user.updatedAt).toBe('2024-01-02T00:00:00Z');
    });
  });

  describe('UpdateProfileData interface', () => {
    it('should allow partial updates', () => {
      const updateData: UpdateProfileData = {
        name: 'New Name'
      };

      expect(updateData.name).toBe('New Name');
    });

    it('should allow all optional properties', () => {
      const updateData: UpdateProfileData = {
        name: 'New Name',
        password: 'newpassword',
        workInterval: 30,
        breakInterval: 10,
        intervalsCount: 6
      };

      expect(updateData.name).toBe('New Name');
      expect(updateData.password).toBe('newpassword');
      expect(updateData.workInterval).toBe(30);
      expect(updateData.breakInterval).toBe(10);
      expect(updateData.intervalsCount).toBe(6);
    });

    it('should allow empty object', () => {
      const updateData: UpdateProfileData = {};
      expect(updateData).toEqual({});
    });
  });

  describe('UpdateProfileResponse interface', () => {
    it('should contain user property', () => {
      const response: UpdateProfileResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          workInterval: 25,
          breakInterval: 5,
          intervalsCount: 4,
          createdAt: '2024-01-01T00:00:00Z'
        }
      };

      expect(response.user).toBeDefined();
      expect(response.user.id).toBe('1');
    });
  });

  describe('AuthResponse interface', () => {
    it('should contain all required properties', () => {
      const authResponse: AuthResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          workInterval: 25,
          breakInterval: 5,
          intervalsCount: 4,
          createdAt: '2024-01-01T00:00:00Z'
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      expect(authResponse.user).toBeDefined();
      expect(authResponse.accessToken).toBe('access-token');
      expect(authResponse.refreshToken).toBe('refresh-token');
    });
  });

  describe('LoginCredentials interface', () => {
    it('should contain email and password', () => {
      const credentials: LoginCredentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      expect(credentials.email).toBe('test@test.com');
      expect(credentials.password).toBe('password123');
    });
  });

  describe('RegisterData interface', () => {
    it('should extend LoginCredentials', () => {
      const registerData: RegisterData = {
        email: 'test@test.com',
        password: 'password123'
      };

      expect(registerData.email).toBe('test@test.com');
      expect(registerData.password).toBe('password123');
    });

    it('should allow optional name', () => {
      const registerData: RegisterData = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      };

      expect(registerData.name).toBe('Test User');
    });
  });
});