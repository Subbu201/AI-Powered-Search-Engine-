package com.searchengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "repositories")
@Data
@NoArgsConstructor
public class Repository {

    @Id
    private String id;

    @Indexed(unique = true)
    private String repositoryName;

    private String repositoryUrl;

    private String description;

    private String language;

    private String localPath;

    private String indexingStatus = "PENDING";

    private Integer totalFilesToIndex = 0;

    private Long indexingStartTime;

    private Long indexingEndTime;

    private LocalDateTime createdAt;


    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
