package KJX.KJX.controller;

import KJX.KJX.entity.Membership;
import KJX.KJX.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins = "*")
public class MembershipController {
    
    @Autowired
    private MembershipService membershipService;
    
    @GetMapping
    public ResponseEntity<List<Membership>> getAllMemberships() {
        return ResponseEntity.ok(membershipService.getAllMemberships());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMembershipById(@PathVariable Long id) {
        return membershipService.getMembershipById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Membership>> getActiveMemberships() {
        return ResponseEntity.ok(membershipService.getActiveMemberships());
    }
    
    @PostMapping
    public ResponseEntity<Membership> createMembership(@RequestBody Membership membership) {
        return ResponseEntity.ok(membershipService.saveMembership(membership));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Membership> updateMembership(@PathVariable Long id, @RequestBody Membership membershipDetails) {
        return ResponseEntity.ok(membershipService.updateMembership(id, membershipDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMembership(@PathVariable Long id) {
        membershipService.deleteMembership(id);
        return ResponseEntity.noContent().build();
    }
}
