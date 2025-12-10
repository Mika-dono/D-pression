package KJX.KJX.controller;

import KJX.KJX.entity.Schedule;
import KJX.KJX.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {
    
    @Autowired
    private ScheduleService scheduleService;
    
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/day/{day}")
    public ResponseEntity<?> getScheduleByDay(@PathVariable String day) {
        return scheduleService.getScheduleByDay(day)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Schedule>> getSchedulesByTeamId(@PathVariable Long teamId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByTeamId(teamId));
    }
    
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.saveSchedule(schedule));
    }
    
    @PostMapping("/day")
    public ResponseEntity<Schedule> saveOrUpdateByDay(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.saveOrUpdateByDay(schedule));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule scheduleDetails) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, scheduleDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
