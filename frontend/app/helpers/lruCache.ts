const MAX_CACHE_ENTRIES = 3;

export const saveToCache = (key: string, data: any) => {
  const cache = JSON.parse(sessionStorage.getItem("search_cache") || "{}");

  cache[key] = {
    data,
    timestamp: Date.now(),
  };

  // Remove oldest if too many
  const keys = Object.keys(cache);
  if (keys.length > MAX_CACHE_ENTRIES) {
    const oldestKey = keys.sort(
      (a, b) => cache[a].timestamp - cache[b].timestamp,
    )[0];
    delete cache[oldestKey];
  }

  sessionStorage.setItem("search_cache", JSON.stringify(cache));
};

export const loadFromCache = (key: string) => {
  const cache = JSON.parse(sessionStorage.getItem("search_cache") || "{}");
  return cache[key]?.data || null;
};
