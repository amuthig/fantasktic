package com.fantastik.fantastik.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fantastik.fantastik.model.Tasks;
import com.fantastik.fantastik.repository.TasksRepository;

/**
 * Service for managing tasks.
 * Provides CRUD (Create, Read, Update, Delete) operations for task entities.
 */
@Service
public class TasksService {

    @Autowired
    private TasksRepository tasksRepository; // Repository for interacting with the database.

    /**
     * CREATE: Add a new task.
     *
     * @param task The task to add.
     * @return The saved task.
     */
    public Tasks createTask(Tasks task) {
        // Ensure the task's stage is within the valid range (0 to 3).
        if (task.getStage() < 0 || task.getStage() > 3) {
            task.setStage(0); // Default to stage 0 if invalid.
        }
        return tasksRepository.save(task); // Save and return the task.
    }

    /**
     * READ: Retrieve all tasks.
     *
     * @return A list of all tasks.
     */
    public List<Tasks> getAllTasks() {
        return tasksRepository.findAll(); // Fetch all tasks from the database.
    }

    /**
     * READ: Retrieve a task by its ID.
     *
     * @param id The ID of the task.
     * @return The task wrapped in an Optional.
     */
    public Optional<Tasks> getTaskById(Long id) {
        return tasksRepository.findById(id); // Find the task by ID.
    }

    /**
     * UPDATE: Update an existing task.
     *
     * @param id          The ID of the task to update.
     * @param taskDetails The new details for the task.
     * @return The updated task.
     */
    public Tasks updateTask(Long id, Tasks taskDetails) {
        // Retrieve the task or throw an exception if not found.
        Tasks task = tasksRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        // Update task details.
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());

        // Validate and set the stage value.
        if (taskDetails.getStage() < 0 || taskDetails.getStage() > 3) {
            task.setStage(0); // Default to stage 0 if invalid.
        } else {
            task.setStage(taskDetails.getStage());
        }

        task.setDeadline(taskDetails.getDeadline());
        task.setCreatedById(taskDetails.getCreatedById());

        return tasksRepository.save(task); // Save and return the updated task.
    }

    /**
     * DELETE: Remove a task by its ID.
     *
     * @param id The ID of the task to delete.
     */
    public void deleteTask(Long id) {
        // Retrieve the task or throw an exception if not found.
        Tasks task = tasksRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        tasksRepository.delete(task); // Delete the task from the database.
    }
}
