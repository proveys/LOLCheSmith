package com.hc.lolmatchhistory.repository;

import com.hc.lolmatchhistory.entity.PatchNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatchNoteRepository extends JpaRepository<PatchNote, Long> {
    Optional<PatchNote> findByTitleAndDate(String title, String date);

}
