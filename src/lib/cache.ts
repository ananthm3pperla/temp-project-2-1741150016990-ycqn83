// Memory cache for frequent data
export class MemoryCache<T> {
  private cache: Map<string, { data: T; timestamp: number }>;
  private maxAge: number;

  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Local storage cache
export class StorageCache {
  private prefix: string;

  constructor(prefix = 'hi-bridge-') {
    this.prefix = prefix;
  }

  set(key: string, data: any, ttl: number = 3600000) { // 1 hour default
    const item = {
      data,
      expires: Date.now() + ttl
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  get(key: string): any {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;

    const { data, expires } = JSON.parse(item);
    if (Date.now() > expires) {
      localStorage.removeItem(this.prefix + key);
      return null;
    }

    return data;
  }

  remove(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Session storage cache
export class SessionCache {
  private prefix: string;

  constructor(prefix = 'hi-bridge-') {
    this.prefix = prefix;
  }

  set(key: string, data: any) {
    sessionStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  get(key: string): any {
    const item = sessionStorage.getItem(this.prefix + key);
    return item ? JSON.parse(item) : null;
  }

  remove(key: string) {
    sessionStorage.removeItem(this.prefix + key);
  }

  clear() {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => sessionStorage.removeItem(key));
  }
}