package com.hc.lolmatchhistory.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hc.lolmatchhistory.dto.MatchDTO;
import com.hc.lolmatchhistory.dto.TeamMemberDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MatchHistoryService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${riot.api.key:NOT_CONFIGURED}")
    private String riotApiKey;

    private HttpEntity<String> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Riot-Token", riotApiKey);
        return new HttpEntity<>(headers);
    }

    // 🔹 1. 매치 ID 목록 가져오기 (최근 10경기)
    public List<String> getMatchIds(String puuid) {
        String url = String.format(
                "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/%s/ids?queue=420&count=10", puuid
        );

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), String.class);

        try {
            return objectMapper.readValue(response.getBody(), new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 역직렬화 오류 (Match ID 목록)", e);
        }
    }

    // 🔹 2. 매치 상세 정보 가져오기
    public MatchDTO getMatchDetails(String matchId, String puuid) {
        String url = String.format("https://asia.api.riotgames.com/lol/match/v5/matches/%s", matchId);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), String.class);

        try {
            Map<String, Object> rawData = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            return extractMatchData(rawData, puuid);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 역직렬화 오류 (MatchDTO)", e);
        }
    }

    // 🔹 3. 데이터를 MatchDTO로 변환
    private MatchDTO extractMatchData(Map<String, Object> rawData, String puuid) {
        MatchDTO matchDTO = new MatchDTO();
        matchDTO.setMatchId((String) ((Map<String, Object>) rawData.get("metadata")).get("matchId"));

        // 🔹 게임 시간 가져오기
        matchDTO.setGameDuration(((Number) ((Map<String, Object>) rawData.get("info")).get("gameDuration")).longValue());

        List<Map<String, Object>> participants =
                (List<Map<String, Object>>) ((Map<String, Object>) rawData.get("info")).get("participants");

        // participants 데이터 확인을 위한 로그
        System.out.println("Participants Data:");
        for (Map<String, Object> participant : participants) {
            System.out.println("Participant: " + participant);
            System.out.println("SummonerName: " + participant.get("summonerName"));
            System.out.println("RiotIdTagline: " + participant.get("riotIdTagline"));
            System.out.println("------------------------");
        }

        List<TeamMemberDTO> teamMembers = new ArrayList<>();

        // 🔹 현재 플레이어의 팀 ID 찾기
        int playerTeamId = -1;
        for (Map<String, Object> participant : participants) {
            if (puuid.equals(participant.get("puuid"))) {
                playerTeamId = ((Number) participant.get("teamId")).intValue();
                break;
            }
        }

        // 🔹 현재 플레이어의 팀 승리 여부 가져오기
        List<Map<String, Object>> teams = (List<Map<String, Object>>) ((Map<String, Object>) rawData.get("info")).get("teams");
        for (Map<String, Object> team : teams) {
            if (((Number) team.get("teamId")).intValue() == playerTeamId) {
                matchDTO.setWin((boolean) team.get("win"));
                break;
            }
        }

        // 🔹 같은 팀의 총 킬 계산
        int teamTotalKills = 0;
        for (Map<String, Object> participant : participants) {
            if (((Number) participant.get("teamId")).intValue() == playerTeamId) {
                teamTotalKills += ((Number) participant.get("kills")).intValue();
            }
        }
        matchDTO.setTeamTotalKills(teamTotalKills);

        for (Map<String, Object> participant : participants) {
            TeamMemberDTO memberDTO = new TeamMemberDTO();
            memberDTO.setSummonerName((String) participant.get("riotIdGameName"));
            memberDTO.setTagLine((String) participant.get("riotIdTagline"));
            memberDTO.setChampionName((String) participant.get("championName"));
            memberDTO.setKills(((Number) participant.get("kills")).intValue());
            memberDTO.setDeaths(((Number) participant.get("deaths")).intValue());
            memberDTO.setAssists(((Number) participant.get("assists")).intValue());
            memberDTO.setTotalCS(((Number) participant.get("totalMinionsKilled")).intValue());
            memberDTO.setTotalDamageDealtToChampions(((Number) participant.get("totalDamageDealtToChampions")).intValue());
            memberDTO.setTotalDamageTaken(((Number) participant.get("totalDamageTaken")).intValue());
            memberDTO.setSummoner1Id(((Number) participant.get("summoner1Id")).intValue());
            memberDTO.setSummoner2Id(((Number) participant.get("summoner2Id")).intValue());
            memberDTO.setTeamId(((Number) participant.get("teamId")).intValue());

            // 🔹 룬 정보 저장 (메인 룬 첫 번째 + 서브 룬 스타일만)
            Map<String, Object> perks = (Map<String, Object>) participant.get("perks");
            List<Map<String, Object>> styles = (List<Map<String, Object>>) perks.get("styles");

            // 메인 룬 첫 번째 저장
            List<Map<String, Object>> primarySelections = (List<Map<String, Object>>) styles.get(0).get("selections");
            memberDTO.setPrimaryRune1(((Number) primarySelections.get(0).get("perk")).intValue());

            // 서브 룬 스타일 저장
            memberDTO.setSubRuneStyle(((Number) styles.get(1).get("style")).intValue());

            teamMembers.add(memberDTO);

            // 🔹 본인 데이터 저장
            if (puuid.equals(participant.get("puuid"))) {
                matchDTO.setChampionName(memberDTO.getChampionName());
                matchDTO.setKills(memberDTO.getKills());
                matchDTO.setDeaths(memberDTO.getDeaths());
                matchDTO.setAssists(memberDTO.getAssists());
                matchDTO.setTotalCS(memberDTO.getTotalCS());
                matchDTO.setTotalDamageDealtToChampions(memberDTO.getTotalDamageDealtToChampions());
                matchDTO.setTotalDamageTaken(memberDTO.getTotalDamageTaken());
                matchDTO.setSummoner1Id(memberDTO.getSummoner1Id());
                matchDTO.setSummoner2Id(memberDTO.getSummoner2Id());
                matchDTO.setPrimaryRune1(memberDTO.getPrimaryRune1());
                matchDTO.setSubRuneStyle(memberDTO.getSubRuneStyle());

                List<Integer> items = new ArrayList<>();
                for (int i = 0; i <= 6; i++) {
                    items.add(((Number) participant.get("item" + i)).intValue());
                }
                matchDTO.setItems(items);
            }
        }

        // 🔹 팀원 리스트 저장
        matchDTO.setTeamMembers(teamMembers);

        return matchDTO;
    }

    // 🔹 4. 최근 10개의 솔로 랭크 매치 정보 가져오기
    public List<MatchDTO> getMatchHistory(String puuid) {
        List<String> matchIds = getMatchIds(puuid);
        List<MatchDTO> matchHistory = new ArrayList<>();

        for (String matchId : matchIds) {
            MatchDTO match = getMatchDetails(matchId, puuid);
            matchHistory.add(match);
        }
        return matchHistory;
    }
}
