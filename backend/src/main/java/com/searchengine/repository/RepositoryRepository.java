package com.searchengine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends MongoRepository<com.searchengine.model.Repository, String> {
}
