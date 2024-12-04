package com.fantastik.fantastik.controller;

import com.fantastik.fantastik.model.Tasks;
import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.TasksService;
import com.fantastik.fantastik.service.UsersService;
import com.fantastik.fantastik.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TasksControllerTest {

    @Mock
    private TasksService tasksService;

    @Mock
    private UsersService usersService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private TasksController tasksController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTask_Success() throws Exception {
        // Arrange
        String token = "Bearer test-token";
        String username = "testuser";
        Map<String, Object> taskData = new HashMap<>();
        taskData.put("title", "Test Task");
        taskData.put("description", "Test Description");
        taskData.put("stage", 1);
        taskData.put("user_id", 2L);
        taskData.put("deadline", "2024-12-31");

        Users user = new Users();
        user.setId(1L);
        user.setUsername(username);

        Users assignee = new Users();
        assignee.setId(2L);

        Tasks task = new Tasks();
        task.setId(1L);
        task.setTitle("Test Task");

        when(jwtUtil.extractUsername("test-token")).thenReturn(username);
        when(usersService.getUserByUsername(username)).thenReturn(Optional.of(user));
        when(usersService.getUserById(2L)).thenReturn(Optional.of(assignee));
        when(tasksService.createTask(any(Tasks.class))).thenReturn(task);

        // Act
        ResponseEntity<Tasks> response = tasksController.createTask(taskData, token);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Test Task", response.getBody().getTitle());
    }

    @Test
    void testGetAllTasks_Success() {
        // Arrange
        Tasks task = new Tasks();
        task.setId(1L);
        task.setTitle("Task 1");

        when(tasksService.getAllTasks()).thenReturn(Collections.singletonList(task));

        // Act
        ResponseEntity<List<Tasks>> response = tasksController.getAllTasks();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Task 1", response.getBody().get(0).getTitle());
    }

    @Test
    void testUpdateTask_Success() throws Exception {
        // Arrange
        Long taskId = 1L;
        Map<String, Object> taskData = new HashMap<>();
        taskData.put("title", "Updated Task");

        Tasks existingTask = new Tasks();
        existingTask.setId(taskId);
        existingTask.setTitle("Original Task");

        when(tasksService.getTaskById(taskId)).thenReturn(Optional.of(existingTask));
        when(tasksService.updateTask(eq(taskId), any(Tasks.class))).thenReturn(existingTask);

        // Act
        ResponseEntity<Tasks> response = tasksController.updateTask(taskId, taskData);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated Task", response.getBody().getTitle());
    }

    @Test
    void testDeleteTask_Success() {
        // Arrange
        Long taskId = 1L;

        // Act
        ResponseEntity<Void> response = tasksController.deleteTask(taskId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(tasksService, times(1)).deleteTask(taskId);
    }
}
