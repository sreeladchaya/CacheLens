package com.example.demo.cache;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cache")
@CrossOrigin(origins = "http://localhost:5173")
public class CacheController {

    private final CacheService cacheService;

    public CacheController(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    // GET cache value
    @GetMapping("/{key}")
    public Map<String, Object> get(@PathVariable String key) {
        return cacheService.get(key);
    }

    // PUT cache value
    @PutMapping("/{key}")
    public Map<String, Object> put(
            @PathVariable String key,
            @RequestBody Map<String, Object> request) {

        String value = String.valueOf(request.get("value"));

        long ttl = Long.parseLong(
                String.valueOf(request.getOrDefault("ttl", 30000))
        );

        return cacheService.put(key, value, ttl);
    }

    // Get cache statistics
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return cacheService.getStats();
    }

    // Change cache policy
    @PostMapping("/policy")
    public Map<String, String> policy(
            @RequestParam String value) {

        cacheService.setPolicy(value);

        return Map.of(
                "policy", value.toUpperCase()
        );
    }

    // Clear cache
    @DeleteMapping("/clear")
    public Map<String, String> clear() {
        cacheService.clear();

        return Map.of(
                "status", "Cache cleared"
        );
    }
}