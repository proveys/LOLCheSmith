package com.hc.lolmatchhistory.controller;

import com.hc.lolmatchhistory.entity.PatchNote;
import com.hc.lolmatchhistory.service.PatchNoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patchnotes")
@RequiredArgsConstructor
@Slf4j
public class PatchNoteController {

    private final PatchNoteService patchNoteService;

    // 🔁 수동 크롤링
    @PostMapping("/crawl")
    public ResponseEntity<String> crawlAndSave() {
        log.info("🔁 패치노트 수동 크롤링 시작");
        patchNoteService.crawlWithSelenium();
        log.info("✅ 패치노트 수동 크롤링 완료");
        return ResponseEntity.ok("패치노트 수동 크롤링 완료");
    }

    // ✅ 페이지 단위 패치노트 가져오기
    @GetMapping
    public ResponseEntity<List<PatchNote>> getPagedNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        List<PatchNote> notes = patchNoteService.getPagedPatchNotes(page, size);
        return ResponseEntity.ok(notes);
    }
}
