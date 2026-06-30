package com.searchengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "code_files")
@Data
@NoArgsConstructor
public class CodeFile {

    @Id
    private String id;

    private String fileName;

    private String filePath;

    private String fileContent;

    private String fileType;

    private LocalDateTime indexedAt;

    private String repositoryId;


    protected void onCreate() {
        indexedAt = LocalDateTime.now();
    }
}
