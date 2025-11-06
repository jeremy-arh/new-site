// Simple in-memory cache with TTL (Time To Live)
class DataCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  // Generate cache key
  getKey(type, identifier) {
    return `${type}:${identifier}`;
  }

  // Get data from cache
  get(type, identifier) {
    const key = this.getKey(type, identifier);
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Set data in cache
  set(type, identifier, data, ttl = this.defaultTTL) {
    const key = this.getKey(type, identifier);
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      data,
      expiresAt,
      cachedAt: Date.now()
    });
  }

  // Check if data exists in cache and is valid
  has(type, identifier) {
    const key = this.getKey(type, identifier);
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Clear specific cache entry
  clear(type, identifier) {
    const key = this.getKey(type, identifier);
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll() {
    this.cache.clear();
  }

  // Get cache stats (for debugging)
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    this.cache.forEach((item) => {
      if (now > item.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    });

    return {
      total: this.cache.size,
      valid,
      expired
    };
  }
}

// Export singleton instance
export const cache = new DataCache();

