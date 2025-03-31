package com.hc.lolmatchhistory.controller;

import com.hc.lolmatchhistory.dto.MatchDTO;
import com.hc.lolmatchhistory.service.MatchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
public class MatchHistoryController {
    private final MatchHistoryService matchHistoryService;

    @GetMapping("/{puuid}")
    public ResponseEntity<List<MatchDTO>> getMatchHistory(@PathVariable String puuid) {
        System.out.println("🔍 매치 히스토리 요청: " + puuid);
        List<MatchDTO> matchHistory = matchHistoryService.getMatchHistory(puuid);

        for (MatchDTO match : matchHistory) {
            System.out.println("✅ Match ID: " + match.getMatchId() + " | 승리 여부: " + match.isWin());
        }

        return ResponseEntity.ok(matchHistory);
    }
}
