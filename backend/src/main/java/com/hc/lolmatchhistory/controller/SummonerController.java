package com.hc.lolmatchhistory.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hc.lolmatchhistory.dto.SummonerDTO;
import com.hc.lolmatchhistory.dto.SummonerRankDTO;
import com.hc.lolmatchhistory.service.RiotApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/summoner")
@RequiredArgsConstructor
public class SummonerController {
    private final RiotApiClient riotApiClient;

    @GetMapping("/{gameName}/{tagLine}")
    public ResponseEntity<String> getSummoner(@PathVariable String gameName, @PathVariable String tagLine) {
        System.out.println(" 소환사 PUUID 요청: " + gameName + " / " + tagLine);
        String summonerInfo = riotApiClient.getSummonerByRiotId(gameName, tagLine);
        System.out.println(" PUUID 응답: " + summonerInfo);
        return ResponseEntity.ok(summonerInfo);
    }

    @GetMapping("/info/{puuid}")
    public ResponseEntity<SummonerDTO> getSummonerByPuuid(@PathVariable String puuid) {
        System.out.println(" 소환사 정보 요청: " + puuid);
        SummonerDTO summonerInfo = riotApiClient.getSummonerByPuuid(puuid);
        System.out.println(" 소환사 정보 응답: " + summonerInfo);
        return ResponseEntity.ok(summonerInfo);
    }

    @GetMapping("/rank/{summonerId}")
    public ResponseEntity<SummonerRankDTO> getSummonerRank(@PathVariable String summonerId) {
        SummonerRankDTO rankInfo = riotApiClient.getSummonerRank(summonerId);
        return ResponseEntity.ok(rankInfo);
    }


}