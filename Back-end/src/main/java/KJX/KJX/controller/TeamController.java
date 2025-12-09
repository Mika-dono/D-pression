package KJX.KJX.controller;

import KJX.KJX.entity.Team;
import KJX.KJX.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/game/{game}")
    public ResponseEntity<List<Team>> getTeamsByGame(@PathVariable String game) {
        return ResponseEntity.ok(teamService.getTeamsByGame(game));
    }
    
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.saveTeam(team));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team teamDetails) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
