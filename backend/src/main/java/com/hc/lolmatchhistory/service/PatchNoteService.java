package com.hc.lolmatchhistory.service;

import com.hc.lolmatchhistory.entity.PatchNote;
import com.hc.lolmatchhistory.repository.PatchNoteRepository;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatchNoteService {

    private final PatchNoteRepository patchNoteRepository;
    private static final String PATCH_NOTE_URL = "https://www.leagueoflegends.com/ko-kr/news/tags/patch-notes/";

    @Transactional
    public void crawlWithSelenium() {
        System.setProperty("webdriver.chrome.driver", "C:/chromedriver-win64/chromedriver.exe");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.98 Safari/537.36");

        WebDriver driver = new ChromeDriver(options);
        List<PatchNote> patchNotes = new ArrayList<>();

        try {
            driver.get(PATCH_NOTE_URL);
            Thread.sleep(3000); // 페이지 로딩 대기

            List<WebElement> cards = driver.findElements(By.cssSelector("a[data-testid=articlefeaturedcard-component]"));
            System.out.println("🧩 크롤링 대상 개수: " + cards.size());

            for (WebElement card : cards) {
                try {
                    String title = card.findElement(By.cssSelector("div[data-testid=card-title]"))
                            .getText();
                    String description = card.findElement(By.cssSelector("div[data-testid=card-description]"))
                            .getText();
                    String date = card.findElement(By.cssSelector("time")).getText();
                    String url = "https://www.leagueoflegends.com" + card.getAttribute("href");
                    String imageUrl = card.findElement(By.cssSelector("img")).getAttribute("src");

                    Optional<PatchNote> existing = patchNoteRepository.findAll().stream()
                            .filter(p -> p.getTitle().equals(title) && p.getDate().equals(date))
                            .findFirst();

                    if (existing.isEmpty()) {
                        PatchNote note = PatchNote.builder()
                                .title(title)
                                .date(date)
                                .description(description)
                                .link(url)
                                .imageUrl(imageUrl)
                                .build();
                        patchNotes.add(note);
                        System.out.println("✅ 새로 저장: " + title);
                    } else {
                        // 업데이트 두번째 저장 위해 덮어쓰기
                        PatchNote note = existing.get();
                        note.setDescription(description);
                        note.setImageUrl(imageUrl);
                        note.setLink(url);
                        patchNoteRepository.save(note);
                        System.out.println("♻️ 업데이트: " + title);
                    }

                    if (patchNotes.size() >= 12) break;

                } catch (Exception e) {
                    System.out.println("⚠️ 크롤링 중 일부 항목 에러: " + e.getMessage());
                }
            }

            patchNoteRepository.saveAll(patchNotes);
            System.out.println("🎉 저장 완료된 패치노트 수: " + patchNotes.size());

        } catch (Exception e) {
            System.out.println("❌ 크롤링 전체 실패: " + e.getMessage());
        } finally {
            driver.quit();
        }
    }

    // ✅ 페이직 적용된 패치노트 발표
    public List<PatchNote> getPagedPatchNotes(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
        return patchNoteRepository.findAll(pageable).getContent();
    }
}
