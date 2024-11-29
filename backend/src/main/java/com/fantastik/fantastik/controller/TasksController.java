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

import java.util.List;
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
    public ResponseEntity<Tasks> createTask(@RequestBody Tasks task, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));

        Users user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        Tasks newTask = tasksService.createTask(task);
        return new ResponseEntity<>(newTask, HttpStatus.CREATED);
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
    public ResponseEntity<Tasks> updateTask(@PathVariable Long id, @RequestBody Tasks taskDetails) {
        Tasks updatedTask = tasksService.updateTask(id, taskDetails);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        tasksService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
