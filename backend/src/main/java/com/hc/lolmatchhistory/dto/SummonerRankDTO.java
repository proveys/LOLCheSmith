package com.hc.lolmatchhistory.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SummonerRankDTO {
    private String queueType;
    private String tier;
    private String rank;
    private int leaguePoints;
    private int wins;
    private int losses;
    private double winRate;

    public SummonerRankDTO() {} // 기본 생성자

    public SummonerRankDTO(String tier, String rank, int leaguePoints, int wins, int losses) {
        this.queueType = "RANKED_SOLO_5x5";
        this.tier = tier;
        this.rank = rank;
        this.leaguePoints = leaguePoints;
        this.wins = wins;
        this.losses = losses;
        this.winRate = calculateWinRate();
    }
    private double calculateWinRate() {
        if (wins + losses > 0) {
            double rawWinRate = (wins / (double) (wins + losses)) * 100;
            BigDecimal roundedWinRate = new BigDecimal(rawWinRate).setScale(1, RoundingMode.HALF_UP);
            return roundedWinRate.stripTrailingZeros().doubleValue(); // 불필요한 .0제거
        }
        return 0.0;
    }

    // 오류 해결을 위한 메서드 (승률이 0.0으로 나와서 승,패가 변경되면 자동 업데이트)
    public void setWins(int wins) {
        this.wins = wins;
        this.winRate = calculateWinRate();
    }

    //패
    public void setLosses(int losses) {
        this.losses = losses;
        this.winRate = calculateWinRate();
    }
}
