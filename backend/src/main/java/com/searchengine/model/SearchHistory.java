package com.searchengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "search_history")
@Data
@NoArgsConstructor
public class SearchHistory {

    @Id
    private String id;

    private String keyword;

    private LocalDateTime searchedAt;

    private String userId;


    protected void onCreate() {
        searchedAt = LocalDateTime.now();
    }
}
