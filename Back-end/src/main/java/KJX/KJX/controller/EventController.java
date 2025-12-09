package KJX.KJX.controller;

import KJX.KJX.entity.Event;
import KJX.KJX.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable String type) {
        return ResponseEntity.ok(eventService.getEventsByType(type));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Event>> getEventsByTeamId(@PathVariable Long teamId) {
        return ResponseEntity.ok(eventService.getEventsByTeamId(teamId));
    }
    
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.saveEvent(event));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
