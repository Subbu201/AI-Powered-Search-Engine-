package com.searchengine.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_logs")
@Data
@NoArgsConstructor
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String keyword;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    @Column
    private Long userId;

    @PrePersist
    protected void onCreate() {
        searchedAt = LocalDateTime.now();
    }
}
