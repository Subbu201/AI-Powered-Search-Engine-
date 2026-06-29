package com.searchengine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryStatDTO {
    private String repositoryName;
    private int totalFiles;
    private long indexedFilesCount;
}
