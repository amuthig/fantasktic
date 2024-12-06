import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { TasksService } from '../task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { UsersService } from '../users.service';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [NgFor, DragDropModule, TaskComponent, MatIconModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit, OnChanges {
  @Input() filters: any = {}; // Accepts filters from the parent component
  columns = [
    { title: 'Backlog', tasks: [] as any[] },
    { title: 'In Progress', tasks: [] as any[] },
    { title: 'Review', tasks: [] as any[] },
    { title: 'Done', tasks: [] as any[] },
  ]; // Columns for the Kanban board
  connectedTo: string[] = []; // Stores the drag-and-drop connections for each column
  filteredColumns = this.columns; // Columns after filtering tasks based on the selected filters

  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks(); // Loads tasks on initialization
    this.connectedTo = this.columns.map((_, index) => 'task-list-' + index); // Connects columns for drag-and-drop functionality
    this.tasksService.getTaskUpdates().subscribe(() => {
      this.loadTasks(); // Reload tasks when they are updated
    });
  }

  ngOnChanges(): void {
    this.applyFilters(); // Applies filters when input filters change
  }

  /**
   * Loads tasks from the task service and assigns them to the appropriate columns.
   */
  loadTasks(): void {
    this.tasksService.getTasks().subscribe((tasks: any[]) => {
      this.columns.forEach(column => column.tasks = []); // Reset columns to clear previous tasks
      tasks.forEach((task: any) => {
        if (task.stage >= 0 && task.stage < this.columns.length) {
          this.columns[task.stage].tasks.push(task); // Assign tasks to columns based on their stage
        } else {
          console.error(`Invalid stage value for task in loadTasks: ${task.id}`, task);
        }
      });
      this.applyFilters(); // Apply filters after loading tasks
      this.cdr.detectChanges(); // Trigger change detection to ensure the view is updated
    });
  }

  /**
   * Applies filters based on the current filters provided via input.
   */
  applyFilters(): void {
    const { assignee, daysUntilDeadline } = this.filters;
    if (assignee) {
      const userObservables = this.columns.flatMap(column =>
        column.tasks.map(task => this.usersService.getUserById(task.user_id).pipe(
          map(user => ({ ...task, assigneeUsername: user.username }))
        ))
      );

      // Combine observables and filter tasks based on assignee and deadline
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
        this.cdr.detectChanges(); // Trigger change detection after filtering tasks
      });
    } else {
      this.filteredColumns = this.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => {
          const matchesDeadline = !daysUntilDeadline || this.calculateDaysUntilDeadline(task.deadline) <= daysUntilDeadline;
          return matchesDeadline;
        })
      }));
      this.cdr.detectChanges(); // Trigger change detection after filtering tasks
    }
  }

  /**
   * Calculates the number of days remaining until the task's deadline.
   * @param deadline The task's deadline in string format (ISO).
   * @returns The number of days remaining until the deadline.
   */
  calculateDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - new Date().getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Returns the number of days
  }

  /**
   * Deletes a task from the Kanban board.
   * @param taskId The task's ID to be deleted.
   */
  deleteTask(taskId: number): void {
    this.columns.forEach((column) => {
      column.tasks = column.tasks.filter((task) => task.id !== taskId); // Remove task from all columns
    });
    this.tasksService.notifyTaskUpdates(); // Notify task updates to the service
  }

  /**
   * Updates a task in the Kanban board.
   * @param updatedTask The task with updated information.
   */
  updateTask(updatedTask: any): void {
    this.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1); // Remove the task from its current position
      }
    });
    if (updatedTask.stage >= 0 && updatedTask.stage < this.columns.length) {
      this.columns[updatedTask.stage].tasks.push(updatedTask); // Add task to the new column based on its updated stage
    } else {
      console.error(`Invalid stage value for task in updateTask: ${updatedTask.id}`, updatedTask);
    }
    this.tasksService.notifyTaskUpdates(); // Notify task updates to the service
  }

  /**
   * Handles the drag-and-drop event for tasks between columns.
   * @param event The drag-and-drop event.
   * @param column The target column where the task is dropped.
   */
  onDrop(event: CdkDragDrop<any[]>, column: any): void {
    const previousColumn = event.previousContainer.data;
    const currentColumn = column.tasks;

    if (event.previousContainer !== event.container) {
      const task = previousColumn.splice(event.previousIndex, 1)[0];
      const newStage = this.columns.findIndex(col => col.title === column.title); // Find the new column's index
      if (newStage >= 0 && newStage < this.columns.length) {
        task.stage = newStage; // Update the task's stage
        currentColumn.splice(event.currentIndex, 0, task); // Add task to the new column
        this.tasksService.updateTask(task.id, task).subscribe(updatedTask => {
          this.updateTask(updatedTask); // Update the task in the UI after it's moved
        });
      } else {
        console.error(`Invalid stage value for task: ${task.id}`, task);
      }
    } else {
      const task = currentColumn.splice(event.previousIndex, 1)[0];
      currentColumn.splice(event.currentIndex, 0, task); // Reorder task within the same column
    }
  }

  /**
   * Opens a dialog to add a new task to the specified stage.
   * @param stage The stage to which the task will be added.
   */
  openAddTaskDialog(stage: number): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px',
      data: { stage } // Passes the stage information to the AddTaskComponent
    });
  }
}
