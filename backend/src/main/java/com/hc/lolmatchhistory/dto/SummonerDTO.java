package com.hc.lolmatchhistory.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SummonerDTO {
    private String id;
    private String accountId;
    private String puuid;
    @JsonProperty("gameName")
    private String gameName;

    @JsonProperty("name")
    private String name;

    @JsonProperty("profileIconId")  // Riot API 응답 필드와 매핑
    private int profileIconId; // profileIconId는 int로 유지

    private long summonerLevel;

    private String profileIconUrl; // 아이콘 URL 저장용 필드 추가

    // profileIconId 값을 기반으로 URL 생성
    public void setProfileIconId(int profileIconId) {
        this.profileIconId = profileIconId;
        this.profileIconUrl = "http://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/" + profileIconId + ".png";
    }
}
