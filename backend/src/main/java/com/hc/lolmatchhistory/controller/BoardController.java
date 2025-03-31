package com.hc.lolmatchhistory.controller;

import com.hc.lolmatchhistory.dto.BoardRequest;
import com.hc.lolmatchhistory.dto.BoardResponse;
import com.hc.lolmatchhistory.entity.Board;
import com.hc.lolmatchhistory.entity.Member;
import com.hc.lolmatchhistory.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpSession;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createBoard(
            @RequestPart("data") BoardRequest boardRequest,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session) {

        var loginMember = (Member) session.getAttribute("loginMember");
        System.out.println("🧪 [1] 로그인 사용자 세션: " + loginMember);

        if (loginMember == null) {
            return ResponseEntity.status(401).body("로그인한 사용자만 작성할 수 있습니다.");
        }

        System.out.println("🧪 [2] 게시글 제목: " + boardRequest.getTitle());
        System.out.println("🧪 [2] 게시글 내용: " + boardRequest.getContent());
        System.out.println("🧪 [3] 이미지 파일: " + (image != null ? image.getOriginalFilename() : "없음"));

        // ✅ 이미지 저장 처리
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                // 👉 프로젝트 루트 경로에 uploads 폴더
                String uploadDir = System.getProperty("user.dir") + "/uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String savedName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                File dest = new File(dir, savedName);
                image.transferTo(dest);

                imageUrl = "/uploads/" + savedName; // 프론트 접근용 경로
                System.out.println("🧪 [3.5] 이미지 저장 완료: " + imageUrl);

            } catch (IOException e) {
                System.out.println("❌ 이미지 저장 실패: " + e.getMessage());
                return ResponseEntity.status(500).body("이미지 업로드 실패");
            }
        }

        System.out.println("🧪 [4] 게시글 저장 직전! imageUrl: " + imageUrl);

        Board saved = boardService.createBoard(boardRequest, loginMember.getEmail(), imageUrl);
        return ResponseEntity.ok(saved);
    }


    // ✅ 게시글 목록 조회 → BoardResponse로 반환
    @GetMapping
    public ResponseEntity<List<BoardResponse>> getBoardList() {
        List<Board> boards = boardService.getBoardList();
        List<BoardResponse> responseList = boards.stream()
                .map(BoardResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // ✅ 검색 → BoardResponse로 반환
    @GetMapping("/search")
    public ResponseEntity<List<BoardResponse>> searchBoards(@RequestParam String keyword) {
        List<Board> boards = boardService.searchBoards(keyword);
        List<BoardResponse> responseList = boards.stream()
                .map(BoardResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // 게시글 하나 조회 (상세 페이지용)
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoardById(@PathVariable Long id) {
        Board board = boardService.getBoard(id);
        return ResponseEntity.ok(new BoardResponse(board));
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id, HttpSession session) {
        var loginMember = (com.hc.lolmatchhistory.entity.Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return ResponseEntity.status(401).body("로그인한 사용자만 삭제할 수 있습니다.");
        }
        boardService.deleteBoard(id, loginMember.getEmail());
        return ResponseEntity.ok().build();
    }

    // ✅ 게시글 수정
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateBoard(
            @PathVariable Long id,
            @RequestPart("data") BoardRequest boardRequest,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session
    ) {
        var loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return ResponseEntity.status(401).body("로그인한 사용자만 수정할 수 있습니다.");
        }

        // ✅ 이미지 저장 처리 (선택)
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                String uploadDir = System.getProperty("user.dir") + "/uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String savedName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                File dest = new File(dir, savedName);
                image.transferTo(dest);

                imageUrl = "/uploads/" + savedName;
            } catch (IOException e) {
                return ResponseEntity.status(500).body("이미지 업로드 실패");
            }
        }

        boardService.updateBoard(id, boardRequest, loginMember.getEmail(), imageUrl);
        return ResponseEntity.ok("게시글 수정 완료");
    }


}
