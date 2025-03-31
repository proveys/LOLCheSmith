package com.hc.lolmatchhistory.service;

import com.hc.lolmatchhistory.constant.Role;
import com.hc.lolmatchhistory.dto.SignupRequest;
import com.hc.lolmatchhistory.entity.Member;
import com.hc.lolmatchhistory.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        // 이메일 중복 체크
        if (memberRepository.existsByEmail(email)) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 유저네임(닉네임) 중복 체크
        if (memberRepository.existsByUsername(username)) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        // 회원 저장
        Member member = Member.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .role(Role.USER)
                .build();

        memberRepository.save(member);
    }
    public Member login(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }
}
