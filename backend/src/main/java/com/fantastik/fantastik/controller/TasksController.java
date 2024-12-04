package com.fantastik.fantastik.controller;

import com.fantastik.fantastik.model.Tasks;
import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.TasksService;
import com.fantastik.fantastik.service.UsersService;
import com.fantastik.fantastik.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TasksController {

    @Autowired
    private TasksService tasksService;

    @Autowired
    private UsersService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // CREATE
    @PostMapping
    public ResponseEntity<Tasks> createTask(@RequestBody Map<String, Object> taskData,
            @RequestHeader("Authorization") String token) {
        try {
            // getting the user from the token
            String username = jwtUtil.extractUsername(token.substring(7));
            Users createdBy = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long createdById = createdBy.getId();

            // Créer une nouvelle tâche et définir ses propriétés
            Tasks task = new Tasks();
            task.setTitle((String) taskData.getOrDefault("title", ""));
            task.setDescription((String) taskData.getOrDefault("description", ""));

            if (taskData.get("stage") != null) {
                task.setStage(((Number) taskData.get("stage")).intValue());
            }
            task.setCreatedById(createdById);

            // Récupérer l'utilisateur assigné à la tâche
            if (taskData.get("user_id") != null) {
                Long user_id = ((Number) taskData.get("user_id")).longValue();
                Users assignee = userService.getUserById(user_id)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                task.setUser(assignee);
            }

            // Définir la deadline si elle est présente
            if (taskData.get("deadline") != null) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date deadline = dateFormat.parse((String) taskData.get("deadline"));
                task.setDeadline(deadline);
            }

            Tasks newTask = tasksService.createTask(task);
            return new ResponseEntity<>(newTask, HttpStatus.CREATED);
        } catch (ParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // READ - Get all tasks
    @GetMapping
    public ResponseEntity<List<Tasks>> getAllTasks() {
        List<Tasks> tasks = tasksService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // READ - Get a task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tasks> getTaskById(@PathVariable Long id) {
        Optional<Tasks> task = tasksService.getTaskById(id);
        return task.map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Tasks> updateTask(@PathVariable Long id, @RequestBody Map<String, Object> taskData) {
        Optional<Tasks> existingTask = tasksService.getTaskById(id);
        if (!existingTask.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Tasks task = existingTask.get();

        if (taskData.containsKey("title")) {
            task.setTitle((String) taskData.get("title"));
        }
        if (taskData.containsKey("description")) {
            task.setDescription((String) taskData.get("description"));
        }
        if (taskData.containsKey("stage") && taskData.get("stage") != null) {
            task.setStage(((Number) taskData.get("stage")).intValue());
        }
        if (taskData.containsKey("createdById") && taskData.get("createdById") != null) {
            task.setCreatedById(((Number) taskData.get("createdById")).longValue());
        }
        if (taskData.containsKey("user_id") && taskData.get("user_id") != null) {
            Long user_id = ((Number) taskData.get("user_id")).longValue();
            Users assignee = userService.getUserById(user_id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setUser(assignee);
        }
        if (taskData.containsKey("deadline") && taskData.get("deadline") != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date deadline = dateFormat.parse((String) taskData.get("deadline"));
                task.setDeadline(deadline);
            } catch (ParseException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

        Tasks updatedTask = tasksService.updateTask(id, task);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        tasksService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
