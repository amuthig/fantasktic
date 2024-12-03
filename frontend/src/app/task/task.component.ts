import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TasksService } from '../task.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task!: any;
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<any>();

  createdByUsername: string | undefined;
  assignedToUsername: string | undefined;

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadCreatedByUsername();
    this.loadAssignedToUsername();
  }

  // Méthode pour charger le nom d'utilisateur du créateur
  loadCreatedByUsername(): void {
    this.usersService.getUserById(this.task.createdById).subscribe(user => {
      this.createdByUsername = user.username;
    });
  }

  // Méthode pour charger le nom d'utilisateur de l'utilisateur assigné
  loadAssignedToUsername(): void {
    if (this.task.user_id) {
      this.usersService.getUserById(this.task.user_id).subscribe(user => {
        this.assignedToUsername = user.username;
      });
    } else {
      this.assignedToUsername = 'Unassigned';
    }
  }

  // Méthode pour ouvrir le dialog de modification
  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '400px',
      data: this.task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.updateTask(this.task.id, result).subscribe(updatedTask => {
          this.task.title = updatedTask.title;
          this.task.description = updatedTask.description;
          this.task.stage = updatedTask.stage;
          this.task.createdById = updatedTask.createdById;
          this.task.deadline = updatedTask.deadline;
          this.task.user = updatedTask.user;
          this.update.emit(updatedTask);
          this.loadCreatedByUsername(); // Recharger le nom d'utilisateur après la mise à jour
          this.loadAssignedToUsername(); // Recharger le nom d'utilisateur assigné après la mise à jour
        });
      }
    });
  }

  // Méthode pour obtenir le nom de l'étape en fonction de l'ID de l'étape
  getStageName(stage: number): string {
    switch (stage) {
      case 0:
        return 'Backlog';
      case 1:
        return 'In Progress';
      case 2:
        return 'Review';
      case 3:
        return 'Done';
      default:
        return 'Unknown';
    }
  }

  // Méthode pour supprimer la tâche
  onDelete(): void {
    this.tasksService.deleteTask(this.task.id).subscribe(() => {
      console.log(`Task with ID ${this.task.id} deleted successfully.`);
      this.delete.emit(this.task.id); // Émettre l'événement de suppression
    });
  }
}