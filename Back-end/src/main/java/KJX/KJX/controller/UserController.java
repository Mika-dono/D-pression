package KJX.KJX.controller;

import KJX.KJX.entity.User;
import KJX.KJX.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Don't send password hashes
        users.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                user.setPasswordHash(null);
                return ResponseEntity.ok(user);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userRepository.findByRole(role.toUpperCase());
        users.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(users);
    }

    // Create new user (admin)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        // Check if username exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Ce nom d'utilisateur existe déjà");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if email exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Cette adresse email existe déjà");
            return ResponseEntity.badRequest().body(response);
        }

        User newUser = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(hashPassword(request.getPassword()))
            .role(request.getRole() != null ? request.getRole().toUpperCase() : "USER")
            .isActive(request.getIsActive() != null ? request.getIsActive() : true)
            .build();

        User saved = userRepository.save(newUser);
        saved.setPasswordHash(null);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Utilisateur créé avec succès");
        response.put("user", saved);
        return ResponseEntity.ok(response);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userRepository.findById(id)
            .map(user -> {
                if (request.getUsername() != null) {
                    // Check if username is taken by another user
                    userRepository.findByUsername(request.getUsername())
                        .filter(u -> !u.getId().equals(id))
                        .ifPresent(u -> {
                            throw new RuntimeException("Username already taken");
                        });
                    user.setUsername(request.getUsername());
                }
                if (request.getEmail() != null) {
                    // Check if email is taken by another user
                    userRepository.findByEmail(request.getEmail())
                        .filter(u -> !u.getId().equals(id))
                        .ifPresent(u -> {
                            throw new RuntimeException("Email already taken");
                        });
                    user.setEmail(request.getEmail());
                }
                if (request.getRole() != null) {
                    user.setRole(request.getRole().toUpperCase());
                }
                if (request.getIsActive() != null) {
                    user.setIsActive(request.getIsActive());
                }
                if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                    user.setPasswordHash(hashPassword(request.getPassword()));
                }

                User saved = userRepository.save(user);
                saved.setPasswordHash(null);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Utilisateur mis à jour");
                response.put("user", saved);
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            });
    }

    // Toggle user active status
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                user.setIsActive(!user.getIsActive());
                User saved = userRepository.save(user);
                saved.setPasswordHash(null);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", user.getIsActive() ? "Utilisateur activé" : "Utilisateur désactivé");
                response.put("user", saved);
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Utilisateur supprimé");
        return ResponseEntity.ok(response);
    }

    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", userRepository.count());
        stats.put("admins", userRepository.findByRole("ADMIN").size());
        stats.put("users", userRepository.findByRole("USER").size());
        stats.put("coaches", userRepository.findByRole("COACH").size());
        stats.put("moderators", userRepository.findByRole("MODERATOR").size());
        stats.put("active", userRepository.findByIsActive(true).size());
        stats.put("inactive", userRepository.findByIsActive(false).size());
        return ResponseEntity.ok(stats);
    }

    // Helper method to hash password
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    // Request DTOs
    public static class CreateUserRequest {
        private String username;
        private String email;
        private String password;
        private String role;
        private Boolean isActive;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    public static class UpdateUserRequest {
        private String username;
        private String email;
        private String password;
        private String role;
        private Boolean isActive;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }
}
