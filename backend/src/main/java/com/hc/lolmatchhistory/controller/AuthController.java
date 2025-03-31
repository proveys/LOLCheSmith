package com.hc.lolmatchhistory.controller;

import com.hc.lolmatchhistory.dto.LoginRequest;
import com.hc.lolmatchhistory.dto.SignupRequest;
import com.hc.lolmatchhistory.entity.Member;
import com.hc.lolmatchhistory.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;

    // 🔐 회원가입 요청 처리
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            memberService.signup(request);
            return ResponseEntity.ok("회원가입 성공!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("회원가입 실패: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            Member member = memberService.login(request.getEmail(), request.getPassword());
            // 세션에 사용자 저장
            session.setAttribute("loginMember", member);
            System.out.println("로그인 성공, 세션 ID: " + session.getId());
            System.out.println("현재 세션 사용자: " + member);
            // 프론트에 보낼 최소한의 정보
            return ResponseEntity.ok(Map.of("username", member.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("로그인 실패: " + e.getMessage());
        }
    }
    //로그인 여부 확인 가능
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        System.out.println("현재 세션 사용자: " + loginMember); // ✅ 이거 추가
        if (loginMember == null) {
            return ResponseEntity.status(401).body("로그인되어 있지 않습니다.");
        }
        return ResponseEntity.ok(Map.of("username", loginMember.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // ✅ 세션 무효화
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

}