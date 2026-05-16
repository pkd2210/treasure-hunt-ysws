type CacheEntry<T> = {
    value: T;
}

const cache = new Map<string, CacheEntry<any>>();

export async function getOrSet<T>(
    key: string,
    getter: () => Promise<T> | T,
    ttlM?: number
): Promise<T> {
    const existing = cache.get(key);

    if (existing) {
        return existing.value;
    }

    const value = await getter();

    cache.set(key, { value });

    if (ttlM) {
        setTimeout(() => {
            cache.delete(key);
        }, ttlM);
    }

    return value;
}

export async function getOrSetRelay<T>(
    key: string,
    getter: () => Promise<T>
): Promise<T> {
    const existing = cache.get(key);
    
    if (existing) {
        getter()
            .then((freshValue) => {
                cache.set(key, { value: freshValue });
            })
            .catch((error) => {
                console.error(`Error updating cache for key "${key}":`, error);
            });
        
        return existing.value;
    }

    const value = await getter();
    cache.set(key, { value });
    
    return value;
}

export function clearCache() {
    cache.clear();
}