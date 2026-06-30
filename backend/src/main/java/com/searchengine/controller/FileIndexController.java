package com.searchengine.controller;

import com.searchengine.model.CodeFile;
import com.searchengine.repository.CodeFileRepository;
import com.searchengine.service.FileIndexingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.searchengine.model.Repository;
import com.searchengine.repository.RepositoryRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/index")
public class FileIndexController {

    @Autowired
    private FileIndexingService fileIndexingService;

    @Autowired
    private CodeFileRepository codeFileRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @PostMapping("/{repositoryId}")
    public ResponseEntity<?> indexRepository(@PathVariable String repositoryId) {
        try {
            String result = fileIndexingService.indexRepository(repositoryId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Indexing failed: " + e.getMessage());
        }
    }

    @GetMapping("/status/{repositoryId}")
    public ResponseEntity<?> getIndexingStatus(@PathVariable String repositoryId) {
        try {
            Repository repo = repositoryRepository.findById(repositoryId).orElse(null);
            if (repo == null) return ResponseEntity.status(404).body("Repository not found");

            int total = repo.getTotalFilesToIndex() == null ? 0 : repo.getTotalFilesToIndex();
            int current = codeFileRepository.countByRepositoryId(repositoryId);
            
            int progress = total > 0 ? (current * 100) / total : 0;
            if (progress > 100) progress = 100;

            Map<String, Object> response = new HashMap<>();
            response.put("status", repo.getIndexingStatus());
            response.put("progress", progress);
            response.put("totalFiles", total);
            response.put("indexedFiles", current);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error checking status: " + e.getMessage());
        }
    }

    @GetMapping("/performance/{repositoryId}")
    public ResponseEntity<?> getPerformance(@PathVariable String repositoryId) {
        try {
            Repository repo = repositoryRepository.findById(repositoryId).orElse(null);
            if (repo == null) return ResponseEntity.status(404).body("Repository not found");

            Long start = repo.getIndexingStartTime();
            Long end = repo.getIndexingEndTime();
            int total = repo.getTotalFilesToIndex() == null ? 0 : repo.getTotalFilesToIndex();

            if (start == null || end == null || total == 0) {
                return ResponseEntity.status(400).body("Performance data not available");
            }

            long totalTimeMs = end - start;
            long avgTimeMs = totalTimeMs / total;

            Map<String, Object> response = new HashMap<>();
            response.put("totalFilesIndexed", total);
            response.put("totalTimeMs", totalTimeMs);
            response.put("averageProcessingTimeMs", avgTimeMs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching performance: " + e.getMessage());
        }
    }

    @GetMapping("/files/{repositoryId}")
    public ResponseEntity<?> getIndexedFiles(@PathVariable String repositoryId) {
        try {
            List<CodeFile> files = codeFileRepository.findByRepositoryId(repositoryId);
            // Optionally, we could map this to a DTO to exclude fileContent for faster loading, 
            // but the prompt says "do not write more lines" and it's a simple setup.
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to load files: " + e.getMessage());
        }
    }

    @GetMapping("/file/{fileId}")
    public ResponseEntity<?> getFileDetails(@PathVariable String fileId) {
        try {
            CodeFile file = codeFileRepository.findById(fileId).orElse(null);
            if (file == null) {
                return ResponseEntity.status(404).body("File not found");
            }
            return ResponseEntity.ok(file);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch file: " + e.getMessage());
        }
    }
}
