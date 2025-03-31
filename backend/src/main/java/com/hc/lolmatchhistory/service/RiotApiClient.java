package com.hc.lolmatchhistory.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hc.lolmatchhistory.dto.SummonerDTO;
import com.hc.lolmatchhistory.dto.SummonerRankDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class RiotApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${riot.api.key:NOT_CONFIGURED}")
    private String riotApiKey;

    private HttpEntity<String> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Riot-Token", riotApiKey);
        return new HttpEntity<>(headers);
    }

    // puuid 검색
    public String getSummonerByRiotId(String gameName, String tagLine) {
        if ("NOT_CONFIGURED".equals(riotApiKey)) {
            throw new IllegalStateException("Riot API Key가 설정되지 않았습니다. application.properties를 확인하세요.");
        }

        String url = String.format("https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s", gameName, tagLine);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), String.class);
        return response.getBody();
    }

    //puuid로 소환사 정보 반환
    public SummonerDTO getSummonerByPuuid(String puuid) {
        if (puuid == null || puuid.isEmpty()) {
            throw new IllegalArgumentException("Puuid 값이 유효하지 않습니다.");
        }

        String url = String.format("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/%s", puuid);
        System.out.println("🔍 Riot API 요청 (소환사 정보): " + url);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), String.class);
        System.out.println("✅ Riot API 응답 (소환사 정보): " + response.getBody());
        try {
            return objectMapper.readValue(response.getBody(), SummonerDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 역직렬화 오류 (SummonerDTO)", e);
        }
    }

    // summonerId로 랭크 정보 반환
    public SummonerRankDTO getSummonerRank(String summonerId) {
        if (summonerId == null || summonerId.isEmpty()) {
            throw new IllegalArgumentException("Summoner ID 값이 유효하지 않습니다.");
        }

        String url = String.format("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/%s", summonerId);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), String.class);

        try {
            List<SummonerRankDTO> rankInfoList = objectMapper.readValue(response.getBody(), new TypeReference<List<SummonerRankDTO>>() {});
            for (SummonerRankDTO rank : rankInfoList) {
                if ("RANKED_SOLO_5x5".equals(rank.getQueueType())) {
                    System.out.println("처리된 랭크 데이터 : " + rank);
                    return rank;
                }
            }
            return new SummonerRankDTO("Unranked", "", 0, 0, 0);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 역직렬화 오류 (SummonerRankDTO)", e);
        }
    }

}
