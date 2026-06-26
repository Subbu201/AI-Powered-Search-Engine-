package com.searchengine.repository;

import com.searchengine.model.CodeFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CodeFileRepository extends JpaRepository<CodeFile, Long> {
    List<CodeFile> findByRepositoryId(Long repositoryId);
    void deleteByRepositoryId(Long repositoryId);
    int countByRepositoryId(Long repositoryId);

    @Query(value = "SELECT * FROM code_files WHERE LOWER(file_content) LIKE LOWER(CONCAT('%', :keyword, '%'))", nativeQuery = true)
    List<CodeFile> searchByFileContent(@org.springframework.data.repository.query.Param("keyword") String keyword);

    List<CodeFile> findByFileNameContainingIgnoreCase(String fileName);
}
