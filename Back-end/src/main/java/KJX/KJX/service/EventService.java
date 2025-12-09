package KJX.KJX.service;

import KJX.KJX.entity.Event;
import KJX.KJX.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public List<Event> getEventsByType(String type) {
        return eventRepository.findByType(type);
    }
    
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDateTime.now());
    }
    
    public List<Event> getEventsByTeamId(Long teamId) {
        return eventRepository.findByTeamId(teamId);
    }
    
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        return eventRepository.findById(id)
            .map(event -> {
                event.setTitle(eventDetails.getTitle());
                event.setDescription(eventDetails.getDescription());
                event.setType(eventDetails.getType());
                event.setDate(eventDetails.getDate());
                event.setTime(eventDetails.getTime());
                event.setLocation(eventDetails.getLocation());
                event.setStatus(eventDetails.getStatus());
                event.setOpponent(eventDetails.getOpponent());
                return eventRepository.save(event);
            })
            .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
