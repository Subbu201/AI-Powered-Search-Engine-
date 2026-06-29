package com.searchengine.repository;

import com.searchengine.model.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    @Query("SELECT s.keyword, COUNT(s) as c FROM SearchHistory s GROUP BY s.keyword ORDER BY c DESC")
    List<Object[]> findTopSearches(Pageable pageable);
}
