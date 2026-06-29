package com.searchengine.service;

import com.searchengine.dto.*;
import com.searchengine.model.Repository;
import com.searchengine.repository.CodeFileRepository;
import com.searchengine.repository.RepositoryRepository;
import com.searchengine.repository.SearchHistoryRepository;
import com.searchengine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private CodeFileRepository codeFileRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public AnalyticsOverviewDTO getOverview() {
        return new AnalyticsOverviewDTO(
                repositoryRepository.count(),
                codeFileRepository.count(),
                searchHistoryRepository.count(),
                userRepository.count()
        );
    }

    public List<LanguageStatDTO> getLanguageStats(Long repositoryId) {
        List<com.searchengine.model.CodeFile> files;
        if (repositoryId != null) {
            files = codeFileRepository.findByRepositoryId(repositoryId);
        } else {
            files = codeFileRepository.findAll();
        }
        
        Map<String, Long> counts = files.stream()
                .filter(file -> file.getFileType() != null && !file.getFileType().isEmpty())
                .collect(Collectors.groupingBy(com.searchengine.model.CodeFile::getFileType, Collectors.counting()));

        return counts.entrySet().stream()
                .map(e -> {
                    String ext = e.getKey();
                    if (ext.startsWith(".")) {
                        ext = ext.substring(1);
                    }
                    return new LanguageStatDTO(ext, e.getValue());
                })
                .collect(Collectors.toList());
    }

    public List<KeywordStatDTO> getTopSearches() {
        List<Object[]> top = searchHistoryRepository.findTopSearches(PageRequest.of(0, 10));
        List<KeywordStatDTO> result = new ArrayList<>();
        for (Object[] row : top) {
            String keyword = (String) row[0];
            Long count = (Long) row[1];
            result.add(new KeywordStatDTO(keyword, count));
        }
        return result;
    }

    public List<RepositoryStatDTO> getRepositoryStats() {
        List<Repository> allRepos = repositoryRepository.findAll();
        List<RepositoryStatDTO> result = new ArrayList<>();
        for (Repository repo : allRepos) {
            long indexedCount = codeFileRepository.countByRepositoryId(repo.getId());
            int totalFiles = repo.getTotalFilesToIndex() != null ? repo.getTotalFilesToIndex() : 0;
            result.add(new RepositoryStatDTO(repo.getRepositoryName(), totalFiles, indexedCount));
        }
        return result;
    }
}
