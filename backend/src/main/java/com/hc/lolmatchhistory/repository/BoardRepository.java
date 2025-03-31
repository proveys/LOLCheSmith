package com.hc.lolmatchhistory.repository;

import com.hc.lolmatchhistory.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 최신순 전체 조회
    List<Board> findAllByOrderByCreatedAtDesc();

    // 제목에 특정 키워드가 포함된 게시글 조회 (대소문자 구분 없이)
    List<Board> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}
