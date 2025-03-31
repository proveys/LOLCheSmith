package com.hc.lolmatchhistory.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "riot.api")
public class RiotApiProperties {
    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @PostConstruct
    public void logKey() {
        if (key == null || key.isEmpty()) {
            System.out.println("❌ [ERROR] Riot API Key is NOT CONFIGURED! 확인 필요!");
        } else {
            System.out.println("✅ Riot API Key Loaded: " + key);
        }
    }
}
