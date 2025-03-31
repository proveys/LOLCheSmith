package com.hc.lolmatchhistory.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchDTO {
    private String matchId;
    private boolean win;
    private String championName;
    private int kills;
    private int deaths;
    private int assists;
    private long gameDuration;
    private int totalCS;
    private int teamTotalKills;

    private List<Integer> items;

    // 소환사 주문 (스펠)
    private int summoner1Id;
    private int summoner2Id;

    // 룬 정보 (메인 룬 + 보조 룬 계열)
    private int primaryRune;

    private int primaryRuneStyle;
    private int primaryRune1;
    private int primaryRune2;
    private int primaryRune3;
    private int primaryRune4;

    private int subRuneStyle;
    private int subRune1;
    private int subRune2;

    private int totalDamageDealtToChampions;
    private int totalDamageTaken;

    private List<TeamMemberDTO> teamMembers;


}
