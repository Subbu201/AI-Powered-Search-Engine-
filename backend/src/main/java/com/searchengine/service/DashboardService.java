package com.searchengine.service;

import com.searchengine.dto.DashboardStats;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    
    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private com.searchengine.repository.CodeFileRepository codeFileRepository;

    @Autowired
    private com.searchengine.repository.SearchHistoryRepository searchHistoryRepository;

    public DashboardStats getDashboardStats() {
        long actualRepositories = repositoryRepository.count();
        long actualIndexedFiles = codeFileRepository.count();
        long actualSearches = searchHistoryRepository.count();
        
        return new DashboardStats(actualRepositories, actualIndexedFiles, actualSearches);
    }
}
