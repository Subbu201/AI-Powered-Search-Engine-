package com.searchengine.service;

import com.searchengine.dto.SearchResultDTO;
import com.searchengine.model.CodeFile;
import com.searchengine.model.Repository;
import com.searchengine.repository.CodeFileRepository;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private CodeFileRepository codeFileRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private com.searchengine.repository.SearchHistoryRepository searchHistoryRepository;

    public List<SearchResultDTO> searchByKeyword(String keyword, String userId) {
        // Log search history
        if (keyword != null && !keyword.trim().isEmpty()) {
            com.searchengine.model.SearchHistory history = new com.searchengine.model.SearchHistory();
            history.setKeyword(keyword.trim());
            history.setUserId(userId);
            history.setSearchedAt(java.time.LocalDateTime.now());
            searchHistoryRepository.save(history);
        }

        List<CodeFile> rawResults = codeFileRepository.searchByFileContent(keyword);
        return rankAndMapResults(rawResults, keyword);
    }

    public List<SearchResultDTO> searchByLanguage(String language) {
        // We will map language to file extension roughly
        String ext = mapLanguageToExtension(language);
        List<CodeFile> rawResults = codeFileRepository.findAll().stream()
                .filter(file -> file.getFileType().equalsIgnoreCase(ext))
                .collect(Collectors.toList());
        return rankAndMapResults(rawResults, ""); // Empty keyword means no score, just listing
    }

    public List<SearchResultDTO> searchByRepository(String repositoryId) {
        List<CodeFile> rawResults = codeFileRepository.findByRepositoryId(repositoryId);
        return rankAndMapResults(rawResults, "");
    }

    public List<SearchResultDTO> searchByFileName(String fileName) {
        List<CodeFile> rawResults = codeFileRepository.findByFileNameContainingIgnoreCase(fileName);
        return rankAndMapResults(rawResults, fileName);
    }

    private List<SearchResultDTO> rankAndMapResults(List<CodeFile> files, String keyword) {
        // Pre-fetch repositories to avoid N+1 queries
        Map<String, Repository> repoMap = new HashMap<>();
        repositoryRepository.findAll().forEach(repo -> repoMap.put(repo.getId(), repo));

        List<SearchResultDTO> dtoList = new ArrayList<>();
        
        for (CodeFile file : files) {
            Repository repo = repoMap.get(file.getRepositoryId());
            if (repo == null) continue;

            int score = calculateScore(file.getFileContent(), keyword);
            String preview = generatePreview(file.getFileContent(), keyword);

            SearchResultDTO dto = new SearchResultDTO(
                    file.getId(),
                    file.getFileName(),
                    repo.getRepositoryName(),
                    file.getFilePath(),
                    repo.getLanguage(),
                    score,
                    preview
            );
            dtoList.add(dto);
        }

        // Sort by score descending
        if (!keyword.isEmpty()) {
            dtoList.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        }
        
        return dtoList;
    }

    private int calculateScore(String content, String keyword) {
        if (keyword == null || keyword.isEmpty() || content == null) return 0;
        int score = 0;
        int index = 0;
        String lowerContent = content.toLowerCase();
        String lowerKeyword = keyword.toLowerCase();
        
        while ((index = lowerContent.indexOf(lowerKeyword, index)) != -1) {
            score++;
            index += lowerKeyword.length();
        }
        return score;
    }

    private String generatePreview(String content, String keyword) {
        if (content == null) return "";
        if (keyword == null || keyword.isEmpty()) {
            return content.substring(0, Math.min(content.length(), 150)) + "...";
        }
        
        String lowerContent = content.toLowerCase();
        String lowerKeyword = keyword.toLowerCase();
        int index = lowerContent.indexOf(lowerKeyword);
        
        if (index == -1) {
            return content.substring(0, Math.min(content.length(), 150)) + "...";
        }
        
        int start = Math.max(0, index - 50);
        int end = Math.min(content.length(), index + keyword.length() + 50);
        
        String preview = content.substring(start, end);
        if (start > 0) preview = "..." + preview;
        if (end < content.length()) preview = preview + "...";
        
        return preview;
    }

    private String mapLanguageToExtension(String language) {
        if (language == null) return "";
        switch (language.toLowerCase()) {
            case "java": return ".java";
            case "javascript": return ".js";
            case "python": return ".py";
            case "html": return ".html";
            case "css": return ".css";
            case "xml": return ".xml";
            case "sql": return ".sql";
            default: return "";
        }
    }
}
