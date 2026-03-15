package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.entity.ResumeStats;
import com.hemantkumar.portfolio.repository.ResumeStatsRepository;
import com.hemantkumar.portfolio.service.ResumeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);
    private static final String RESUME_PATH = "static/Hemant_Kumar_CV.pdf";

    private final ResumeStatsRepository resumeStatsRepository;

    @Override
    public Resource getResumePdf() {
        ClassPathResource pdfFile = new ClassPathResource(RESUME_PATH);

        if (!pdfFile.exists() || !pdfFile.isReadable()) {
            logger.warn("Resume file not found: {}", RESUME_PATH);
            throw new RuntimeException("Resume file not found");
        }

        return pdfFile;
    }

    @Override
    @Transactional
    public void downloadRecord() {
        ResumeStats stats = resumeStatsRepository.findById(1L)
                .orElse(new ResumeStats(1L, 0, null));

        stats.setDownloadCount(stats.getDownloadCount() + 1);
        stats.setLastDownloadedAt(LocalDateTime.now());
        resumeStatsRepository.save(stats);

        logger.info("Resume downloaded. Total downloads: {}", stats.getDownloadCount());
    }
}
