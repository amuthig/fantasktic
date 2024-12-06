import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../task.service';
import { UsersService } from '../users.service';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  users: User[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tasksService: TasksService,
    private usersService: UsersService
  ) {
    // Initialize form group for adding a task with required validations
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: ['', Validators.required],
      deadline: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Load users when component is initialized
    this.loadUsers();
  }

  /**
   * Load users from the UsersService.
   * This method fetches the list of users to be displayed in the task assignment dropdown.
   */
  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users: User[]) => this.users = users, // Set the users list to the fetched data
      error: (err) => console.error('Error fetching users:', err) // Handle any error during the fetch
    });
  }

  /**
   * Handle form submission.
   * Validates the form, formats the deadline date, and sends the data to the TasksService.
   */
  onSave(): void {
    if (this.addTaskForm.valid && !this.isSaving) {
      console.log('Saving task...');
      this.isSaving = true;

      const newTask = {
        ...this.addTaskForm.value,
        deadline: this.formatDate(this.addTaskForm.value.deadline), // Format the deadline before submission
        stage: this.data.stage, // Use the stage data passed through the dialog
        createdById: null // Assuming the creator is handled elsewhere
      };

      // Call service to add the new task
      this.tasksService.addTask(newTask).subscribe({
        next: (task) => {
          console.log('Task saved:', task);
          this.isSaving = false;
          this.dialogRef.close(task); // Close dialog and pass the saved task data back
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error saving task:', err); // Handle any error during task creation
        }
      });
    }
  }

  /**
   * Format the date for submission.
   * Converts a Date object into a string format 'yyyy-mm-dd'.
   * @param {Date} date - Date object to format.
   * @returns {string} Formatted date string.
   */
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month; // Ensure month is always two digits
    if (day.length < 2) day = '0' + day; // Ensure day is always two digits

    return [year, month, day].join('-');
  }

  /**
   * Handle form cancellation.
   * Closes the dialog without saving any data.
   */
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without any return data
  }
}
