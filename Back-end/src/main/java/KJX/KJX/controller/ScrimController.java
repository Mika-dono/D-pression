package KJX.KJX.controller;

import KJX.KJX.entity.Scrim;
import KJX.KJX.service.ScrimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scrims")
@CrossOrigin(origins = "*")
public class ScrimController {
    
    @Autowired
    private ScrimService scrimService;
    
    @GetMapping
    public ResponseEntity<List<Scrim>> getAllScrims() {
        return ResponseEntity.ok(scrimService.getAllScrims());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getScrimById(@PathVariable Long id) {
        return scrimService.getScrimById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Scrim>> getScrimsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(scrimService.getScrimsByStatus(status));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Scrim>> getScrimsByTeamId(@PathVariable Long teamId) {
        return ResponseEntity.ok(scrimService.getScrimsByTeamId(teamId));
    }
    
    @PostMapping
    public ResponseEntity<Scrim> createScrim(@RequestBody Scrim scrim) {
        return ResponseEntity.ok(scrimService.saveScrim(scrim));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Scrim> updateScrim(@PathVariable Long id, @RequestBody Scrim scrimDetails) {
        return ResponseEntity.ok(scrimService.updateScrim(id, scrimDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScrim(@PathVariable Long id) {
        scrimService.deleteScrim(id);
        return ResponseEntity.noContent().build();
    }
}
