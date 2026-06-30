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

    public List<LanguageStatDTO> getLanguageStats(String repositoryId) {
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

    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    public List<KeywordStatDTO> getTopSearches() {
        org.springframework.data.mongodb.core.aggregation.Aggregation aggregation = org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(
                org.springframework.data.mongodb.core.aggregation.Aggregation.group("keyword").count().as("count"),
                org.springframework.data.mongodb.core.aggregation.Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC, "count"),
                org.springframework.data.mongodb.core.aggregation.Aggregation.limit(10)
        );

        org.springframework.data.mongodb.core.aggregation.AggregationResults<org.bson.Document> results = mongoTemplate.aggregate(aggregation, "search_history", org.bson.Document.class);
        List<org.bson.Document> top = results.getMappedResults();

        List<KeywordStatDTO> result = new ArrayList<>();
        for (org.bson.Document row : top) {
            String keyword = row.getString("_id");
            Number countNum = row.get("count", Number.class);
            Long count = countNum != null ? countNum.longValue() : 0L;
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
