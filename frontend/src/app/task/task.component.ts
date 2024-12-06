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
  @Input() task!: any;  // The task input passed to the component
  @Output() delete = new EventEmitter<number>();  // Event emitter for deleting the task
  @Output() update = new EventEmitter<any>();  // Event emitter for updating the task

  createdByUsername: string | undefined;  // Username of the task creator
  assignedToUsername: string | undefined;  // Username of the user assigned to the task

  constructor(
    private tasksService: TasksService,  // Service for task-related actions
    private dialog: MatDialog,  // MatDialog for handling modals
    private usersService: UsersService  // Service for fetching user data
  ) {}

  /**
   * ngOnInit - Initializes the component
   * Loads the usernames for the creator and assignee of the task
   */
  ngOnInit(): void {
    this.loadCreatedByUsername();
    this.loadAssignedToUsername();
  }

  /**
   * loadCreatedByUsername - Loads the username of the task creator
   * Fetches user data by creator ID and assigns it to `createdByUsername`
   */
  loadCreatedByUsername(): void {
    this.usersService.getUserById(this.task.createdById).subscribe(user => {
      this.createdByUsername = user.username;
    });
  }

  /**
   * loadAssignedToUsername - Loads the username of the user assigned to the task
   * If no user is assigned, sets `assignedToUsername` to 'Unassigned'
   */
  loadAssignedToUsername(): void {
    if (this.task.user_id) {
      this.usersService.getUserById(this.task.user_id).subscribe(user => {
        this.assignedToUsername = user.username;
      });
    } else {
      this.assignedToUsername = 'Unassigned';
    }
  }

  /**
   * openEditDialog - Opens the task edit dialog
   * Launches `EditTaskComponent` dialog and updates the task if changes are made
   */
  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '400px',  // Sets the dialog width
      data: this.task  // Passes task data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the task with new data after dialog is closed
        this.tasksService.updateTask(this.task.id, result).subscribe(updatedTask => {
          this.task.title = updatedTask.title;
          this.task.description = updatedTask.description;
          this.task.stage = updatedTask.stage;
          this.task.createdById = updatedTask.createdById;
          this.task.deadline = updatedTask.deadline;
          this.task.user = updatedTask.user;
          this.update.emit(updatedTask);  // Emit the updated task
          this.loadCreatedByUsername();  // Reload the creator's username after update
          this.loadAssignedToUsername();  // Reload the assigned user's username after update
        });
      }
    });
  }

  /**
   * getStageName - Returns the stage name based on the stage ID
   * @param stage - The stage ID of the task
   * @returns A string representing the stage name
   */
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

  /**
   * onDelete - Deletes the task
   * Calls the delete service method and emits a delete event upon success
   */
  onDelete(): void {
    this.tasksService.deleteTask(this.task.id).subscribe(() => {
      console.log(`Task with ID ${this.task.id} deleted successfully.`);
      this.delete.emit(this.task.id);  // Emit the task ID for deletion
    });
  }
}
