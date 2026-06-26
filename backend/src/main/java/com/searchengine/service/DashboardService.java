package com.searchengine.service;

import com.searchengine.dto.DashboardStats;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    
    @Autowired
    private RepositoryRepository repositoryRepository;

    public DashboardStats getDashboardStats() {
        // Query real count for repositories from database
        long actualRepositories = repositoryRepository.count();
        
        // For now, set other mock data to 0 as requested until they are implemented
        long mockIndexedFiles = 0;
        long mockSearches = 0;
        
        return new DashboardStats(actualRepositories, mockIndexedFiles, mockSearches);
    }
}
