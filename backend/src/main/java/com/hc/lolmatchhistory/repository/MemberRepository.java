package com.hc.lolmatchhistory.repository;

import com.hc.lolmatchhistory.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 로그인용 (email 기준)
    Optional<Member> findByEmail(String email);

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 유저네임(닉네임) 중복 체크
    boolean existsByUsername(String username);
}
