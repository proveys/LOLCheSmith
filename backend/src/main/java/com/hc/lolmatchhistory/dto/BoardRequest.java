package com.hc.lolmatchhistory.dto;

import lombok.Data;

@Data
public class BoardRequest {
    private String title;
    private String content;
    private String imageUrl;
}
