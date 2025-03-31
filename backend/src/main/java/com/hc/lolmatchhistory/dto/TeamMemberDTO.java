package com.hc.lolmatchhistory.dto;

import lombok.Data;
import java.util.List;

@Data
public class TeamMemberDTO {
    private String summonerName;
    private String tagLine;
    private String championName;
    private int kills;
    private int deaths;
    private int assists;
    private int totalCS;
    private int totalDamageDealtToChampions;
    private int totalDamageTaken;
    private int summoner1Id;
    private int summoner2Id;
    private int primaryRune1;
    private int subRuneStyle;
    private int teamId;

    private List<Integer> items;
}
