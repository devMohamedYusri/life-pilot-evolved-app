
import { User } from '@/types/auth';
import { StorageService } from './storageService';

interface UserWithPassword extends User {
  password: string;
}

// Mock user data for development
const mockUsers: UserWithPassword[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password123!',
    avatar: '',
  },
];

export class AuthService {
  private static readonly USER_KEY = 'lifepilot_user';
  private static readonly REGISTERED_USERS_KEY = 'lifepilot_registered_users';
  
  // Get all registered users (including mock users)
  static getRegisteredUsers(): UserWithPassword[] {
    return StorageService.getItem<UserWithPassword[]>(this.REGISTERED_USERS_KEY, mockUsers);
  }
  
  // Save registered users
  static saveRegisteredUsers(users: UserWithPassword[]): void {
    StorageService.setItem(this.REGISTERED_USERS_KEY, users);
  }
  
  // Get current user from storage
  static getCurrentUser(): User | null {
    return StorageService.getItem<User | null>(this.USER_KEY, null);
  }
  
  // Save current user to storage
  static saveCurrentUser(user: User): void {
    StorageService.setItem(this.USER_KEY, user);
  }
  
  // Remove current user from storage
  static removeCurrentUser(): void {
    StorageService.removeItem(this.USER_KEY);
  }
  
  // Verify user credentials
  static async verifyCredentials(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = this.getRegisteredUsers();
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }
  
  // Register a new user
  static async registerUser(firstName: string, lastName: string, email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = this.getRegisteredUsers();
    
    // Check if user already exists
    const userExists = registeredUsers.some(u => u.email === email);
    if (userExists) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: UserWithPassword = {
      id: String(registeredUsers.length + 1),
      firstName,
      lastName,
      email,
      password,
      avatar: '',
    };
    
    // Add to registered users
    const updatedUsers = [...registeredUsers, newUser];
    this.saveRegisteredUsers(updatedUsers);
    
    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  // Process forgot password request
  static async forgotPassword(email: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = this.getRegisteredUsers();
    const userExists = registeredUsers.some(u => u.email === email);
    
    if (!userExists) {
      throw new Error('No account found with that email');
    }
    
    // In a real app, this would send an email with a reset link
    return Promise.resolve();
  }
  
  // Reset user password
  static async resetPassword(token: string, password: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we'd validate the token and update the password
    return Promise.resolve();
  }
}
