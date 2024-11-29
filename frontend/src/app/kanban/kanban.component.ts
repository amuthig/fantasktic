import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { TasksService } from '../task.service';


@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [NgFor, DragDropModule, TaskComponent],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit {
  columns = [
    { title: 'Backlog', tasks: [] as any[] },
    { title: 'In Progress', tasks: [] as any[] },
    { title: 'Review', tasks: [] as any[] },
    { title: 'Done', tasks: [] as any[] },
  ];

  connectedTo: string[] = [];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.connectedTo = this.columns.map((_, index) => 'task-list-' + index);
  }

  // Méthode pour charger les tâches depuis l'API
  loadTasks(): void {
    this.tasksService.getTasks().subscribe((tasks: any[]) => {
      tasks.forEach((task: any) => {
        this.columns[task.stage].tasks.push(task);
      });
    });
  }

  // Méthode pour supprimer une tâche
  deleteTask(taskId: number): void {
    this.columns.forEach((column) => {
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    });
  }

  // Méthode pour mettre à jour une tâche
  updateTask(updatedTask: any): void {
    this.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
      }
    });
    this.columns[updatedTask.stage].tasks.push(updatedTask);
  }

  onDrop(event: CdkDragDrop<any[]>, column: any): void {
    const previousColumn = event.previousContainer.data;
    const currentColumn = column.tasks;

    if (event.previousContainer !== event.container) {
      const task = previousColumn.splice(event.previousIndex, 1)[0];
      task.stage = this.columns.indexOf(column); // Mettre à jour le stage de la tâche
      currentColumn.splice(event.currentIndex, 0, task);
      console.log(`Tâche déplacée vers la colonne : ${column.title}`); // Afficher la colonne dans la console
      this.tasksService.updateTask(task.id, task).subscribe(updatedTask => {
        this.updateTask(updatedTask); // Mettre à jour l'interface utilisateur avec la tâche mise à jour
      });
    } else {
      const task = currentColumn.splice(event.previousIndex, 1)[0];
      currentColumn.splice(event.currentIndex, 0, task);
    }
  }
}