package com.searchengine.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultDTO {
    private Long fileId;
    private String fileName;
    private String repositoryName;
    private String filePath;
    private String language;
    private int score;
    private String preview;
}
