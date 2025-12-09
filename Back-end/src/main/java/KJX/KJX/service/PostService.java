package KJX.KJX.service;

import KJX.KJX.entity.Post;
import KJX.KJX.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }
    
    public List<Post> getPostsByCategory(String category) {
        return postRepository.findByCategory(category);
    }
    
    public List<Post> getPublishedPosts() {
        return postRepository.findByIsPublishedTrue();
    }
    
    public Post savePost(Post post) {
        return postRepository.save(post);
    }
    
    public Post updatePost(Long id, Post postDetails) {
        return postRepository.findById(id)
            .map(post -> {
                post.setTitle(postDetails.getTitle());
                post.setExcerpt(postDetails.getExcerpt());
                post.setDescription(postDetails.getDescription());
                post.setCategory(postDetails.getCategory());
                post.setAuthor(postDetails.getAuthor());
                post.setIsPublished(postDetails.getIsPublished());
                post.setViewCount(postDetails.getViewCount());
                return postRepository.save(post);
            })
            .orElseThrow(() -> new RuntimeException("Post not found"));
    }
    
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
    
    public void incrementViewCount(Long id) {
        postRepository.findById(id)
            .ifPresent(post -> {
                post.setViewCount((post.getViewCount() != null ? post.getViewCount() : 0) + 1);
                postRepository.save(post);
            });
    }
}
