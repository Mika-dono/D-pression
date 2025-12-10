package KJX.KJX.controller;

import KJX.KJX.entity.Match;
import KJX.KJX.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {
    
    @Autowired
    private MatchService matchService;
    
    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }
    
    @GetMapping("/visible")
    public ResponseEntity<List<Match>> getVisibleMatches() {
        return ResponseEntity.ok(matchService.getVisibleMatches());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tournament/{tournament}")
    public ResponseEntity<List<Match>> getMatchesByTournament(@PathVariable String tournament) {
        return ResponseEntity.ok(matchService.getMatchesByTournament(tournament));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Match>> getUpcomingMatches() {
        return ResponseEntity.ok(matchService.getUpcomingMatches());
    }
    
    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestBody Match match) {
        return ResponseEntity.ok(matchService.saveMatch(match));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match matchDetails) {
        return ResponseEntity.ok(matchService.updateMatch(id, matchDetails));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Match> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.toggleVisibility(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }
}
