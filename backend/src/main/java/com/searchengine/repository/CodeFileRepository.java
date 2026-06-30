package com.searchengine.repository;

import com.searchengine.model.CodeFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CodeFileRepository extends MongoRepository<CodeFile, String> {
    List<CodeFile> findByRepositoryId(String repositoryId);
    void deleteByRepositoryId(String repositoryId);
    int countByRepositoryId(String repositoryId);

    @Query("{ 'fileContent': { $regex: ?0, $options: 'i' } }")
    List<CodeFile> searchByFileContent(String keyword);

    List<CodeFile> findByFileNameContainingIgnoreCase(String fileName);
}
