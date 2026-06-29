package com.searchengine.controller;

import com.searchengine.dto.*;
import com.searchengine.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewDTO> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/languages")
    public ResponseEntity<List<LanguageStatDTO>> getLanguageStats(@RequestParam(required = false) Long repositoryId) {
        return ResponseEntity.ok(analyticsService.getLanguageStats(repositoryId));
    }

    @GetMapping("/top-searches")
    public ResponseEntity<List<KeywordStatDTO>> getTopSearches() {
        return ResponseEntity.ok(analyticsService.getTopSearches());
    }

    @GetMapping("/repository-stats")
    public ResponseEntity<List<RepositoryStatDTO>> getRepositoryStats() {
        return ResponseEntity.ok(analyticsService.getRepositoryStats());
    }
}
