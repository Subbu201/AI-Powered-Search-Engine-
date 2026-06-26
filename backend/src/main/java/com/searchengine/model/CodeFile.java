package com.searchengine.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_files")
@Data
@NoArgsConstructor
public class CodeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, length = 1000)
    private String filePath;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fileContent;

    @Column
    private String fileType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime indexedAt;

    @Column(nullable = false)
    private Long repositoryId;

    @PrePersist
    protected void onCreate() {
        indexedAt = LocalDateTime.now();
    }
}
