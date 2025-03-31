package com.hc.lolmatchhistory;

import com.hc.lolmatchhistory.config.RiotApiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // ✅ DB 자동설정 제외 유지
@EnableJpaAuditing
@SpringBootApplication
@EnableConfigurationProperties(RiotApiProperties.class) // ✅ Riot API Key 로드 추가
public class LolApplication {
    public static void main(String[] args) {
        SpringApplication.run(LolApplication.class, args);
    }
}

