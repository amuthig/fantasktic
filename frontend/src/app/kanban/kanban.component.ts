import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { TasksService } from '../task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { UsersService } from '../users.service';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [NgFor, DragDropModule, TaskComponent],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit, OnChanges {
  @Input() filters: any = {};
  columns = [
    { title: 'Backlog', tasks: [] as any[] },
    { title: 'In Progress', tasks: [] as any[] },
    { title: 'Review', tasks: [] as any[] },
    { title: 'Done', tasks: [] as any[] },
  ];

  connectedTo: string[] = [];
  filteredColumns = this.columns;

  constructor(private usersService: UsersService, private tasksService: TasksService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
    this.connectedTo = this.columns.map((_, index) => 'task-list-' + index);
    this.tasksService.getTaskUpdates().subscribe(() => {
      this.loadTasks();
    });
  }

  ngOnChanges(): void {
    this.applyFilters();
  }



  // Méthode pour charger les tâches depuis l'API
  loadTasks(): void {
    this.tasksService.getTasks().subscribe((tasks: any[]) => {
      this.columns.forEach(column => column.tasks = []); // Réinitialiser les colonnes
      tasks.forEach((task: any) => {
        this.columns[task.stage].tasks.push(task);
        console.log(task); // Afficher la tâche dans la console
      });
      this.applyFilters();
      this.cdr.detectChanges(); // Forcer la détection des changements
    });
  }

  applyFilters(): void {
    const { assignee, daysUntilDeadline } = this.filters;
    if (assignee) {
      const userObservables = this.columns.flatMap(column =>
        column.tasks.map(task => this.usersService.getUserById(task.user_id).pipe(
          map(user => ({ ...task, assigneeUsername: user.username }))
        ))
      );

      forkJoin(userObservables).subscribe(tasksWithUsernames => {
        this.filteredColumns = this.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => {
            const taskWithUsername = tasksWithUsernames.find(t => t.id === task.id);
            const matchesAssignee = !assignee || (taskWithUsername && taskWithUsername.assigneeUsername.toLowerCase().includes(assignee.toLowerCase()));
            const matchesDeadline = !daysUntilDeadline || this.calculateDaysUntilDeadline(task.deadline) <= daysUntilDeadline;
            return matchesAssignee && matchesDeadline;
          })
        }));
        this.cdr.detectChanges(); // Forcer la détection des changements
      });
    } else {
      this.filteredColumns = this.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => {
          const matchesDeadline = !daysUntilDeadline || this.calculateDaysUntilDeadline(task.deadline) <= daysUntilDeadline;
          return matchesDeadline;
        })
      }));
      this.cdr.detectChanges(); // Forcer la détection des changements
    }
  }
  
  calculateDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - new Date().getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Méthode pour supprimer une tâche
  deleteTask(taskId: number): void {
    this.columns.forEach((column) => {
      column.tasks = column.tasks.filter((task) => task.id !== taskId);
    });
    this.tasksService.notifyTaskUpdates(); // Notifier les mises à jour des tâches
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
    this.tasksService.notifyTaskUpdates(); // Notifier les mises à jour des tâches
  }

  // Méthode pour gérer le drop et mettre à jour le stage de la tâche
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

  // Ouvre le dialog pour ajouter une tâche
  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.addTask(result).subscribe(newTask => {
          this.columns[newTask.stage].tasks.push(newTask); // Ajouter la nouvelle tâche à la colonne appropriée
          this.tasksService.notifyTaskUpdates(); // Notifier les mises à jour des tâches
          this.cdr.detectChanges(); // Forcer la détection des changements
        });
      }
    });
  }
}