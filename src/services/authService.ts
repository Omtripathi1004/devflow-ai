import { UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-om-tripathi',
    name: 'Om Tripathi',
    email: 'om.tripathi@devflow.ai',
    role: 'Lead AI Architect & Systems Orchestrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    color: '#06B6D4',
    createdAt: '2026-09-01T10:00:00.000Z',
    lastLogin: new Date().toISOString(),
    isLoggedIn: true,
    preferences: {
      theme: 'cyber-dark',
      selectedModel: 'gemini-2.5-flash',
      notifications: true,
    },
  },
  {
    id: 'user-alex-rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@enterprise.io',
    role: 'Principal Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    color: '#8B5CF6',
    createdAt: '2026-09-05T14:30:00.000Z',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    isLoggedIn: false,
    preferences: {
      theme: 'cyber-dark',
      selectedModel: 'gemini-1.5-pro',
      notifications: true,
    },
  },
  {
    id: 'user-elena-rostova',
    name: 'Elena Rostova',
    email: 'elena.r@cloudops.net',
    role: 'DevOps & Site Reliability Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    color: '#10B981',
    createdAt: '2026-09-10T09:15:00.000Z',
    lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(),
    isLoggedIn: false,
    preferences: {
      theme: 'cyber-dark',
      selectedModel: 'gemini-1.5-flash',
      notifications: false,
    },
  },
];

export class AuthService {
  private static STORAGE_KEY_CURRENT = 'devflow_current_user';
  private static STORAGE_KEY_USERS = 'devflow_users_db';

  public static getUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_USERS);
      if (stored) {
        const parsed: UserProfile[] = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  public static saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  public static getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_CURRENT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    const defaultUser = INITIAL_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  public static setCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_CURRENT, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to set current user', e);
    }
  }

  public static switchUser(userId: string): UserProfile {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId) || users[0];
    const updated = {
      ...target,
      lastLogin: new Date().toISOString(),
      isLoggedIn: true,
    };
    const updatedList = users.map((u) => (u.id === target.id ? updated : { ...u, isLoggedIn: false }));
    this.saveUsers(updatedList);
    this.setCurrentUser(updated);
    return updated;
  }

  public static registerUser(name: string, email: string, role: string): UserProfile {
    const users = this.getUsers();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role.trim() || 'Software Engineer',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      color: '#38BDF8',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isLoggedIn: true,
      preferences: {
        theme: 'cyber-dark',
        selectedModel: 'gemini-2.5-flash',
        notifications: true,
      },
    };

    const updatedList = [...users.map((u) => ({ ...u, isLoggedIn: false })), newUser];
    this.saveUsers(updatedList);
    this.setCurrentUser(newUser);
    return newUser;
  }

  public static updateApiKey(apiKey: string): void {
    const current = this.getCurrentUser();
    current.preferences = {
      ...current.preferences,
      geminiApiKey: apiKey.trim(),
    };
    this.setCurrentUser(current);
    const users = this.getUsers();
    const updatedList = users.map((u) => (u.id === current.id ? current : u));
    this.saveUsers(updatedList);
  }
}
