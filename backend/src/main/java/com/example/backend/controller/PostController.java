package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173") // Allows Vite frontend access
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get all posts (with optional search filter)
    @GetMapping
    public List<Post> getAllPosts(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return postRepository.findByTitleContainingIgnoreCaseOrTagsContainingIgnoreCase(search, search);
        }
        return postRepository.findAll();
    }

    // 2. Get a single post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@Valid @RequestBody Post postDetails, @RequestParam Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        postDetails.setAuthor(author);
        postDetails.setCreatedAt(LocalDateTime.now());
        postDetails.setUpdatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(postDetails);
        return ResponseEntity.ok(savedPost);
    }

    // 4. Update an existing post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @Valid @RequestBody Post postDetails) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setTags(postDetails.getTags());
            post.setImageUrl(postDetails.getImageUrl());
            post.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(postRepository.save(post));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}