package com.hemantkumar.portfolio.service;

import org.springframework.core.io.Resource;

public interface ResumeService {
    Resource getResumePdf();

    void downloadRecord();
}
