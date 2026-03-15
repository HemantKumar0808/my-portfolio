package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.service.RateLimitService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitServiceImpl implements RateLimitService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket createNewBucket(){
        Bandwidth limit = Bandwidth.simple(2, java.time.Duration.ofMinutes(1));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public Bucket resolveBucket(String ip) {
        return buckets.computeIfAbsent(ip, k -> createNewBucket());
    }
}
