package com.hemantkumar.portfolio.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS settings to all endpoints
                .allowedOrigins(
                        "http://localhost:5502", // Allow localhost for development
                        "http://127.0.0.1:5502", // Allow localhost with IP for development
                        "https://hemant-dev.vercel.app", // Allow specific production domains
                        "https://my-portfolio-rf5159ngt-hemantkumar0808s-projects.vercel.app" // Allow specific production domains
                )
                .allowedMethods("GET", "POST", "OPTIONS") // Allow specific HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true) // Allow credentials (cookies, authorization headers, etc.)
                .maxAge(3600); // Cache pre-flight response for 1 hour
    }
}