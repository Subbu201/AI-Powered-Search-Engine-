package com.searchengine.repository;

import org.springframework.data.jpa.repository.JpaRepository;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<com.searchengine.model.Repository, Long> {
}
