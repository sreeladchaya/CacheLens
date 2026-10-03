package com.example.demo.cache;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CacheService {

    private final Map<String, CacheEntry> cache = new HashMap<>();

    private int capacity = 10;

    private long hits = 0;
    private long misses = 0;
    private long evictions = 0;

    private String policy = "LRU";

    // GET
    public synchronized Map<String, Object> get(String key) {

        CacheEntry entry = cache.get(key);

        // MISS
        if (entry == null || entry.isExpired()) {

            if (entry != null) {
                cache.remove(key);
            }

            misses++;

            return Map.of(
                    "key", key,
                    "status", "MISS"
            );
        }

        // HIT
        hits++;

        entry.incrementFrequency();
        entry.updateLastAccessTime();

        return Map.of(
                "key", key,
                "value", entry.getValue(),
                "status", "HIT",
                "frequency", entry.getFrequency()
        );
    }

    // PUT
    public synchronized Map<String, Object> put(
            String key,
            String value,
            long ttl) {

        if (cache.size() >= capacity && !cache.containsKey(key)) {
            evict();
        }

        CacheEntry entry = new CacheEntry(key, value, ttl);

        cache.put(key, entry);

        return Map.of(
                "key", key,
                "value", value,
                "status", "INSERTED"
        );
    }

    // LRU / LFU eviction
    private void evict() {

        if (cache.isEmpty()) {
            return;
        }

        String keyToRemove = null;

        if (policy.equals("LFU")) {

            int lowestFrequency = Integer.MAX_VALUE;

            for (CacheEntry entry : cache.values()) {

                if (entry.getFrequency() < lowestFrequency) {
                    lowestFrequency = entry.getFrequency();
                    keyToRemove = entry.getKey();
                }
            }

        } else {

            long oldestTime = Long.MAX_VALUE;

            for (CacheEntry entry : cache.values()) {

                if (entry.getLastAccessTime() < oldestTime) {
                    oldestTime = entry.getLastAccessTime();
                    keyToRemove = entry.getKey();
                }
            }
        }

        if (keyToRemove != null) {
            cache.remove(keyToRemove);
            evictions++;
        }
    }

    // Statistics
    public synchronized Map<String, Object> getStats() {

        double hitRate = 0;

        long total = hits + misses;

        if (total > 0) {
            hitRate = ((double) hits / total) * 100;
        }

        return Map.of(
                "size", cache.size(),
                "capacity", capacity,
                "hits", hits,
                "misses", misses,
                "hitRate", hitRate,
                "evictions", evictions,
                "policy", policy
        );
    }

    // Change LRU / LFU
    public synchronized void setPolicy(String policy) {

        if (policy.equalsIgnoreCase("LRU")
                || policy.equalsIgnoreCase("LFU")) {

            this.policy = policy.toUpperCase();
        }
    }

    // Clear cache
    public synchronized void clear() {

        cache.clear();

        hits = 0;
        misses = 0;
        evictions = 0;
    }
}