package com.searchengine.service;

import com.searchengine.model.CodeFile;
import com.searchengine.model.Repository;
import com.searchengine.repository.CodeFileRepository;
import com.searchengine.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.*;

@Service
public class FileIndexingService {

    @Autowired
    private CodeFileRepository codeFileRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".java", ".js", ".jsx", ".ts", ".tsx", ".py", ".html", ".css", ".xml", ".sql"
    );

    private static final List<String> IGNORED_FOLDERS = Arrays.asList(
            ".git", "node_modules", "target", "build"
    );

    @Transactional
    public String indexRepository(String repositoryId) throws Exception {
        Repository repo = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new Exception("Repository not found with ID: " + repositoryId));

        if (repo.getLocalPath() == null || repo.getLocalPath().isEmpty()) {
            throw new Exception("Repository source code not found. Please re-import the repository.");
        }

        File baseDir = new File(repo.getLocalPath());
        if (!baseDir.exists() || !baseDir.isDirectory()) {
            // Auto-repair for ephemeral environments (like Render)
            if (baseDir.getParentFile() != null) {
                baseDir.getParentFile().mkdirs();
            }
            ProcessBuilder pb = new ProcessBuilder("git", "clone", repo.getRepositoryUrl(), repo.getLocalPath());
            pb.redirectErrorStream(true);
            Process p = pb.start();
            if (p.waitFor() != 0) {
                throw new Exception("Local directory does not exist and auto-reclone failed: " + repo.getLocalPath());
            }
        }

        // Prevent double indexing
        if ("IN_PROGRESS".equals(repo.getIndexingStatus())) {
            throw new Exception("Indexing is already in progress for this repository.");
        }

        // Clean previous index
        codeFileRepository.deleteByRepositoryId(repositoryId);

        repo.setIndexingStatus("IN_PROGRESS");
        repo.setIndexingStartTime(System.currentTimeMillis());
        repo.setIndexingEndTime(null);
        repositoryRepository.save(repo);

        // Run asynchronously
        CompletableFuture.runAsync(() -> performMultithreadedIndexing(baseDir, repo));

        return "Indexing started in the background.";
    }

    private void performMultithreadedIndexing(File baseDir, Repository repo) {
        try {
            List<File> allFiles = new ArrayList<>();
            collectFiles(baseDir, allFiles);
            
            repo.setTotalFilesToIndex(allFiles.size());
            repositoryRepository.save(repo);

            if (allFiles.isEmpty()) {
                repo.setIndexingStatus("COMPLETED");
                repo.setIndexingEndTime(System.currentTimeMillis());
                repositoryRepository.save(repo);
                return;
            }

            ExecutorService executor = Executors.newFixedThreadPool(10);
            List<Callable<Void>> tasks = new ArrayList<>();

            for (File file : allFiles) {
                tasks.add(() -> {
                    try {
                        String content = Files.readString(file.toPath());
                        CodeFile codeFile = new CodeFile();
                        codeFile.setFileName(file.getName());
                        codeFile.setFilePath(file.getAbsolutePath().replace(repo.getLocalPath(), ""));
                        codeFile.setFileContent(content);
                        codeFile.setFileType(getFileExtension(file.getName()));
                        codeFile.setRepositoryId(repo.getId());
                        
                        // Thread-safe save via Spring Data JPA
                        codeFileRepository.save(codeFile);
                    } catch (IOException e) {
                        System.err.println("Failed to read file: " + file.getAbsolutePath());
                    }
                    return null;
                });
            }

            // Execute all tasks and wait for them to finish
            List<Future<Void>> futures = executor.invokeAll(tasks);
            for (Future<Void> future : futures) {
                future.get(); // Check for exceptions if needed
            }
            executor.shutdown();

            repo.setIndexingStatus("COMPLETED");
            repo.setIndexingEndTime(System.currentTimeMillis());
            repositoryRepository.save(repo);

        } catch (Exception e) {
            System.err.println("Indexing failed for repo " + repo.getId() + ": " + e.getMessage());
            repo.setIndexingStatus("FAILED");
            repo.setIndexingEndTime(System.currentTimeMillis());
            repositoryRepository.save(repo);
        }
    }

    private void collectFiles(File currentDir, List<File> collectedFiles) {
        File[] files = currentDir.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isDirectory()) {
                if (!IGNORED_FOLDERS.contains(file.getName())) {
                    collectFiles(file, collectedFiles);
                }
            } else {
                if (isAllowedFile(file.getName())) {
                    collectedFiles.add(file);
                }
            }
        }
    }

    private boolean isAllowedFile(String fileName) {
        return ALLOWED_EXTENSIONS.stream().anyMatch(fileName::endsWith);
    }

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot > 0) {
            return fileName.substring(lastDot);
        }
        return "unknown";
    }
}
