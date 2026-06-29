package com.searchengine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDTO {
    private long totalRepositories;
    private long totalIndexedFiles;
    private long totalSearches;
    private long totalUsers;
}
