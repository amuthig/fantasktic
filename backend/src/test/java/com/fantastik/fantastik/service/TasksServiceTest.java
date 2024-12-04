package com.fantastik.fantastik.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.fantastik.fantastik.model.Tasks;
import com.fantastik.fantastik.repository.TasksRepository;

@SpringBootTest
public class TasksServiceTest {

    @Mock
    private TasksRepository tasksRepository;

    @InjectMocks
    private TasksService tasksService;

    private Tasks task;

    @BeforeEach
    public void setUp() {
        // Initialisation d'un objet de test
        task = new Tasks();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Description of the test task");
        task.setStage(1);
        try {
            task.setDeadline(new SimpleDateFormat("yyyy-MM-dd").parse("2024-12-31"));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        task.setCreatedById(1L);
    }

    @Test
    public void testCreateTask() {
        // Préparer le mock pour la méthode save()
        when(tasksRepository.save(any(Tasks.class))).thenReturn(task);

        // Appeler la méthode createTask
        Tasks createdTask = tasksService.createTask(task);

        // Vérifier que la méthode save() a été appelée une fois et que l'objet retourné
        // est correct
        verify(tasksRepository, times(1)).save(task);
        assertNotNull(createdTask);
        assertEquals("Test Task", createdTask.getTitle());
        assertEquals(1, createdTask.getStage());
    }

    @Test
    public void testGetAllTasks() {
        // Tester la méthode getAllTasks()
        when(tasksRepository.findAll()).thenReturn(List.of(task));

        List<Tasks> tasksList = tasksService.getAllTasks();

        // Vérifier que la méthode findAll() a été appelée et que la liste retournée
        // contient bien une tâche
        verify(tasksRepository, times(1)).findAll();
        assertEquals(1, tasksList.size());
        assertEquals("Test Task", tasksList.get(0).getTitle());
    }

    @Test
    public void testGetTaskById_Success() {
        // Tester la méthode getTaskById() quand la tâche existe
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Tasks> retrievedTask = tasksService.getTaskById(1L);

        // Vérifier que la méthode findById() a été appelée et que la tâche retournée
        // est correcte
        verify(tasksRepository, times(1)).findById(1L);
        assertTrue(retrievedTask.isPresent());
        assertEquals("Test Task", retrievedTask.get().getTitle());
    }

    @Test
    public void testGetTaskById_NotFound() {
        // Tester la méthode getTaskById() quand la tâche n'existe pas
        when(tasksRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Tasks> retrievedTask = tasksService.getTaskById(1L);

        // Vérifier que la tâche n'a pas été trouvée
        assertFalse(retrievedTask.isPresent());
    }

    @Test
    public void testUpdateTask_Success() {
        // Préparer le mock pour la méthode findById()
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(task));
        when(tasksRepository.save(any(Tasks.class))).thenReturn(task);

        // Modifier les détails de la tâche
        task.setTitle("Updated Task");

        // Appeler la méthode updateTask
        Tasks updatedTask = tasksService.updateTask(1L, task);

        // Vérifier que la tâche a bien été mise à jour
        verify(tasksRepository, times(1)).save(task);
        assertEquals("Updated Task", updatedTask.getTitle());
    }

    @Test
    public void testUpdateTask_NotFound() {
        // Tester la mise à jour d'une tâche qui n'existe pas
        when(tasksRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tasksService.updateTask(1L, task);
        });

        // Vérifier qu'une exception est levée
        assertEquals("Task not found", exception.getMessage());
    }

    @Test
    public void testDeleteTask_Success() {
        // Préparer le mock pour la méthode findById() et delete()
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(task));

        // Appeler la méthode deleteTask
        tasksService.deleteTask(1L);

        // Vérifier que la méthode delete() a bien été appelée
        verify(tasksRepository, times(1)).delete(task);
    }

    @Test
    public void testDeleteTask_NotFound() {
        // Tester la suppression d'une tâche qui n'existe pas
        when(tasksRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tasksService.deleteTask(1L);
        });

        // Vérifier qu'une exception est levée
        assertEquals("Task not found", exception.getMessage());
    }
}
