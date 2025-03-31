package com.hc.lolmatchhistory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patch_note")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatchNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // 패치노트 제목 (예: 25.06 패치 노트)
    private String date;        // 날짜 (예: 2025.3.19.)

    @Column(length = 200)
    private String description; // 요약 설명

    private String imageUrl;    // 썸네일 이미지 URL
    private String link;        // 원문 링크
}
