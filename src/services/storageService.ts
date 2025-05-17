
export class StorageService {
  static getItem<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return defaultValue;
    
    try {
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error(`Failed to parse stored value for key "${key}":`, error);
      localStorage.removeItem(key);
      return defaultValue;
    }
  }
  
  static setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
