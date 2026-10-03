package com.example.demo.cache;

public class CacheEntry {

    private String key;
    private String value;
    private long expiryTime;
    private int frequency;
    private long lastAccessTime;

    public CacheEntry(String key, String value, long ttl) {
        this.key = key;
        this.value = value;
        this.expiryTime = System.currentTimeMillis() + ttl;
        this.frequency = 1;
        this.lastAccessTime = System.currentTimeMillis();
    }

    public String getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public long getExpiryTime() {
        return expiryTime;
    }

    public int getFrequency() {
        return frequency;
    }

    public long getLastAccessTime() {
        return lastAccessTime;
    }

    public void incrementFrequency() {
        frequency++;
    }

    public void updateLastAccessTime() {
        lastAccessTime = System.currentTimeMillis();
    }

    public boolean isExpired() {
        return System.currentTimeMillis() >= expiryTime;
    }
}