package com.searchengine.controller;

import com.searchengine.dto.SearchResultDTO;
import com.searchengine.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<?> searchByKeyword(@RequestParam String keyword, @RequestParam(required = false) Long userId) {
        try {
            List<SearchResultDTO> results = searchService.searchByKeyword(keyword, userId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error executing search: " + e.getMessage());
        }
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<?> searchByLanguage(@PathVariable String language) {
        try {
            List<SearchResultDTO> results = searchService.searchByLanguage(language);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error executing search: " + e.getMessage());
        }
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<?> searchByRepository(@PathVariable Long repositoryId) {
        try {
            List<SearchResultDTO> results = searchService.searchByRepository(repositoryId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error executing search: " + e.getMessage());
        }
    }

    @GetMapping("/file/{fileName}")
    public ResponseEntity<?> searchByFileName(@PathVariable String fileName) {
        try {
            List<SearchResultDTO> results = searchService.searchByFileName(fileName);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error executing search: " + e.getMessage());
        }
    }
}
