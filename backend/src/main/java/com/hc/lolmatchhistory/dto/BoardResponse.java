package com.hc.lolmatchhistory.dto;

import com.hc.lolmatchhistory.entity.Board;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardResponse {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String username; // 작성자 이름
    private LocalDateTime createdAt;

    public BoardResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.imageUrl = board.getImageUrl();
        this.createdAt = board.getCreatedAt();
        this.username = board.getWriter().getUsername(); // 작성자
    }
}
