package com.hemantkumar.portfolio.service;

import io.github.bucket4j.Bucket;

public interface RateLimitService {
    Bucket resolveBucket(String ip);

}
