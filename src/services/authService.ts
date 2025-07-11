// Mock auth service for demo mode
export class AuthService {
  static async login(email: string, password: string) {
    // Demo login - just return success
    return Promise.resolve({ user: { email }, session: null });
  }

  static async register(email: string, password: string, userData: any) {
    // Demo registration - just return success
    return Promise.resolve({ user: { email, ...userData }, session: null });
  }

  static async logout() {
    // Demo logout
    return Promise.resolve();
  }
}