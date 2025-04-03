package com.hc.lolmatchhistory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    //  보안 경로 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) //  CSRF 보호 비활성화 (React 프론트와 연동 시 편의)
                .authorizeHttpRequests(auth -> auth
                        //  인증 없이 접근 허용할 경로
                        .requestMatchers(
                                "/summoner/**",        // 소환사 검색 관련 API
                                "/match/**",           // 매치 히스토리 API
                                "/api/member/signup",  // 회원가입
                                "/api/member/login",    // 로그인
                                "/api/api/member/me",       // 로그인여부확임
                                "/api/member/logout",
                                "/api/member/me",
                                "/api/api/member/logout"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/board/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/board").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/board/**").authenticated()

                        //  그 외 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");// 리액트 서버
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }

    //  비밀번호 암호화용 PasswordEncoder Bean 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
