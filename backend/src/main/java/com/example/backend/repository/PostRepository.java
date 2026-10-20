package com.example.backend.repository;

import com.example.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Bonus feature: Search posts by title or tags
    List<Post> findByTitleContainingIgnoreCaseOrTagsContainingIgnoreCase(String title, String tags);
}