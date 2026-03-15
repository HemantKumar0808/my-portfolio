package com.hemantkumar.portfolio.controller;

import com.hemantkumar.portfolio.entity.ResumeStats;
import com.hemantkumar.portfolio.repository.ResumeStatsRepository;
import com.hemantkumar.portfolio.service.ResumeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    private final ResumeService resumeService;

    @GetMapping("/download")
    @Transactional
    public ResponseEntity<Resource> getResumePdf() {
        try {
            Resource pdfFile = resumeService.getResumePdf();
            resumeService.downloadRecord();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Hemant_Kumar_CV.pdf\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfFile);

        } catch (Exception e) {
            logger.error("Error serving resume", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}