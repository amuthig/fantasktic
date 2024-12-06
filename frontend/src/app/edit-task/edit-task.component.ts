import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsersService } from '../users.service';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  providers: [provideNativeDateAdapter()], // Provides the native date adapter for date inputs
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatOptionModule, 
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  editTaskForm: FormGroup; // Form group for editing task
  users: any[] = []; // Array to store list of users

  // Constructor to initialize form and inject dependencies
  constructor(
    private fb: FormBuilder, // FormBuilder to create the form
    private dialogRef: MatDialogRef<EditTaskComponent>, // Reference to the dialog box
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject data passed from the dialog
    private usersService: UsersService, // Service to handle user data
    private tasksService: TasksService // Service to handle task data
  ) {
    // Initialize form with values passed through dialog data
    this.editTaskForm = this.fb.group({
      title: [data.title], // Set initial title from data
      description: [data.description], // Set initial description from data
      stage: [data.stage], // Set initial stage from data
      user_id: [data.user_id], // Set initial user_id from data
      deadline: [data.deadline] // Set initial deadline from data
    });
  }

  /**
   * Lifecycle hook called when the component is initialized.
   * It loads the list of users for assigning a task.
   */
  ngOnInit(): void {
    this.loadUsers(); // Load users on component initialization
  }

  /**
   * Fetches the list of users from the users service.
   * These users will be used to assign a user to the task.
   */
  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users; // Store the users in the component's array
    });
  }

  /**
   * Handles form submission to save the updated task data.
   * Calls the task service to update the task on the server.
   */
  onSave(): void {
    // Check if the form is valid before submitting
    if (this.editTaskForm.valid) {
      const updatedTask = {
        ...this.editTaskForm.value, // Get the form values
        id: this.data.id // Include the task ID to update the correct task
      };
      
      // Call the tasks service to update the task on the server
      this.tasksService.updateTask(updatedTask.id, updatedTask).subscribe(() => {
        this.dialogRef.close(updatedTask); // Close the dialog and pass updated task data
      });
    }
  }

  /**
   * Cancels the task editing and closes the dialog without saving changes.
   */
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without making any changes
  }
}
