package com.searchengine.service;

import com.searchengine.model.Repository;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class RepositoryService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    private static final String IMPORT_DIR = "imported-repositories";

    public Repository importRepository(Repository repositoryDetails) throws Exception {
        // Ensure directory exists
        File baseDir = new File(IMPORT_DIR);
        if (!baseDir.exists()) {
            baseDir.mkdirs();
        }

        // Generate target path
        String repoName = repositoryDetails.getRepositoryName().replaceAll("[^a-zA-Z0-9.-]", "_");
        Path targetPath = Paths.get(IMPORT_DIR, repoName).toAbsolutePath();

        // Run git clone using ProcessBuilder
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("git", "clone", repositoryDetails.getRepositoryUrl(), targetPath.toString());
        processBuilder.directory(baseDir);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0 && !new File(targetPath.toFile(), ".git").exists()) {
            throw new Exception("Git clone failed. Ensure git is installed and the URL is correct.");
        }

        // Clone was successful or it already exists there. Save to DB.
        repositoryDetails.setLocalPath(targetPath.toString());
        
        // Handle saving. Let's find if it exists by URL or Name to avoid duplicates (optional but good).
        // For now, we just save as a new entry. If duplicate name, it will fail unique constraint and throw.
        return repositoryRepository.save(repositoryDetails);
    }
}
