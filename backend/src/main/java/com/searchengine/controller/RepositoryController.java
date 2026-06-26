package com.searchengine.controller;

import com.searchengine.model.Repository;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.searchengine.service.RepositoryService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private RepositoryService repositoryService;

    @PostMapping("/import")
    public ResponseEntity<?> importRepository(@RequestBody Repository repository) {
        try {
            Repository importedRepo = repositoryService.importRepository(repository);
            return ResponseEntity.ok(importedRepo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Import failed: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Repository> getAllRepositories() {
        return repositoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repository> getRepositoryById(@PathVariable Long id) {
        Optional<Repository> repositoryData = repositoryRepository.findById(id);
        return repositoryData.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRepository(@RequestBody Repository repository) {
        try {
            Repository saved = repositoryRepository.save(repository);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving repository: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Repository> updateRepository(@PathVariable Long id, @RequestBody Repository repositoryDetails) {
        Optional<Repository> repositoryData = repositoryRepository.findById(id);

        if (repositoryData.isPresent()) {
            Repository updatedRepository = repositoryData.get();
            updatedRepository.setRepositoryName(repositoryDetails.getRepositoryName());
            updatedRepository.setRepositoryUrl(repositoryDetails.getRepositoryUrl());
            updatedRepository.setDescription(repositoryDetails.getDescription());
            updatedRepository.setLanguage(repositoryDetails.getLanguage());
            return ResponseEntity.ok(repositoryRepository.save(updatedRepository));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepository(@PathVariable Long id) {
        try {
            repositoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
