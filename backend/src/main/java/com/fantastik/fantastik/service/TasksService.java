package com.fantastik.fantastik.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fantastik.fantastik.model.Tasks;
import com.fantastik.fantastik.repository.TasksRepository;

@Service
public class TasksService {

    @Autowired
    private TasksRepository tasksRepository;

    /**
     * CREATE: Ajouter une nouvelle tâche.
     *
     * @param task La tâche à ajouter.
     * @return La tâche ajoutée.
     */

    public Tasks createTask(Tasks task) {
        return tasksRepository.save(task);
    }

    /**
     * READ: Récupérer toutes les tâches.
     *
     * @return La liste des tâches.
     */
    public List<Tasks> getAllTasks() {
        return tasksRepository.findAll();
    }

    /**
     * READ: Récupérer une tâche par son ID.
     *
     * @param id L'ID de la tâche.
     * @return La tâche trouvée ou une exception si introuvable.
     */
    public Optional<Tasks> getTaskById(Long id) {
        return tasksRepository.findById(id);
    }

    /**
     * UPDATE: Mettre à jour une tâche.
     *
     * @param id          L'ID de la tâche à mettre à jour.
     * @param taskDetails Les nouvelles informations de la tâche.
     * @return La tâche mise à jour.
     */
    public Tasks updateTask(Long id, Tasks taskDetails) {
        Tasks task = tasksRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStage(taskDetails.getStage());
        task.setDeadline(taskDetails.getDeadline());
        task.setCreatedById(taskDetails.getCreatedById());
        return tasksRepository.save(task);
    }

    /**
     * DELETE: Supprimer une tâche par son ID.
     *
     * @param id L'ID de la tâche à supprimer.
     */
    public void deleteTask(Long id) {
        Tasks task = tasksRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        tasksRepository.delete(task);
    }
}
