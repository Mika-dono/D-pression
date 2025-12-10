package KJX.KJX.service;

import KJX.KJX.entity.Schedule;
import KJX.KJX.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAllByOrderByIdAsc();
    }
    
    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }
    
    public Optional<Schedule> getScheduleByDay(String dayOfWeek) {
        return scheduleRepository.findByDayOfWeek(dayOfWeek);
    }
    
    public List<Schedule> getSchedulesByTeamId(Long teamId) {
        return scheduleRepository.findByTeamId(teamId);
    }
    
    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    public Schedule updateSchedule(Long id, Schedule scheduleDetails) {
        Schedule schedule = scheduleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        
        schedule.setDayOfWeek(scheduleDetails.getDayOfWeek());
        schedule.setStartTime(scheduleDetails.getStartTime());
        schedule.setEndTime(scheduleDetails.getEndTime());
        schedule.setActivity(scheduleDetails.getActivity());
        schedule.setNotes(scheduleDetails.getNotes());
        
        return scheduleRepository.save(schedule);
    }
    
    public Schedule saveOrUpdateByDay(Schedule schedule) {
        Optional<Schedule> existing = scheduleRepository.findByDayOfWeek(schedule.getDayOfWeek());
        if (existing.isPresent()) {
            Schedule existingSchedule = existing.get();
            existingSchedule.setStartTime(schedule.getStartTime());
            existingSchedule.setEndTime(schedule.getEndTime());
            existingSchedule.setActivity(schedule.getActivity());
            existingSchedule.setNotes(schedule.getNotes());
            return scheduleRepository.save(existingSchedule);
        }
        return scheduleRepository.save(schedule);
    }
    
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}
