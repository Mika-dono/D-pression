package KJX.KJX.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Simple hardcoded authentication for admin panel
        if ("admin".equals(request.getUsername()) && "admin123".equals(request.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("username", request.getUsername());
            response.put("token", "admin-token-" + System.currentTimeMillis());
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
