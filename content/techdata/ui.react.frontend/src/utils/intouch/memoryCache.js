class MemoryCache {

    constructor() {
      this.cacheContainer = {};
    }

    set(key,data) {
        this.cacheContainer[key] = data
    }

    get(key) {
        return this.cacheContainer[key]
    }
}
export const memoryCache = new MemoryCache();