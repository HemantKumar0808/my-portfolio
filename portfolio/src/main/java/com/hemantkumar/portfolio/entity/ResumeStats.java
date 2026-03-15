package com.hemantkumar.portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeStats {

    @Id
    private Long id = 1L; // Singleton record, always with ID = 1

    @Column(nullable = false)
    private long downloadCount = 0; // Total downloads

    private LocalDateTime lastDownloadedAt; // Timestamp of last download
}