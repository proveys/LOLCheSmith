package com.hc.lolmatchhistory.service;

import com.hc.lolmatchhistory.entity.Board;
import com.hc.lolmatchhistory.entity.Member;
import com.hc.lolmatchhistory.dto.BoardRequest;
import com.hc.lolmatchhistory.repository.BoardRepository;
import com.hc.lolmatchhistory.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    // 게시글 생성 (로그인한 사용자의 email을 통해 회원(Member) 조회)
    public Board createBoard(BoardRequest request, String email, String imageUrl) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("작성자 정보 없음"));

        Board board = new Board();
        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setImageUrl(imageUrl); // ✅ 이미지 경로 저장
        board.setWriter(member);

        return boardRepository.save(board);
    }

    // 전체 게시글 조회 (최신순)
    public List<Board> getBoardList() {
        return boardRepository.findAllByOrderByCreatedAtDesc();
    }

    // 제목 검색 기능: 키워드가 포함된 게시글 조회
    public List<Board> searchBoards(String keyword) {
        return boardRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
    }

    //게시글 상세
    public Board getBoard(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
    }

    // 게시글 삭제 (작성자 본인만)
    public void deleteBoard(Long boardId, String email) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        if (!board.getWriter().getEmail().equals(email)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        boardRepository.delete(board);
    }
    //게시글 수정
    @Transactional
    public void updateBoard(Long id, BoardRequest request, String email, String imageUrl) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        // 작성자 본인만 수정 가능
        if (!board.getWriter().getEmail().equals(email)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        if (imageUrl != null) {
            board.setImageUrl(imageUrl); // 이미지 수정이 있을 경우에만
        }
    }


}
